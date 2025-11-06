<template>  
  <div class="canvas-container">
    <div class="canvasWrapper">
        <canvas ref="lowerCanvasRef" width="650" height="650"></canvas>  
        <canvas ref="upperCanvasRef" width="650" height="650" class="upperCanvas"></canvas>
    </div>
    <div>
        <div class="flex-div">
            <el-select v-model="BrushSize" style="width: 100px">
                <el-option label="5" value="5" />
                <el-option label="10" value="10" />
                <el-option label="15" value="15" />
            </el-select>
            <el-button type="primary" @click="toggleBrush">画笔</el-button>
        </div>
        <div class="flex-div">
            <el-select v-model="EraserSize" style="width: 100px">
                <el-option label="5" value="5" />
                <el-option label="10" value="10" />
                <el-option label="20" value="20" />
            </el-select>
            <el-button type="primary" @click="toggleEraser">橡皮擦</el-button> 
        </div> 
        <el-button @click="exportCanvas">导出图片</el-button>
        <div id="imgs"></div>
    </div>
    
  </div>  
</template>  
  
<script setup>
import canvasImg from "@/assets/jpg/7.jpeg";
import {ref, onMounted, reactive} from "vue";

// eslint-disable-next-line no-unused-vars
const fileInfo = reactive({});
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
// const imgMarker = new Image();
const isDrawing = ref(false);

    
const drawUpperMask = () => {
  // 绘制黑白mask图片 
  upperCtx.value.fillStyle = "#000";
  upperCanvasRef.value.width = imgWidth.value;
  upperCanvasRef.value.height = imgHeight.value;
  upperCtx.value.fillRect(0, 0, imgWidth.value, imgHeight.value);
  // imgMarker.src = fileInfo.value.base64;
  // imgMarker.onload = () => {
  //   upperCanvasRef.value.width = imgWidth.value;
  //   upperCanvasRef.value.height = imgHeight.value;
  //   upperCtx.value.drawImage(imgMarker, 0, 0, imgWidth.value, imgHeight.value);
  // };  
  // // 添加一个定时器，确保图片加载完成后再调用 drawImage 方法
  // setTimeout(() => {
  //   if (imgMarker.complete) {
  //     upperCtx.value.drawImage(imgMarker, 0, 0, imgWidth.value, imgHeight.value);
  //   }
  // }, 100);
};

const drawLowerImage = () => {
  // const img = new Image();
  // img.src = canvasImg;
  // let scaledWidth, scaledHeight;
  // img.onload = () => {
  //   const ratio = img.width / img.height;
  //   if (lowerCanvasRef.value.width / ratio <= lowerCanvasRef.value.height) {
  //     // 如果图片的宽高比使得宽度能够适应 canvas，则按照宽度缩放
  //     scaledWidth = lowerCanvasRef.value.width;
  //     scaledHeight = lowerCanvasRef.value.width / ratio;
  //   } else {
  //     // 否则按照高度缩放
  //     scaledWidth = lowerCanvasRef.value.height * ratio;
  //     scaledHeight = lowerCanvasRef.value.height;
  //   }
  //   imgWidth.value = scaledWidth;
  //   imgHeight.value = scaledHeight;
  //   contextLower.value.drawImage(img, 0, 0, scaledWidth, scaledHeight);
  // };  
  // // 添加一个定时器，确保图片加载完成后再调用 drawImage 方法
  // setTimeout(() => {
  //   if (img.complete) {
  //     contextLower.value.drawImage(img, 0, 0, scaledWidth, scaledHeight);
  //     drawUpperMask();
  //   }
  // }, 100);
  const img = new Image();
  img.src = canvasImg;
  img.onload = () => {
    lowerCanvasRef.value.width = img.width;
    lowerCanvasRef.value.height = img.height;
    imgWidth.value = img.width;
    imgHeight.value = img.height;
    lowerCtx.value.drawImage(img, 0, 0, imgWidth.value, imgHeight.value);
  };  
  // 添加一个定时器，确保图片加载完成后再调用 drawImage 方法
  setTimeout(() => {
    if (img.complete) {
      lowerCtx.value.drawImage(img, 0, 0, imgWidth.value, imgHeight.value);
      drawUpperMask();
    }
  }, 100);
};
    
const clearArea = (x, y, radius) => {
  const ctx = upperCtx.value;
  ctx.globalCompositeOperation = eraser.value ? "destination-out" : "source-over"; // 设置为擦除模式
  ctx.strokeStyle = eraser.value ? "white" : "black";
  ctx.lineWidth = lineWidth.value;
  ctx.beginPath();
  if(eraser.value) {
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
  clearArea(e.clientX - pos.left, e.clientY - pos.top, lineWidth.value); // 擦除半径为 20 的区域
};
  
/* const draw = (e) => {
  if (!isDrawing.value) {return;}
  const pos = e.target.getBoundingClientRect();
  clearArea(e.clientX - pos.left, e.clientY - pos.top, lineWidth.value);
}; */
  
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
  //const upperImageData = contextUpper.value.getImageData(0, 0, upperCanvasRef.value.width, upperCanvasRef.value.height);
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
  // console.log("导出成功", link);
};

const state = reactive({
  isDrawing: false,
  lastX: 0,
  lastY: 0,
  lineWidth: 10,
  eraser: true,
  BrushSize: "5",
  EraserSize: "10"
});


const draw = (e) => {
  if (!state.isDrawing) {return;}
  const pos = e.target.getBoundingClientRect();
  clearArea(e.clientX - pos.left, e.clientY - pos.top, state.lineWidth);
};

const initCanvas = () => {
  const lowerCanvas = lowerCanvasRef.value;
  const upperCanvas = upperCanvasRef.value;
  lowerCtx.value = lowerCanvas.getContext("2d");
  upperCtx.value = upperCanvas.getContext("2d");
  
  upperCanvas.addEventListener("mousedown", startDraw);
  upperCanvas.addEventListener("mousemove", draw);
  upperCanvas.addEventListener("mouseup", stopDraw);
  upperCanvas.addEventListener("mouseleave", stopDraw); // 添加鼠标离开事件
};

onMounted(() => {
  initCanvas();
  drawLowerImage();
});

onUnmounted(() => {
  // 清理事件监听
  const upperCanvas = upperCanvasRef.value;
  upperCanvas.removeEventListener("mousedown", startDraw);
  upperCanvas.removeEventListener("mousemove", draw);
  upperCanvas.removeEventListener("mouseup", stopDraw);
  upperCanvas.removeEventListener("mouseleave", stopDraw);
});
</script>

<style lang="scss" scoped>
    .canvas-container { 
        display: flex;
        align-items: flex-start;
    }

    .canvasWrapper {
        position: relative;
    }
    .upperCanvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        opacity: 0.6;
    }

    .flex-div {
        display: flex;
        margin-bottom: 10px;

        .el-button {
            margin-left: 5px;
        }
    }
</style>