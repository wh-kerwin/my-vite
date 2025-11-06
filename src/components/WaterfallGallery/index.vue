<template>
    <div v-if="show" class="waterfall-gallery">
        <div
            v-for="(photo, index) in pictureList"
            :key="index"
            class="photo-item"
            :style="gridHegiht(photo.img_url, index)"
        >
          <el-skeleton v-if="defer(index)" style="height: 100%;" :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="image" style="height: 100%;" />
            </template>
            <template #default>
              <el-image :src="photo.img_url" :alt="photo.title" lazy/>
              <div class="photo-title">{{ photo.title }}</div>
            </template>
          </el-skeleton>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useDefer } from "@/hooks/useDefer";
const defer = useDefer();
const props = defineProps({
  imgList: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["loadend"]);
const pictureList = ref([]);
const show = ref(false);
const loading = ref(true);
const computedGrid = () => {
  let count = props.imgList.length;
  props.imgList.forEach((img, index) => {
    let image = new Image();
    image.src = img;
    image.onload = () => {
      count -= 1;
      if (!count) {
        show.value = true;
        emit("loadend");
      }
      loading.value = false;
    };
    pictureList.value.push({
      id: index + 1,
      img_url: props.imgList[index],
      title: "图片" + (index + 1)
    });
  });
};
onMounted(() => {
  computedGrid();
});
// eslint-disable-next-line no-unused-vars
const gridHegiht = (imgUrl, index) => {
  let img = new Image();
  img.src = imgUrl;
  let heightSm = "";
  return (img.onload = function () {
    let width = img.width;
    let height = img.height;
    heightSm = {
      "grid-row": "auto / span " + Math.round((height * 10) / width),
      "aspect-ratio": width + " / " + height
    };
    return heightSm;
  })();
};
 
  
</script>

<style lang="scss" scoped>
.waterfall-gallery {
  column-count: 4;
  
  .photo-item {
    position: relative;
    overflow: hidden;
    margin-bottom: 1em;

    .photo-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }

    .photo-title {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 5px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      font-size: 14px;
      text-align: center;
    }
  }
}
@media (max-width: 560px) {
  .waterfall-gallery {
    column-count: 1;
  }
}

/* 平板竖屏 - 双列 */
@media (min-width: 561px) and (max-width: 768px) {
  .waterfall-gallery {
    column-count: 2;
  }
}

/* 平板横屏 - 三列 */
@media (min-width: 769px) and (max-width: 1024px) {
  .waterfall-gallery {
    column-count: 3;
  }
}

/* 小型桌面屏幕 - 四列 */
@media (min-width: 1025px) and (max-width: 1440px) {
  .waterfall-gallery {
    column-count: 4;
  }
}

/* 大型桌面屏幕 - 五列 */
@media (min-width: 1441px) {
  .waterfall-gallery {
    column-count: 5;
  }
}
/* .waterfall-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 10px;
}

.photo-item {
  grid-column-end: span 1;
  position: relative;
  overflow: hidden;
  // padding-bottom: var(--pb, 100%);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.photo-title {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 14px;
  text-align: center;
}
@media (max-width: 600px) {
  .waterfall-gallery {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 5px;
  }
}

@media (min-width: 601px) and (max-width: 1200px) {
  .waterfall-gallery {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-gap: 10px;
  }
}

@media (min-width: 1201px) {
  .waterfall-gallery {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 15px;
  }
} */
</style>