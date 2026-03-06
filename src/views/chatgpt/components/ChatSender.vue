<template>
  <div class="sender-area">
    <div class="sender-wrapper">
      <Sender
        ref="senderRef"
        v-model="messageInput"
        placeholder="输入消息，Shift+Enter 换行..."
        :submit-btn-disabled="isGenerating || !hasApiKey"
        :input-style="{ color: 'hsl(var(--foreground))' }"
        @submit="$emit('submit')"
      >
        <template #action-list>
          <el-tooltip v-if="isGenerating" content="停止生成" placement="top">
            <el-button link size="large" @click="$emit('stop')">
              <el-icon><VideoPause /></el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </Sender>
      <div v-if="!hasApiKey" class="api-warning">
        <el-icon><WarningFilled /></el-icon>
        请先配置 API Key
      </div>
    </div>
  </div>
</template>

<script setup>
import { Sender } from "vue-element-plus-x";
import { VideoPause, WarningFilled } from "@element-plus/icons-vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  isGenerating: {
    type: Boolean,
    default: false
  },
  hasApiKey: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue", "submit", "stop"]);

const messageInput = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});

const senderRef = ref(null);

defineExpose({
  senderRef
});
</script>

<style lang="scss" scoped>
.sender-area {
  padding: 16px 24px;
  border-top: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  backdrop-filter: blur(10px);

  .sender-wrapper {
    position: relative;
  }

  .api-warning {
    position: absolute;
    top: -30px;
    left: 0;
    font-size: 12px;
    color: hsl(var(--warning));
    display: flex;
    align-items: center;
    gap: 4px;
  }

  :deep(.el-sender) {
    background: hsl(var(--secondary));
    border: 1px solid hsl(var(--border));
    border-radius: 12px;
    padding: 8px 12px;

    &:hover, &:focus-within {
      border-color: hsl(var(--primary));
    }

    .el-sender-content {
      padding: 0px;
    }

    textarea {
      color: hsl(var(--foreground));
      background: transparent !important;
      border: none !important;
      resize: none !important;
      outline: none !important;
      font-size: 14px;
      line-height: 1.5;

      &::placeholder {
        color: hsl(var(--muted-foreground));
      }

      &:focus {
        background: transparent !important;
      }
    }

    .el-sender__input {
      &::placeholder {
        color: hsl(var(--muted-foreground));
      }
    }

    .el-sender__submit-btn {
      background: hsl(var(--primary));

      &:hover {
        background: hsl(var(--primary-hover));
      }
    }
  }
}
</style>
