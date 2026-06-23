<template>
  <div class="signature-pad-container">
    <div class="signature-pad-header">
      <h3>{{ t('certificate.signature.title') }}</h3>
      <div class="signature-tabs">
        <button
          class="tab-button"
          :class="{ active: mode === 'draw' }"
          @click="mode = 'draw'"
        >
          {{ t('certificate.signature.draw') }}
        </button>
        <button
          class="tab-button"
          :class="{ active: mode === 'upload' }"
          @click="mode = 'upload'"
        >
          {{ t('certificate.signature.upload') }}
        </button>
      </div>
    </div>

    <div class="signature-pad-content">
      <!-- 手写签名模式 -->
      <div v-show="mode === 'draw'" class="draw-mode">
        <div class="canvas-container">
          <canvas
            ref="canvasRef"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart="startDrawing"
            @touchmove="draw"
            @touchend="stopDrawing"
          ></canvas>
        </div>
        <div class="canvas-controls">
          <button class="control-btn" @click="clearCanvas">
            {{ t('certificate.signature.clear') }}
          </button>
          <button class="control-btn" @click="undo">
            {{ t('certificate.signature.undo') }}
          </button>
          <label class="control-label">
            {{ t('certificate.signature.penWidth') }}:
            <input
              type="range"
              v-model.number="penWidth"
              min="1"
              max="10"
              step="0.5"
            />
            <span>{{ penWidth }}px</span>
          </label>
          <label class="control-label">
            {{ t('certificate.signature.color') }}:
            <input type="color" v-model="penColor" />
          </label>
        </div>
      </div>

      <!-- 上传图片模式 -->
      <div v-show="mode === 'upload'" class="upload-mode">
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            style="display: none"
          />
          <div v-if="!uploadedImage" class="upload-placeholder">
            <p>{{ t('certificate.signature.uploadHint') }}</p>
            <p class="upload-hint-small">{{ t('certificate.signature.uploadHintSmall') }}</p>
          </div>
          <div v-else class="uploaded-preview">
            <img :src="uploadedImage" alt="Uploaded signature" />
            <button class="remove-btn" @click.stop="removeUploadedImage">
              {{ t('certificate.signature.remove') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="signature-pad-footer">
      <button class="btn-secondary" @click="cancel">
        {{ t('certificate.signature.cancel') }}
      </button>
      <button class="btn-primary" @click="confirm" :disabled="!hasSignature">
        {{ t('certificate.signature.confirm') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ISignatureData } from '../../CertificateTypes'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'confirm', data: ISignatureData): void
  (e: 'cancel'): void
}>()

const props = defineProps<{
  initialData?: ISignatureData | null
}>()

// 模式：draw 或 upload
const mode = ref<'draw' | 'upload'>('draw')

// Canvas 相关
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const penWidth = ref(3)
const penColor = ref('#000000')
const drawingHistory: ImageData[] = []

// 上传相关
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadedImage = ref<string | null>(null)

// 计算是否有签名
const hasSignature = computed(() => {
  if (mode.value === 'draw') {
    return drawingHistory.length > 0
  } else {
    return uploadedImage.value !== null
  }
})

// 初始化Canvas
onMounted(() => {
  initCanvas()
  if (props.initialData) {
    loadInitialData(props.initialData)
  }
})

// 监听模式切换
watch(mode, () => {
  if (mode.value === 'draw') {
    setTimeout(() => {
      initCanvas()
      if (props.initialData && props.initialData.type === 'canvas') {
        loadInitialData(props.initialData)
      }
    }, 0)
  }
})

// 初始化Canvas
const initCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置Canvas尺寸
  const rect = canvas.parentElement?.getBoundingClientRect()
  if (rect) {
    canvas.width = rect.width
    canvas.height = rect.height * 0.6
  } else {
    canvas.width = 600
    canvas.height = 200
  }

  // 设置样式
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = penColor.value
  ctx.lineWidth = penWidth.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

// 开始绘制
const startDrawing = (e: MouseEvent | TouchEvent) => {
  if (!canvasRef.value) return

  isDrawing.value = true
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const point = getEventPoint(e)
  ctx.beginPath()
  ctx.moveTo(point.x, point.y)

  // 保存当前状态
  saveState()
}

// 绘制
const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || !canvasRef.value) return

  e.preventDefault()
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const point = getEventPoint(e)
  ctx.lineTo(point.x, point.y)
  ctx.stroke()
}

