<!--
 * ......................................&&.........................
 * ....................................&&&..........................
 * .................................&&&&............................
 * ...............................&&&&..............................
 * .............................&&&&&&..............................
 * ...........................&&&&&&....&&&..&&&&&&&&&&&&&&&........
 * ..................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&..............
 * ................&...&&&&&&&&&&&&&&&&&&&&&&&&&&&&.................
 * .......................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&.........
 * ...................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...............
 * ..................&&&   &&&&&&&&&&&&&&&&&&&&&&&&&&&&&............
 * ...............&&&&&@  &&&&&&&&&&..&&&&&&&&&&&&&&&&&&&...........
 * ..............&&&&&&&&&&&&&&&.&&....&&&&&&&&&&&&&..&&&&&.........
 * ..........&&&&&&&&&&&&&&&&&&...&.....&&&&&&&&&&&&&...&&&&........
 * ........&&&&&&&&&&&&&&&&&&&.........&&&&&&&&&&&&&&&....&&&.......
 * .......&&&&&&&&.....................&&&&&&&&&&&&&&&&.....&&......
 * ........&&&&&.....................&&&&&&&&&&&&&&&&&&.............
 * ..........&...................&&&&&&&&&&&&&&&&&&&&&&&............
 * ................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&............
 * ..................&&&&&&&&&&&&&&&&&&&&&&&&&&&&..&&&&&............
 * ..............&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&....&&&&&............
 * ...........&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&......&&&&............
 * .........&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&.........&&&&............
 * .......&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...........&&&&............
 * ......&&&&&&&&&&&&&&&&&&&...&&&&&&...............&&&.............
 * .....&&&&&&&&&&&&&&&&............................&&..............
 * ....&&&&&&&&&&&&&&&.................&&...........................
 * ...&&&&&&&&&&&&&&&.....................&&&&......................
 * ...&&&&&&&&&&.&&&........................&&&&&...................
 * ..&&&&&&&&&&&..&&..........................&&&&&&&...............
 * ..&&&&&&&&&&&&...&............&&&.....&&&&...&&&&&&&.............
 * ..&&&&&&&&&&&&&.................&&&.....&&&&&&&&&&&&&&...........
 * ..&&&&&&&&&&&&&&&&..............&&&&&&&&&&&&&&&&&&&&&&&&.........
 * ..&&.&&&&&&&&&&&&&&&&&.........&&&&&&&&&&&&&&&&&&&&&&&&&&&.......
 * ...&&..&&&&&&&&&&&&.........&&&&&&&&&&&&&&&&...&&&&&&&&&&&&......
 * ....&..&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...........&&&&&&&&.....
 * .......&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&..............&&&&&&&....
 * .......&&&&&.&&&&&&&&&&&&&&&&&&..&&&&&&&&...&..........&&&&&&....
 * ........&&&.....&&&&&&&&&&&&&.....&&&&&&&&&&...........&..&&&&...
 * .......&&&........&&&.&&&&&&&&&.....&&&&&.................&&&&...
 * .......&&&...............&&&&&&&.......&&&&&&&&............&&&...
 * ........&&...................&&&&&&.........................&&&..
 * .........&.....................&&&&........................&&....
 * ...............................&&&.......................&&......
 * ................................&&......................&&.......
 * .................................&&..............................
 * ..................................&..............................
 -->

<!--
 * @Description: 富文本编辑器
-->
<template>
    <div :class="['wang-editor', selfDisabled ? 'editor-disabled' : '']">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :default-config="toolbarConfig"
            :mode="mode"
        />
        <Editor
            v-model="valueHtml"
            style="height: 300px; overflow-y: hidden;"
            :default-config="editorConfig"
            :mode="mode"
            @on-created="handleCreated"
        />
    </div>
</template>

<script setup name="WangEditor">
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { onBeforeUnmount, shallowRef, onMounted, computed } from "vue";

const props = defineProps({
  // 是否禁用
  selfDisabled: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "default",
  },
  valuehtml: {
    type: String,
    default: "",
  }
});

const toolbarConfig = {
  excludeKeys: []
};

const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {}
};

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const handleCreated = (editor) => {
  editorRef.value = editor; // editor 实例，重要！
};

// 内容 HTML
// const valueHtml = ref("<p>hello</p>");

const emit = defineEmits(["update:valueHtml"]);

