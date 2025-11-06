<template>
    <div class="animate-clock">
        <!-- <p>{{days}}{{hours}}{{minites}}{{seconds}}</p> -->
        <span>距离结束还剩</span>
        <animate-card :val="days" :size="16" :self-disabled="btnDisabled" />
        <span>天</span>
        <animate-card :val="hours" :size="16" :self-disabled="btnDisabled" />
        <span>时</span>
        <animate-card :val="minites" :size="16" :self-disabled="btnDisabled" />
        <span>分</span>
        <animate-card :val="seconds" :size="16" :self-disabled="btnDisabled" />
        <span>秒</span>
    </div>
</template>
<script setup>
import AnimateCard from "../AnimateCard/index.vue";
// eslint-disable-next-line no-unused-vars
import { ref, watch, computed, onMounted } from "vue";
let days = ref(["0", "0"]);
let hours = ref(["0", "0"]);
let minites = ref(["0", "0"]);
let seconds = ref(["0", "0"]);
let setIntVal = ref(null); 
let btnDisabled = ref(false);
const props = defineProps({
  terminalTime: {
    type: String,
    default: ""
  }
});
/**
     * 转化数字为数组，并在 头部填充 0
     * @params num: numnber
     * @result string[]
     */
const toStringAndUnshiftZero = (num) => {
  const val = num.toString().split("");
  if (num < 10) {
    val.unshift("0");
  }
  return val;
};
const updateClock = () => {
  let now = new Date().getTime();
  let stopTime = 0;
  // 错误入参 处理逻辑
  try {
    stopTime = new Date(props.terminalTime).getTime();
  } catch (err) {
    console.error(err);
    return false;
  }
  // 终止逻辑
  const remainingTime = stopTime - now;
  if (remainingTime < 1000) {
    clearInterval(setIntVal);
    setIntVal.value = null;
    // 计时器 清零
    days.value = hours.value = minites.value = seconds.value = ["0", "0"];
    btnDisabled.value = true;
    console.log("时间到！");
    return false;
  }
  // 计算 日、时、分、秒
  let newdays = parseInt(remainingTime / (24 * 60 * 60 * 1000));
  let newhours = parseInt(
    (remainingTime - 24 * 60 * 60 * 1000 * newdays) / (60 * 60 * 1000)
  );
  let newminites = parseInt(
    (remainingTime - 24 * 60 * 60 * 1000 * newdays - 60 * 60 * 1000 * newhours) /
            (60 * 1000)
  );
  let newseconds = parseInt(
    (remainingTime -
            24 * 60 * 60 * 1000 * newdays -
            60 * 60 * 1000 * newhours -
            60 * 1000 * newminites) /
            1000
  );
  // 更新 data
  days.value = toStringAndUnshiftZero(newdays);
  hours.value = toStringAndUnshiftZero(newhours);
  minites.value = toStringAndUnshiftZero(newminites);
  seconds.value = toStringAndUnshiftZero(newseconds);
};
onMounted(() => {
  // 初始化
  updateClock();
  // 开启定时器
  setIntVal.value = setInterval(updateClock, 1000);
});
</script>
<style lang="scss" scoped>
.animate-clock {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  padding: 40px 0 ;
}
</style>
