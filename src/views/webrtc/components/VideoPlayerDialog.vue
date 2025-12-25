<template>
  <el-dialog
    v-model="visible"
    title="视频播放"
    width="70%"
    destroy-on-close
    @update:model-value="handleClose"
  >
    <div class="play-dialog-content">
      <video
        v-if="currentVideo"
        :src="currentVideo.url"
        controls
        style="width: 100%; height: auto"
      ></video>
    </div>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  currentVideo: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const handleClose = () => {
  emit("update:modelValue", false);
};
</script>

<style lang="scss" scoped>
.play-dialog-content {
  width: 100%;
  max-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 6px;
  padding: 20px;
}
</style>
