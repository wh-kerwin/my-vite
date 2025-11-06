/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-05-06 15:01:31
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-12-02 16:02:12
 * @FilePath: \my-vite\src\router\modules\three.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const Three = [
  {
    path: "/three",
    name: "three",
    meta: { title: "menu.three", icon: "SwitchFilled" },
    redirect: { name: "threeIndex" },
    children: [
      {
        path: "/motor",
        name: "threeIndex",
        component: () => import("@/views/three/Motor/index.vue"),
        meta: { title: "menu.motor", icon: "Camera" },
      },
      {
        path: "/valve",
        name: "threeValve",
        component: () => import("@/views/three/ValveView/index.vue"),
        meta: { title: "menu.valve", icon: "Camera" },
      },
      {
        path: "/car",
        name: "threeCar",
        component: () => import("@/views/three/CarView/index.vue"),
        meta: { title: "menu.car", icon: "Camera" },
      },
      {
        path: "/tokyo",
        name: "threeTokyo",
        component: () => import("@/views/three/Tokyo/index.vue"),
        meta: { title: "menu.tokyo", icon: "Camera" },
      },
      {
        path: "/shade",
        name: "threeShade",
        component: () => import("@/views/three/Shade/index.vue"),
        meta: { title: "menu.shade", icon: "Camera" },
      },
    ],
  },
];
