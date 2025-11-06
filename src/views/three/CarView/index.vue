<template>
    <div class="car-view">
    <div id="scene"></div>
    <div class="car-color">
        <div class="color1">
            <div class="color-white" @click="setCarColor('#c0c0c0')"></div>
            <span>亮银色</span>
        </div>
        <div class="color1">
            <div class="color-blank" @click="setCarColor('#222')"></div>
            <span>星际黑</span>
        </div>
        <div class="color1">
            <div class="color-red" @click="setCarColor('#ff0000')"></div>
            <span>中国红</span>
        </div>
        <div class="color1">
            <div class="color-green" @click="setCarColor('#9dc209')"></div>
            <span>苹果绿</span>
        </div>
        <div class="color1">
            <div class="color-blue" @click="setCarColor('#2443e2')"></div>
            <span>雪邦蓝</span>
        </div> 
    </div>
    </div>
</template>

<script setup>
import Car3D from "./index";
import { ref, onMounted } from "vue";
const car3d = ref(null);
onMounted(() => {
  car3d.value = new Car3D("#scene");
});

const setCarColor = (color) => {
  car3d.value.setCarColor(color);
};
</script>

<style scoped>
.car-color {
  /* 设置这个div居中显示 */
  margin: 0 auto;
  position:fixed; 
  bottom: 50px;
  left: 30%;
  width: 40%;
  height: 100px;
  display: flex; 
  justify-content:space-around;
  align-items: center;
}
.color1 { 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.color1 div {
  width: 80px;
  height: 80px;
  border-radius: 80px;
  cursor: pointer;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3); 
}
.color-white { 
  background-color: #c0c0c0; 
}
.color-blank { 
  background-color: #222; 
}
.color-red { 
  background-color: #FF0000; 
}
.color-green { 
  background-color: #9dc209; 
}
.color-blue { 
  background-color: #2443e2; 
}
span{
  margin-top: 5px;
}
</style>
