<template>
  <div id="scene"></div>
</template>

<script setup>
import Motor3D from "./index";
import { onMounted } from "vue";

onMounted(() => {
  new Motor3D("#scene");
});
</script>

<style scoped>

</style>