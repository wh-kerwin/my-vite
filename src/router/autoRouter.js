// 自动生成路由
// const globaPath = import.meta.glob("../views/**/page.js", {
//   eager: true, // 预加载
//   import: "default", // 返回值
// });
// const globaPages = import.meta.glob("../views/**/index.vue");
// const routesArr = Object.entries(globaPath).map(([path, config]) => {
//   let pageJsPath = path.replace("page.js", "index.vue");
//   const pathUrl = path.replace("../views", "").replace("/page.js", "") || "/";
//   const pathArr = pathUrl.split("/").filter(Boolean).join("-") || "index";
//   return {
//     path: pathUrl,
//     name: pathArr + "-index",
//     component: globaPages[pageJsPath],
//     meta: config,
//   };
// });
// console.log(routesArr);

// 自动生成路由带子路由
const EMPTY_STRING = "";
const PAGE_TS = "page.js";
const INDEX_VUE = "index.vue";
const INDEX = "index";

const getFileDeepth = (path) => (path.match(/\//g) || []).length;
const pageComponents = import.meta.glob("../views/**/index.vue");
const pages = import.meta.glob("../views/**/page.js", {
  eager: true,
  import: "default",
});
const pageEntries = Object.entries(pages);
// 根据文件目录的层级找到子页面和子路由页面
const subPages = pageEntries.filter(
  ([pagePath]) => getFileDeepth(pagePath) < 4
); // 子页面
const pageChildren = pageEntries.filter(
  ([pagePath]) => getFileDeepth(pagePath) > 3
); // 子路由
const getComponentPath = (pagePath) => pagePath.replace(PAGE_TS, INDEX_VUE);

const getChildren = (name) => {
  return pageChildren.map(([pagePath, meta]) => {
    if (pagePath.includes(`${name}\/`)) {
      const path = pagePath
        .replace(`../views/${name}`, EMPTY_STRING)
        .replace("/page.js", EMPTY_STRING);
      const childName = path.substring(1);
      const componentPath = getComponentPath(pagePath);

      return {
        path,
        name: childName,
        component: pageComponents[componentPath],
        meta,
      };
    }
  });
};

const routesArr = subPages.map(([pagePath, meta]) => {
  const path =
    pagePath
      .replace("../views", EMPTY_STRING)
      .replace("/page.js", EMPTY_STRING) || "/";
  const name = path.substring(1) || INDEX;
  const componentPath = getComponentPath(pagePath);
  const children = getChildren(name);
  if (componentPath === "../views/home/index.vue") {
    return {
      path,
      name,
      component: () => import("../layout/index.vue"),
      meta,
      children,
    };
  }
  const otherProps = {
    path,
    name,
    component: pageComponents[componentPath],
    meta,
  };

  return Array.isArray(children) &&
    children.length === 1 &&
    children[0] === undefined
    ? { ...otherProps }
    : { ...otherProps, children };
});

export default routesArr;
