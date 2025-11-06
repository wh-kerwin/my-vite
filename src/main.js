import { createApp } from "vue";
import "@/styles/index.scss"; // global css
import App from "./App.vue";
// 引入路由文件
import router from "./router/index";
// 引入ElementPlus
// import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 引入element icon
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "@/permission";
import pinia from "@/store/index.js";
// 引入国际化
import i18n from "./locales/index.js";

import "animate.css";
import CommonUtils from "@/utils/index";
import directives from "@/directives/index";

const app = createApp(App);
// 引入element icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 引入svg图标注册脚本
import "virtual:svg-icons-register";
// 注册全局组件
import globalComponent  from "./global-components";
// 全局注册CommonUtils 组件内使用inject("$commonUtils");
const commonUtils = new CommonUtils();
app.provide("$commonUtils", commonUtils);
// 使用ElementPlus
//app.use(ElementPlus);
// 国际化
app.use(i18n);
app.use(globalComponent);
// 使用自定义指令
app.use(directives);
// 使用状态管理器pinia
app.use(pinia);
// 使用路由
app.use(router);
app.mount("#app");
