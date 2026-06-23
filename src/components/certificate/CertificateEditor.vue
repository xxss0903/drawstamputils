<template>
  <div class="certificate-editor">
    <div class="editor-header">
      <h2>{{ t('certificate.editor.title') }}</h2>
      <div class="header-actions">
        <button class="btn-secondary" @click="loadTemplate">
          {{ t('certificate.editor.loadTemplate') }}
        </button>
        <button class="btn-secondary" @click="saveTemplate">
          {{ t('certificate.editor.saveTemplate') }}
        </button>
        <button class="btn-primary" @click="preview">
          {{ t('certificate.editor.preview') }}
        </button>
      </div>
    </div>

    <div class="editor-content">
      <!-- 左侧工具栏 -->
      <div class="editor-sidebar">
        <div class="sidebar-section">
          <h3>{{ t('certificate.editor.elements') }}</h3>
          <div class="element-buttons">
            <button
              v-for="elementType in elementTypes"
              :key="elementType.type"
              class="element-btn"
              :title="elementType.label"
              @click="addElement(elementType.type)"
            >
              <span class="element-icon">{{ elementType.icon }}</span>
              <span class="element-label">{{ elementType.label }}</span>
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>{{ t('certificate.editor.fields') }}</h3>
          <button class="btn-add-field" @click="showAddFieldDialog = true">
            + {{ t('certificate.editor.addField') }}
          </button>
          <div class="fields-list">
            <div
              v-for="field in template.fields"
              :key="field.id"
              class="field-item"
              :class="{ active: selectedFieldId === field.id }"
              @click="selectField(field.id)"
            >
              <span class="field-name">{{ field.label }}</span>
              <button class="field-delete" @click.stop="deleteField(field.id)">
                ×
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- 中间画布区域 -->
      <div class="editor-canvas-area">
        <div class="canvas-container" ref="canvasContainerRef">
          <canvas
            ref="canvasRef"
            @click="handleCanvasClick"
            @mousedown="startDrag"
            @mousemove="handleDrag"
            @mouseup="stopDrag"
          ></canvas>
          <!-- 元素选择框 -->
          <div
            v-for="element in template.elements"
            :key="element.id"
            v-show="selectedElementId === element.id"
            class="element-selection-box"
            :style="getSelectionBoxStyle(element)"
          ></div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="editor-properties">
        <!-- 元素属性 -->
        <div class="properties-section" v-if="selectedElement">
          <h3>{{ t('certificate.editor.elementProperties') }}</h3>
          <ElementProperties
            :element="selectedElement"
            @update="updateElement"
          />
          <button class="btn-danger" @click="deleteElement(selectedElement.id)">
            {{ t('certificate.editor.delete') }}
          </button>
        </div>
        
        <!-- 模板设置 -->
        <div class="properties-section">
          <h3>{{ t('certificate.editor.templateSettings') }}</h3>
          <div class="property-group">
            <label>{{ t('certificate.editor.width') }} (mm):</label>
            <input
              type="number"
              v-model.number="template.width"
              min="50"
              max="1000"
              step="1"
              @input="updateCanvas"
            />
          </div>
          <div class="property-group">
            <label>{{ t('certificate.editor.height') }} (mm):</label>
            <input
              type="number"
              v-model.number="template.height"
              min="50"
              max="1000"
              step="1"
              @input="updateCanvas"
            />
          </div>
          <div class="property-group">
            <label>{{ t('certificate.editor.backgroundColor') }}:</label>
            <input type="color" v-model="template.backgroundColor" @input="updateCanvas" />
          </div>
          <div class="property-group">
            <label>{{ t('certificate.editor.backgroundImage') }}:</label>
            <div class="background-image-controls">
              <input
                ref="backgroundImageInputRef"
                type="file"
                accept="image/*"
                @change="handleBackgroundImageSelect"
                style="display: none"
              />
              <button
                type="button"
                class="btn-upload"
                @click="backgroundImageInputRef?.click()"
              >
                {{ t('certificate.editor.uploadImage') }}
              </button>
              <button
                v-if="template.backgroundImage"
                type="button"
                class="btn-remove"
                @click="removeBackgroundImage"
              >
                {{ t('certificate.editor.removeImage') }}
              </button>
            </div>
            <div v-if="template.backgroundImage" class="background-image-preview">
              <img :src="template.backgroundImage" alt="Background preview" />
            </div>
          </div>
          <div class="property-group">
            <button class="btn-create-default" @click="createDefaultAwardTemplate">
              {{ t('certificate.editor.createDefaultAward') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加字段对话框 -->
    <div v-if="showAddFieldDialog" class="dialog-overlay" @click.self="showAddFieldDialog = false">
      <div class="dialog">
        <h3>{{ t('certificate.editor.addField') }}</h3>
        <div class="dialog-content">
          <div class="form-group">
            <label>{{ t('certificate.editor.fieldName') }}:</label>
            <input type="text" v-model="newField.name" placeholder="name" />
          </div>
          <div class="form-group">
            <label>{{ t('certificate.editor.fieldLabel') }}:</label>
            <input type="text" v-model="newField.label" placeholder="Name" />
          </div>
          <div class="form-group">
            <label>{{ t('certificate.editor.fieldType') }}:</label>
            <select v-model="newField.type">
              <option value="text">{{ t('certificate.editor.fieldTypeText') }}</option>
              <option value="date">{{ t('certificate.editor.fieldTypeDate') }}</option>
              <option value="number">{{ t('certificate.editor.fieldTypeNumber') }}</option>
              <option value="image">{{ t('certificate.editor.fieldTypeImage') }}</option>
              <option value="signature">{{ t('certificate.editor.fieldTypeSignature') }}</option>
            </select>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="btn-secondary" @click="showAddFieldDialog = false">
            {{ t('certificate.editor.cancel') }}
          </button>
          <button class="btn-primary" @click="addField">
            {{ t('certificate.editor.add') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 预览对话框 -->
    <div v-if="showPreview" class="dialog-overlay" @click.self="showPreview = false">
      <div class="preview-dialog">
        <h3>{{ t('certificate.editor.preview') }}</h3>
        <div class="preview-content">
          <canvas ref="previewCanvasRef"></canvas>
          <div class="preview-data-form">
            <h4>{{ t('certificate.editor.enterData') }}</h4>
            <div
              v-for="field in template.fields"
              :key="field.id"
              class="form-group"
            >
              <label>{{ field.label }}:</label>
              <input
                v-if="field.type !== 'signature' && field.type !== 'image'"
                type="text"
                v-model="previewData[field.name]"
                @input="updatePreview"
              />
              <button
                v-else-if="field.type === 'signature'"
                class="btn-signature"
                @click="openSignaturePad(field)"
              >
                {{ t('certificate.editor.addSignature') }}
              </button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="btn-secondary" @click="showPreview = false">
            {{ t('certificate.editor.close') }}
          </button>
          <button class="btn-primary" @click="downloadPreview">
            {{ t('certificate.editor.download') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 签名板 -->
    <SignaturePad
      v-if="showSignaturePad"
      :initial-data="currentSignatureData"
      @confirm="handleSignatureConfirm"
      @cancel="showSignaturePad = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { DrawCertificateUtils } from '../../utils/DrawCertificateUtils'
import SignaturePad from './SignaturePad.vue'
import type {
  ICertificateTemplate,
  ICertificateElement,
  ICertificateField,
  ICertificateData,
  ISignatureData,
  ElementType,
  FieldType
} from '../../CertificateTypes'

const { t } = useI18n()

// 定义 emit
const emit = defineEmits<{
  (e: 'template-updated', template: ICertificateTemplate): void
}>()

// 模板数据
const template = ref<ICertificateTemplate>({
  title: 'New Certificate',
  width: 210, // A4 width in mm
  height: 297, // A4 height in mm
  backgroundColor: '#ffffff',
  elements: [],
  fields: []
})

// Canvas 相关
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasContainerRef = ref<HTMLDivElement | null>(null)
const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
const drawUtils = new DrawCertificateUtils()
const backgroundImageInputRef = ref<HTMLInputElement | null>(null)

// 选中状态
const selectedElementId = ref<string | null>(null)
const selectedFieldId = ref<string | null>(null)
const isDragging = ref(false)
const dragStart = ref<{ x: number; y: number; elementX?: number; elementY?: number }>({ x: 0, y: 0 })
let animationFrameId: number | null = null

// 对话框状态
const showAddFieldDialog = ref(false)
const showPreview = ref(false)
const showSignaturePad = ref(false)

// 新字段
const newField = ref<Partial<ICertificateField>>({
  type: 'text',
  name: '',
  label: '',
  x: 0,
  y: 0,
  fontSize: 12,
  fontFamily: 'Arial',
  color: '#000000'
})

// 预览数据
const previewData = ref<ICertificateData>({})
const currentSignatureField = ref<ICertificateField | null>(null)
const currentSignatureData = ref<ISignatureData | null>(null)

// 元素类型
const elementTypes = [
  { type: 'text', label: t('certificate.editor.elementText'), icon: '📝' },
  { type: 'image', label: t('certificate.editor.elementImage'), icon: '🖼️' },
  { type: 'line', label: t('certificate.editor.elementLine'), icon: '➖' },
  { type: 'rectangle', label: t('certificate.editor.elementRectangle'), icon: '▭' },
  { type: 'field', label: t('certificate.editor.elementField'), icon: '📋' }
] as const

// 选中的元素
const selectedElement = computed(() => {
  if (!selectedElementId.value) return null
  return template.value.elements.find(e => e.id === selectedElementId.value) || null
})

// 初始化
onMounted(() => {
  if (canvasRef.value) {
    drawUtils.setCanvas(canvasRef.value)
    updateCanvas()
  }
})

// 更新画布
const updateCanvas = async () => {
  if (!canvasRef.value) return

  const config = {
    template: template.value,
    data: {}
  }

  await drawUtils.drawCertificate(config)
}

// 添加元素
const addElement = (type: string) => {
  const element: ICertificateElement = {
    id: `element-${Date.now()}`,
    type: type as ElementType,
    x: 50,
    y: 50,
    width: type === 'text' ? 100 : 50,
    height: type === 'text' ? 20 : 50,
    zIndex: template.value.elements.length
  }

  if (type === 'text') {
    element.text = 'Text'
    element.fontSize = 12
    element.fontFamily = 'Arial'
    element.color = '#000000'
  } else if (type === 'line') {
    element.lineWidth = 1
    element.lineColor = '#000000'
    element.lineStyle = 'solid'
  } else if (type === 'rectangle') {
    element.fillColor = '#ffffff'
    element.strokeColor = '#000000'
    element.strokeWidth = 1
  }

  template.value.elements.push(element)
  selectedElementId.value = element.id
  updateCanvas()
}

// 选择元素
const selectElement = (elementId: string) => {
  selectedElementId.value = elementId
  selectedFieldId.value = null
}

// 选择字段
const selectField = (fieldId: string) => {
  selectedFieldId.value = fieldId
  selectedElementId.value = null
}

// 删除元素
const deleteElement = (elementId: string) => {
  const index = template.value.elements.findIndex(e => e.id === elementId)
  if (index > -1) {
    template.value.elements.splice(index, 1)
    if (selectedElementId.value === elementId) {
      selectedElementId.value = null
    }
    updateCanvas()
  }
}

// 更新元素
const updateElement = (updates: Partial<ICertificateElement>) => {
  if (!selectedElementId.value) return

  const index = template.value.elements.findIndex(e => e.id === selectedElementId.value)
  if (index > -1) {
    template.value.elements[index] = { ...template.value.elements[index], ...updates }
    updateCanvas()
  }
}

// 添加字段
const addField = () => {
  if (!newField.value.name || !newField.value.label) return

  const field: ICertificateField = {
    id: `field-${Date.now()}`,
    name: newField.value.name,
    label: newField.value.label,
    type: (newField.value.type || 'text') as FieldType,
    x: newField.value.x || 50,
    y: newField.value.y || 50,
    fontSize: newField.value.fontSize || 12,
    fontFamily: newField.value.fontFamily || 'Arial',
    color: newField.value.color || '#000000',
    textAlign: 'left',
    required: false
  }

  template.value.fields.push(field)
  newField.value = {
    type: 'text',
    name: '',
    label: '',
    x: 0,
    y: 0,
    fontSize: 12,
    fontFamily: 'Arial',
    color: '#000000'
  }
  showAddFieldDialog.value = false
  updateCanvas()
}

// 删除字段
const deleteField = (fieldId: string) => {
  const index = template.value.fields.findIndex(f => f.id === fieldId)
  if (index > -1) {
    template.value.fields.splice(index, 1)
    // 删除关联的元素
    template.value.elements = template.value.elements.filter(
      e => e.fieldId !== fieldId
    )
    if (selectedFieldId.value === fieldId) {
      selectedFieldId.value = null
    }
    updateCanvas()
  }
}

// 计算文本元素的尺寸
const getTextElementSize = (element: ICertificateElement): { width: number; height: number } => {
  if (element.type !== 'text' || !element.text) {
    return { width: element.width || 0, height: element.height || 0 }
  }

  // 创建临时canvas来测量文本尺寸
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return { width: 0, height: 0 }

  const fontSize = (element.fontSize || 12) * drawUtils.getMmToPixel()
  const fontFamily = element.fontFamily || 'Arial'
  const fontWeight = element.fontWeight || 'normal'
  tempCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`

  const lines = element.text.split('\n')
  let maxWidth = 0
  lines.forEach(line => {
    const metrics = tempCtx.measureText(line)
    maxWidth = Math.max(maxWidth, metrics.width)
  })

  const lineHeight = fontSize * 1.2
  const height = lines.length * lineHeight

  return {
    width: maxWidth / drawUtils.getMmToPixel(),
    height: height / drawUtils.getMmToPixel()
  }
}

// 画布点击
const handleCanvasClick = (e: MouseEvent) => {
  if (!canvasRef.value || isDragging.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / (rect.width / canvasRef.value.width)
  const y = (e.clientY - rect.top) / (rect.height / canvasRef.value.height)

  // 转换为毫米
  const mmToPixel = drawUtils.getMmToPixel()
  const mmX = x / mmToPixel
  const mmY = y / mmToPixel

  // 从后往前检查元素（后面的元素在上层）
  const elements = [...template.value.elements].reverse()
  for (const element of elements) {
    let elementWidth = element.width || 0
    let elementHeight = element.height || 0

    // 如果是文本元素，计算实际文本尺寸
    if (element.type === 'text') {
      const textSize = getTextElementSize(element)
      elementWidth = textSize.width || 50 // 默认宽度
      elementHeight = textSize.height || 10 // 默认高度
    } else if (element.type === 'field') {
      // 字段元素使用字段的尺寸
      const field = template.value.fields.find(f => f.id === element.fieldId)
      if (field) {
        elementWidth = field.width || 50
        elementHeight = field.height || 10
      } else {
        elementWidth = element.width || 50
        elementHeight = element.height || 10
      }
    }

    // 检查点击是否在元素范围内
    if (
      element.x <= mmX &&
      mmX <= element.x + elementWidth &&
      element.y <= mmY &&
      mmY <= element.y + elementHeight
    ) {
      selectElement(element.id)
      return
    }
  }

  selectedElementId.value = null
}

// 开始拖拽
const startDrag = (e: MouseEvent) => {
  // 如果点击了元素，先选中它
  if (!selectedElementId.value) {
    handleCanvasClick(e)
  }

  if (!selectedElementId.value || !canvasRef.value) return

  // 检查是否点击在元素上
  const rect = canvasRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / (rect.width / canvasRef.value.width)
  const y = (e.clientY - rect.top) / (rect.height / canvasRef.value.height)
  const mmToPixel = drawUtils.getMmToPixel()
  const mmX = x / mmToPixel
  const mmY = y / mmToPixel

  const element = template.value.elements.find(e => e.id === selectedElementId.value)
  if (!element) return

  let elementWidth = element.width || 0
  let elementHeight = element.height || 0

  if (element.type === 'text') {
    const textSize = getTextElementSize(element)
    elementWidth = textSize.width || 50
    elementHeight = textSize.height || 10
  } else if (element.type === 'field') {
    const field = template.value.fields.find(f => f.id === element.fieldId)
    if (field) {
      elementWidth = field.width || 50
      elementHeight = field.height || 10
    }
  }

  // 检查点击是否在元素范围内
  if (
    mmX < element.x ||
    mmX > element.x + elementWidth ||
    mmY < element.y ||
    mmY > element.y + elementHeight
  ) {
    return
  }

  isDragging.value = true
  dragStart.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    elementX: element.x,
    elementY: element.y
  }
  e.preventDefault()
}

// 处理拖拽
const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value || !selectedElementId.value || !canvasRef.value) return

  e.preventDefault()
  const rect = canvasRef.value.getBoundingClientRect()
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top

  const mmToPixel = drawUtils.getMmToPixel()
  const scaleX = rect.width / canvasRef.value.width
  const scaleY = rect.height / canvasRef.value.height

  // 计算新的位置（基于初始位置和鼠标移动距离）
  const deltaX = (currentX - dragStart.value.x) / scaleX / mmToPixel
  const deltaY = (currentY - dragStart.value.y) / scaleY / mmToPixel

  const element = template.value.elements.find(e => e.id === selectedElementId.value)
  if (element && dragStart.value.elementX !== undefined && dragStart.value.elementY !== undefined) {
    // 更新元素位置（但不更新画布，避免闪烁）
    element.x = dragStart.value.elementX + deltaX
    element.y = dragStart.value.elementY + deltaY
    
    // 选择框会通过响应式自动更新位置，不需要手动更新画布
    // 这样可以避免拖拽时的闪烁
  }
}

// 停止拖拽
const stopDrag = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  // 先设置 isDragging 为 false，这样 watch 可以正常工作
  const wasDragging = isDragging.value
  isDragging.value = false
  
  // 拖拽结束后更新画布，确保最终状态正确
  if (wasDragging) {
    // 使用 nextTick 确保在 watch 之后更新
    setTimeout(() => {
      updateCanvas()
    }, 0)
  }
}

// 获取选择框样式
const getSelectionBoxStyle = (element: ICertificateElement) => {
  if (!canvasRef.value) return {}

  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = rect.width / canvasRef.value.width
  const scaleY = rect.height / canvasRef.value.height
  const mmToPixel = drawUtils.getMmToPixel()

  let elementWidth = element.width || 0
  let elementHeight = element.height || 0

  // 如果是文本元素，计算实际文本尺寸
  if (element.type === 'text') {
    const textSize = getTextElementSize(element)
    elementWidth = textSize.width || 50
    elementHeight = textSize.height || 10
  } else if (element.type === 'field') {
    const field = template.value.fields.find(f => f.id === element.fieldId)
    if (field) {
      elementWidth = field.width || 50
      elementHeight = field.height || 10
    }
  }

  return {
    left: `${element.x * mmToPixel * scaleX}px`,
    top: `${element.y * mmToPixel * scaleY}px`,
    width: `${elementWidth * mmToPixel * scaleX}px`,
    height: `${elementHeight * mmToPixel * scaleY}px`
  }
}

// 预览
const preview = () => {
  showPreview.value = true
  previewData.value = {}
  setTimeout(() => {
    updatePreview()
  }, 100)
}

// 更新预览
const updatePreview = async () => {
  if (!previewCanvasRef.value) return

  const previewUtils = new DrawCertificateUtils()
  previewUtils.setCanvas(previewCanvasRef.value)

  const config = {
    template: template.value,
    data: previewData.value
  }

  await previewUtils.drawCertificate(config)
}

// 打开签名板
const openSignaturePad = (field: ICertificateField) => {
  currentSignatureField.value = field
  currentSignatureData.value = null
  showSignaturePad.value = true
}

// 处理签名确认
const handleSignatureConfirm = (signatureData: ISignatureData) => {
  if (currentSignatureField.value) {
    previewData.value[currentSignatureField.value.name] = JSON.stringify(signatureData)
    updatePreview()
  }
  showSignaturePad.value = false
}

// 下载预览
const downloadPreview = async () => {
  if (!previewCanvasRef.value) return

  const previewUtils = new DrawCertificateUtils()
  previewUtils.setCanvas(previewCanvasRef.value)
  await updatePreview()

  const dataUrl = previewUtils.exportToImage('png')
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'certificate.png'
  link.click()
}

// 保存模板
const saveTemplate = () => {
  const json = JSON.stringify(template.value, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${template.value.title || 'certificate'}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// 加载模板
const loadTemplate = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const loaded = JSON.parse(e.target?.result as string)
          template.value = loaded
          updateCanvas()
        } catch (error) {
          alert('Failed to load template')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

// 处理背景图片选择
const handleBackgroundImageSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        template.value.backgroundImage = result
        updateCanvas()
      }
    }
    reader.readAsDataURL(file)
  }
}

// 移除背景图片
const removeBackgroundImage = () => {
  template.value.backgroundImage = undefined
  updateCanvas()
}

// 创建默认奖状模板
const createDefaultAwardTemplate = () => {
  // 创建渐变背景（黄色到红色）
  const canvas = document.createElement('canvas')
  canvas.width = 2100 // A4 宽度（210mm * 10px/mm）
  canvas.height = 2970 // A4 高度（297mm * 10px/mm）
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 创建渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#ff6b35') // 红色顶部
  gradient.addColorStop(0.3, '#ffa500') // 橙色
  gradient.addColorStop(0.5, '#ffd700') // 黄色中心
  gradient.addColorStop(0.7, '#ffa500') // 橙色
  gradient.addColorStop(1, '#ff6b35') // 红色底部

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 转换为Base64
  template.value.backgroundImage = canvas.toDataURL('image/png')

  // 设置模板尺寸（A4）
  template.value.width = 210
  template.value.height = 297
  template.value.title = '奖状模板'

  // 创建字段
  template.value.fields = [
    {
      id: 'field-recipient',
      name: 'recipient',
      label: '收件人姓名',
      type: 'text',
      x: 30,
      y: 80,
      fontSize: 18,
      fontFamily: 'SimSun, serif',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'left',
      required: true
    },
    {
      id: 'field-award-title',
      name: 'awardTitle',
      label: '奖项名称',
      type: 'text',
      x: 105,
      y: 140,
      fontSize: 36,
      fontFamily: 'SimHei, sans-serif',
      fontWeight: 'bold',
      color: '#dc2626',
      textAlign: 'center',
      required: true
    },
    {
      id: 'field-issuer',
      name: 'issuer',
      label: '颁发机构',
      type: 'text',
      x: 150,
      y: 250,
      fontSize: 16,
      fontFamily: 'SimSun, serif',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'right',
      required: true
    },
    {
      id: 'field-date',
      name: 'date',
      label: '日期',
      type: 'date',
      x: 150,
      y: 270,
      fontSize: 14,
      fontFamily: 'SimSun, serif',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'right',
      format: 'YYYY年MM月DD日',
      required: true
    },
    {
      id: 'field-seal',
      name: 'seal',
      label: '印章',
      type: 'image',
      x: 160,
      y: 250,
      width: 40,
      height: 40,
      required: false
    }
  ]

  // 创建固定文本元素
  template.value.elements = [
    {
      id: 'text-student',
      type: 'text',
      x: 30,
      y: 100,
      text: '同学：',
      fontSize: 18,
      fontFamily: 'SimSun, serif',
      color: '#000000',
      zIndex: 1
    },
    {
      id: 'text-description',
      type: 'text',
      x: 30,
      y: 120,
      text: '在2023年度第一学期中表现优秀，被评为',
      fontSize: 16,
      fontFamily: 'SimSun, serif',
      color: '#000000',
      zIndex: 1
    },
    {
      id: 'text-encouragement',
      type: 'text',
      x: 30,
      y: 200,
      text: '特发此状，以资鼓励。',
      fontSize: 16,
      fontFamily: 'SimSun, serif',
      color: '#000000',
      zIndex: 1
    },
    // 字段元素
    {
      id: 'element-recipient',
      type: 'field',
      x: 30,
      y: 80,
      fieldId: 'field-recipient',
      zIndex: 2
    },
    {
      id: 'element-award-title',
      type: 'field',
      x: 105,
      y: 140,
      width: 0,
      height: 0,
      fieldId: 'field-award-title',
      zIndex: 2
    },
    {
      id: 'element-issuer',
      type: 'field',
      x: 150,
      y: 250,
      fieldId: 'field-issuer',
      zIndex: 2
    },
    {
      id: 'element-date',
      type: 'field',
      x: 150,
      y: 270,
      fieldId: 'field-date',
      zIndex: 2
    },
    {
      id: 'element-seal',
      type: 'field',
      x: 160,
      y: 250,
      width: 40,
      height: 40,
      fieldId: 'field-seal',
      zIndex: 3
    }
  ]

  updateCanvas()
}

// 监听模板变化（拖拽时不更新画布，避免闪烁）
watch(() => template.value, () => {
  // 如果正在拖拽，不更新画布
  if (!isDragging.value) {
    updateCanvas()
  }
  emit('template-updated', template.value)
}, { deep: true })
</script>

<style scoped>
.certificate-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.editor-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.editor-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 16px;
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-section h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.element-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.element-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 60px;
}

.element-btn:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.element-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.element-label {
  font-size: 11px;
  text-align: center;
  line-height: 1.2;
}

.btn-add-field {
  width: 100%;
  padding: 10px;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.btn-add-field:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-item {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.field-item:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.field-item.active {
  border-color: #3b82f6;
  background: #e0f2fe;
}

.field-delete {
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 20px;
  padding: 0 4px;
}

.editor-canvas-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
  background: #f9fafb;
  min-width: 0;
  min-height: 0;
}

.canvas-container {
  position: relative;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: auto;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.canvas-container canvas {
  display: block;
  width: auto;
  height: auto;
}

.element-selection-box {
  position: absolute;
  border: 2px dashed #3b82f6;
  pointer-events: none;
}

.editor-properties {
  width: 280px;
  background: #fff;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 16px;
}

.properties-section h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.property-group {
  margin-bottom: 16px;
}

.property-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #6b7280;
}

.property-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.dialog-content {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.preview-dialog {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.preview-content {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.preview-content canvas {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  max-width: 400px;
}

.preview-data-form {
  flex: 1;
}

.preview-data-form h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.btn-signature {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  background: #fff;
  color: #3b82f6;
  cursor: pointer;
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

.btn-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.background-image-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.btn-upload,
.btn-remove {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-upload:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-remove:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.background-image-preview {
  margin-top: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  max-height: 100px;
}

.background-image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.btn-create-default {
  width: 100%;
  padding: 10px;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  margin-top: 8px;
}

.btn-create-default:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-danger {
  margin-top: 12px;
  padding: 10px 20px;
  border: 1px solid #ef4444;
  border-radius: 6px;
  background: #fff;
  color: #ef4444;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  width: 100%;
}

.btn-danger:hover {
  background: #fee2e2;
}
</style>

