<template>
    <div class="container">
        <canvas ref="stampCanvas" width="1000" height="1000"></canvas>
    </div>
  </template>
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { DrawStampUtils } from './DrawStampUtils'
  const stampCanvas = ref<HTMLCanvasElement | null>(null)
  const MM_PER_PIXEL = 10 // 毫米换算像素

  // 初始化绘制印章参数
  let drawStampUtils: DrawStampUtils
  const initDrawStampUtils = () => {
    drawStampUtils = new DrawStampUtils(stampCanvas.value, MM_PER_PIXEL)
    drawStampUtils.refreshStamp()
  }

  const updateDrawConfigs = () => {
    const drawConfigs = drawStampUtils.getDrawConfigs()
    const drawStar: IDrawStar = drawConfigs.drawStar
    drawStar.drawStar = true
    drawStar.starDiameter = 11
    
    drawStampUtils.refreshStamp()
  }

  
  
  onMounted(() => {
    initDrawStampUtils()
  })
  </script>
  <style scoped>
  .container {
    display: flex;
    height: 50%; /* 使用视口高度 */
    overflow: hidden;
  }
  
  .editor-controls {
    width: 300px;
    padding: 10px;
    background-color: #f0f0f0;
    overflow-y: auto; /* 允许垂直滚动 */
    max-height: 70vh; /* 最大高度为视口高度 */
    box-sizing: border-box; /* 确保padding不会增加总宽度 */
  }
  
  .control-group {
    margin-bottom: 15px;
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }
  
  .control-group h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
  }
  
  .editor-controls label {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .editor-controls input[type='text'],
  .editor-controls input[type='number'],
  .editor-controls input[type='range'] {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box; /* 确保padding不会增加总宽度 */
  }
  
  .editor-controls input[type='color'] {
    width: 100%;
    height: 30px;
    padding: 0;
    border: none;
  }
  
  .checkbox-label {
    flex-direction: row !important;
    align-items: center;
  }
  
  .checkbox-label input {
    margin-right: 5px;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  button {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  .canvas-container {
    flex-grow: 1;
    flex-direction: column;
    background-color: aliceblue;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto; /* 允许内容溢出时滚动 */
  }
  
  canvas {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  </style>
  