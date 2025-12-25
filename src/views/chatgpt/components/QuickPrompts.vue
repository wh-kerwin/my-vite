<template>
  <div class="quick-prompts">
    <el-button
      v-for="prompt in prompts"
      :key="prompt"
      size="small"
      plain
      class="prompt-btn"
      @click="$emit('select', prompt)"
    >
      {{ prompt }}
    </el-button>
  </div>
</template>

<script setup>
defineProps({
  prompts: {
    type: Array,
    default: () => []
  }
});

defineEmits(["select"]);
</script>

<style lang="scss" scoped>
.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;

  .prompt-btn {
    border-color: #3b82f6;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);

    &:hover {
      border-color: rgba(255, 255, 255, 0.1);
      color: #94a3b8;
    }
  }
}
</style>
