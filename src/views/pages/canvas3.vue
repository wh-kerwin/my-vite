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
      <button @click="getPointsCoordinates">Get Points Coordinates</button>
    </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import canvasImg from "@/assets/jpg/7.jpeg";
// import { login } from "@/api/useRequest";

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

let isDragging = false;
let currentPointIndex = -1;
let initialPointPosition = null;

const redrawCanvas = () => {
  const canvas = canvasRef.value;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
};

const drawLowerImage = () => {
  const img = new Image();
  img.src = canvasImg;
  // 根据 canvas 的尺寸和宽高比计算缩放后的图片尺寸
  let scaledWidth, scaledHeight;
  img.onload = () => {
    const ratio = img.width / img.height;
    if (lowerCanvasRef.value.width / ratio <= lowerCanvasRef.value.height) {
      // 如果图片的宽高比使得宽度能够适应 canvas，则按照宽度缩放
      scaledWidth = lowerCanvasRef.value.width;
      scaledHeight = lowerCanvasRef.value.width / ratio;
    } else {
      // 否则按照高度缩放
      scaledWidth = lowerCanvasRef.value.height * ratio;
      scaledHeight = lowerCanvasRef.value.height;
    }
    imgWidth.value = scaledWidth;
    imgHeight.value = scaledHeight;
    contextLower.value.drawImage(img, 0, 0, scaledWidth, scaledHeight);
  };  
  // 添加一个定时器，确保图片加载完成后再调用 drawImage 方法
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

    // 检查新位置是否超出 canvas 边界，并进行限制
    // const canvasWidth = canvasRef.value.width;
    // const canvasHeight = canvasRef.value.height;
    const canvasWidth = imgWidth.value;
    const canvasHeight = imgHeight.value;

    if (newX < 0) {
      newX = 0; // 如果超出左侧边界，限制在左侧
    } else if (newX > canvasWidth) {
      newX = canvasWidth; // 如果超出右侧边界，限制在右侧
    }

    if (newY < 0) {
      newY = 0; // 如果超出上侧边界，限制在上侧
    } else if (newY > canvasHeight) {
      newY = canvasHeight; // 如果超出下侧边界，限制在下侧
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
    initialPointPosition = { x: points[index].x + 230, y: points[index].y + 70 };
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", stopDragging);
  }
};

const getPointsCoordinates = () => {
  let pointsArr = [];
  for(let i in points) {
    if (points.hasOwnProperty(i)) {
      pointsArr.push([points[i].x, points[i].y]);
    }
  }
  // console.log("Points Coordinates:", pointsArr);
  ElMessageBox.alert(`坐标: ${pointsArr}`, "Title", {
    confirmButtonText: "OK"
  });

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
}
.canvasWrapper {
  position: relative;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.drag-point {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-5px, -5px);
  z-index: 2;
}
</style>