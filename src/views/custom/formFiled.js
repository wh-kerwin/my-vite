const formFiledList = [
  {
    type: "input",
    label: "姓名",
    prop: "name",
    span: 12,
    rules: [
      { required: true, message: "请输入姓名", trigger: "blur" },
      { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
    ],
  },
  {
    type: "select",
    label: "性别",
    prop: "sex",
    span: 12,
    rules: [
      { required: true, message: "请选择性别", trigger: "change" },
    ],
    options: [
      { label: "男", value: "1" },
      { label: "女", value: "2" },
    ],
  },
  {
    type: "checkbox",
    label: "城市",
    prop: "city",
    rules: [
      { required: true, message: "请选择", trigger: "change" },
    ],
    checkboxList: [
      { label: "北京", value: "1" },
      { label: "上海", value: "2" },
      { label: "广州", value: "3" },
      { label: "深圳", value: "4" },
    ],
  },
  {
    type: "date",
    label: "生日",
    prop: "birthday",
    span: 12,
    rules: [
      { required: true, message: "请选择日期", trigger: "change" },
    ],
  },
  {
    type: "daterange",
    label: "时间段",
    prop: "datetime",
    span: 12,
    rules: [
      { required: true, message: "请选择", trigger: "change" },
    ],
  },
  {
    type: "radio",
    label: "选择城市",
    prop: "city1",
    rules: [
      { required: true, message: "请选择", trigger: "change" },
    ],
    radioList: [
      { label: "北京", value: "1" },
      { label: "上海", value: "2" },
    ],
  },
  {
    type: "textarea",
    label: "简介",
    prop: "desc"
  },
  {
    type: "wangeditor",
    label: "详情",
    prop: "marks"
  },
];
export default formFiledList;