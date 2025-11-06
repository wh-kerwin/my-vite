<template>
    <BaseCharts :options="options" :height="heights" />
</template>

<script setup>
import BaseCharts from "@/components/BaseEcharts/index.vue";

defineProps({
  heights: {
    type: String,
    default: "100%",
  },
});

const options = {
  tooltip: {},
  //   legend: {
  //     show: true,
  //     icon: "circle",
  //     bottom: 30,
  //     center: 0,
  //     itemWidth: 14,
  //     itemHeight: 14,
  //     shadowColor: "rgba(0, 0, 0, 1)",
  //     shadowBlur: 30,
  //     shadowOffsetX: 10,
  //     shadowOffsetY: 10,
  //     // itemGap: 30,
  //     orient: "horizontal",
  //     data: ["一级权重分析d", "二级权重分析"],
  //     textStyle: {
  //       fontSize: 14,
  //       color: "#fff"
  //     },
  //   },

  radar: {
    // shape: 'circle',
    radius: "90%",
    center: ["50%", "50%"],
    startAngle: 0,
    triggerEvent: true,
    axisName: {
      textStyle: {
        color: "#fff",
        fontSize: "14",
        borderRadius: 3,
        padding: [3, 5]
      }
    },
    axisNameGap: "2",
    indicator: [
      { name: "设备" },
      { name: "建材" },
      { name: "食品" },
      { name: "服装" },
      { name: "旅游" },
    ],
    axisLabel: {
      show: false,
      color: "#333"
    },
    alignTicks: true,
    splitNumber: 5, // 设置每个轴的刻度数量
    splitArea: {
      areaStyle: {
        color: [
          "rgba(0,255,255, 0.1)", "rgba(0,255,255, 0.2)",
          "rgba(0,255,255, 0.3)", "rgba(0,255,255, 0.4)",
          "rgba(0,255,255, 0.5)", "rgba(0,255,255, 0.6)",
        ].reverse(),
        shadowColor: "rgba(0, 0, 0, 1)",
        shadowBlur: 30,
        shadowOffsetX: 10,
        shadowOffsetY: 10
      }
    },
    axisLine: {
      lineStyle: {
        color: "rgba(0,206,209, 0.3)"
      }
    },
    splitLine: {
      lineStyle: {
        width: 1,
        color: [
          "rgba(0,206,209, 0.1)", "rgba(0,206,209, 0.2)",
          "rgba(0,206,209, 0.3)", "rgba(0,206,209, 0.4)",
          "rgba(0,206,209, 0.5)", "rgba(0,206,209, 0.6)"
        ].reverse()
      }
    }

  },
  series: [
    {
      name: "一级权重分析",
      type: "radar",
      areaStyle: {
        color: "rgba(127,255,210, 0.5)"
      },
      symbol: "circle",
      symbolSize: 12,
      itemStyle: {
        color: "rgba(127,255,210,0.8)",
        borderColor: "rgba(127,255,210,0.2)",
        borderWidth: 10,
      },
      lineStyle: {
        color: "rgba(127,255,210, 0.6)",
        width: 2
      },
      label: {
        show: true,
      },
      data: [
        [1250, 1300, 1500, 1350, 1800]
      ]
    },
    {
      name: "二级权重分析",
      type: "radar",
      areaStyle: {
        color: "rgba(255,237,145, 0.5)"
      },
      symbol: "circle",
      symbolSize: 12,
      itemStyle: {
        color: "rgba(255,237,145,0.8)",
        borderColor: "rgba(255,237,145,0.2)",
        borderWidth: 10,
      },
      lineStyle: {
        color: "rgba(255,237,145, 0.6)",
        width: 2
      },
      data: [
        [900, 1500, 1280, 1350, 1500]
      ]
    }
  ]
};

</script>

<style lang="scss" scoped>
</style>