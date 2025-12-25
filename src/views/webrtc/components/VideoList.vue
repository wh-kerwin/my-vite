<template>
  <div class="media-list">
    <div v-if="videoList.length === 0" class="empty-state">
      <el-empty description="暂无录像" />
    </div>
    <div v-else class="video-items">
      <div
        v-for="(video, index) in videoList"
        :key="index"
        class="media-item"
      >
        <div class="thumbnail">
          <video :src="video.url" class="thumb-video"></video>
          <div class="play-icon">
            <el-icon><VideoPlay /></el-icon>
          </div>
          <div class="quality-tag">{{ video.quality }}</div>
        </div>
        <div class="info">
          <p class="name">{{ video.name }}</p>
          <p class="time">{{ video.time }}</p>
          <p class="size">大小: {{ formatFileSize(video.size) }}</p>
          <div class="actions">
            <el-button
              link
              type="primary"
              size="small"
              @click="playVideo(video)"
            >
              播放
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              @click="deleteVideo(index)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  videoList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["playVideo", "deleteVideo"]);

const formatFileSize = (bytes) => {
  if (!bytes) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  );
};

const playVideo = (video) => emit("playVideo", video);
const deleteVideo = (index) => emit("deleteVideo", index);
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

  .video-items {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .media-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: #f0f0f0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .thumbnail {
        position: relative;
        width: 80px;
        height: 60px;
        border-radius: 6px;
        overflow: hidden;
        flex-shrink: 0;
        background: #000;

        .thumb-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 24px;
          background: rgba(0, 0, 0, 0.5);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;

          .el-icon {
            font-size: 20px;
          }
        }

        .quality-tag {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
        }

        &:hover .play-icon {
          opacity: 1;
        }
      }

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name {
          margin: 0;
          font-weight: 500;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .time {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: #999;
        }

        .size {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: #999;
        }

        .actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
      }
    }
  }
}
</style>