const valueHtml = computed({
  get() {
    return props.valuehtml;
  },
  set(val) {
    // 防止富文本内容为空时，校验失败
    if (editorRef.value.isEmpty()) {val = "";}
    emit("update:valueHtml", val);
  },
});

// 模拟 ajax 异步获取内容
onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
//   }, 1500);
});

// 图片上传前判断
const uploadImgValidate = (file) => {
  console.log(file);
  return true;
};
/**
 * @description 图片自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 * */
editorConfig.MENU_CONF["uploadImage"] = {
  // eslint-disable-next-line no-unused-vars
  async customUpload(file, insertFn) {
    if (!uploadImgValidate(file)) {return;}
    let formData = new FormData();
    formData.append("file", file);
    try {
      // const { data } = await uploadImg(formData);
      // insertFn(data.fileUrl);
    } catch (error) {
      console.log(error);
    }
  },
  
//   // form-data fieldName ，默认值 'wangeditor-uploaded-image'
//   fieldName: "your-custom-name",
//   // 单个文件的最大体积限制，默认为 2M
//   maxFileSize: 1 * 1024 * 1024, // 1M
//   // 最多可上传几个文件，默认为 100
//   maxNumberOfFiles: 10,
//   // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
//   allowedFileTypes: ["image/*"],
//   // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
//   meta: {
//     token: "xxx",
//     otherKey: "yyy"
//   },
//   // 将 meta 拼接到 url 参数中，默认 false
//   metaWithUrl: false,
//   // 自定义增加 http  header
//   headers: {
//     Accept: "text/x-json",
//     otherKey: "xxx"
//   },
//   // 跨域是否传递 cookie ，默认为 false
//   withCredentials: true,
//   // 超时时间，默认为 10 秒
//   timeout: 5 * 1000, // 5 秒
//   // 上传之前触发
//   // onBeforeUpload(file: File) { // TS 语法
//   onBeforeUpload(file) {    // JS 语法
//     // file 选中的文件，格式如 { key: file }
//     return file;
//     // 可以 return
//     // 1. return file 或者 new 一个 file ，接下来将上传
//     // 2. return false ，不上传这个 file
//   },
//   // 上传进度的回调函数
//   // onProgress(progress: number) {  // TS 语法
//   onProgress(progress) {       // JS 语法
//     // progress 是 0-100 的数字
//     console.log("progress", progress);
//   },
//   // 单个文件上传成功之后
//   // onSuccess(file: File, res: any) {  // TS 语法
//   onSuccess(file, res) {          // JS 语法
//     console.log(`${file.name} 上传成功`, res);
//   },
//   // 单个文件上传失败
//   // onFailed(file: File, res: any) {   // TS 语法
//   onFailed(file, res) {           // JS 语法
//     console.log(`${file.name} 上传失败`, res);
//   },
//   // 上传错误，或者触发 timeout 超时
//   // onError(file: File, err: any, res: any) {  // TS 语法
//   onError(file, err, res) {               // JS 语法
//     console.log(`${file.name} 上传出错`, err, res);
//   },
};

// 视频上传前判断
const uploadVideoValidate = (file) => {
  console.log(file);
  return true;
};
/**
 * @description 视频自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 * */
editorConfig.MENU_CONF["uploadVideo"] = {
  // eslint-disable-next-line no-unused-vars
  async customUpload(file, insertFn) {
    if (!uploadVideoValidate(file)) {return;}
    let formData = new FormData();
    formData.append("file", file);
    try {
      // const { data } = await uploadVideo(formData);
      // insertFn(data.fileUrl);
    } catch (error) {
      console.log(error);
    }
  }
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor === null) {return;}
  editor.destroy();
});

defineExpose({
  editor: editorRef
});
</script>

<style lang="scss" scoped>
/* 富文本组件校验失败样式 */
.is-error {
  .editor-box {
    border-color: var(--el-color-danger);
    .editor-toolbar {
      border-bottom-color: var(--el-color-danger);
    }
  }
}

/* 富文本组件禁用样式 */
.editor-disabled {
  cursor: not-allowed !important;
}

/* 富文本组件样式 */
.wang-editor {
  /* 防止富文本编辑器全屏时 tabs组件 在其层级之上 */
  z-index: 2;
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  .editor-toolbar {
    border-bottom: 1px solid var(--el-border-color);
  }
  .editor-content {
    overflow-y: hidden;
  }
}
</style>