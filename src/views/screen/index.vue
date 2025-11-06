<template>
    <div class="screen3D-container">
        <div id="scene"></div>
        <div class="chart-wrapper">
          <div class="title-wrapper">3D 城市模型大屏</div>
          <div class="left-wrapper">
            <LineCharts style="height: 32%" />
            <PieCharts style="height: 32%" />
            <BarCharts style="height: 32%" />
          </div>
          <div class="right-wrapper">
            <WaterCharts style="height: 32%" />
            <ScatterCharts style="height: 32%" />
            <RadarCharts style="height: 32%" />
          </div>
          <div class="bottom-wrapper">
            <div v-for="(item, index) in datas" :key="index" class="tagItem" @click="moveTo(item.position)">{{ item.text }}</div>
          </div>
        </div>
    </div>
</template>

<script setup>
import Screen from "./index";
import LineCharts from "./components/lineChart.vue";
import PieCharts from "./components/pieChart.vue";
import BarCharts from "./components/barChart.vue";
import WaterCharts from "./components/waterChart.vue";
import RadarCharts from "./components/radarChart.vue";
import ScatterCharts from "./components/scatterChart.vue";
import { onMounted, ref } from "vue";
const sceneObject = ref(null);
const datas = [
  { text: "东方明珠", position: {x:-521, y: 161, z: 1342} },
  { text: "陆家嘴", position: {x: -374.9514172359461, y: 97.65854415606516, z: 539.1217592715113} },
  { text: "新天地", position: {x: -217.44272941156635, y: 41.237777709960966, z: 203.11301542389742} },
  { text: "松江大学城", position: {x: -282.8620062878682, y: 204.1691591314717, z: -634.8093208130131} },
  { text: "人民广场", position: {x: -20, y: 46, z: -39} },
  { text: "上海迪士尼", position: {x: -214.411227864534, y: 115.2371717529303, z: -105.901227864534} },
  { text: "宝山区", position: {x: 618.3054998026594, y: 34.94658279418956, z: -145.98597071841232} },
];

onMounted(() => {
  // window.cityModel = new Screen("#scene");
  sceneObject.value = new Screen("#scene");
});

const moveTo = (position) => {
  sceneObject.value.flyto(position);
};
</script>

<style lang="scss" scoped>

:deep(.tag) {
  box-shadow: 0 0 2px #00ffff inset;
  background: linear-gradient(#00ffff, #00ffff) left top;
  background-repeat: no-repeat;
  background-size: 1px 6px, 6px 1px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  font-size: 12px;
  padding: 4px 10px;
  position: absolute;
  z-index: 9;
  display: inline;
}
.screen3D-container {
  position: relative;

  .chart-wrapper {

    .title-wrapper {
      position: absolute;
      width: 100%;
      top: 10px;
      text-align: center;
      color: var(--color); /*设置文字颜色*/
      text-decoration: none;
      font-size:2em; /*设置字体大小*/
      font-family:"微软雅黑";/*设置字体*/
      animation: shine 2.4s infinite;/*设置动画*/
    }

    @keyframes shine {
      0%,100%{ color:#fff;text-shadow:0 0 10px var(--color),0 0 10px var(--color); }
      50%{ text-shadow:0 0 10px var(--color),0 0 40px var(--color); }
    }

    .left-wrapper, .right-wrapper {
      position: absolute;
      bottom: 10px;
      width: 300px;
      height: calc(100vh - 70px);;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
      border: 1px solid transparent;
      border-radius: 10px;
      margin: 10px;
      
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .left-wrapper {
      left: 10px;
    }

    .right-wrapper {
      right: 10px;
    }

    .bottom-wrapper {
      position: absolute;
      width: 100%;
      bottom: 30px;
      text-align: center;
      display: flex;
      justify-content: center;

      .tagItem {
        box-shadow: 0 0 2px #00ffff inset;
        background: linear-gradient(#99fffe, #99fffe) left -3px top 0, linear-gradient(#99fffe, #99fffe) left -3px top -3px, linear-gradient(#99fffe, #99fffe) right -3px top 0, linear-gradient(#99fffe, #99fffe) right -3px top -3px, linear-gradient(#99fffe, #99fffe) left -3px bottom 0, linear-gradient(#99fffe, #99fffe) left -3px bottom -3px, linear-gradient(#99fffe, #99fffe) right -3px bottom 0, linear-gradient(#99fffe, #99fffe) right -3px bottom -3px;
        background-color: #0239;
        background-repeat: no-repeat;
        background-size: 3px 8px, 8px 3px;
        border: 1px solid transparent;
        backdrop-filter: blur(1px);
        color: #ffffff;
        font-size: 12px;
        padding: 4px 10px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
  
}

</style>