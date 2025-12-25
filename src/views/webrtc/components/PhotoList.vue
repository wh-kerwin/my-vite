<template>
  <div class="media-list">
    <div v-if="photoList.length === 0" class="empty-state">
      <el-empty description="暂无拍照" />
    </div>
    <div v-else class="photo-grid">
      <div
        v-for="(photo, index) in photoList"
        :key="index"
        class="photo-item"
      >
        <img :src="photo.url" :alt="`photo-${index}`" />
        <div class="photo-actions">
          <el-button
            link
            type="primary"
            size="small"
            @click="downloadPhoto(photo)"
          >
            下载
          </el-button>
          <el-button
            link
            type="danger"
            size="small"
            @click="deletePhoto(index)"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  photoList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["downloadPhoto", "deletePhoto"]);

const downloadPhoto = (photo) => emit("downloadPhoto", photo);
const deletePhoto = (index) => emit("deletePhoto", index);
</script>

<style lang="scss" scoped>
.media-list {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;

    .photo-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 1;
      background: #f0f0f0;
      cursor: pointer;
      transition: all 0.3s ease;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-actions {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.8));
        padding: 8px;
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.3s ease;

        :deep(.el-button) {
          font-size: 12px;
          padding: 2px 8px;
        }
      }

      &:hover .photo-actions {
        opacity: 1;
      }
    }
  }
}
</style>
