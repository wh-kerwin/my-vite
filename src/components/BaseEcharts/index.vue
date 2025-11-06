<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-05-20 11:13:00
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-05-23 10:12:49
 * @FilePath: \my-vite\src\components\BaseEcharts\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div
      ref="echartsRef"
      :style="{
        width: width,
        height: height,
      }"
    />
  </template>
  
<script setup>
import { ref, onMounted, watch } from "vue";
import { useEcharts } from "@/hooks/useEcharts"; // 引入hooks
  
const props = defineProps({
  options: { type: Object, required: true },
  height: { type: String, default: "100%" },
  width: { type: String, default: "100%" },
  themeColors: { type: Array, default: () => [] },
});
  
const echartsRef = ref();
  
const { setOptions, initCharts, resize } = useEcharts(echartsRef, props.options);
  
watch(
  () => props.options,
  (nVal) => {
    let targetOptions = {};
    if (props.themeColors && props.themeColors.length > 0) {
      targetOptions = { ...nVal, color: props.themeColors };
      // targetOptions.color = props.themeColors;
    } else {
      targetOptions = { ...nVal };
    }
    setOptions(targetOptions);
  }
);
  
onMounted(() => {
  initCharts();

  resize();
});
  
defineExpose({
  resize,
  setOptions,
  initCharts,
  echartsRef,
  // ...toRefs(state),
});
</script>
  