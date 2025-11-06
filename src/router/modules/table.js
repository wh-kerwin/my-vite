/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-05-06 15:25:49
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-05-23 13:27:04
 * @FilePath: \my-vite\src\router\modules\table.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const tableRouter = [
  {
    path: "/table",
    name: "table",
    meta: { icon: "List", title: "menu.table" },
    redirect: { name: "table1" },
    children: [
      {
        path: "/table1",
        name: "table1",
        meta: { icon: "Memo", title: "menu.table1" },
        component: () => import("@/views/table/index.vue"),
      },
      {
        path: "/treeTable",
        name: "treeTable",
        meta: { icon: "Files", title: "menu.treetable" },
        component: () => import("@/views/table/treetable.vue"),
      },
      {
        path: "/customTable",
        name: "customTable",
        meta: { icon: "Files", title: "menu.customTable" },
        component: () => import("@/views/table/customTable.vue"),
      },
    ],
  },
];
export default tableRouter;
