<template>
  <div class="app-wrapper">
    <div :class="classObj">
      <el-aside class="sidebar-container">
        <logo v-if="showLogo" :collapse="isCollapse" ></logo>
        <!-- 当侧边栏超出浏览器视口时，显示滚动条 -->
        <el-scrollbar
          wrap-class="scrollbar-wrapper" 
          :class="showLogo ? 'scrollbarHeight' : ''"
        >
          <el-menu
            active-text-color="#409EFF"
            :default-active="defaultActive"
            :collapse="!isCollapse"
            background-color="#304156"
            text-color="#bfcbd9"
            :unique-opened="false"
            :collapse-transition="false"
            mode="vertical"
          >
            <myAside :main-router-list="mainRouterList"></myAside>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <div class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <myHeader></myHeader>
          <myTags></myTags>
        </div>
        <div class="app-main">
          <myMain :is-refresh="isRouterShow"></myMain>
        </div>
        <!-- <el-footer>Footer</el-footer> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import logo from "./components/myLogo.vue";
import myAside from "./components/myAside.vue";
import myHeader from "./components/myHeader.vue";
import myTags from "./components/TagsViews/index.vue";
import myMain from "./components/myMain.vue";
import { useRoute, useRouter } from "vue-router";
import { provide, ref, computed, watch, onMounted } from "vue";
import useAppStore from "@/store/app";


// 注入刷新页面方法
const isRouterShow = ref(true);
const refreshCurrentPage = (val) => (isRouterShow.value = val);
provide("refresh", refreshCurrentPage);

const myRouter = useRouter();
const myRoute = useRoute();

// 获取路由里的所有路由数组
const routerList = myRouter.options.routes;
// 获取layout里面的所有数组
const mainRouterList = routerList.find((v) => v.name === "home").children;

// 当前路由地址，用作左边侧边栏的高亮
const defaultActive = ref("");
watch(() => myRoute.path, (newVal) => {
  defaultActive.value = newVal;
});
// defaultActive.value = computed(() => myRoute.path);
// 监听sidebar的变化
const appStore = useAppStore();
const isCollapse = computed(() => appStore.sidebar);
// 监听获取的appStore的fixedHeader
const fixedHeader = computed(() => appStore.fixedHeader);
const showLogo = computed(() => appStore.sidebarLogo);
// 获取当前app-wrapper 其他classObj
const classObj = computed(() => {
  return {
    hideSidebar: !isCollapse.value,
    openSidebar: isCollapse.value
  };
});

// 监听路由的变化
watch(
  () => myRoute.path,
  (newVal) => {
    defaultActive.value = newVal;
  }
);

onMounted(() => {
  defaultActive.value = myRoute.path;
});
</script>

<style lang="scss" scoped>
  @import "@/styles/mixin.scss";
  @import "@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .scrollbarHeight {
    height: calc(100% - 50px) !important;
  }

  .app-main {
    /*50 = navbar  */
    // min-height: calc(100vh - 50px);
    height: calc(100vh - 90px);
    width: 100%;
    position: relative;
    overflow-x: hidden;
    background-color: #f2f3f5;

    /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
    // 滚动条整体部分
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
    }
    // 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
    &::-webkit-scrollbar-button {
      display: none;
    }
    // 滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
    &::-webkit-scrollbar-thumb {
      background: rgba(144, 147, 153, 0.6);
      cursor: pointer;
      border-radius: 4px;
    }
    // 边角，即两个滚动条的交汇处
    &::-webkit-scrollbar-corner {
      display: none;
    }
    // 两个滚动条的交汇处上用于通过拖动调整元素大小的小控件
    &::-webkit-resizer {
      display: none;
    }
  }
  .fixed-header+.app-main {
    margin-top: 90px;
  }
</style>
