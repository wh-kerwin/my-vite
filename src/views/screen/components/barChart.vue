<template>
    <BaseCharts :options="options" :height="heights" />
</template>

<script setup>
import BaseCharts from "@/components/BaseEcharts/index.vue";
import { CHART_CONFIG } from "./chartConfig";

defineProps({
  heights: {
    type: String,
    default: "100%",
  },
});

const createGradientColor = (colorBottom, colorTop) => {
  return {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 0,
    colorStops: [
      { offset: 0, color: colorBottom },
      { offset: 1, color: colorTop }
    ]
  };
};

const options = {
  tooltip: {
    show: true,
    formatter: "{b}:{c}"
  },
  grid: CHART_CONFIG.commonGrid,
  xAxis: {
    type: "value",
    show: false,
    position: "top",
    axisTick: { show: false },
    axisLine: { show: false },
    splitLine: { show: false },
  },
  yAxis: [{
    type: "category",
    axisTick: { show: false },
    splitLine: { show: false },
    inverse: "true",
    axisLine: { show: false },
    data: ["first", "two", "three", "four", "five"]
  }],
  series: [{
    name: "能耗值",
    type: "bar",
    label: {
      show: true,
      position: "right",
      formatter: "{c}",
      color: "white"
    },
    itemStyle: {
      show: true,
      color: (params) => {
        const colorItem = CHART_CONFIG.colorArray[params.dataIndex % CHART_CONFIG.colorArray.length];
        return createGradientColor(colorItem.bottom, colorItem.top);
      },
      borderRadius: 70,
      borderWidth: 0,
      borderColor: "#333",
    },
    barGap: "0%",
    barCategoryGap: "50%",
    data: [60, 132, 89, 134, 60]
  }]
};
</script>

<style lang="scss" scoped>
</style>