<template>
    <template v-for="item in myMainRouterList" :key="item.name">
      <div v-if="!item.hidden">
        <!-- 多个 -->
        <el-sub-menu v-if="item?.children?.length > 0" :index="item.path">
          <template #title>
            <icon-renderer :meta="item.meta" />
            <span>{{ $t(item.meta.title) }}</span>
          </template>
          <!-- 递归调用自己 -->
          <myAside :main-router-list="item?.children"></myAside>
        </el-sub-menu>
        <!-- 单个 -->
        <el-menu-item v-else :index="item.path"  @click="handleClickMenu(item)">
          <icon-renderer :meta="item.meta" />
          <span>{{ $t(item?.meta?.title) }}</span>
        </el-menu-item>
      </div>
    </template>
  </template>
<script setup>
import { useRouter } from "vue-router";
import IconRenderer from "./IconRenderer.vue";
const myRouter = useRouter();
// 获取父组件传递过来的参数
// eslint-disable-next-line vue/require-prop-types
const myProps = defineProps(["mainRouterList"]);
const myMainRouterList = myProps.mainRouterList;
  
// 点击左侧侧边栏，进行路由跳转
const handleClickMenu = (subItem) => {
  if (subItem.meta.isLink) {return window.open(subItem.meta.isLink, "_blank");}
  myRouter.push(subItem?.path);
};
</script>
  