<template>
    <div class="screen3D-container">
        <div class="scan-line"></div>
        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
        
        <div id="scene"></div>
        
        <div class="chart-wrapper">
          <div class="title-wrapper">
            <div class="title-content">
              <span class="title-text">CITY DATA</span>
              <span class="title-sub">城市数据可视化</span>
            </div>
            <div id="currentTime" class="time-display"></div>
          </div>
          
          <div class="left-wrapper">
            <div class="chart-card">
              <div class="card-header">
                <span class="card-title">能源消耗</span>
                <div class="card-indicator"></div>
              </div>
              <LineCharts style="height: calc(100% - 37px)" />
            </div>
            <div class="chart-card">
              <div class="card-header">
                <span class="card-title">设备在线</span>
                <div class="card-indicator"></div>
              </div>
              <PieCharts style="height: calc(100% - 37px)" />
            </div>
            <div class="chart-card">
              <div class="card-header">
                <span class="card-title">区域统计</span>
                <div class="card-indicator"></div>
              </div>
              <BarCharts style="height: calc(100% - 37px)" />
            </div>
          </div>
          
          <div class="right-wrapper">
            <div class="chart-card">
              <div class="card-header">
                <span class="card-title">实时流量</span>
                <div class="card-indicator"></div>
              </div>
              <WaterCharts style="height: calc(100% - 37px)" />
            </div>
            <div class="chart-card">
              <div class="card-header">
                <span class="card-title">任务分布</span>
                <div class="card-indicator"></div>
              </div>
              <ScatterCharts style="height: calc(100% - 37px)" />
            </div>
            <div class="chart-card">
              <div class="card-header">
                <span class="card-title">权重分析</span>
                <div class="card-indicator"></div>
              </div>
              <RadarCharts style="height: calc(100% - 37px)" />
            </div>
          </div>
          
          <div class="bottom-wrapper">
            <div
              v-for="(item, index) in datas" :key="index" 
              class="tagItem" 
              :style="{ '--delay': index * 0.1 + 's' }"
              @click="moveTo(item.position)">
                <div class="tag-icon"></div>
                <span class="tag-text">{{ item.text }}</span>
            </div>
          </div>
        </div>
    </div>
</template>

<script setup>
import Screen from "./index";
import LineCharts from "./components/lineChart.vue";
import PieCharts from "./components/pieChart.vue";
import BarCharts from "./components/barChart.vue";
import WaterCharts from "./components/waterChart.vue";
import RadarCharts from "./components/radarChart.vue";
import ScatterCharts from "./components/scatterChart.vue";
import { onMounted, ref, onUnmounted } from "vue";

const sceneObject = ref(null);
let timeInterval = null;

const datas = [
  { text: "东方明珠", position: {x: -521, y: 161, z: 1342} },
  { text: "陆家嘴", position: {x: -374.9514172359461, y: 97.65854415606516, z: 539.1217592715113} },
  { text: "新天地", position: {x: -217.44272941156635, y: 41.237777709960966, z: 203.11301542389742} },
  { text: "松江大学城", position: {x: -282.8620062878682, y: 204.1691591314717, z: -634.8093208130131} },
  { text: "人民广场", position: {x: -20, y: 46, z: -39} },
  { text: "上海迪士尼", position: {x: -214.411227864534, y: 115.2371717529303, z: -105.901227864534} },
  { text: "宝山区", position: {x: 618.3054998026594, y: 34.94658279418956, z: -145.98597071841232} },
];

const updateTime = () => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("zh-CN", { hour12: false });
  const dateStr = now.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  document.getElementById("currentTime").innerHTML = `${dateStr} <span class="time-sep">/</span> ${timeStr}`;
};

onMounted(() => {
  sceneObject.value = new Screen("#scene");
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});

const moveTo = (position) => {
  sceneObject.value.flyto(position, {
    distance: 500,
    height: 300,
    angle: 45,
    duration: 2000
  });
};
</script>

<style lang="scss" scoped>
:deep(.tag) {
  position: absolute;
  padding: 8px 16px;
  font-size: 13px;
  font-family: 'Orbitron', 'Arial Black', monospace;
  color: #00f5ff;
  background: rgba(0, 15, 35, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 245, 255, 0.4);
  border-left: 3px solid #00f5ff;
  box-shadow: 
    0 0 20px rgba(0, 245, 255, 0.3),
    inset 0 0 20px rgba(0, 245, 255, 0.1);
  animation: tag-pulse 2s ease-in-out infinite;
}

@keyframes tag-pulse {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(0, 245, 255, 0.3),
      inset 0 0 20px rgba(0, 245, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(0, 245, 255, 0.6),
      inset 0 0 30px rgba(0, 245, 255, 0.2);
  }
}

