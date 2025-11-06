import lodash from "lodash";
export class MyPermission {
  /**
   * 权限，类
   * @param {number} currentPageAuth 例如:0b0000111 该地之下的用户的权限值
   * @param {string:array} currentPagePath 例如:'setting.userPermission' 用于当前页面的权限表的地址
   */
  constructor (currentPageAuth = 0b0, currentPagePath = "") {
    // 权限表: type:Object
    this.permissionDictionary = MyPermission.permissionDictionary();
    // 用户的权限（当前页）:number
    this.currentPageAuth = currentPageAuth;

    // 当前页的权限路径例如：
    this.currentPagePath = currentPagePath;
  }

  // 以'.'的方式找到对象内部的值，如无必要，应使用lodash.get方法
  static ObjFindBySpot (key, obj) {
    try {
      // 用户输入类似‘admin.pageVisible’，以点分割
      const arr = key.split(".");
      // 传入字典，将会在此字典内处寻找值
      let val = obj;
      // 递归查找
      const findRecursion = (arr, index) => {
        if (index < arr.length) {
          val = val[arr[index]];
          findRecursion(arr, (index += 1));
        }
      };
      findRecursion(arr, 0);
      return val;
    } catch (error) {
      return undefined;
    }
  }

  //
  /**
   * 判断权限
   * @param {array} fullKeyArray 后带上.value
   * @returns {Boolean} 判断是否有当前权限
   */
  judgmentAuth (fullKeyArray) {
    return lodash.get(this.permissionDictionary, fullKeyArray) === (this.currentPageAuth & lodash.get(this.permissionDictionary, fullKeyArray));
  }

  // 组合权限
  combination (keyAddress) {
    keyAddress.push("value");
    this.currentPageAuth = this.currentPageAuth | lodash.get(this.permissionDictionary, keyAddress);
    this.sayMyAuth();
    return this.currentPageAuth;
  }

  /**
   * 删除权限
   * @param {array} keyAddress 不需要带.value
   * @returns {number} 返回删除后的值
   */
  del (keyAddress) {
    // keyAddress = `${this.currentPagePath}.${keyAddress}.value`
    keyAddress.push("value");
    // 异或会导致重复操作
    if (this.judgmentAuth(keyAddress)) {
      this.currentPageAuth = this.currentPageAuth ^ lodash.get(this.permissionDictionary, keyAddress);
    }
    this.sayMyAuth();
    return this.currentPageAuth;
  }

  // 返回currentPageAuth:number
  sayMyAuth () {
    console.log(this.currentPageAuth.toString(2));
    return this.currentPageAuth;
  }

  //
  /**
   * 当前页的权限信息，每个页面可以调用该方法获取所有的权限信息
   * @returns {object} 新增了isShow字段，用户可以使用该字段进行判断是否展示
   */
  showMeCurrentPageDetail () {
    const detail = lodash.cloneDeep(lodash.get(this.permissionDictionary, this.currentPagePath));
    Object.keys(detail).forEach((key) => {
      Reflect.deleteProperty(detail[key], "value");
      // 添加isShow字段，业务组件调用此方法可以使用isShow来控制组件是否有该部分权限。
      detail[key].isShow = this.judgmentAuth(`${this.currentPagePath}.${key}.value`);
    });

    return detail;
  }

  /**
   * 用户初始化字典
   * @returns {object} 用于初始化用户权限字典
   */
  userPermissionTemplate () {
    const dic = JSON.parse(JSON.stringify(this.permissionDictionary));
    // 创建初始化字典
    Object.keys(dic).forEach((key1) => {
      Object.keys(dic[key1]).forEach((key2) => {
        dic[key1][key2] = 0b0;
      });
    });
    return dic;
  }

  help () {
    console.log(
      `
      /* 调用示例
      * const my = new MyPermission(0b0000111, 'setting.userPermission')
      * my.judgmentAuth('_create')
      * my.combination('_create')
      * my.del('_create')
      * my.sayMyAuth()
      * my.showMeCurrentPageDetail()
      * MyPermission.ObjFindBySpot('admin._create)
     */
      `

    );
  }

  /**
   * 权限表
   * 层级数应为“三级”,用户的权限表第二级后为数字
   * 最后一级的应为 _visible:{ value:0b000001,label:'-可见意否' }
   * @returns object
   *
   */
  static permissionDictionary () {
    return {
      // 保密控制台
      secruty: {
        // 侧边标签组权限
        group: {
          // 侧边标签组整体是否可见
          _visible: { value: 0b001, label: "保密控制台组-可见" }
        },
        securityConsole: {
          // 页面是否可见
          _visible: { value: 0b00000001, label: "控制台-可见" },
          // 是否可以增删改查
          _create: { value: 0b00000010, label: "控制台-创建" },
          _delete: { value: 0b00000100, label: "控制台-删除" },
          _update: { value: 0b00001000, label: "控制台-更新" },
          _search: { value: 0b00010000, label: "控制台-查找" }
        },
      },
    
      // 倒计时
      countDown: {
        group: {
          _visible: { value: 0b001, label: "倒计时组-可见" }
        },
        countDownConsole: {
          _visible: { value: 0b00000001, label: "控制台-可见" }
        }
      }
      
    };
  }
}