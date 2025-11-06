<template>
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" v-if="isRefresh" :key="route.fullPath" class="app-container" />
      </transition>
    </router-view>
</template>

<script setup>
defineProps({
  isRefresh: {
    type: Boolean,
    default: true
  }
});
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, background-color 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  background-color: transparent;
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>