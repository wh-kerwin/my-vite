<template>
  <div class="control-buttons">
    <el-button
      type="primary"
      :icon="isVideoActive ? VideoPause : VideoPlay"
      class="btn"
      @click="toggleCamera"
    >
      {{ isVideoActive ? "关闭摄像头" : "启动摄像头" }}
    </el-button>

    <el-button
      type="success"
      :icon="isRecording ? VideoPause : VideoPlay"
      :disabled="!isVideoActive"
      class="btn"
      @click="toggleRecording"
    >
      {{ isRecording ? "停止录制" : "开始录制" }}
    </el-button>

    <el-button
      type="warning"
      icon="Camera"
      :disabled="!isVideoActive"
      class="btn"
      @click="takePhoto"
    >
      拍照
    </el-button>

    <el-button
      type="info"
      icon="Download"
      :disabled="!hasRecordedVideo"
      class="btn"
      @click="downloadVideo"
    >
      下载视频
    </el-button>
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
  hasRecordedVideo: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["toggleCamera", "toggleRecording", "takePhoto", "downloadVideo"]);

const toggleCamera = () => emit("toggleCamera");
const toggleRecording = () => emit("toggleRecording");
const takePhoto = () => emit("takePhoto");
const downloadVideo = () => emit("downloadVideo");
</script>

<style lang="scss" scoped>
.control-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;

  .btn {
    width: 100%;
    height: 40px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>
