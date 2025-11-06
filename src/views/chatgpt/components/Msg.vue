<template>
    <div class="msg-item" :class="{'msg-item-system': role === 'system'}">
        <div class="msg-content">
            <span class="msg-pop-container"  :class="{'msg-pop-container-user': role === 'user'}">
                <span ref="popRef" class="msg-pop-default" :class="{'msg-pop-primary': role === 'user'}" v-html="mkHtml"></span>
            </span>
        </div>

    </div>
</template>

<script setup>
import MarkDownIt from "markdown-it";
import highLight from "highlight.js";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import { computed, nextTick, ref} from "vue";

const props = defineProps({
  content: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    default: "user"
  },
  streaming: {
    type: Boolean,
    default: false
  }
});

const md = new MarkDownIt({
  highlight: function (str, lang) {
    if (lang && highLight.getLanguage(lang)) {
      try {
        return `<div class="hl-code"><div class="hl-code-header"><span>${lang}</span></div><div class="hljs"><code>${highLight.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></div></div>`;
      } catch (__) {}
    }

    return `<div class="hl-code"><div class="hl-code-header"><span>${lang}</span></div><div class="hljs"><code>${md.utils.escapeHtml(
      str
    )}</code></div></div>`;
  }
});
function findLastElement(element) {
  if(!element.children.length) {return element;}
  const lastChild = element.children[element.children.length - 1];
  if(lastChild.nodeType === node.ElEMENT_NODE) {
    return findLastElement(lastChild);
  }
  return element;
}

const popRef = ref(null);
const mkHtml = computed(() => {
  if(props.role === "user") {
    return props.content;
  }
  let html = md.render(props.content);
  nextTick(() => {
    if(props.streaming) {
      const parent = popRef.value;
      if(!parent) {return;}
      let lastChild = parent.lastElementChild || parent;
      if (lastChild.tagName === "PRE") {
        lastChild = lastChild.getElementsByClassName("hljs")[0] || lastChild;
      }
      if (lastChild.tagName === "OL") {
        lastChild = findLastElement(lastChild);
      }
      lastChild?.insertAdjacentHTML("beforeend", "<span class=\"input-cursor\"></span>");
    }
  });
  return html;
});
</script>

<style lang="scss" scoped>
.msg-item {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  // padding: 0 24px;

  .msg-content {
    position: relative;
    width: 100%;
    flex: 1 1 auto;

    .msg-pop-container {
      position: relative;
      display: inline-block;
      max-width: 95%;

      .msg-pop-default {
        width: 100%;
        display: inline-block;
        padding: 8px;
        background: #79d1cd;
        border-radius: 4px;
        color: #252724;

        :deep(p) {
          margin-bottom: 0;
          white-space: pre-line;
        }
      }

      .msg-pop-primary {
        background: #409eff;
        color: #fff;
        // white-space: pre-line;
      }
    }
    .msg-pop-container-user {
        float: right;
    }
  }
}

.msg-item-system {
  justify-content: flex-end;
}
</style>
<style lang="scss">
.hl-code {
  margin-top: 1em;
}

.hl-code-header {
  padding: 0 10px;
  color: #abb2bf;
  background: #1d2635;
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hljs {
  padding: 10px;
  overflow-x: auto;
  border-radius: 0 0 4px 4px;

  .input-cursor {
    background: #fff;
    /* fallback for old browsers */
  }
}

.input-cursor {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 1px;
  height: 1em;
  background: #3b414b;
  /* fallback for old browsers */
  padding-left: 0.05em;
  top: 0.1em;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  0% {
    visibility: visible;
  }

  50% {
    visibility: hidden;
  }

  100% {
    visibility: visible;
  }
}
</style>
