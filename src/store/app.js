import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { defaultSettings } from "@/settings";

// eslint-disable-next-line no-unused-vars
const { showSettings, fixedHeader, sidebarLogo } = defaultSettings;
const useAppStore = defineStore("app", {
  state: () => {
    return {
      sidebar: Cookies.get("sidebarStatus")
        ? !!+Cookies.get("sidebarStatus")
        : true,
      fixedHeader,
      sidebarLogo,
    };
  },
  getters: {
    getSidebarStatus: (state) => state.sidebar,
  },
  actions: {
    changeSidebar() {
      this.sidebar = !this.sidebar;
      if (this.sidebar) {
        Cookies.set("sidebarStatus", 1);
      } else {
        Cookies.set("sidebarStatus", 0);
      }
    },
  },
});

export default useAppStore;
