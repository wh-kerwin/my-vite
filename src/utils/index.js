class CommonUtils {
  // 判断是否为空
  isEmpty(value) {
    return value === null || value === undefined || value === "";
  }

  // 判断是否不为空
  isNotEmpty(value) {
    return !this.isEmpty(value);
  }

  // 判断是否为空对象
  isEmptyObject(value) {
    return (
      value === null || value === undefined || Object.keys(value).length === 0
    );
  }

  // 判断是否不为空对象
  isNotEmptyObject(value) {
    return !this.isEmptyObject(value);
  }

  // 判断是否为空数组
  isEmptyArray(value) {
    return value === null || value === undefined || value.length === 0;
  }

  // 判断是否不为空数组
  isNotEmptyArray(value) {
    return !this.isEmptyArray(value);
  }

  // 生成随机数
  generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 生成随机字符串
  generateRandomString(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // 防抖
  debounce(func, delay) {
    let timer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  // 节流
  throttle(func, delay) {
    let timer;
    return function () {
      const context = this;
      const args = arguments;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          func.apply(context, args);
        }, delay);
      }
    };
  }
}

export default CommonUtils;


/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList) {
  let newMenuList = JSON.parse(JSON.stringify(menuList));
  return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])]);
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList) {
  let newMenuList = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children));
    return !item.meta?.isHide;
  });
}
/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList, parent = [], result) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];
    if (item.children) {getAllBreadcrumbList(item.children, result[item.path], result);}
  }
  return result;
};