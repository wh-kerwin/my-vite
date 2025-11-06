import { defineStore } from "pinia";
import router from "@/router";
import { getItem, setItem } from "@/utils/storage";

function getUrlWithParams() {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search
  };
  return url[mode];
}
function getStorageMenus() {
  const authMenuList = getItem("tabsStorageMenu");
  return authMenuList ? authMenuList : false;
}

export const useTabsStore = defineStore({
  id: "tabs",
  state: () => ({
    keepAliveName: [],
    tabsMenuList: getStorageMenus() || [],

  }),
  actions: {
    // Add KeepAliveName
    async addKeepAliveName(name) {
      !this.keepAliveName.includes(name) && this.keepAliveName.push(name);
    },
    // Remove KeepAliveName
    async removeKeepAliveName(name) {
      this.keepAliveName = this.keepAliveName.filter(item => item !== name);
    },
    // Set KeepAliveName
    async setKeepAliveName(keepAliveName) {
      this.keepAliveName = keepAliveName;
    },
    // Add Tabs
    async addTabs(tabItem, isFirst = false) {
      if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
        isFirst ?
          this.tabsMenuList.unshift(tabItem) :
          this.tabsMenuList.push(tabItem);
      }
      // add keepalive
      if (!this.keepAliveName.includes(tabItem.name) && tabItem.isKeepAlive) {
        this.addKeepAliveName(tabItem.path);
      }
      //  set storage tabs
      setItem("tabsStorageMenu", this.tabsMenuList);
    },
    // Remove Tabs
    async removeTabs(tabPath, isCurrent = true) {
      if (isCurrent) {
        this.tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) {return;}
          const nextTab = this.tabsMenuList[index + 1] || this.tabsMenuList[index - 1];
          if (!nextTab) {return;}
          router.push(nextTab.path);
        });
      }
      // remove keepalive
      const tabItem = this.tabsMenuList.find(item => item.path === tabPath);
      tabItem?.isKeepAlive && this.removeKeepAliveName(tabItem.path);
      // set tabs
      this.tabsMenuList = this.tabsMenuList.filter(item => item.path !== tabPath);
      
      // set storage tabs
      setItem("tabsStorageMenu", this.tabsMenuList);
    },
    // Close Tabs On Side
    async closeTabsOnSide(path, type) {
      const currentIndex = this.tabsMenuList.findIndex(item => item.path === path);
      if (currentIndex !== -1) {
        const range = type === "left" ? [0, currentIndex] : [currentIndex + 1, this.tabsMenuList.length];
        this.tabsMenuList = this.tabsMenuList.filter((item, index) => {
          return index < range[0] || index >= range[1] || !item.close;
        });
      }
      // set keepalive
      const KeepAliveList = this.tabsMenuList.filter(item => item.isKeepAlive);
      this.setKeepAliveName(KeepAliveList.map(item => item.path));
    },
    // Close MultipleTab
    async closeMultipleTab(tabsMenuValue) {
      this.tabsMenuList = this.tabsMenuList.filter(item => {
        return item.path === tabsMenuValue || !item.close;
      });
      // set keepalive
      const KeepAliveList = this.tabsMenuList.filter(item => item.isKeepAlive);
      this.setKeepAliveName(KeepAliveList.map(item => item.path));
    },
    // Set Tabs
    async setTabs(tabsMenuList) {
      this.tabsMenuList = tabsMenuList;
    },
    // Set Tabs Title
    async setTabsTitle(title) {
      this.tabsMenuList.forEach(item => {
        if (item.path === getUrlWithParams()) {item.title = title;}
      });
    }
  }
});
