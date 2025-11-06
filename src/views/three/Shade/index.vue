<template>
    <div id="scene"></div>
</template>

<script setup>
import Shade from "./index";
import { onMounted } from "vue";
onMounted(() => {
  new Shade("scene");
});
</script>

<style lang="scss" scoped>

</style>