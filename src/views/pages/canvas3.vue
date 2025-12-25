<template>
    <div class="canvas-container">
      <div class="canvasWrapper">
        <canvas ref="lowerCanvasRef" width="650" height="650"></canvas>  
        <canvas ref="canvasRef" class="canvas" width="650" height="650"></canvas>
        <div
            v-for="(point, index) in points"
            :key="index"
            class="drag-point"
            :style="{ left: point.x + 'px', top: point.y + 'px' }"
            @mousedown="startDragging(index)"
        ></div>
      </div>
      <div class="controls">
        <el-button type="primary" @click="getPointsCoordinates">获取坐标</el-button>
        <el-button @click="resetPoints">重置点</el-button>
        <el-button @click="addPoint">添加点</el-button>
      </div>
    </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import canvasImg from "@/assets/jpg/7.jpeg";

const lowerCanvasRef = ref(null);
const contextLower = ref(null);
const imgWidth = ref(650);
const imgHeight = ref(650);
const canvasRef = ref(null);
const points = reactive([
  { x: 50, y: 50 },
  { x: 100, y: 30 },
  { x: 160, y: 100 },
  { x: 150, y: 150 },
  { x: 50, y: 150 },
]);

const initialPoints = JSON.parse(JSON.stringify(points));

let isDragging = false;
let currentPointIndex = -1;
let initialPointPosition = null;

const redrawCanvas = () => {
  const canvas = canvasRef.value;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = "#409eff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }
};

const drawLowerImage = () => {
  const img = new Image();
  img.src = canvasImg;
  let scaledWidth, scaledHeight;
  img.onload = () => {
    const ratio = img.width / img.height;
    if (lowerCanvasRef.value.width / ratio <= lowerCanvasRef.value.height) {
      scaledWidth = lowerCanvasRef.value.width;
      scaledHeight = lowerCanvasRef.value.width / ratio;
    } else {
      scaledWidth = lowerCanvasRef.value.height * ratio;
      scaledHeight = lowerCanvasRef.value.height;
    }
    imgWidth.value = scaledWidth;
    imgHeight.value = scaledHeight;
    contextLower.value.drawImage(img, 0, 0, scaledWidth, scaledHeight);
  };  
  setTimeout(() => {
    if (img.complete) {
      contextLower.value.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    }
  }, 100);
};

const onDragging = (event) => {
  if (currentPointIndex >= 0) {
    const deltaX = event.clientX - initialPointPosition.x;
    const deltaY = event.clientY - initialPointPosition.y;
    let newX = points[currentPointIndex].x + deltaX;
    let newY = points[currentPointIndex].y + deltaY;

    const canvasWidth = canvasRef.value.width;
    const canvasHeight = canvasRef.value.height;

    if (newX < 0) {
      newX = 0;
    } else if (newX > canvasWidth) {
      newX = canvasWidth;
    }

    if (newY < 0) {
      newY = 0;
    } else if (newY > canvasHeight) {
      newY = canvasHeight;
    }

    points[currentPointIndex].x = newX;
    points[currentPointIndex].y = newY;
    initialPointPosition = { x: event.clientX, y: event.clientY };
    redrawCanvas();
  }
};

const stopDragging = () => {
  if (isDragging) {
    isDragging = false;
    currentPointIndex = -1;
    document.removeEventListener("mousemove", onDragging);
    document.removeEventListener("mouseup", stopDragging);
  }
};

const startDragging = (index) => {
  if (!isDragging) {
    isDragging = true;
    currentPointIndex = index;
    const rect = canvasRef.value.getBoundingClientRect();
    initialPointPosition = { x: points[index].x + rect.left, y: points[index].y + rect.top };
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", stopDragging);
  }
};

const getPointsCoordinates = () => {
  const pointsArr = points.map(p => [Math.round(p.x), Math.round(p.y)]);
  ElMessageBox.alert(
    `<div style="text-align: left; max-height: 300px; overflow-y: auto;">
      ${pointsArr.map((p, i) => `点 ${i + 1}: (${p[0]}, ${p[1]})`).join("<br>")}
    </div>`, 
    "坐标信息", 
    {
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }
  );
};

const resetPoints = () => {
  points.length = 0;
  initialPoints.forEach(p => points.push({ ...p }));
  redrawCanvas();
};

const addPoint = () => {
  if (points.length < 20) {
    const lastPoint = points[points.length - 1];
    const newPoint = {
      x: Math.min(lastPoint.x + 30, 600),
      y: Math.min(lastPoint.y + 30, 600)
    };
    points.push(newPoint);
    redrawCanvas();
  } else {
    ElMessageBox.alert("最多只能添加20个点", "提示", {
      confirmButtonText: "确定"
    });
  }
};

onMounted(() => {
  contextLower.value = lowerCanvasRef.value.getContext("2d");
  drawLowerImage(); 
  redrawCanvas();
});
</script>


<style scoped>
.canvas-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.canvasWrapper {
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.drag-point {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: #409eff;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.3);
    background-color: #66b1ff;
    box-shadow: 0 4px 8px rgba(64, 158, 255, 0.4);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .el-button {
    min-width: 120px;
  }
}
</style>