// 停止绘制
const stopDrawing = () => {
  isDrawing.value = false
}

// 获取事件坐标
const getEventPoint = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
  if (!canvasRef.value) return { x: 0, y: 0 }

  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()

  if (e instanceof MouseEvent) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  } else {
    const touch = e.touches[0] || e.changedTouches[0]
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }
  }
}

// 保存状态（用于撤销）
const saveState = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  drawingHistory.push(imageData)
}

// 清空画布
const clearCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawingHistory.length = 0
}

// 撤销
const undo = () => {
  if (drawingHistory.length <= 1) {
    clearCanvas()
    return
  }

  if (!canvasRef.value) return

  drawingHistory.pop()
  const lastState = drawingHistory[drawingHistory.length - 1]
  if (lastState) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.putImageData(lastState, 0, 0)
    }
  }
}

// 监听画笔宽度变化
watch(penWidth, (newWidth) => {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.lineWidth = newWidth
    }
  }
})

// 监听画笔颜色变化
watch(penColor, (newColor) => {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = newColor
    }
  }
})

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    loadImageFile(file)
  }
}

// 处理拖放
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0]
    if (file.type.startsWith('image/')) {
      loadImageFile(file)
    }
  }
}

// 加载图片文件
const loadImageFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      uploadedImage.value = result
    }
  }
  reader.readAsDataURL(file)
}

// 移除上传的图片
const removeUploadedImage = () => {
  uploadedImage.value = null
}

// 加载初始数据
const loadInitialData = (data: ISignatureData) => {
  if (data.type === 'canvas' && canvasRef.value) {
    const img = new Image()
    img.onload = () => {
      const ctx = canvasRef.value?.getContext('2d')
      if (ctx && canvasRef.value) {
        ctx.drawImage(img, 0, 0, canvasRef.value.width, canvasRef.value.height)
        saveState()
      }
    }
    img.src = data.data
  } else if (data.type === 'image') {
    uploadedImage.value = data.data
    mode.value = 'upload'
  }
}

// 确认
const confirm = () => {
  if (mode.value === 'draw' && canvasRef.value) {
    const dataUrl = canvasRef.value.toDataURL('image/png')
    emit('confirm', {
      type: 'canvas',
      data: dataUrl,
      width: canvasRef.value.width,
      height: canvasRef.value.height
    })
  } else if (mode.value === 'upload' && uploadedImage.value) {
    emit('confirm', {
      type: 'image',
      data: uploadedImage.value
    })
  }
}

// 取消
const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.signature-pad-container {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.signature-pad-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.signature-pad-header h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.signature-tabs {
  display: flex;
  gap: 8px;
}

.tab-button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.tab-button:hover {
  border-color: #9ca3af;
  color: #374151;
}

.tab-button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.signature-pad-content {
  padding: 16px;
  min-height: 300px;
}

.draw-mode {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.canvas-container {
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  cursor: crosshair;
}

.canvas-container canvas {
  display: block;
  width: 100%;
  height: auto;
  touch-action: none;
}

.canvas-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.control-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.control-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.control-label input[type="range"] {
  width: 100px;
}

.control-label input[type="color"] {
  width: 40px;
  height: 32px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

.upload-mode {
  display: flex;
  flex-direction: column;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9fafb;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.upload-placeholder p {
  margin: 8px 0;
  color: #6b7280;
}

.upload-hint-small {
  font-size: 12px;
  color: #9ca3af;
}

.uploaded-preview {
  position: relative;
  max-width: 100%;
}

.uploaded-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
}

.remove-btn {
  margin-top: 12px;
  padding: 8px 16px;
  border: 1px solid #ef4444;
  border-radius: 6px;
  background: #fff;
  color: #ef4444;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fee2e2;
}

.signature-pad-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f9fafb;
}

.btn-secondary,
.btn-primary {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
}

.btn-secondary:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.btn-primary {
  border: 1px solid #3b82f6;
  background: #3b82f6;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

