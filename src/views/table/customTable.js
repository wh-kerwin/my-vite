import { h } from "vue";
import dayjs from "dayjs";
import { ElTag, ElButton } from "element-plus";
// 基本表格配置
export const tableColumn1 = [
  { type: "selection", width: "55" },
  { type: "index", width: "80", label: "序号" },
  { prop: "name", label: "名字", sortable: true  },
  { type: "date", prop: "date", label: "日期"},
  { prop: "address", label: "地址", showOverflowTooltip: true },
  {
    width: "120",
    label: "操作",
    buttons: [
      { name: "编辑", type: "success", command: "edit" },
      { name: "删除", type: "danger", command: "delete" }
    ]
  }
];
// 自定义表头
export const tableColumn2 = [
  {
    label: "Date",
    prop: "date",
    headerRender: ({ column }) => h(ElTag, { type: "danger" }, () => `${column.label}(渲染函数自定义表头)`)
  },
  {
    label: "Delivery Info",
    headerSlot: "deliveryHeader",
    children: [
      { label: "Name", prop: "name", },
      {
        label: "Address Info",
        headerRender: ({ column }) => h(ElTag, { type: "success" }, () => `${column.label}(渲染函数自定义表头)`),
        children: [
          { label: "State", prop: "state",  headerSlot: "stateHeader" },
          { label: "City", prop: "city", },
          {
            label: "Address",
            prop: "address",
            showOverflowTooltip: true, 
            headerRender: ({ column }) =>
              h(ElTag, { type: "warning" }, () => `${column.label}(渲染函数自定义表头)`)
          },
          { label: "Zip", render: ({ row }) => h(ElTag, { type: "success" }, () => row.zip) }
        ]
      }
    ]
  }
];
// 展开行
const renderExpandContent = (row) =>
  h("div", { class: "p-5" }, [
    h("p", `名字：${row.name}`),
    h("p", `地址：${row.address}`),
    h("p", `日期：${row.date}`)
  ]);
export const tableColumn3 = [
  // 使用render函数渲染展开行的内容
  { type: "expand", width: "50", render: ({ row }) => renderExpandContent(row) },
  // 使用expand插槽自定义展开行的内容。注意：如果使用展开行的插槽， slot名字必须是 ‘expand’。
  { type: "index", width: "80", label: "序号" },
  { prop: "name", label: "名字", sortable: true },
  { prop: "date", label: "日期", type: "date" },
  { prop: "address", label: "地址", showOverflowTooltip: true },
  {
    width: "180",
    label: "操作",
    buttons: [
      { name: "编辑", type: "success", command: "edit" },
      { name: "删除", type: "danger", command: "delete" }
    ]
  }
];
// 自定义头 自定义列
export const tableColumn4 = [
  { type: "selection", width: "50" },
  { type: "index", width: "80", label: "序号" },
  { prop: "name", label: "名字" },
  // 日期使用render函数格式化
  {
    prop: "date",
    label: "日期",
    headerRender: ({ column }) => h(ElTag, { type: "danger" }, () => `${column.label}(渲染函数自定义表头)`),
    render: ({ row }) => h("span", dayjs(row.date).format("YYYY-MM-DD HH:mm"))
  },
  { prop: "address", label: "地址", headerSlot: "addressHeader", slot: "address", showOverflowTooltip: true },
  // 按钮使用render函数渲染
  {
    width: "140",
    label: "操作",
    render: (row, index) =>
    // 渲染多个元素
      h("div", null, [
        h(
          ElButton,
          {
            type: "primary",
            size: "small",
            onClick: () => handleRenderEdit(row, index)
          },
          { default: () => "编辑" }
        ),
        h(
          ElButton,
          {
            type: "danger",
            size: "small",
            onClick: () => handleRenderDelete(row, index)
          },
          { default: () => "删除" }
        )
      ])
  }
];