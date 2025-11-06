<template>
    <div id="scene"></div>
</template>

<script setup>
import Tokyo3D from "./index";
import { onMounted } from "vue";

onMounted(() => {
  new Tokyo3D("#scene");
});
</script>

<style lang="scss" scoped>

</style>