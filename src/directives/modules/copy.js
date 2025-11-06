/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */
import { ElMessage } from "element-plus";
let copyData;
async function handleClick() {
  try {
    await navigator.clipboard.writeText(copyData);
  } catch (err) {
    console.error("复制操作不被支持或失败: ", err);
  }
  ElMessage({
    type: "success",
    message: "复制成功",
  });
}
const copy = {
  mounted(el, binding) {
    copyData = binding.value;
    el.addEventListener("click", handleClick);
  },
  updated(el, binding) {
    copyData = binding.value;
  },
  beforeUnmount(el) {
    el.removeEventListener("click", el.__handleClick__);
  },
};

export default copy;
