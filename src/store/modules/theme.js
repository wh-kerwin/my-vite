import { defineStore } from "pinia";
import Cookies from "js-cookie";

const useThemeStore = defineStore("theme", {
  state: () => ({
    // 主题模式: 'light' | 'dark'
    theme: Cookies.get("theme") || "light",
  }),
  getters: {
    isDark: (state) => state.theme === "dark",
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      this.setTheme(this.theme);
    },
    setTheme(theme) {
      this.theme = theme;
      Cookies.set("theme", theme, { expires: 30 });
      
      // 更新 HTML 类
      const html = document.documentElement;
      if (theme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
      
      // 更新 Element Plus 主题
      this.updateElementPlusTheme(theme);
    },
    updateElementPlusTheme(theme) {
      // 更新 Element Plus 主题色
      const el = document.documentElement;
      if (theme === "dark") {
        el.style.setProperty("--el-color-primary", "#818cf8"); // Indigo light
        el.style.setProperty("--el-color-primary-light-3", "#a5b4fc");
        el.style.setProperty("--el-color-primary-light-5", "#c7d2fe");
        el.style.setProperty("--el-color-primary-light-7", "#e0e7ff");
        el.style.setProperty("--el-color-primary-light-8", "#eef2ff");
        el.style.setProperty("--el-color-primary-light-9", "#e0e7ff");
        el.style.setProperty("--el-color-primary-dark-2", "#6366f1");
      } else {
        el.style.setProperty("--el-color-primary", "#6366f1");
        el.style.setProperty("--el-color-primary-light-3", "#818cf8");
        el.style.setProperty("--el-color-primary-light-5", "#a5b4fc");
        el.style.setProperty("--el-color-primary-light-7", "#c7d2fe");
        el.style.setProperty("--el-color-primary-light-8", "#e0e7ff");
        el.style.setProperty("--el-color-primary-light-9", "#eef2ff");
        el.style.setProperty("--el-color-primary-dark-2", "#4f46e5");
      }
    },
    initTheme() {
      this.setTheme(this.theme);
    },
  },
});

export default useThemeStore;
