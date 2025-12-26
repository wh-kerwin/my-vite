<template>
  <div v-if="show" class="waterfall-gallery">
    <div
      v-for="(photo, index) in pictureList"
      :key="photo.id"
      class="photo-item"
      :style="getImageStyle(photo.img_url)"
    >
      <el-skeleton v-if="defer(index)" style="height: 100%;" :loading="loading" animated>
        <template #template>
          <el-skeleton-item variant="image" style="height: 100%;" />
        </template>
        <template #default>
          <div class="image-wrapper">
            <el-image 
              :src="photo.img_url" 
              :alt="photo.title" 
              fit="cover"
              lazy
              class="gallery-image"
            />
            <div class="photo-overlay">
              <div class="photo-title">{{ photo.title }}</div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useDefer } from "@/hooks/useDefer";

const defer = useDefer();

const props = defineProps({
  imgList: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["loadend"]);

const pictureList = ref([]);
const show = ref(false);
const loading = ref(true);
const imageCache = new Map();

// 初始化图片列表
const initPictureList = () => {
  if (!props.imgList.length) {
    show.value = true;
    emit("loadend");
    return;
  }

  let loadedCount = 0;
  const totalCount = props.imgList.length;

  props.imgList.forEach((imgUrl, index) => {
    const image = new Image();
    image.src = imgUrl;
    
    image.onload = () => {
      loadedCount++;
      
      // 缓存图片尺寸信息
      imageCache.set(imgUrl, {
        width: image.width,
        height: image.height
      });
      
      // 所有图片加载完成
      if (loadedCount === totalCount) {
        show.value = true;
        loading.value = false;
        emit("loadend");
      }
    };
    
    image.onerror = () => {
      console.warn(`图片加载失败: ${imgUrl}`);
      loadedCount++;
      
      if (loadedCount === totalCount) {
        show.value = true;
        loading.value = false;
        emit("loadend");
      }
    };
    
    // 添加到图片列表
    pictureList.value.push({
      id: index + 1,
      img_url: imgUrl,
      title: `图片 ${index + 1}`
    });
  });
};

// 获取图片样式(用于瀑布流布局)
const getImageStyle = (imgUrl) => {
  const cached = imageCache.get(imgUrl);
  
  if (!cached) {
    return {};
  }
  
  const { width, height } = cached;
  const spanRows = Math.round((height * 10) / width);
  
  return {
    "grid-row": `auto / span ${spanRows}`,
    "aspect-ratio": `${width} / ${height}`
  };
};

onMounted(() => {
  initPictureList();
});
</script>

<style lang="scss" scoped>
.waterfall-gallery {
  column-count: 4;
  column-gap: 1rem;
  
  .photo-item {
    position: relative;
    overflow: hidden;
    margin-bottom: 1rem;
    border-radius: 12px;
    break-inside: avoid;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      
      .photo-overlay {
        opacity: 1;
      }
    }
    
    .image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    :deep(.gallery-image) {
      width: 100%;
      height: 100%;
      display: block;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }
    
    &:hover :deep(.gallery-image img) {
      transform: scale(1.05);
    }
    
    .photo-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);
      padding: 2rem 1rem 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .photo-title {
      color: white;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }
}

/* 响应式设计 */
@media (max-width: 560px) {
  .waterfall-gallery {
    column-count: 1;
    column-gap: 0.75rem;
    
    .photo-item {
      margin-bottom: 0.75rem;
    }
  }
}

@media (min-width: 561px) and (max-width: 768px) {
  .waterfall-gallery {
    column-count: 2;
    column-gap: 0.875rem;
    
    .photo-item {
      margin-bottom: 0.875rem;
    }
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .waterfall-gallery {
    column-count: 3;
    column-gap: 1rem;
  }
}

@media (min-width: 1025px) and (max-width: 1440px) {
  .waterfall-gallery {
    column-count: 4;
  }
}

@media (min-width: 1441px) {
  .waterfall-gallery {
    column-count: 5;
    column-gap: 1.25rem;
    
    .photo-item {
      margin-bottom: 1.25rem;
    }
  }
}
</style>
