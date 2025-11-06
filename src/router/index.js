/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-15 16:01:37
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-05-07 10:56:36
 * @FilePath: \my-vite\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/* eslint-disable no-unused-vars */
// 引入创建路由的函数，和配置路由模式的函数
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Layout from "../layout/index.vue";
import canvasRouter from "./modules/canvas";
import tableRouter from "./modules/table";
import customRouter from "./modules/custom";
import { Three } from "./modules/three";
import webRtc from "./modules/webrtc";
// import autoRoutes from "./autoRouter";

const routes = [
  {
    path: "/login",
    name: "login",
    meta: { icon: "House", title: "menu.login" },
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/3Dscreen",
    name: "3Dscreen",
    meta: { icon: "House", title: "menu.screen" },
    component: () => import("../views/screen/index.vue"),
  },
  {
    path: "/",
    name: "home",
    redirect: { name: "dashboard" },
    meta: { icon: "House", title: "menu.home", isAffix: true },
    component: Layout,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: { icon: "House", title: "menu.home", isAffix: true },
        component: () => import("../views/pages/page1-1.vue"),
      },
      {
        path: window.location.origin + "/3Dscreen",
        name: "screen",
        meta: { icon: "Histogram", title: "menu.screen", isLink: window.location.origin + "/3Dscreen" },
      },
      {
        path: "/chatgpt",
        name: "chatgpt",
        meta: { icon: "House", title: "menu.chatgpt" },
        component: () => import("../views/chatgpt/index.vue"),
      },
      ...canvasRouter,
      ...tableRouter,
      ...customRouter,
      ...Three,
      ...webRtc,
    ],
  },
  // Resolve refresh page, route warnings
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    meta: { title: "menu.404" },
    component: () => import("@/views/error/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
