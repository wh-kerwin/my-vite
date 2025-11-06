import {
  shallowRef,
  unref,
  onMounted,
  onDeactivated,
  onBeforeUnmount,
} from "vue";
  
import echarts from "@/components/BaseEcharts/config";
  
// export type EChartsCoreOption = echarts.EChartsCoreOption;
  
const useEcharts = (elRef, options) => {
  const charts = shallowRef();
  
  const setOptions = (options) => {
    charts.value && charts.value.setOption(options);
  };
  
  // 初始化
  const initCharts = (themeColor) => {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }
    charts.value = echarts.init(el);
    if (themeColor) {
      options.color = themeColor;
    }
    setOptions(options);
  };
  
  // 重新窗口变化时，重新计算
  const resize = () => {
    charts.value && charts.value.resize();
  };
  
  onMounted(() => {
    window.addEventListener("resize", resize);
  });
  
  // 页面keepAlive时，不监听页面
  onDeactivated(() => {
    window.removeEventListener("resize", resize);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener("resize", resize);
  });

  
  document.addEventListener("visibilitychange", function() { // 解决浏览器切换页面时图标不加载
    if (!document.hidden) {
      charts.value?.resize();
    }
  });

  return {
    initCharts,
    setOptions,
    resize,
  };
};
  
export { useEcharts };
  