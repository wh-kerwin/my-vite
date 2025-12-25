<template>
  <el-dialog
    v-model="dialogVisible"
    title="智谱AI API 配置"
    width="500px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="API Key">
        <el-input
          v-model="form.apiKey"
          type="password"
          placeholder="请输入智谱AI的API Key"
          show-password
        />
      </el-form-item>
      <el-alert
        title="获取API Key"
        type="info"
        :closable="false"
        style="margin-bottom: 16px"
      >
        <template #default>
          访问 <a href="https://open.bigmodel.cn" target="_blank">智谱AI开放平台</a> 获取您的API Key
        </template>
      </el-alert>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  apiKey: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:visible", "save"]);

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val)
});

const form = ref({
  apiKey: ""
});

watch(() => props.visible, (val) => {
  if (val) {
    form.value.apiKey = props.apiKey;
  }
});

const handleSave = () => {
  if (!form.value.apiKey || !form.value.apiKey.trim()) {
    ElMessage.warning("请输入 API Key");
    return;
  }
  emit("save", form.value.apiKey.trim());
  dialogVisible.value = false;
};

const handleClosed = () => {
  form.value.apiKey = "";
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border: 1px solid rgba(255, 255, 255, 0.1);

  .el-dialog__body {
    .el-alert__title {
      color: #94a3b8;
    }

    .el-alert a {
      color: #3b82f6;
    }
  }
}
</style>
