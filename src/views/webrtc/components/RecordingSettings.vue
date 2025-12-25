<template>
  <div class="settings-panel">
    <div class="setting-item">
      <label>录制质量</label>
      <el-radio-group v-model="localQuality" size="small" class="quality-group">
        <el-radio-button label="hd">高清 (720p)</el-radio-button>
        <el-radio-button label="sd">标清 (480p)</el-radio-button>
        <el-radio-button label="ld">流畅 (360p)</el-radio-button>
      </el-radio-group>
    </div>
    <div class="setting-item">
      <label>比特率</label>
      <el-select v-model="localBitrate" size="small" class="quality-select">
        <el-option label="2500 kbps (高)" value="2500000" />
        <el-option label="1500 kbps (中)" value="1500000" />
        <el-option label="800 kbps (低)" value="800000" />
      </el-select>
    </div>
    <div class="setting-item">
      <label>帧率</label>
      <el-select v-model="localFramerate" size="small" class="quality-select">
        <el-option label="30 fps" value="30" />
        <el-option label="24 fps" value="24" />
        <el-option label="15 fps" value="15" />
      </el-select>
    </div>
    <div class="setting-info">
      <el-alert
        :title="`当前预设: ${qualityPresets[localQuality].name}`"
        :description="`分辨率: ${qualityPresets[localQuality].width}x${qualityPresets[localQuality].height}`"
        type="info"
        :closable="false"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  quality: {
    type: String,
    required: true,
  },
  bitrate: {
    type: String,
    required: true,
  },
  framerate: {
    type: String,
    required: true,
  },
  qualityPresets: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:quality", "update:bitrate", "update:framerate"]);

const localQuality = ref(props.quality);
const localBitrate = ref(props.bitrate);
const localFramerate = ref(props.framerate);

watch(localQuality, (val) => emit("update:quality", val));
watch(localBitrate, (val) => emit("update:bitrate", val));
watch(localFramerate, (val) => emit("update:framerate", val));
</script>

<style lang="scss" scoped>
.settings-panel {
  .setting-item {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
      font-size: 13px;
    }

    .quality-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .quality-select {
      width: 100%;

      :deep(.el-input__wrapper) {
        background: rgba(102, 126, 234, 0.1);
        border: 1px solid rgba(102, 126, 234, 0.3);

        &:hover {
          border-color: #667eea;
        }
      }
    }
  }

  .setting-info {
    margin-top: 12px;

    :deep(.el-alert) {
      padding: 12px;
      border-radius: 6px;

      .el-alert__title {
        font-size: 13px;
        font-weight: 500;
      }

      .el-alert__description {
        font-size: 12px;
      }
    }
  }
}
</style>
