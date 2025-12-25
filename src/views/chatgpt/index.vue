<template>
  <div class="chatgpt">
    <div class="chat-container">
      <!-- 聊天标题栏 -->
      <ChatHeader
        v-model="selectedModel"
        @show-api-key-dialog="showApiKeyDialog"
        @clear-messages="clearMessages"
      />

      <!-- 消息区域 -->
      <div ref="messageListRef" class="message-list">
        <div v-if="messageList.length === 0" class="empty-state">
          <el-empty description="开始你的 AI 对话之旅">
            <template #image>
              <div class="empty-icon">
                <el-icon :size="80"><ChatDotRound /></el-icon>
              </div>
            </template>
            <QuickPrompts :prompts="quickPrompts" @select="sendQuickPrompt" />
          </el-empty>
        </div>

        <BubbleList
          v-else
          ref="bubbleListRef"
          :list="bubbleList"
          :auto-scroll="true"
          :trigger-indices="'only-last'"
        >
          <template #avatar="{ item }">
            <div class="message-avatar">
              <el-icon v-if="item.role === 'user'" :size="32"><User /></el-icon>
              <el-icon v-else :size="32"><ChatDotRound /></el-icon>
            </div>
          </template>
          <template #header="{ item }">
            <div class="message-sender">
              {{ item.role === 'user' ? '你' : '智谱AI' }}
            </div>
          </template>
          <template #content="{ item }">
            <div class="message-text" v-html="renderMarkdown(item.content)"></div>
          </template>
          <template #footer="{ item, index }">
            <div v-if="item.role === 'assistant' && index !== 0" class="message-actions">
              <el-button link size="small" @click="copyMessage(item.content)">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
          </template>
          <template #loading="{ item, index }">
            <GeneratingIndicator v-if="item.role === 'assistant' && index === bubbleList.length - 1 && isGenerating" />
          </template>
        </BubbleList>
      </div>

      <!-- 发送区域 -->
      <ChatSender
        v-model="messageInput"
        :is-generating="isGenerating"
        :has-api-key="hasApiKey"
        @submit="handleSubmit"
        @stop="stopGeneration"
      />
    </div>

    <!-- API Key 设置对话框 -->
    <ApiKeyDialog v-model:visible="apiKeyDialogVisible" :api-key="getZhipuApiKey()" @save="handleApiKeySave" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { BubbleList } from "vue-element-plus-x";
import { ElMessage } from "element-plus";
import { ChatDotRound, User, CopyDocument } from "@element-plus/icons-vue";
import {
  sendMessageToZhipuAI,
  clearConversationHistory,
  getZhipuApiKey,
  setZhipuApiKey
} from "@/api/zhipu";
import MarkdownIt from "markdown-it";
import ChatHeader from "./components/ChatHeader.vue";
import QuickPrompts from "./components/QuickPrompts.vue";
import GeneratingIndicator from "./components/GeneratingIndicator.vue";
import ChatSender from "./components/ChatSender.vue";
import ApiKeyDialog from "./components/ApiKeyDialog.vue";

// Markdown 渲染器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str) {
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

const bubbleListRef = ref(null);
const messageListRef = ref(null);
const messageInput = ref("");

// 消息列表（适配 BubbleList 的格式）
const messageList = ref([]);

// 转换为 BubbleList 需要的格式
const bubbleList = computed(() => {
  return messageList.value.map((msg) => ({
    ...msg,
    placement: msg.role === "user" ? "end" : "start",
    variant: "filled"
  }));
});

// 发送状态
const isGenerating = ref(false);

// 当前请求 AbortController（用于停止生成）
const currentAbortController = ref(null);

// API Key 配置
const apiKeyDialogVisible = ref(false);
const hasApiKey = computed(() => !!getZhipuApiKey());

// 模型选择
const selectedModel = ref("glm-4-flash");

// 对话ID
const conversationId = ref("chatgpt-" + Date.now());

// 快捷提示词
const quickPrompts = [
  "帮我写一个Python函数",
  "解释量子计算的原理",
  "推荐几本好书",
  "优化这段代码",
];

// 渲染 Markdown
const renderMarkdown = (content) => {
  if (!content) {return "";}

  let html = md.render(content);

  // 为代码块添加复制按钮
  html = html.replace(/<pre(?:\s+class="hljs")?><code>([\s\S]*?)<\/code><\/pre>/g, (_match, code) => {
    const codeId = "code-" + Math.random().toString(36).substring(2, 11);
    return `
      <div class="code-block-wrapper">
        <div class="code-header">
          <span class="code-lang">Code</span>
          <button class="copy-code-btn" onclick="copyCode('${codeId}')" title="复制代码">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>复制</span>
          </button>
        </div>
        <pre id="${codeId}" class="hljs"><code>${code}</code></pre>
      </div>
    `;
  });

  return html;
};

// 复制消息
const copyMessage = (content) => {
  navigator.clipboard.writeText(content).then(() => {
    ElMessage.success("已复制到剪贴板");
  });
};

