<template>
  <div class="video-wrapper">
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="video-preview"
    ></video>
    <div v-if="isRecording" class="recording-indicator">
      <span class="pulse"></span>
      <div class="recording-info">
        <div>正在录制 {{ formattedTime }}</div>
        <div class="quality-badge">{{ qualityName }}</div>
      </div>
    </div>
    <div v-if="isVideoActive && !isRecording" class="status-badge">
      <el-icon><VideoPlay /></el-icon>
      摄像头就绪
    </div>
  </div>
</template>

<script setup>
defineProps({
  isVideoActive: {
    type: Boolean,
    required: true,
  },
  isRecording: {
    type: Boolean,
    required: true,
  },
  formattedTime: {
    type: String,
    required: true,
  },
  qualityName: {
    type: String,
    required: true,
  },
});

const videoRef = ref(null);

defineExpose({
  videoRef,
});
</script>

<style lang="scss" scoped>
.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 75%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  .video-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .recording-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    z-index: 10;

    .pulse {
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      animation: pulse 1s infinite;
    }

    .quality-badge {
      background: rgba(0, 0, 0, 0.6);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  }

  .status-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
  }
}
</style>
