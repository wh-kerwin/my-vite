import axios from "axios";

// 智谱AI API 配置
const ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

// 创建智谱AI专用实例
const zhipuInstance = axios.create({
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 对话历史存储
const conversationHistory = new Map();

/**
 * 发送消息到智谱AI
 * @param {string} message - 用户消息
 * @param {string} conversationId - 对话ID，用于管理多轮对话
 * @param {object} options - 可选参数
 * @param {function} onMessage - 流式回调函数
 * @returns {Promise}
 */
export function sendMessageToZhipuAI(message, conversationId = "default", options = {}, onMessage = null) {
  const apiKey = options.apiKey || localStorage.getItem("zhipu_api_key");
  const signal = options.signal;

  if (!apiKey) {
    return Promise.reject(new Error("请先配置智谱AI API Key"));
  }

  // 获取或初始化对话历史
  let history = conversationHistory.get(conversationId) || [];

  // 添加用户消息
  history.push({
    role: "user",
    content: message
  });

  const requestData = {
    model: options.model || "glm-4-flash",
    messages: history,
    stream: options.stream !== false, // 默认开启流式输出
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 4096,
    top_p: options.top_p || 0.9,
  };

  // 流式请求
  if (requestData.stream && onMessage) {
    return streamChatWithZhipuAI(requestData, apiKey, conversationId, onMessage, signal);
  }

  // 非流式请求
  return zhipuInstance.post(ZHIPU_API_URL, requestData, {
    headers: {
      "Authorization": `Bearer ${apiKey}`
    },
    signal,
  }).then(response => {
    const assistantMessage = response.data.choices[0].message;
    // 添加助手回复到历史
    history.push(assistantMessage);
    conversationHistory.set(conversationId, history);
    return assistantMessage;
  });
}

/**
 * 流式对话
 */
function streamChatWithZhipuAI(requestData, apiKey, conversationId, onMessage, signal) {
  let history = conversationHistory.get(conversationId) || [];
  let fullContent = "";

  return fetch(ZHIPU_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestData),
    signal,
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    function read() {
      return reader.read().then(({ done, value }) => {
        if (done) {
          // 添加完整的助手回复到历史
          if (fullContent) {
            history.push({
              role: "assistant",
              content: fullContent
            });
            conversationHistory.set(conversationId, history);
          }
          return { done: true };
        }

        // 处理数据流
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim().startsWith("data: ")) {
            const data = line.trim().slice(6);
            if (data === "[DONE]") {
              return { done: true };
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                onMessage({ content: fullContent, done: false });
              }
            } catch (e) {
              console.error("解析错误:", e);
            }
          }
        }

        return read();
      });
    }

    return read();
  });
}

/**
 * 清空对话历史
 */
export function clearConversationHistory(conversationId = "default") {
  conversationHistory.delete(conversationId);
}

/**
 * 获取对话历史
 */
export function getConversationHistory(conversationId = "default") {
  return conversationHistory.get(conversationId) || [];
}

/**
 * 设置API Key
 */
export function setZhipuApiKey(apiKey) {
  localStorage.setItem("zhipu_api_key", apiKey);
}

/**
 * 获取API Key
 */
export function getZhipuApiKey() {
  return localStorage.getItem("zhipu_api_key");
}
