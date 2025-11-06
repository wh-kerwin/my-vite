<template>
    <BaseCharts :options="options" :height="heights" />
</template>

<script setup>
import BaseCharts from "@/components/BaseEcharts/index.vue";
import "echarts-liquidfill";

defineProps({
  heights: {
    type: String,
    default: "100%",
  },
});

var value = 0.2;
var data = [value, value, value, ];
const options = {
  width: "100%",
  height: "100%",
  title: {
    text: (value * 100).toFixed(0) + "{a|%}",
    textStyle: {
      fontSize: 30,
      fontFamily: "Microsoft Yahei",
      fontWeight: "normal",
      color: "#bcb8fb",
      rich: {
        a: {
          fontSize: 20,
        }
      }
    },
    x: "center",
    y: "35%"
  },
  graphic: [{
    type: "group",
    left: "center",
    top: "60%",
    children: [{
      type: "text",
      z: 100,
      left: "10",
      top: "middle",
      style: {
        fill: "#aab2fa",
        text: "流量统计",
        font: "20px Microsoft YaHei"
      }
    }]
  }],
  series: [
    {
      type: "liquidFill",
      radius: "90%",
      data: data,
      center: ["50%", "50%"], //图在整个画布的位置
      backgroundStyle: {
        color: {
          type: "linear",
          x: 1,
          y: 0,
          x2: 0.5,
          y2: 1,
          colorStops: [{
            offset: 1,
            color: "rgba(68, 145, 253, 0)"
          }, {
            offset: 0.5,
            color: "rgba(68, 145, 253, .25)"
          }, {
            offset: 0,
            color: "rgba(68, 145, 253, 1)"
          }],
          globalCoord: false
        },
      },
      label: {
        //水球图里面的文字喝字体等设置
        formatter: function (value) {
          if (!value) {
            return "加载中";
          } 
          return 0.2 *100 + "%";
                
        },
        fontSize: 22,
      },
      outline: {
        //水球图的外层边框 可设置 show:false  不显示
        itemStyle: {
          borderColor: "#DCDCDC",
          borderWidth: 3,
        },
        borderDistance: 0,
      },
      color: [{
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 1,
          color: "rgba(58, 71, 212, 0)"
        }, {
          offset: 0.5,
          color: "rgba(31, 222, 225, .2)"
        }, {
          offset: 0,
          color: "rgba(31, 222, 225, 1)"
        }],
        globalCoord: false
      }], //波浪的颜色
      itemStyle: {
        opacity: 0.95,
        shadowColor: "rgba(0,0,0,0)",
      },
    },
  ],
};

</script>