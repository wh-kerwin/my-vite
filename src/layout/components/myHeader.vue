<template>
  <div class="navbar">
    <hamburger :is-active="sidebar" class="hamburger-container" @toggle-click="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
          <search id="header-search" class="right-menu-item" />  
          <error-log class="errLog-container right-menu-item hover-effect" />
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
          <el-tooltip content="Global Size" effect="dark" placement="bottom">
              <size-select id="size-select" class="right-menu-item hover-effect" />
          </el-tooltip>
      </template> -->
      <change-lang />
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="'https://github.com/element-plus/element-plus'" class="user-avatar"> -->
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="" class="user-avatar" />
          <span class="user-name">
            admin
            <!-- <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon> -->
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
                <el-dropdown-item>主页</el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
                <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/">
                <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item divided>
                <span style="display:block;" @click="logout">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import Hamburger from "@/components/Hamburger/index.vue";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import ChangeLang from "./changeLang.vue";
// eslint-disable-next-line no-unused-vars
import Cookies from "js-cookie";
import useAppStore from "@/store/app";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { removeToken } from "@/utils/auth";
import { removeItem } from "@/utils/storage";

const router = useRouter();
const appStore = useAppStore(); // 获取app的sidebar状态
const sidebar = computed(() => appStore.sidebar);
const toggleSideBar = () => {
  appStore.changeSidebar();
};
function logout() {
  // 清除token
  removeToken("vue3_admin_token");
  removeItem("tabsStorageMenu");
  // 跳转到登录页
  router.push("/login");
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  // padding: 0px 20px;
  line-height: 50px;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
    line-height: 50px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 10px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .user-name {
          vertical-align: super;
        }

        .el-icon--right {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 22px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
  