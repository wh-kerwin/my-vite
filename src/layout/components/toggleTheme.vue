<template>
  <div ref="container" class="theme-container">
    <button class="toggle-theme" @click="toggleTheme">
      <el-icon :size="20" class="icon">
        <Moon v-if="!isDark" />
        <Sunny v-else />
      </el-icon>
    </button>
  </div>
</template>

<script setup>
import useThemeStore from "@/store/modules/theme";
import { Moon, Sunny } from "@element-plus/icons-vue";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

// 获取容器引用
const container = ref(null);

// 主题切换函数
const toggleTheme = (event) => {
  // 获取点击位置坐标
  const x = event.clientX;
  const y = event.clientY;
  
  // 计算结束半径（从点击位置到屏幕最远点的距离）
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  // 兼容性处理：如果浏览器不支持 View Transitions API，则直接切换主题
  if (!document.startViewTransition) {
    themeStore.toggleTheme();
    return;
  }

  // 使用 View Transitions API 创建过渡效果
  const transition = document.startViewTransition(async () => {
    themeStore.toggleTheme();
  });

  // 过渡准备就绪后，执行动画
  transition.ready.then(() => {
    // 定义圆形裁剪路径
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    
    // 根据当前主题状态决定动画方向
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: "ease-in",
        fill: "forwards",
        pseudoElement: isDark.value
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      }
    );
  });
};
</script>

<style scoped>
.theme-container {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  height: 100%;
}

.toggle-theme {
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;
  color: hsl(var(--foreground) / 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-theme:hover {
  background-color: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
}

.icon {
  font-size: 20px;
}
</style>