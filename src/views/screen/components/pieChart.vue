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

const labelFormatter = (param) => {
  return `{a| ${param.seriesName}}` + "\n\n{b|${param.percent}% }";
};

const richLabel = {
  a: { fontSize: 14, color: CHART_CONFIG.colors.chartBlue, lineHeight: 19 },
  b: { fontSize: 20, color: CHART_CONFIG.colors.chartBlue, lineHeight: 23 }
};

const richLabelCyan = {
  a: { fontSize: 14, color: CHART_CONFIG.colors.chartCyan, lineHeight: 19 },
  b: { fontSize: 20, color: CHART_CONFIG.colors.chartCyan, lineHeight: 23 }
};

const options = {
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(200,231,242,0.9)",
    textStyle: { color: "rgba(20,34,54,1)" },
    formatter: (param) => {
      if (param.data.name === "other") { return ""; }
      return param.name + "</br>在线率: " + param.percent + "%";
    }
  },
  color: CHART_CONFIG.pieColors,
  series: [
    {
      name: "内层背景",
      type: "pie",
      radius: ["60%", "80%"],
      silent: true,
      label: { show: false },
      data: [{ value: 0, name: "内层背景" }]
    },
    {
      name: "外层背景",
      type: "pie",
      radius: ["80%", "90%"],
      silent: true,
      label: { show: false },
      data: [{ value: 0, name: "外层背景" }]
    },
    {
      name: "IPC",
      type: "pie",
      radius: ["60%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: "center",
        padding: [0, 0, 0, 80],
        align: "center",
        width: 70,
        height: 50,
        lineHeight: 14,
        fontSize: 14,
        formatter: labelFormatter,
        rich: richLabel,
      },
      data: [
        { value: 56, name: "IPC", label: { show: false } },
        { value: 100, name: "other" }
      ]
    },
    {
      name: "设备",
      type: "pie",
      radius: ["70%", "80%"],
      avoidLabelOverlap: false,
      emphasis: { scale: false },
      label: {
        show: true,
        position: "center",
        padding: [0, 80, 0, 0],
        align: "center",
        width: 70,
        height: 50,
        lineHeight: 14,
        fontSize: 14,
        formatter: labelFormatter,
        rich: richLabelCyan,
      },
      data: [
        { value: 87, name: "设备", label: { show: false } },
        { value: 100, name: "other" }
      ]
    }
  ]
};
</script>

<style lang="scss" scoped>
</style>
