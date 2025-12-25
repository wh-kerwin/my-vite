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

const data = [
  { name: "常规", value: 175.17 },
  { name: "紧急", value: 148.35 },
  { name: "疑难", value: 95.36 }
];

const xAxisData = [];
const seriesData1 = [];
let sum = 0;
const barTopColor = [CHART_CONFIG.colors.cyan, CHART_CONFIG.colors.green, CHART_CONFIG.colors.purple];
const barBottomColor = [
  "rgba(2,195,241,0.1)",
  "rgba(83, 229, 104, 0.1)",
  "rgba(161, 84, 233, 0.1)"
];

data.forEach(item => {
  xAxisData.push(item.name);
  seriesData1.push(item.value);
  sum += item.value;
});

const options = {
  grid: { top: "25%", bottom: "30%" },
  xAxis: {
    data: xAxisData,
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: {
      show: true,
      margin: 25,
      align: "center",
      rich: {
        a: { fontSize: 12, color: "#ffffff" },
        b: { height: 20, fontSize: 12, color: "#ffffff" }
      },
      formatter: (params, index) => {
        return (seriesData1[index] / sum * 100).toFixed(2) + "%" + "\n" + "{b|" + params + "}";
      },
      fontSize: 10,
      color: "#ffffff",
    },
    interval: 0,
  },
  yAxis: {
    splitLine: { show: false },
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: { show: false }
  },
  series: [
    {
      name: "柱顶部",
      type: "pictorialBar",
      symbolSize: [26, 10],
      symbolOffset: [0, -5],
      z: 12,
      itemStyle: {
        color: (params) => barTopColor[params.dataIndex]
      },
      label: {
        show: true,
        position: "top",
        fontSize: 14,
        color: "#fff"
      },
      symbolPosition: "end",
      data: seriesData1,
    },
    {
      name: "柱底部",
      type: "pictorialBar",
      symbolSize: [26, 10],
      symbolOffset: [0, 5],
      z: 12,
      itemStyle: {
        color: (params) => barTopColor[params.dataIndex]
      },
      data: seriesData1
    },
    {
      name: "第一圈",
      type: "pictorialBar",
      symbolSize: [47, 16],
      symbolOffset: [0, 11],
      z: 11,
      itemStyle: {
        color: "transparent",
        borderColor: "#3ACDC5",
        borderWidth: 2
      },
      data: seriesData1
    },
    {
      name: "第二圈",
      type: "pictorialBar",
      symbolSize: [62, 22],
      symbolOffset: [0, 17],
      z: 10,
      itemStyle: {
        color: "transparent",
        borderColor: barTopColor[0],
        borderWidth: 2
      },
      data: seriesData1
    },
    {
      type: "bar",
      itemStyle: {
        color: (params) => ({
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: barBottomColor[params.dataIndex] },
            { offset: 1, color: barTopColor[params.dataIndex] }
          ],
          global: false
        }),
        opacity: 0.8
      },
      z: 16,
      silent: true,
      barWidth: 26,
      barGap: "-100%",
      data: seriesData1
    }
  ]
};
</script>

<style lang="scss" scoped>
</style>
