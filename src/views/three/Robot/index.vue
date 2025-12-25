<!-- <template>
  <AuroraBackground>
    <Motion
      as="div"
      :initial="{ opacity: 0, y: 40, filter: 'blur(10px)' }"
      :in-view="{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }"
      :transition="{
        delay: 0.3,
        duration: 0.8,
        ease: 'easeInOut',
      }"
      class="relative flex flex-col items-center justify-center gap-4 px-4"
    >
      <div class="text-3xl font-bold text-center md:text-7xl dark:text-white">
        Background lights are cool you know.
      </div>
      <div class="py-4 text-base font-extralight md:text-4xl dark:text-neutral-200">
        And this, is chemical burn.
      </div>
      <button
        class="px-4 py-2 text-white bg-black rounded-full w-fit dark:bg-white dark:text-black"
      >
        Burn it now
      </button>
    </Motion>
  </AuroraBackground>
</template>

<script setup>
import AuroraBackground from "@/components/Inspira/Background.vue";
import { Motion } from "motion-v";
</script> -->
<!-- <template>
  <div class="flex items-center justify-center h-80">
    <SparklesText
      text="Inspira UI"
      :colors="{ first: '#9E7AFF', second: '#FE8BBB' }"
      :sparkles-count="10"
      class="my-8"
    />
  </div>
</template> -->

<template>
  <div class="relative w-full overflow-hidden rounded-lg bg-black/[0.96]">
    <div
      class="absolute flex flex-col items-center justify-center w-full gap-2 p-8 text-center text-white font-heading"
    >
      <span class="text-4xl font-semibold"> Inspira UI </span>
      <span class="font-sans font-light">Build spline animations with style.</span>
    </div>
    <div class="flex">
      <Spline
        :scene="sceneUrl"
        class="mt-24 size-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Spline from "@/components/Inspira/Spline/index.vue";
const sceneUrl = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";
</script>