<template>
    <div class="more-botton">
        <el-dropdown trigger="click" :teleported="false">
            <div class="more-button">
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                  <el-dropdown-item @click="refresh">
                  <el-icon><Refresh /></el-icon>{{ $t("tabs.refresh") }}
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="closeCurrentTab">
                  <el-icon><Remove /></el-icon>{{ $t("tabs.closeCurrent") }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="tabStore.closeTabsOnSide(route.fullPath, 'left')">
                  <el-icon><DArrowLeft /></el-icon>{{ $t("tabs.closeLeft") }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="tabStore.closeTabsOnSide(route.fullPath, 'right')">
                  <el-icon><DArrowRight /></el-icon>{{ $t("tabs.closeRight") }}
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="tabStore.closeMultipleTab(route.fullPath)">
                  <el-icon><CircleClose /></el-icon>{{ $t("tabs.closeOther") }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="closeAllTab">
                  <el-icon><FolderDelete /></el-icon>{{ $t("tabs.closeAll") }}
                  </el-dropdown-item>
              </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { inject, nextTick } from "vue";
import { useTabsStore } from "@/store/modules/tabs";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const tabStore = useTabsStore();

// refresh current page
const refreshCurrentPage = inject("refresh");
const refresh = () => {
  setTimeout(() => {
    route.meta.isKeepAlive && tabStore.removeKeepAliveName(route.fullPath);
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.isKeepAlive && tabStore.addKeepAliveName(route.fullPath);
      refreshCurrentPage(true);
    });
  }, 0);
};


// Close Current
const closeCurrentTab = () => {
  if (route.meta.isAffix) {return;}
  tabStore.removeTabs(route.fullPath);
};

// Close All
const closeAllTab = () => {
  tabStore.closeMultipleTab();
  router.push("/");
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>