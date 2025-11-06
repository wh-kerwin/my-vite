<template>
  <div class="form-wraper">
    <el-card class="mb-5">
      <template #header> 二次封装表单组件 </template>
      <easy-form :options="formOptions" :filed-list="filedLists" :form-data="formDatas" @submit="submitFn"></easy-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import EasyForm from "@/components/EasyForm/index.vue";
import formFiledList from "./formFiled.js";

const formOptions = reactive({
  inline: false,
  labelWidth: "80px",
  labelPosition: "right",
});

const filedLists = ref(formFiledList);
const formDatas = ref({
  name: "",
  desc: "",
  sex: "",
  marks: ""
});

const submitFn = async (formData) => {
  try {
    // 添加表单验证
    await formDatas.value.validate();
    console.log("formData", formData);
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};
</script>

<style lang="scss" scoped>

</style>
