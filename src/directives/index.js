// eslint-disable-next-line no-unused-vars
// import { App, Directive } from "vue";
// import auth from "./modules/auth";
import copy from "./modules/copy";
import waterMarker from "./modules/waterMarker";
import draggable from "./modules/draggable";
import debounce from "./modules/debounce";
import throttle from "./modules/throttle";
import dragDialog from "./dialogDrag";

const directivesList = {
  // auth,
  copy,
  waterMarker,
  draggable,
  dragDialog,
  debounce,
  throttle,
};

const directives = {
  install: function (app) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key]);
    });
  },
};

export default directives;
