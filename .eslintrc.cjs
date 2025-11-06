// .eslintrc.cjs
module.exports = {
  extends: ["plugin:vue/vue3-recommended", "prettier"],
  plugins: ["vue", "prettier"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "ecmaFeatures": {
      "classPrivateProperties": true
    }
  },
  // 自定义规则
  rules: {
    "indent": ["warn", 2], 
    // // 错误级别规则
    "no-console": "off", // 允许使用 console.log
    "no-debugger": "off", // 允许使用 debugger
    "no-unused-vars": "warn", // 未使用的变量发出警告
    // "no-undef": "warn", // 未定义的变量或函数使用时报错
    eqeqeq: "error", // 要求使用 === 和 !== 严格比较
    curly: "error", // 要求代码块使用花括号
    "guard-for-in": "error", // 要求 for-in 循环中使用守卫语句
    "no-else-return": "error", // 禁止 if-else 语句中出现 return
    "no-empty-function": "error", // 禁止空函数
    "no-use-before-define": "error", // 禁止变量使用前定义
    "vue/multi-word-component-names": "off",
    // 警告级别规则
    quotes: ["warn", "double"], // 字符串使用单引号
    semi: ["warn", "always"], // 不使用分号
    // 可关闭的规则
    "no-plusplus": "off", // 允许使用 ++ 和 --
    "no-restricted-syntax": "off", // 允许受限语法
    "no-useless-escape": "off", // 允许不必要的转义
    "no-shadow": "off", // 允许变量阴影
    "no-undef-init": "off", // 允许变量初始化为 undefined
    "no-underscore-dangle": "off", // 允许下划线命名
    "no-unused-expressions": "off", // 允许未使用的表达式
    "no-void": "off", // 允许 void 操作
    "prefer-arrow-callback": "off", // 允许使用传统函数声明
    "prefer-template": "off", // 允许使用字符串连接而不是模板字符串
    "rest-spread-spacing": "off", // 允许或禁止在 spread 操作符 和其表达式之间添加空格
    "sort-imports": "off", // 允许导入顺序不排序
    "vars-on-top": "off", // 允许变量声明不在函数顶部
    "vue/no-v-html": "off",
  },
};
