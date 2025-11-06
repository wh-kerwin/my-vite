<template>
  <div v-loading="loading" class="waterfall-gallery-container">
    <waterfall-gallery :img-list="arr" @loadend="changeLoading"></waterfall-gallery>
  </div>
  
</template>

<script setup>
import { ref } from "vue";
import WaterfallGallery from "@/components/WaterfallGallery/index.vue";
import img1 from "@/assets/jpg/1.jpeg";
import img2 from "@/assets/jpg/2.jpeg";
import img3 from "@/assets/jpg/3.jpeg";
import img4 from "@/assets/jpg/4.jpeg";
import img5 from "@/assets/jpg/5.jpeg";
import img6 from "@/assets/jpg/6.jpeg";
import img7 from "@/assets/jpg/7.jpeg";
import img8 from "@/assets/jpg/8.jpeg";
import img9 from "@/assets/jpg/9.jpeg";
import img10 from "@/assets/jpg/10.jpeg";
import img11 from "@/assets/jpg/11.jpeg";
import img12 from "@/assets/jpg/12.jpeg";
import img13 from "@/assets/jpg/13.jpeg";
import img14 from "@/assets/jpg/14.jpeg";
import img15 from "@/assets/jpg/15.jpeg";
import img16 from "@/assets/jpg/16.jpeg";
import img17 from "@/assets/jpg/17.jpeg";
import img18 from "@/assets/jpg/18.jpeg";
import img19 from "@/assets/jpg/19.jpeg";
// const arr = [];
const arr = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19];

const loading = ref(true);
const changeLoading = () => {
  console.log("加载完成");
  loading.value = false;
};
</script>

<style lang="scss" scoped>

</style>