.screen3D-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #050a14;
  overflow: hidden;
  font-family: 'Share Tech Mono', 'Courier New', monospace;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at 50% 50%, rgba(0, 245, 255, 0.03) 0%, transparent 70%),
      radial-gradient(ellipse at 30% 70%, rgba(139, 0, 255, 0.02) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 30%, rgba(255, 0, 128, 0.02) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(0, 245, 255, 0.5), 
      transparent
    );
    animation: scan 4s linear infinite;
    z-index: 2;
  }

  @keyframes scan {
    0% { top: 0; opacity: 1; }
    50% { opacity: 0.3; }
    100% { top: 100%; opacity: 1; }
  }

  .corner-decoration {
    position: absolute;
    width: 80px;
    height: 80px;
    pointer-events: none;
    z-index: 3;
    
    &::before, &::after {
      content: '';
      position: absolute;
      background: #00f5ff;
      box-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
    }

    &.top-left {
      top: 20px;
      left: 20px;
      &::before { width: 40px; height: 2px; top: 0; left: 0; }
      &::after { width: 2px; height: 40px; top: 0; left: 0; }
    }
    &.top-right {
      top: 20px;
      right: 20px;
      &::before { width: 40px; height: 2px; top: 0; right: 0; }
      &::after { width: 2px; height: 40px; top: 0; right: 0; }
    }
    &.bottom-left {
      bottom: 20px;
      left: 20px;
      &::before { width: 40px; height: 2px; bottom: 0; left: 0; }
      &::after { width: 2px; height: 40px; bottom: 0; left: 0; }
    }
    &.bottom-right {
      bottom: 20px;
      right: 20px;
      &::before { width: 40px; height: 2px; bottom: 0; right: 0; }
      &::after { width: 2px; height: 40px; bottom: 0; right: 0; }
    }
  }

  .chart-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 10;

    .title-wrapper {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      pointer-events: auto;

      .title-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .title-text {
          font-family: 'Orbitron', 'Arial Black', sans-serif;
          font-size: 48px;
          font-weight: 900;
          letter-spacing: 12px;
          background: linear-gradient(180deg, #00f5ff 0%, #8b00ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 
            0 0 30px rgba(0, 245, 255, 0.5),
            0 0 60px rgba(139, 0, 255, 0.3);
          animation: title-glow 3s ease-in-out infinite;
        }

        .title-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          letter-spacing: 6px;
          color: rgba(0, 245, 255, 0.6);
          text-transform: uppercase;
        }
      }

      .time-display {
        font-family: 'Orbitron', monospace;
        font-size: 16px;
        color: #00f5ff;
        letter-spacing: 2px;
        opacity: 0.7;
        
        .time-sep {
          margin: 0 8px;
          opacity: 0.5;
        }
      }
    }

    @keyframes title-glow {
      0%, 100% {
        text-shadow: 
          0 0 30px rgba(0, 245, 255, 0.5),
          0 0 60px rgba(139, 0, 255, 0.3);
      }
      50% {
        text-shadow: 
          0 0 50px rgba(0, 245, 255, 0.8),
          0 0 100px rgba(139, 0, 255, 0.5);
      }
    }

    .left-wrapper, .right-wrapper {
      position: absolute;
      top: 10px;
      bottom: 10px;
      width: 340px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      pointer-events: auto;
    }

    .left-wrapper {
      left: 20px;
    }

    .right-wrapper {
      right: 20px;
    }

    .chart-card {
      flex: 1;
      background: rgba(5, 10, 20, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 245, 255, 0.2);
      border-left: 3px solid #00f5ff;
      border-radius: 0;
      overflow: hidden;
      animation: card-appear 0.5s ease-out both;
      animation-delay: var(--delay, 0s);
      box-shadow: 
        0 0 30px rgba(0, 245, 255, 0.1),
        inset 0 0 30px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(0, 245, 255, 0.5), 
          transparent
        );
      }

      &:hover {
        border-color: rgba(0, 245, 255, 0.6);
        box-shadow: 
          0 0 50px rgba(0, 245, 255, 0.2),
          inset 0 0 40px rgba(0, 0, 0, 0.4);
        transform: translateX(-5px);
      }

      .card-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: rgba(0, 245, 255, 0.05);
        border-bottom: 1px solid rgba(0, 245, 255, 0.2);

        .card-title {
          font-family: 'Orbitron', 'Arial Black', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          color: #00f5ff;
          text-transform: uppercase;
        }

        .card-indicator {
          width: 8px;
          height: 8px;
          background: #00f5ff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 245, 255, 0.8);
          animation: indicator-blink 2s ease-in-out infinite;
        }
      }

      @keyframes indicator-blink {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(0.8); }
      }
    }

    @keyframes card-appear {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .right-wrapper .chart-card {
      border-left: none;
      border-right: 3px solid #8b00ff;
      animation: card-appear-right 0.5s ease-out both;

      &::before {
        background: linear-gradient(90deg, 
          transparent, 
          rgba(139, 0, 255, 0.5), 
          transparent
        );
      }

      .card-title {
        color: #ff00c8;
      }

      .card-indicator {
        background: #ff00c8;
        box-shadow: 0 0 10px rgba(255, 0, 200, 0.8);
      }

      &:hover {
        border-color: rgba(139, 0, 255, 0.6);
        box-shadow: 
          0 0 50px rgba(139, 0, 255, 0.2),
          inset 0 0 40px rgba(0, 0, 0, 0.4);
        transform: translateX(5px);
      }
    }

    @keyframes card-appear-right {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .bottom-wrapper {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      pointer-events: auto;

      .tagItem {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background: rgba(5, 10, 20, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 245, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: tag-appear 0.5s ease-out both;
        animation-delay: var(--delay);

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(0, 245, 255, 0.1) 0%, 
            transparent 50%
          );
          pointer-events: none;
        }

        .tag-icon {
          width: 6px;
          height: 6px;
          background: #00f5ff;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(0, 245, 255, 0.8);
        }

        .tag-text {
          font-family: 'Orbitron', 'Arial Black', sans-serif;
          font-size: 12px;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
        }

        &:hover {
          background: rgba(0, 245, 255, 0.15);
          border-color: rgba(0, 245, 255, 0.8);
          transform: translateY(-5px);
          box-shadow: 
            0 10px 30px rgba(0, 245, 255, 0.3),
            inset 0 0 20px rgba(0, 245, 255, 0.1);

          .tag-icon {
            background: #ff00c8;
            box-shadow: 0 0 8px rgba(255, 0, 200, 0.8);
          }
        }
      }
    }

    @keyframes tag-appear {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}
</style>
