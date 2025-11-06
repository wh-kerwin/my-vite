<template>
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="kerwin/admin">
          <template #prefix>
            <el-icon class="el-input__icon">
              <user />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="123456" show-password autocomplete="new-password">
          <template #prefix>
            <el-icon class="el-input__icon">
              <lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="login-btn">
      <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
      <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="loginFn(loginFormRef)">
        登录
      </el-button>
    </div>
  </template>
  
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { setToken } from "@/utils/auth";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import { ElForm, ElMessage } from "element-plus";
import { login } from "@/api/login";
  
const router = useRouter();
const loginFormRef = ref(ElForm);
  
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});
  
const loading = ref(false);
const loginForm = reactive({
  username: "",
  password: ""
});
  
// resetForm
const resetForm = (formEl) => {
  if (!formEl) {return;}
  formEl.resetFields();
};
// login
const loginFn = (formEl) => {
  if (!formEl) {return;}
  formEl.validate(async valid => {
    if (!valid) {return;}
    loading.value = true;
    login({ ...loginForm }).then(res => {
      loading.value = false;
      if (res.status === 0) {
        setToken(res.token);
        router.push({ path: "/dashboard" });
      } else {
        ElMessage.error(res.message);
        resetForm(loginFormRef.value);
      }
    }).catch(() => {
      loading.value = false;
    });
  });
};
  
onMounted(() => {
  // console.log(1111);
});
</script>
  
<style scoped lang="scss">
// @import "../index.scss";
.el-form-item {
  margin-bottom: 40px;
}
.login-btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
  white-space: nowrap;
  .el-button {
    width: 185px;
  }
}
</style>
  