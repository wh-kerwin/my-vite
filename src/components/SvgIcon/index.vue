<template>
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>
<script setup>
defineProps({
  // xlink:href的属性值前缀
  prefix: {
    type: String,
    default: "#icon-",
  },
  // 需要使用的svg的图标的名字
  name: {
    type: String,
    required: true,
  },
  // 需要使用的svg的图标的颜色
  color: {
    type: String,
    default: "#333",
  },
  // 需要使用的svg的图标的宽度
  width: {
    type: String,
    default: "16px",
  },
  // 需要使用的svg的图标的高度
  height: {
    type: String,
    default: "16px",
  },
});
</script>
