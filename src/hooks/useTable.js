/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 * 
 * 
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *            佛祖保佑     永不宕机     永无BUG
 * 
 *        佛曰:  
 *                写字楼里写字间，写字间里程序员；  
 *                程序人员写程序，又拿程序换酒钱。  
 *                酒醒只在网上坐，酒醉还来网下眠；  
 *                酒醉酒醒日复日，网上网下年复年。  
 *                但愿老死电脑间，不愿鞠躬老板前；  
 *                奔驰宝马贵者趣，公交自行程序员。  
 *                别人笑我忒疯癫，我笑自己命太贱；  
 *                不见满街漂亮妹，哪个归得程序员？
 */
/**
 * @description table 页面表格操作方法封装
 * @param {Function} api 获取表格数据 api 方法(必传)
 * @param {Object} initParam 获取数据初始化参数(非必传，默认为{})
 * @param {Boolean} isPageable 是否有分页(非必传，默认为true)
 * @param {Boolean} manual 是否手动触发(非必传，默认为false)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法(非必传)
 * */
import { reactive, onMounted, computed, toRefs } from "vue";
import { useRequest } from "vue-hooks-plus";

export const useTable = (api, initParams = {}, isPageable = true, manual = false, dataCallBack) => {
  /**
     * 1.获取表格数据的方法getTableData
     * 2.查询条件变量searchParam
     * 3.分页查询条件变量pagination
     * 4.分页pageSize变更的方法handleSizeChange()
     * 5.分页currentPage变更的方法handleCurrentChange()
     * 6.查询方法search()
     * 7.初始化参数的变量searchInitParam
     */
  const state = reactive({
    tableData: [],
    pagination: {
      pageSize: 10,
      currentPage: 1,
      total: 0
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {},
    // 是否加载中
    loading: false,
    // 接口返回的所有内容
    responseData: null
  });
  const pageParmas = computed({
    get:() => {
      return {
        current: state.pagination.currentPage,
        pageSize: state.pagination.pageSize
      };
    }
  });

  const getDatas = useRequest(api, {
    manual: true
  });

  const updatePagination = (obj) => {
    Object.assign(state.pagination, obj);
  };

  const getTableData = async () => {
    try {
      Object.assign(state.totalParam, initParams, isPageable ? pageParmas.value : {});
      state.loading = true;
      let res = await getDatas.runAsync(state.totalParam);
      state.responseData = res;
      const { current, pageSize, total, list } = res; // 接口返回内容的数据格式
      //回调处理，此处可以满足对特殊数据的处理
      dataCallBack && ( res = dataCallBack(list) );
      // 设置分页信息
      state.tableData = isPageable ? list : res;
      isPageable && updatePagination({current, pageSize, total});
    } catch (error) {
      throw new Error(error);
    } finally {
      state.loading = false;
    }
  };

  const updateTotalParmas = () => {
    state.totalParam = {};
    // 处理查询参数，可以给查询参数加自定义前缀操作
    let nowSearchParam = {};
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (let key in state.searchParam) {
      // * 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    console.log(Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParmas.value : {}));
    Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParmas.value : {});
  };

  const search = () => {
    state.pagination.current = 1;
    updateTotalParmas();
    getTableData();
  };

  const reset = () => {
    state.searchParam = {};
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    Object.keys(state.searchInitParam).forEach(key => {
      state.searchParam[key] = state.searchInitParam[key];
    });
    search();
  };

  const handleSizeChange = (val) => {
    state.pagination.current = 1;
    state.pagination.pageSize = val;
    getTableData();
  };

  const handleCurrentChange = (val) => {
    state.pagination.current = val;
    getTableData();
  };
  
  onMounted(() => {
    // console.log(222, !manual);
    manual && reset();
  });

  return {
    ...toRefs(state),
    getTableData,
    handleCurrentChange,
    handleSizeChange,
    search,
    reset
  };
};