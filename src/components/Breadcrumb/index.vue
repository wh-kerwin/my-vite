<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ $t(item.meta.title) }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ $t(item.meta.title) }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script setup>
import { compile } from "path-to-regexp";
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const levelList = ref(null);
const route = useRoute();
const router = useRouter();
const matched = ref(null);

watch(route, () => {
  // eslint-disable-next-line no-use-before-define
  getBreadcrumb();
});

onMounted(() => {
  // eslint-disable-next-line no-use-before-define
  getBreadcrumb();   
});

const getBreadcrumb = () => {
  // only show routes with meta.title
  matched.value = route.matched.filter((item) => item.meta && item.meta.title);
  const first = matched.value[0];

  // eslint-disable-next-line no-use-before-define
  if (!isDashboard(first)) {
    matched.value = [{ path: "/dashboard", meta: { title: "menu.home" }}].concat(matched.value);    
  }

  levelList.value = matched.value.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false);
};

const isDashboard = (route) => {
  const name = route && route.name;
  if (!name) {
    return false;
  }
  return name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase(); 
};

const handleLink = (item) => {
  // 添加handleLink函数的实现
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect);
    return;
  }
  // eslint-disable-next-line no-use-before-define
  router.push(pathCompile(path));
};

function pathCompile(path) {
  const { params } = route;
  var toPath = compile(path);
  return toPath(params);
}
</script>
