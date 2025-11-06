<template>
    <div>
        <div id="scene"></div>
        <div class="control">
            <button @click="split(true)">分解</button>
            <button @click="split(false)">组合</button>
        </div>  
    </div>
  
</template>

<script setup>
import Valve3D from "./index";
import { gsap } from "gsap";
import { ref, onMounted } from "vue";

const valve3d = ref(null);

onMounted(() => {
  valve3d.value = new Valve3D("#scene");
});
const split = (flag) => {
  const model = valve3d.value.model.children[0].children;
  if(flag) { 
    model.forEach(item => {
      if(item.name === "网格457_3") {
        // item.position.y = 0.03
        gsap.to(item.position,{
          duration:1,//动画持续时间
          y:0.3,//目标位置
          ease:"power2.inOut"
        });
      } else if (item.name === "网格457_7"){
        // item.position.y = -0.05
        gsap.to(item.position,{
          duration:1,//动画持续时间
          y:-0.5,//目标位置
          ease:"power2.inOut"
        });
      }
    });
  } else {
    model.forEach(item => {
      if(item.name === "网格457_3") {
        // item.position.y = 0.03
        gsap.to(item.position,{
          duration:1,//动画持续时间
          y:0,//目标位置
          ease:"line"
        });
      } else if (item.name === "网格457_7"){
        // item.position.y = -0.05
        gsap.to(item.position,{
          duration:1,//动画持续时间
          y:0,//目标位置
          ease:"line"
        });
      }
    });
  }
};
</script>

<style scoped>
.control{
  display: flex;
  position: fixed;
  top:95px;
  right: 50px;
}
.control button {
  width: 100px;
  height: 30px;
  margin: 10px;
}
</style>