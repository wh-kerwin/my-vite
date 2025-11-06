<template>
    <div class="chatgpt">
        <div ref="listEl" class="msg">
            <Msg v-for="(msg, index) in msgList" :key="index" :role="msg.role" :content="msg.content"></Msg>
            <Msg v-if="streaming" role="system" :content="streamText" :streaming="true"></Msg>
        </div>
        <div class="input">
            <InputDiv v-model:value="inputValue" @submit="handleSubmit"></InputDiv>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import Msg from "./components/Msg.vue";
import InputDiv from "./components/InputDiv.vue";
import { useScroll } from "@vueuse/core";
import { useGpt } from "@/hooks/useGpt";
import config from "./config";

const inputValue = ref("");
const { msgList, streaming, streamText, stream } = useGpt(config.xunfei, true);
const listEl = ref(null);
const { y } = useScroll(listEl);

const scrollToBottom = () => {
  nextTick(() => {
    y.value = listEl.value?.scrollHeight || 0;
  });
};
watch(streamText, (val) => {
  if (val) {
    scrollToBottom();
  }
});
const handleSubmit = (content) => {
  if (content === "") {return;}
  stream(content);
};
</script>

<style lang="scss" scoped>
.chatgpt {
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
//   background-color: #f5f5f5;

  .input {
    width: 100%;
    min-height: 150px;
  }

  .msg {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }
}
</style>