// 复制代码块
window.copyCode = (codeId) => {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    const code = codeElement.textContent;
    navigator.clipboard.writeText(code).then(() => {
      ElMessage.success("代码已复制到剪贴板");
      // 更新按钮状态
      const btn = codeElement.previousElementSibling.querySelector(".copy-code-btn");
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg><span>已复制</span>`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }
    }).catch(err => {
      ElMessage.error("复制失败" + err);
    });
  }
};

// 发送快捷提示
const sendQuickPrompt = (prompt) => {
  if (!hasApiKey.value) {
    showApiKeyDialog();
    ElMessage.warning("请先配置 API Key");
    return;
  }
  messageInput.value = prompt;
  handleSubmit(prompt);
};

// 显示 API Key 设置对话框
const showApiKeyDialog = () => {
  apiKeyDialogVisible.value = true;
};

// 保存 API Key
const handleApiKeySave = (apiKey) => {
  setZhipuApiKey(apiKey);
  ElMessage.success("API Key 保存成功");
};

// 停止生成
const stopGeneration = () => {
  if (currentAbortController.value) {
    try {
      currentAbortController.value.abort();
    } finally {
      currentAbortController.value = null;
    }
  }
  isGenerating.value = false;
  ElMessage.info("已停止生成");
};

// 处理发送消息
const handleSubmit = async (val) => {
  const message = val || messageInput.value;
  if (!message || !message.trim()) {
    return;
  }

  if (!hasApiKey.value) {
    showApiKeyDialog();
    ElMessage.warning("请先配置 API Key");
    return;
  }

  // 清空输入框
  messageInput.value = "";

  // 添加用户消息
  messageList.value.push({
    content: message,
    role: "user"
  });

  // 添加空的助手消息，使用 ref 确保响应式
  const messageIndex = messageList.value.length;
  messageList.value.push({
    content: "",
    role: "assistant"
  });

  // 滚动到底部
  await nextTick();
  scrollToBottom();

  // 如果正在生成，先中止上一次（避免并发串台）
  if (isGenerating.value) {
    stopGeneration();
  }

  const abortController = new AbortController();
  currentAbortController.value = abortController;
  isGenerating.value = true;

  try {
    await sendMessageToZhipuAI(
      message,
      conversationId.value,
      { model: selectedModel.value, signal: abortController.signal },
      (data) => {
        // 已被中止则忽略后续流式回调
        if (abortController.signal.aborted) {
          return;
        }

        // 流式更新消息 - 直接替换整个对象确保响应式更新
        messageList.value[messageIndex] = {
          content: data.content,
          role: "assistant"
        };
        // 触发自动滚动
        nextTick(() => {
          scrollToBottom();
        });
      }
    );
  } catch (error) {
    if (abortController.signal.aborted || error?.name === "AbortError") {
      messageList.value[messageIndex].content += "\n\n*已停止生成*";
    } else {
      messageList.value[messageIndex].content += `\n\n*错误: ${error.message || "请求失败"}*`;
    }
  } finally {
    if (currentAbortController.value === abortController) {
      currentAbortController.value = null;
    }
    isGenerating.value = false;
    // 滚动到底部
    await nextTick();
    scrollToBottom();
  }
};

// 滚动到底部
const scrollToBottom = () => {
  if (bubbleListRef.value && bubbleListRef.value.scrollToBottom) {
    bubbleListRef.value.scrollToBottom();
  } else if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

// 清空对话
const clearMessages = () => {
  messageList.value = [];
  clearConversationHistory(conversationId.value);
  ElMessage.success("对话已清空");
};

// 监听消息列表变化，自动滚动
watch(messageList, () => {
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });

// 初始化
onMounted(() => {
  if (!hasApiKey.value) {
    // 延迟显示，避免影响体验
    setTimeout(() => {
      showApiKeyDialog();
    }, 500);
  }
});

onBeforeUnmount(() => {
  stopGeneration();
});
</script>

<style lang="scss" scoped>
.chatgpt {
  height: calc(100vh - 130px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
}

.chat-container {
  width: 100%;
  height: 100%;
  background: #1e293b;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message-list {
  flex: 1;
  overflow-y: auto;
  background: #1e293b;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 40px;

    .empty-icon {
      color: #3b82f6;
    }

    :deep(.el-empty__description) {
      color: #64748b;
    }
  }
}

:deep(.bubble-list) {
  padding: 20px;
}

:deep(.bubble-item) {
  margin-bottom: 24px;
  display: flex;
  gap: 12px;

  &.bubble-item-start {
    flex-direction: row;
  }

  &.bubble-item-end {
    flex-direction: row-reverse;
  }
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;

  .bubble-item-end & {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }
}

.message-sender {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.6;
  color: #f1f5f9;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);

  .bubble-item-end & {
    background: rgba(59, 130, 246, 0.15);
  }

  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin-top: 1em;
    margin-bottom: 0.5em;
    color: #f1f5f9;
  }

  :deep(p) {
    margin: 0.5em 0;
  }

  :deep(code) {
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
  }

  :deep(.code-block-wrapper) {
    position: relative;
    margin: 12px 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    overflow: hidden;

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.2);

      .code-lang {
        font-size: 12px;
        color: #94a3b8;
        font-weight: 500;
      }

      .copy-code-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 4px;
        color: #3b82f6;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: rgba(59, 130, 246, 0.3);
          border-color: #3b82f6;
        }

        svg {
          display: block;
        }
      }
    }

    pre {
      margin: 0;
      padding: 12px;
      border-radius: 0 0 8px 8px;
      overflow-x: auto;

      code {
        background: transparent;
        padding: 0;
      }
    }
  }

  :deep(ul), :deep(ol) {
    padding-left: 1.5em;
    margin: 0.5em 0;
  }

  :deep(a) {
    color: #3b82f6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(blockquote) {
    border-left: 3px solid #3b82f6;
    padding-left: 1em;
    margin: 1em 0;
    color: #94a3b8;
  }
}

.message-actions {
  display: flex;
  align-items: flex-start;
  opacity: 0;
  transition: opacity 0.2s;
  margin-top: 8px;

  .bubble-item:hover & {
    opacity: 1;
  }

  :deep(.el-button) {
    color: #64748b;

    &:hover {
      color: #3b82f6;
    }
  }
}

:deep(.el-bubble-content-wrapper) {
  .el-bubble-content-filled {
    background: rgba(2, 2, 2, 0.06);
    max-width: 60%;
  }

  .el-bubble-content {
    padding: 0;
  }
}
</style>