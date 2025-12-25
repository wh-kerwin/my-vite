<template>  
  <div class="canvas-container">
    <div class="canvasWrapper">
        <canvas ref="lowerCanvasRef" width="650" height="650"></canvas>  
        <canvas ref="upperCanvasRef" width="650" height="650" class="upperCanvas"></canvas>
    </div>
    <div class="controls">
        <div class="control-group">
            <span class="label">画笔大小:</span>
            <el-select v-model="BrushSize" style="width: 100px">
                <el-option label="5" value="5" />
                <el-option label="10" value="10" />
                <el-option label="15" value="15" />
            </el-select>
            <el-button type="primary" :class="{ active: !eraser }" @click="toggleBrush">画笔</el-button>
        </div>
        <div class="control-group">
            <span class="label">橡皮擦大小:</span>
            <el-select v-model="EraserSize" style="width: 100px">
                <el-option label="5" value="5" />
                <el-option label="10" value="10" />
                <el-option label="20" value="20" />
            </el-select>
            <el-button type="primary" :class="{ active: eraser }" @click="toggleEraser">橡皮擦</el-button> 
        </div> 
        <el-button type="success" @click="exportCanvas">导出图片</el-button>
    </div>
  </div>  
</template>  
  
<script setup>
import canvasImg from "@/assets/jpg/7.jpeg";
import { ref, onMounted, onUnmounted } from "vue";

const lowerCanvasRef = ref(null);
const upperCanvasRef = ref(null);
const lowerCtx = ref(null);
const upperCtx = ref(null);
const imgWidth = ref(650);
const imgHeight = ref(650);
const lastX = ref(0);
const lastY = ref(0);
const lineWidth = ref(10);
const eraser = ref(true);
const BrushSize = ref("5");
const EraserSize = ref("10");
const isDrawing = ref(false);

const drawUpperMask = () => {
  upperCtx.value.fillStyle = "#000";
  upperCanvasRef.value.width = imgWidth.value;
  upperCanvasRef.value.height = imgHeight.value;
  upperCtx.value.fillRect(0, 0, imgWidth.value, imgHeight.value);
};

const drawLowerImage = () => {
  const img = new Image();
  img.src = canvasImg;
  img.onload = () => {
    lowerCanvasRef.value.width = img.width;
    lowerCanvasRef.value.height = img.height;
    imgWidth.value = img.width;
    imgHeight.value = img.height;
    lowerCtx.value.drawImage(img, 0, 0, imgWidth.value, imgHeight.value);
  };  
  setTimeout(() => {
    if (img.complete) {
      lowerCtx.value.drawImage(img, 0, 0, imgWidth.value, imgHeight.value);
      drawUpperMask();
    }
  }, 100);
};
    
const clearArea = (x, y, radius) => {
  const ctx = upperCtx.value;
  ctx.globalCompositeOperation = eraser.value ? "destination-out" : "source-over";
  ctx.strokeStyle = eraser.value ? "white" : "black";
  ctx.lineWidth = lineWidth.value;
  ctx.beginPath();
  if (eraser.value) {
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    ctx.moveTo(lastX.value, lastY.value);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  lastX.value = x;
  lastY.value = y;
};

const startDraw = (e) => {
  const pos = e.target.getBoundingClientRect();
  isDrawing.value = true;
  lastX.value = e.clientX - pos.left;
  lastY.value = e.clientY - pos.top;
  clearArea(e.clientX - pos.left, e.clientY - pos.top, lineWidth.value / 2);
};
  
const draw = (e) => {
  if (!isDrawing.value) {return;}
  const pos = e.target.getBoundingClientRect();
  clearArea(e.clientX - pos.left, e.clientY - pos.top, lineWidth.value / 2);
};
  
const stopDraw = () => {
  isDrawing.value = false;
};

const toggleBrush = () => {
  eraser.value = false;
  lineWidth.value = Number(BrushSize.value);
};

const toggleEraser = () => {
  eraser.value = true;
  lineWidth.value = Number(EraserSize.value);
};
    
const exportCanvas = () => {
  const canvas = document.createElement("canvas");    
  const ctx = canvas.getContext("2d");
  canvas.width = lowerCanvasRef.value.width;
  canvas.height = lowerCanvasRef.value.height;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  upperCanvasRef.value.style.opacity = 1;
  ctx.drawImage(upperCanvasRef.value, 0, 0);

  const image = new Image();
  image.src = canvas.toDataURL("image/png");
        
  const link = document.createElement("a");
  link.href = image.src;
  link.download = "exported-image.png";
  document.body.appendChild(link);
  link.click();
  upperCanvasRef.value.style.opacity = 0.6;
  document.body.removeChild(link);
};

const initCanvas = () => {
  const lowerCanvas = lowerCanvasRef.value;
  const upperCanvas = upperCanvasRef.value;
  lowerCtx.value = lowerCanvas.getContext("2d");
  upperCtx.value = upperCanvas.getContext("2d");
  
  upperCanvas.addEventListener("mousedown", startDraw);
  upperCanvas.addEventListener("mousemove", draw);
  upperCanvas.addEventListener("mouseup", stopDraw);
  upperCanvas.addEventListener("mouseleave", stopDraw);
};

onMounted(() => {
  initCanvas();
  drawLowerImage();
});

onUnmounted(() => {
  const upperCanvas = upperCanvasRef.value;
  if (upperCanvas) {
    upperCanvas.removeEventListener("mousedown", startDraw);
    upperCanvas.removeEventListener("mousemove", draw);
    upperCanvas.removeEventListener("mouseup", stopDraw);
    upperCanvas.removeEventListener("mouseleave", stopDraw);
  }
});
</script>


<style lang="scss" scoped>
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

.upperCanvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0.6;
    cursor: crosshair;
}

.controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 8px;

    .label {
        font-size: 14px;
        color: #606266;
        white-space: nowrap;
    }

    .el-button {
        margin-left: 5px;
        
        &.active {
            background-color: #409eff;
            border-color: #409eff;
        }
    }
}
</style>