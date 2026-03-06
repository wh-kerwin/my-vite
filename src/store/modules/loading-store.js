import { defineStore } from "pinia";
import { toValue } from "vue";

export const useLoadingStore = defineStore("loading", () => {
  // 存所有组件的loading状态
  const loadingSources = ref([]);
  
  // 组件用这个注册自己
  const addLoadingSource = (source) => {
    loadingSources.value.push(source);
  };
 
  // 组件卸载时移除
  const removeLoadingSource = (source) => {
    const index = loadingSources.value.indexOf(source);
    if (index > -1) {
      loadingSources.value.splice(index, 1);
    }
  };
  
  // 关键：只要有一个组件在loading，就返回true
  const isLoading = computed(() =>
    loadingSources.value.some(source => toValue(source))
  );
  
  // 监听变化，自动显示/隐藏
  watch(isLoading, (loading) => {
    if (loading) {
      // 显示Element Plus的全屏loading
      ElLoading.service({ fullscreen: true });
    } else {
      // 所有加载都完成了，关闭
      // 这里需要稍微处理下实例引用，简单起见先这么写
    }
  });
  
  return { addLoadingSource, removeLoadingSource };
});

/* 
<script setup>
import { ref } from 'vue'
import { useLoadingStore } from './loading-store'

const loadingStore = useLoadingStore()
const myLoading = ref(false) // 这是我自己的loading状态

// 注册一下，告诉store“我的状态你帮忙盯着”
loadingStore.addLoadingSource(myLoading)

const fetchData = async () => {
    myLoading.value = true // 就改自己的状态就行
    try {
        await api.getData()
    } finally {
        myLoading.value = false // 完成就关
    }
}

// 组件卸载时记得清理（重要！）
onBeforeUnmount(() => {
    loadingStore.removeLoadingSource(myLoading)
})
</script>
*/