import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// eslint-disable-next-line no-unused-vars
import { viteMockServe } from "vite-plugin-mock";

import { createSvgIconsPlugin  } from "vite-plugin-svg-icons";
import AutoImport from "unplugin-auto-import/vite"; // 自动导入
import Components from "unplugin-vue-components/vite"; // 自动导入组件
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; // 按需引入element组件
import eslint from "vite-plugin-eslint";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";

// https://vitejs.dev/config/
// vite中无法使用 require引入文件（CommonJS模块化规范），vite只支持ESModules模块化规范
export default defineConfig((commond) => {
  // eslint-disable-next-line no-undef, no-unused-vars
  const env = loadEnv(commond.mode, __dirname);
  // eslint-disable-next-line no-unused-vars
  const isProd = commond.mode === "production";
  // eslint-disable-next-line no-unused-vars
  const command = commond.command;
  return {
    //静态资源服务的文件夹
    publicDir: "public",
    base: "./", // 部署应用时的基本 URL
    server: {
      // 启用 gzip 压缩
      compress: true,
      port: 8887,
      // open: true,
      // host: '0.0.0.0', // 设置为 '0.0.0.0' 以允许外部访问
    },
    devServer: {
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    optimizeDeps: {
      include: ["vue","axios"],
      // force: true, // 强制进行依赖预构建
      splitChunks: {
        entries: ["app"], // 入口模块名称
        include: ["vue", "lodash"], // 要包含的库
      },
      esbuildOptions: {
        minify: true,
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      modules: {},
      minify: true, // 是否开启 CSS 压缩
      postcss: { // postCss 配置
        plugins: [autoprefixer(),tailwind()],
      },
      preprocessorOptions: { // 全局样式配置
        scss: {
          use: ["vue-style-import"],
          // additionalData: `@import "@/styles/index.scss";`,
        },
      },
    },
    build: {
      target: "modules", //浏览器兼容性  "esnext"|"modules"
      outDir: "dist", // 指定输出路径
      assetsDir: "assets", // 指定生成静态资源的存放路径   
      manifest: false, // 当设置为 true，构建后将会生成 manifest.json 文件
      minify: "terser", // boolean | 'terser' | 'esbuild' //terser 构建后文件体积更小
      brotliSize: true, //启用/禁用 brotli 压缩大小报告
      cssCodeSplit: true, //启用/禁用 CSS 代码拆分
      sourcemap: false, //构建后是否生成 source map 文件
      emptyOutDir: true, // 在构建之前清空输出目录  
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split("/")
              : [];
            const fileName =
              // eslint-disable-next-line no-magic-numbers
              facadeModuleId[facadeModuleId.length - 2] || "[name]";
            return `assets/chunk/js/${fileName}/[name].[hash].js`;
          },
          manualChunks: {
            "vue-vendor": ["vue", "vue-router", "pinia"],
            "element-plus": ["element-plus"],
            "utils": ["axios", "lodash-es"]
          }
        },
      },
      // 启用资源分割
      assetsInlineLimit: 4096, //小于4kb的文件会被转为base64
      chunkSizeLimit: 5000, // 设置 chunk 大小的限制为 5000 KiB
      chunkSizeWarningLimit: 2000, // 设置 chunk 大小警告的限制为 2000 KiB
    },
    plugins: [
      vue(),
      /*  tailwindcss({
        config: "tailwind.config.js", // Tailwind CSS 配置文件路径
      }), */
      createSvgIconsPlugin ({
        iconDirs: [path.resolve(__dirname, "src/assets/svg")],
        symbolId: "icon-[dir]-[name]",
      }),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      eslint({
        include: ["src/**/*.js", "src/**/*.vue", "src/*.js", "src/*.vue"],
        cache: false,
      }),
      env.VITE_MOCK_DEV_SERVER === "true" ?  viteMockServe({
        mockPath: "./mock/", // 设置模拟数据的存储文件夹
        // logger: true, //  是否在控制台显示请求日志
        localEnabled: command === "serve",
        prodEnabled: command !== "serve", // 设置打包是否启用 mock 功能
        injectCode: `
          import { setUpProdMockServer } from './mockProdServer';
          setupProdMockServer();
          `, // 生产环境开启了 mock 功能,即prodEnabled=true.则该代码会被注入到injectFile对应的文件的底部
        injectFile: path.resolve("./src/main.js")
      }) : null
    ],
  };
});
