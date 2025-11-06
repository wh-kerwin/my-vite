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

var colorArray = [
  {
    top: "#ffa800", //黄
    bottom: "rgba(11,42,84,.3)"
  }, {
    top: "#1ace4a", //绿
    bottom: "rgba(11,42,84, 0.3)"
  },
  {
    top: "#4bf3ff", //蓝
    bottom: "rgba(11,42,84,.3)"
  }, {
    top: "#4f9aff", //深蓝
    bottom: "rgba(11,42,84,.3)"
  },
  {
    top: "#b250ff", //粉
    bottom: "rgba(11,42,84,.3)"
  }
];
const options = {
  tooltip: {
    show: true,
    formatter: "{b}:{c}"
  },
  grid: {
    left: "5%",
    top: "12%",
    right: "1%",
    bottom: "8%",
    containLabel: true
  },
  
  xAxis: {
    type: "value",
    show:false,
    position: "top",
    axisTick: {
      show: false
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: "#fff",
      }
    },
    splitLine: {
      show: false
    },
  },
  yAxis: [{
    type: "category",
    axisTick: {
      show: false,
      alignWithLabel: false,
      length: 5,

    },
    "splitLine": { //网格线
      "show": false
    },
    inverse: "true", //排序
    axisLine: {
      show: false,
      lineStyle: {
        color: "#fff",
      }
    },
    data: ["first", "two", "three", "four", "five"]
  }

  ],
  series: [{
    name: "能耗值",
    type: "bar",
    label: {
      show: true,
      position: "right",
      formatter: "{c}",
      color: "white" //color of value
    },
    itemStyle: {
      show: true,
      color: function(params) {
        let num = colorArray.length;
        return {
          type: "linear",
          colorStops: [{
            offset: 0,
            color: colorArray[params.dataIndex % num].bottom
          }, {
            offset: 1,
            color: colorArray[params.dataIndex % num].top
          }, {
            offset: 0,
            color: colorArray[params.dataIndex % num].bottom
          }, {
            offset: 1,
            color: colorArray[params.dataIndex % num].top
          }, {
            offset: 0,
            color: colorArray[params.dataIndex % num].bottom
          }, {
            offset: 1,
            color: colorArray[params.dataIndex % num].top
          }, {
            offset: 0,
            color: colorArray[params.dataIndex % num].bottom
          }, {
            offset: 1,
            color: colorArray[params.dataIndex % num].top
          }, {
            offset: 0,
            color: colorArray[params.dataIndex % num].bottom
          }, {
            offset: 1,
            color: colorArray[params.dataIndex % num].top
          }, {
            offset: 0,
            color: colorArray[params.dataIndex % num].bottom
          }, {
            offset: 1,
            color: colorArray[params.dataIndex % num].top
          }],
          //globalCoord: false
        };
      },
      borderRadius: 70,
      borderWidth: 0,
      borderColor: "#333",
    },
    barGap: "0%",
    barCategoryGap: "50%",
    data: [60, 132, 89, 134, 60]
  }

  ]
};
</script>

<style lang="scss" scoped>

</style>