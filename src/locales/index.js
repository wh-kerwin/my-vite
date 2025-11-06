// index.js
import { createI18n } from "vue-i18n";
// import zh from "./zh.js";
// import en from "./en.js";

const getMessage = modules => {

  return Object.entries(modules).reduce((module, [path, mod]) => {
    const moduleName = path.match(/\/([^/]+)\.js$/)[1];
    module[moduleName] = mod;
    return module;
  }, {});
};

const i18n = createI18n({
  locale: localStorage.getItem("lang") || "zh",
  messages: {
    zh: getMessage(import.meta.glob("./zh-cn/**/*.js", {
      eager: true,
      import: "default",
    })),
    en: getMessage(import.meta.glob("./en/**/*.js", {
      eager: true,
      import: "default",
    })),
  },
  legacy: false,
  globalInjection: true,
});
// const i18n = createI18n({
//   locale: localStorage.getItem("lang") || "zh",
//   messages: {
//     zh,
//     en,
//   },
//   legacy: false,
//   globalInjection: true,
// });
// console.log(i18n);
export default i18n;