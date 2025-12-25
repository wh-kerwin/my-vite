<template>
  <div class="sender-area">
    <div class="sender-wrapper">
      <Sender
        ref="senderRef"
        v-model="messageInput"
        placeholder="输入消息，Shift+Enter 换行..."
        :submit-btn-disabled="isGenerating || !hasApiKey"
        :input-style="{ color: '#f1f5f9' }"
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
import { Sender } from 'vue-element-plus-x'
import { VideoPause, WarningFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isGenerating: {
    type: Boolean,
    default: false
  },
  hasApiKey: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'stop'])

const messageInput = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const senderRef = ref(null)

defineExpose({
  senderRef
})
</script>

<style lang="scss" scoped>
.sender-area {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);

  .sender-wrapper {
    position: relative;
  }

  .api-warning {
    position: absolute;
    top: -30px;
    left: 0;
    font-size: 12px;
    color: #f59e0b;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  :deep(.el-sender) {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px 12px;

    &:hover, &:focus-within {
      border-color: #3b82f6;
    }

    .el-sender-content {
      padding: 0px;
    }

    textarea {
      color: #f1f5f9;
      background: transparent !important;
      border: none !important;
      resize: none !important;
      outline: none !important;
      font-size: 14px;
      line-height: 1.5;

      &::placeholder {
        color: #64748b;
      }

      &:focus {
        background: transparent !important;
      }
    }

    .el-sender__input {
      color: #f1f5f9;
      background: transparent;

      &::placeholder {
        color: #64748b;
      }
    }

    .el-sender__submit-btn {
      background: #3b82f6;

      &:hover {
        background: #2563eb;
      }
    }
  }
}
</style>
