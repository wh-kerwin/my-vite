<template>
  <div class="webrtc-container">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <span class="title">
            <el-icon><VideoCamera /></el-icon>
            WebRTC 拍照录像
          </span>
          <div class="header-actions">
            <el-popover placement="top" :width="280" trigger="click">
              <template #reference>
                <el-button link type="primary" class="settings-btn">
                  <el-icon><Setting /></el-icon>
                  录制设置
                </el-button>
              </template>
              <RecordingSettings
                v-model:quality="recordingQuality"
                v-model:bitrate="bitrate"
                v-model:framerate="framerate"
                :quality-presets="qualityPresets"
              />
            </el-popover>
          </div>
        </div>
      </template>

      <div class="content">
        <!-- 左侧：视频预览区 -->
        <div class="preview-section">
          <VideoPreview
            ref="videoPreviewRef"
            :is-video-active="isVideoActive"
            :is-recording="isRecording"
            :formatted-time="formattedTime"
            :quality-name="qualityPresets[recordingQuality].name"
          />

          <!-- 控制按钮 -->
          <ControlButtons
            :is-video-active="isVideoActive"
            :is-recording="isRecording"
            :has-recorded-video="!!recordedBlob"
            @toggle-camera="toggleCamera"
            @toggle-recording="toggleRecording"
            @take-photo="takePhoto"
            @download-video="downloadVideo"
          />
        </div>

        <!-- 右侧：录像和拍照列表 -->
        <div class="media-section">
          <el-tabs v-model="activeTab">
            <!-- 录像列表 -->
            <el-tab-pane label="录像列表" name="videos">
              <VideoList
                :video-list="videoList"
                @play-video="playVideo"
                @delete-video="deleteVideo"
              />
            </el-tab-pane>

            <!-- 拍照列表 -->
            <el-tab-pane label="拍照列表" name="photos">
              <PhotoList
                :photo-list="photoList"
                @download-photo="downloadPhoto"
                @delete-photo="deletePhoto"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>

    <!-- 视频播放对话框 -->
    <VideoPlayerDialog
      v-model="showPlayDialog"
      :current-video="currentPlayVideo"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { VideoCamera, Setting } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import VideoPreview from "./components/VideoPreview.vue";
import ControlButtons from "./components/ControlButtons.vue";
import RecordingSettings from "./components/RecordingSettings.vue";
import VideoList from "./components/VideoList.vue";
import PhotoList from "./components/PhotoList.vue";
import VideoPlayerDialog from "./components/VideoPlayerDialog.vue";

// 组件引用
const videoPreviewRef = ref(null);

// 状态管理
const isVideoActive = ref(false);
const isRecording = ref(false);
const recordingTime = ref(0);
const activeTab = ref("videos");
const showPlayDialog = ref(false);
const currentPlayVideo = ref(null);
const recordingQuality = ref("hd");
const bitrate = ref("2500000");
const framerate = ref("30");

// 媒体列表
const videoList = ref([]);
const photoList = ref([]);
const recordedBlob = ref(null);

// MediaRecorder 和 Stream
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let recordingInterval = null;

// 录制质量配置
const qualityPresets = {
  hd: { name: "高清", width: 1280, height: 720, bitrate: 2500000 },
  sd: { name: "标清", width: 854, height: 480, bitrate: 1500000 },
  ld: { name: "流畅", width: 640, height: 360, bitrate: 800000 },
};

// 计算属性：格式化录制时间
const formattedTime = computed(() => {
  const minutes = Math.floor(recordingTime.value / 60);
  const seconds = recordingTime.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

// 获取视频元素
const getVideoElement = () => {
  return videoPreviewRef.value?.videoRef?.value || null;
};

// 启动/关闭摄像头
const toggleCamera = async () => {
  if (isVideoActive.value) {
    stopCamera();
  } else {
    await startCamera();
  }
};

// 启动摄像头
const startCamera = async () => {
  try {
    const preset = qualityPresets[recordingQuality.value];
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: preset.width },
        height: { ideal: preset.height },
      },
      audio: true,
    });

    const videoEl = getVideoElement();
    if (videoEl) {
      videoEl.srcObject = mediaStream;
    }
    isVideoActive.value = true;
    ElMessage.success("摄像头已启动");
  } catch (error) {
    console.error("无法访问摄像头:", error);
    ElMessage.error("无法访问摄像头，请检查权限设置");
  }
};

