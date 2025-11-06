


<script setup>
import { ElConfigProvider } from "element-plus";
import localeZH from "element-plus/dist/locale/zh-cn.mjs";
import localeEN from "element-plus/dist/locale/en.mjs";
import useLang from "@/locales/useLang";


const { lang } = useLang();
    
const locales =  {
  zh: localeZH,
  en: localeEN,
};
</script>

<template>
  <el-config-provider :locale="locales[lang]">
    <router-view />
  </el-config-provider>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
