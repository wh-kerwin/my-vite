<template>
    <div class="tabs-box">
        <div class="tabs-menu">
            <el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
                <el-tab-pane v-for="item in tabsMenuList" :key="item.path" :label="item.title" :name="item.path" :closable="item.close">
                <template #label>
                    <el-icon v-if="item.icon" class="tabs-icon">
                        <component :is="item.icon"></component>
                    </el-icon>
                    {{ $t(item.title) }}
                </template>
                </el-tab-pane>
            </el-tabs>
            <MoreButton />
        </div>
    </div>
</template>

<script setup>
import MoreButton from "./MoreButton.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTabsStore } from "@/store/modules/tabs";
import { useAuthStore } from "@/store/modules/auth";

const route = useRoute();
const router = useRouter();
const tabStore = useTabsStore();
const authStore = useAuthStore();

const tabsMenuValue = ref(route.fullPath);
const tabsMenuList = computed(() => tabStore.tabsMenuList);

// 初始化需要固定的 tabs
const initTabs = () => {
  authStore.flatMenuListGet.forEach(item => {
    const tabsParams = {
      icon: item.icon,
      title: item.title,
      path: item.path,
      name: item.name,
      close: !item.close,
      isKeepAlive: item.isKeepAlive
    };
    if (item.close) {
      tabStore.addTabs(tabsParams, true);
    } else {
      tabStore.addTabs(tabsParams);
    }
    // if (item.meta.isAffix ) {
    //   const tabsParams = {
    //     icon: item.meta.icon,
    //     title: item.meta.title,
    //     path: item.path,
    //     name: item.name,
    //     close: !item.meta.isAffix,
    //     isKeepAlive: item.meta.isKeepAlive
    //   };
    //   tabStore.addTabs(tabsParams, true);
    // }
  });
};

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) {return;}
    tabsMenuValue.value = route.fullPath;
    const tabsParams = {
      icon: route.meta.icon,
      title: route.meta.title,
      path: route.fullPath,
      name: route.name,
      close: !route.meta.isAffix,
      isKeepAlive: route.meta.isKeepAlive
    };
    tabStore.addTabs(tabsParams);
  },
  { immediate: true }
);

onMounted(() => {
  initTabs();
});

// Tab Click
const tabClick = (tabItem) => {
  const fullPath = tabItem.props.name;
  router.push(fullPath);
};

// Remove Tab
const tabRemove = (fullPath) => {
  tabStore.removeTabs(fullPath, fullPath === route.fullPath);
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>