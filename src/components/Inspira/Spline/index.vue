<!-- Spline.vue -->
<template>
    <ParentSize
      :parent-size-styles="parentSizeStyles"
      :debounce-time="50"
      v-bind="$attrs"
    >
      <template #default>
        <canvas
          ref="canvasRef"
          :style="canvasStyle"
        />
        <slot v-if="isLoading" />
      </template>
    </ParentSize>
  </template>
  
<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Application } from "@splinetool/runtime";
import { useDebounceFn } from "@vueuse/core";
import ParentSize from "./ParentSize.vue";
  
const props = defineProps({
  scene: {
    type: String,
    required: true,
  },
  // eslint-disable-next-line vue/require-default-prop
  onLoad: Function,
  renderOnDemand: {
    type: Boolean,
    default: true,
  },
  // eslint-disable-next-line vue/require-default-prop
  style: Object,
});
  
let cleanUpFns = [];
  
const emit = defineEmits([
  "error",
  ...[
    "spline-mouse-down",
    "spline-mouse-up",
    "spline-mouse-hover",
    "spline-key-down",
    "spline-key-up",
    "spline-start",
    "spline-look-at",
    "spline-follow",
    "spline-scroll",
  ],
]);
  
const canvasRef = ref(null);
const isLoading = ref(true);
const splineApp = ref(null);
  
const parentSizeStyles = computed(() => ({
  overflow: "hidden",
  ...props.style,
}));
  
const canvasStyle = computed(() => ({
  display: isLoading.value ? "none" : "block",
  width: "100%",
  height: "100%",
}));
  
function eventHandler(name, handler) {
  if (!handler || !splineApp.value) {return;}
  const debouncedHandler = useDebounceFn(handler, 50, {
    maxWait: 100,
  });
  splineApp.value.addEventListener(name, debouncedHandler);
  return () => splineApp.value?.removeEventListener(name, debouncedHandler);
}
  
onMounted(async () => {
  if (!canvasRef.value) {return;}
  
  try {
    splineApp.value = new Application(canvasRef.value, {
      renderOnDemand: props.renderOnDemand,
    });
  
    await splineApp.value.load(props.scene);
  
    cleanUpFns = [
      eventHandler("mouseDown", (e) => emit("spline-mouse-down", e)),
      eventHandler("mouseUp", (e) => emit("spline-mouse-up", e)),
      eventHandler("mouseHover", (e) => emit("spline-mouse-hover", e)),
      eventHandler("keyDown", (e) => emit("spline-key-down", e)),
      eventHandler("keyUp", (e) => emit("spline-key-up", e)),
      eventHandler("start", (e) => emit("spline-start", e)),
      eventHandler("lookAt", (e) => emit("spline-look-at", e)),
      eventHandler("follow", (e) => emit("spline-follow", e)),
      eventHandler("scroll", (e) => emit("spline-scroll", e)),
    ].filter(Boolean);
  
    isLoading.value = false;
    props.onLoad?.(splineApp.value);
  } catch (err) {
    emit("error", err);
  }
});
  
onUnmounted(() => {
  cleanUpFns.forEach((fn) => fn?.());
  splineApp.value?.dispose();
});
</script>