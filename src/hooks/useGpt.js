import { ref } from "vue";
import { TypeWriter, StreamGpt } from "@/utils/streamGpt";

export function useGpt(key, history = false) {
  const streamText = ref("");
  const streaming = ref(false);
  const msgList = ref([]);
  const typeWriter = new TypeWriter((str) => {
    streamText.value += str || "";
  });
  const useGpt = new StreamGpt(key, {
    onStart: (prompt) => {
      streaming.value = true;
      msgList.value.push({
        role: "user",
        content: prompt
      });
    },
    onPatch: (text) => {
      typeWriter.add(text);
    },
    onCreated: () => {
      typeWriter.start();
    },
    onDone: () => {
      typeWriter.stop();
      streaming.value = false;
      msgList.value.push({
        role: "system",
        content: streamText.value
      });
      streamText.value = "";
    }
  });

  const stream = (prompt) => {
    useGpt.stream(prompt, history ? msgList.value : undefined);
  };

  return { stream, streamText, streaming, msgList };
}