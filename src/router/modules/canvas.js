const canvasRouter = [
  {
    path: "/canvas",
    name: "canvas",
    meta: { icon: "PictureFilled", title: "menu.canvas" },
    redirect: { name: "page2-1" },
    children: [
      {
        path: "/page2-1",
        name: "page2-1",
        meta: { icon: "Picture", title: "menu.waterfall" },
        component: () => import("@/views/pages/page2.vue"),
      },
      {
        path: "/canvas2",
        name: "canvas2",
        meta: { icon: "Picture", title: "menu.canvas2" },
        component: () => import("@/views/pages/canvas2.vue"),
      },
      {
        path: "/canvas3",
        name: "canvas3",
        meta: { icon: "Picture", title: "menu.canvas3" },
        component: () => import("@/views/pages/canvas3.vue"),
      },
    ],
  },
];
export default canvasRouter;
