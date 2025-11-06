# Vue 3 + Vite 项目模板

## 项目概述

这是一个基于 Vue 3 和 Vite 的现代化前端项目模板，旨在帮助开发者快速启动 Vue 3 项目。

## 技术栈

- **Vue 3**：使用 `<script setup>` 语法和 Composition API。
- **Vite**：快速的开发服务器和构建工具。
- **Tailwind CSS**：实用的 CSS 框架。
- **ESLint & Prettier**：代码规范和格式化工具。
- **Mock 数据**：支持本地开发时的 API 模拟。

## 项目结构

```
my-vite/
├── src/                  # 源代码目录
│   ├── api/             # API 请求封装
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── views/           # 页面组件
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   ├── styles/          # 全局样式
│   └── utils/           # 工具函数
├── public/              # 公共资源
├── mock/                # Mock 数据
├── vite.config.js       # Vite 配置
├── tailwind.config.js   # Tailwind 配置
└── package.json         # 项目依赖
```

## 开发环境配置

推荐使用以下工具：

- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（Vue 3 支持）
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## 运行与构建

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **构建生产版本**
   ```bash
   npm run build
   ```

## 其他配置

- **环境变量**：通过 `.env.development` 和 `.env.production` 配置。
- **Mock 数据**：在 `mock/` 目录下配置本地 API 模拟。

## 许可证

MIT