// 停止摄像头
const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
  const videoEl = getVideoElement();
  if (videoEl) {
    videoEl.srcObject = null;
  }
  isVideoActive.value = false;
  isRecording.value = false;
  if (recordingInterval) {
    clearInterval(recordingInterval);
  }
  recordingTime.value = 0;
};

// 开始/停止录制
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

// 开始录制
const startRecording = () => {
  recordedChunks = [];
  const options = {
    mimeType: "video/webm;codecs=vp9",
    videoBitsPerSecond: parseInt(bitrate.value),
  };

  try {
    mediaRecorder = new MediaRecorder(mediaStream, options);
  } catch (e) {
    console.log("VP9 not supported, trying VP8");
    options.mimeType = "video/webm;codecs=vp8";
    try {
      mediaRecorder = new MediaRecorder(mediaStream, options);
    } catch (e2) {
      console.log("VP8 not supported, using default");
      mediaRecorder = new MediaRecorder(mediaStream);
    }
  }

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    recordedBlob.value = blob;

    const url = URL.createObjectURL(blob);
    const timestamp = new Date();
    const name = `video_${timestamp.getHours()}_${timestamp.getMinutes()}_${timestamp.getSeconds()}`;

    videoList.value.unshift({
      url,
      name,
      time: timestamp.toLocaleString(),
      quality: qualityPresets[recordingQuality.value].name,
      size: blob.size,
    });

    ElMessage.success("录制完成");
  };

  mediaRecorder.start();
  isRecording.value = true;
  recordingTime.value = 0;

  recordingInterval = setInterval(() => {
    recordingTime.value++;
  }, 1000);
};

// 停止录制
const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    isRecording.value = false;
    if (recordingInterval) {
      clearInterval(recordingInterval);
    }
    recordingTime.value = 0;
  }
};

// 拍照
const takePhoto = () => {
  const videoEl = getVideoElement();
  if (!videoEl) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoEl, 0, 0);

  const imageUrl = canvas.toDataURL("image/jpeg");
  const timestamp = new Date();

  photoList.value.unshift({
    url: imageUrl,
    time: timestamp.toLocaleString(),
  });

  ElMessage.success("拍照成功");
};

// 播放视频
const playVideo = (video) => {
  currentPlayVideo.value = video;
  showPlayDialog.value = true;
};

// 删除视频
const deleteVideo = (index) => {
  ElMessageBox.confirm("确定要删除此视频吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      videoList.value.splice(index, 1);
      ElMessage.success("删除成功");
    });
};

// 删除拍照
const deletePhoto = (index) => {
  ElMessageBox.confirm("确定要删除此拍照吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      photoList.value.splice(index, 1);
      ElMessage.success("删除成功");
    });
};

// 下载视频
const downloadVideo = () => {
  if (!recordedBlob.value) {
    ElMessage.warning("暂无录制视频");
    return;
  }

  const url = URL.createObjectURL(recordedBlob.value);
  const a = document.createElement("a");
  a.href = url;
  a.download = `video_${Date.now()}.webm`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 下载拍照
const downloadPhoto = (photo) => {
  const a = document.createElement("a");
  a.href = photo.url;
  a.download = `photo_${Date.now()}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 生命周期
onMounted(() => {
  // 初始化时可以自动启动摄像头（可选）
});

onBeforeUnmount(() => {
  stopCamera();
});
</script>

<style lang="scss" scoped>
.webrtc-container {
  padding: 0px;
  height: calc(100vh - 130px);

  .main-card {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    :deep(.el-card__header) {
      padding: 24px;
      border-bottom: 2px solid #f0f0f0;

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          display: flex;
          align-items: center;
          gap: 10px;

          .el-icon {
            color: #667eea;
            font-size: 24px;
          }
        }

        .header-actions {
          .settings-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: #667eea;
          }
        }
      }
    }

    :deep(.el-card__body) {
      padding: 24px;
    }
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;

    @media (max-width: 1400px) {
      grid-template-columns: 1fr;
    }
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .media-section {
    :deep(.el-tabs__content) {
      padding-top: 16px;
    }
  }
}

// 自定义滚动条
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;

  &:hover {
    background: #bbb;
  }
}
</style>