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
    border-color: hsl(var(--primary));
    color: hsl(var(--primary));
    background: hsl(var(--primary) / 0.1);

    &:hover {
      border-color: hsl(var(--border));
      color: hsl(var(--muted-foreground));
    }
  }
}
</style>
