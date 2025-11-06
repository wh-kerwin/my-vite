const customRouter = [
  {
    path: "/custom",
    name: "custom",
    meta: { icon: "PictureFilled", title: "menu.custom" },
    redirect: { name: "disrctives" },
    children: [
      {
        path: "/disrctives",
        name: "disrctives",
        meta: { icon: "Picture", title: "menu.directives" },
        component: () => import("@/views/custom/disrctives.vue"),
      },
      {
        path: "/form",
        name: "customForm",
        meta: { icon: "Picture", title: "menu.customForm" },
        component: () => import("@/views/custom/form.vue"),
      },
    ]
  }
];

export default customRouter;