<template>
  <div class="generating-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style lang="scss" scoped>
.generating-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: hsl(var(--primary));
    animation: pulse 1.4s ease-in-out infinite;

    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes pulse {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  30% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
