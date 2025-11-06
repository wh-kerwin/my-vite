<template>
  <!-- 如果是SVG图标 -->
  <svg-icon 
    v-if="isSvgIcon" 
    :name="iconName"
    width="16px"
    height="16px"
    class="menu-icon"
  />
  
  <!-- 如果是Element图标 -->
  <el-icon
v-else-if="isElementIcon"
           class="menu-icon"
>
    <component :is="iconName" />
  </el-icon>
</template>

<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";

const props = defineProps({
  meta: {
    type: Object,
    default: () => ({})
  }
});

// 判断图标类型并提取图标名称
const { isSvgIcon, isElementIcon, iconName } = computed(() => {
  // 没有图标
  if (!props.meta?.icon) {
    return { isSvgIcon: false, isElementIcon: false, iconName: "" };
  }
  
  const icon = props.meta.icon;
  
  // 只使用字符串格式，通过前缀区分
  if (typeof icon === "string") {
    // 如果以svg-开头，视为SVG图标
    if (icon.startsWith("svg-")) {
      return { 
        isSvgIcon: true, 
        isElementIcon: false, 
        iconName: icon.slice(4) // 移除svg-前缀
      };
    }
    // 否则视为Element图标
    return { 
      isSvgIcon: false, 
      isElementIcon: true, 
      iconName: icon 
    };
  }
  
  // 默认返回
  return { isSvgIcon: false, isElementIcon: false, iconName: "" };
}).value;
</script>

<style scoped>
.menu-icon {
  min-width: 14px;
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style> 