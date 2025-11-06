<template>
    <div class="app-container">
        <div class="vote-clock">
            <animate-clock :terminal-time="'2026-05-11 23:27:00'" />
        </div>
        <img src="@/assets/images/welcome.png" alt="" />
    </div>
</template>

<script setup>
import AnimateClock from "@/components/AnimateClock/index.vue";
</script>

<style lang="scss" scoped>
.vote-clock {
    user-select: none;
}
img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>