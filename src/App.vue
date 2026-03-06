


<script setup>
import { ElConfigProvider } from "element-plus";
import localeZH from "element-plus/dist/locale/zh-cn.mjs";
import localeEN from "element-plus/dist/locale/en.mjs";
import useLang from "@/locales/useLang";
import useThemeStore from "@/store/modules/theme";
import { onMounted } from "vue";


const { lang } = useLang();
const themeStore = useThemeStore();
    
const locales =  {
  zh: localeZH,
  en: localeEN,
};

// 初始化主题
onMounted(() => {
  themeStore.initTheme();
});
</script>

<template>
  <el-config-provider :locale="locales[lang]">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-config-provider>
</template>

<style scoped>
/* Page transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 禁用默认的 View Transitions 动画 */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* 设置亮色模式下的层级顺序 */
::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 2147483646;
}

/* 设置暗色模式下的层级顺序（与亮色模式相反） */
[data-bs-theme="dark"]::view-transition-old(root) {
  z-index: 2147483646;
}

[data-bs-theme="dark"]::view-transition-new(root) {
  z-index: 1;
}
</style>
