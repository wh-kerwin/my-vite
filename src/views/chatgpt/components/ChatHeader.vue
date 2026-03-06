<template>
  <div class="chat-header">
    <div class="header-left">
      <h2 class="title">
        <el-icon class="title-icon"><ChatDotRound /></el-icon>
        智谱AI助手
      </h2>
      <div class="model-selector">
        <el-select :model-value="modelValue" size="small" style="width: 140px" @update:model-value="handleModelChange">
          <el-option label="GLM-4-Flash" value="glm-4-flash" />
          <el-option label="GLM-4-Plus" value="glm-4-plus" />
          <el-option label="GLM-4" value="glm-4" />
        </el-select>
      </div>
    </div>
    <div class="header-actions">
      <el-button size="small" @click="$emit('show-api-key-dialog')">
        <el-icon><Setting /></el-icon>
        API设置
      </el-button>
      <el-button size="small" type="danger" plain @click="$emit('clear-messages')">
        <el-icon><Delete /></el-icon>
        清空对话
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ChatDotRound, Setting, Delete } from "@element-plus/icons-vue";

defineProps({
  modelValue: {
    type: String,
    default: "glm-4-flash"
  }
});

const emit = defineEmits(["update:modelValue", "show-api-key-dialog", "clear-messages"]);

const handleModelChange = (value) => {
  emit("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid hsl(var(--border));
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: hsl(var(--card));
  backdrop-filter: blur(10px);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: hsl(var(--foreground));
      display: flex;
      align-items: center;
      gap: 8px;

      .title-icon {
        color: hsl(var(--primary));
      }
    }

    .model-selector {
      :deep(.el-input__wrapper) {
        background: hsl(var(--secondary));
        box-shadow: none;
        border: 1px solid hsl(var(--border));

        &:hover, &.is-focus {
          border-color: hsl(var(--primary));
        }
      }

      :deep(.el-input__inner) {
        color: hsl(var(--foreground));
      }

      :deep(.el-select__caret) {
        color: hsl(var(--muted-foreground));
      }
    }
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
}
</style>
