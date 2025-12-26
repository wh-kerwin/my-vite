<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">精美图片画廊</h1>
      <p class="page-description">探索精选的高质量图片集合，享受瀑布流布局带来的视觉体验</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载精彩内容...</p>
    </div>

    <!-- 图片画廊 -->
    <div v-else-if="imageList.length > 0" class="gallery-wrapper">
      <waterfall-gallery :img-list="imageList" @loadend="handleLoadEnd"></waterfall-gallery>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📷</div>
      <p class="empty-text">暂无图片内容</p>
    </div>
  </div>
</template>

<script setup>
import WaterfallGallery from "@/components/WaterfallGallery/index.vue";

const loading = ref(true);
const imageList = ref([]);

// 使用 Vite 的 import.meta.glob 批量导入图片
const loadImages = () => {
  try {
    // 使用 eager 模式立即导入所有图片
    const imageModules = import.meta.glob("@/assets/jpg/*.jpeg", { eager: true });
    
    // 提取图片路径并排序
    const images = Object.keys(imageModules)
      .sort((a, b) => {
        // 从路径中提取数字进行排序
        const numA = parseInt(a.match(/(\d+)\.jpeg$/)?.[1] || "0");
        const numB = parseInt(b.match(/(\d+)\.jpeg$/)?.[1] || "0");
        return numA - numB;
      })
      .map(path => imageModules[path].default);
    
    imageList.value = images;
    
    loading.value = false;
    if (images.length === 0) {
      console.warn("未找到任何图片");
      loading.value = false;
    }
  } catch (error) {
    console.error("图片加载出错:", error);
    loading.value = false;
  }
};

const handleLoadEnd = () => {
  console.log("画廊加载完成");
  loading.value = false;
};

onMounted(() => {
  loadImages();
});
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease-out;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.page-description {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  animation: fadeIn 0.4s ease-out;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1.5rem;
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.gallery-wrapper {
  animation: fadeIn 0.6s ease-out;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  animation: fadeIn 0.4s ease-out;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.2rem;
  color: #94a3b8;
  font-weight: 500;
}

/* 动画定义 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }

  .page-description {
    font-size: 0.95rem;
  }
}
</style>