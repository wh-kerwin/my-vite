<template>
    <div>
        <BaseCharts :options="LineOptions" :height="heights" />
    </div>
</template>

<script setup>
import BaseCharts from "@/components/BaseEcharts/index.vue";

defineProps({
  heights: {
    type: String,
    default: "100%",
  },
});

const LineOptions = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      lineStyle: {
        width: 1,
        color: "#008000",
      },
    },
  },
  grid: {
    left: "5px",
    right: "10px",
    bottom: "5px",
    top: "20px",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"],
    axisLabel: {
      interval: 0,
      rotate: 30,
      color: "#fff",
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#fff",
      },
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: (val) => {
        return val;
      },
    },
    show: true,
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#fff",
      },
    },
  },
  yAxis: {
    axisLabel: {
      formatter: (val) => {
        return val;
      },
    },
    show: true,
    axisTick: {
      show: true,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#fff",
      },
    },
  },
  series: [
    {
      name: "收入",
      type: "bar",
      stack: "Total",
      data: [200, 301, 402, 503, 604, 705, 806],
    },
    {
      name: "支出",
      type: "line",
      stack: "Total",
      data: [100, 210, 1020, 230, 20, 250, 60],
    },
  ],
};
</script>

<style lang="scss" scoped>

</style>