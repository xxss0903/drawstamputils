<template>
  <!-- 添加法律提示弹窗 -->
  <div v-if="showLegalDialog" class="legal-dialog-overlay">
    <div class="legal-dialog">
      <h3>⚠️ {{ t('legal.title') }}</h3>
      <div class="legal-content">
        <p><strong>{{ t('legal.warning') }}</strong></p>
        <p>
            <span style="white-space: pre-line">{{ t('legal.securityItems') }}</span>
          </p>
      </div>
      <div class="dialog-buttons">
        <button @click="cancelSave" class="cancel-button">{{ t('legal.cancel') }}</button>
        <button @click="confirmSave" class="confirm-button">{{ t('legal.confirm') }}</button>
      </div>
    </div>
  </div>

  <div class="maker-container" :class="{ 'has-warning': showSecurityWarning }">
    <!-- 修改法律免责说明 -->
    <div class="legal-disclaimer"
         v-if="showSecurityWarning"
         :class="{ 'hidden': !showSecurityWarning }">
      <div class="disclaimer-content">
        <div class="warning-icon">⚠️</div>
        <div class="warning-text">
          <h3>{{ t('legal.securityWarning') }}</h3>
          <p><strong>{{ t('legal.securityNotice') }}</strong></p>
          <p>
            <span style="white-space: pre-line">{{ t('legal.securityItems') }}</span>
          </p>
          <button class="close-warning" @click="showSecurityWarning = false">×</button>
        </div>
      </div>
    </div>
    <EditorControls
      v-if="isDrawStampUtilsReady"
      ref="editorControlsRef"
      :drawStampUtils="drawStampUtils"
      @updateDrawStamp="updateDrawStamp"
    />

    <!-- Canvas 容器 -->
    <div class="canvas-container">
      <div class="canvas-wrapper">
        <canvas ref="stampCanvas" width="600" height="600"></canvas>
      </div>
      <!-- 添加底部工具栏 -->
      <div class="bottom-toolbar">
        <button class="toolbar-button" @click="showTemplateDialog = true">
          <span class="button-icon">📋</span>
          {{ t('stamp.template.open') }}
        </button>
        <button class="toolbar-button" @click="saveStampAsPNG">
          <span class="button-icon">💾</span>
          {{ t('stamp.save') }}
        </button>
        <button class="toolbar-button" @click="openExtractStampTool">
          <span class="button-icon">🔍</span>
          {{ t('stamp.extract.tool') }}
        </button>

        <!-- 添加拖动开关 -->
        <div class="drag-switch-container">
          <span class="drag-label">{{ t('stamp.drag.label') }}</span>
          <label class="switch">
            <input type="checkbox" v-model="isDraggable">
            <span class="slider round"></span>
          </label>
        </div>
      </div>
    </div>
    <!-- 右侧工具栏 -->
    <div class="right-toolbar">

    </div>
    <!-- 使用模板弹窗组件 -->
    <TemplateDialog
      :show="showTemplateDialog"
      :templates="defaultTemplates"
      :currentIndex="currentTemplateIndex"
      :drawStampUtils="drawStampUtils"
      @close="showTemplateDialog = false"
      @save="saveCurrentAsTemplate"
      @select="loadSelectedTemplate"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import {DrawStampUtils} from './DrawStampUtils'
import { getSystemFonts } from './utils/fontUtils'
import { ICode, ICompany, IDrawImage, IDrawStampConfig, IDrawStar, IInnerCircle, IRoughEdge, ISecurityPattern, IStampType, ITaxNumber } from './DrawStampTypes'
import { useI18n } from 'vue-i18n'
import stampTemplate1 from './assets/templates/stamp_template1.json'
import stampTemplate2 from './assets/templates/stamp_template2.json'
import EditorControls from './EditorControls.vue'
import TemplateDialog from './components/TemplateDialog.vue'

const { t } = useI18n()
// 添加一个标志来控制 EditorControls 的加载
const isDrawStampUtilsReady = ref(false)

const editorControlsRef = ref<InstanceType<typeof EditorControls> | null>(null)
const stampCanvas = ref<any | null>(null)
const MM_PER_PIXEL = 10 // 毫米换算像素

const showLegalDialog = ref(false) // 是否显示法律提示弹窗
const isDraggable = ref(false) // 是否开启拖动


// 绘制工具
let drawStampUtils: DrawStampUtils
// 初始化绘制印章参数
const initDrawStampUtils = () => {
  drawStampUtils = new DrawStampUtils(stampCanvas.value, MM_PER_PIXEL)
}


  // 获取所有文字路径（公司名称、编码和印章类型）
  let allTextPaths: any[] = []
  let companyTextPaths: any[] = []
  let codeTextPaths: any[] = []
  let stampTypeTextPaths: any[] = []
  let taxNumberTextPaths: any[] = []

const drawStamp = (refreshSecurityPattern: boolean = false, refreshOld: boolean = false, refreshRoughEdge: boolean = false) => {
  // 使用drawstamputils进行绘制
  drawStampUtils.refreshStamp(refreshSecurityPattern, refreshOld, refreshRoughEdge)

  // 确保拖动设置与当前状态一致
  drawStampUtils.setDraggable(isDraggable.value)

  // 更新文字路径
  companyTextPaths = drawStampUtils.drawCompanyUtils.getTextPaths()
  codeTextPaths = drawStampUtils.drawCodeUtils.getTextPaths()
  stampTypeTextPaths = drawStampUtils.drawStampTypeUtils.getTextPaths()
  taxNumberTextPaths = drawStampUtils.drawTaxNumberUtils.getTextPaths()
  allTextPaths = [...companyTextPaths, ...codeTextPaths, ...stampTypeTextPaths, ...taxNumberTextPaths]
}

// 保存印章为PNG
const saveStampAsPNG = () => {
  showLegalDialog.value = true
}

// 取消保存
const cancelSave = () => {
  showLegalDialog.value = false
}


// 确认保存
const confirmSave = () => {
  showLegalDialog.value = false
  drawStampUtils.saveStampAsPNG()
}

// 添加系统字体列表
const systemFonts = ref<string[]>([])

// 加载系统字体
const loadSystemFonts = async () => {
  systemFonts.value = await getSystemFonts()
}

// 在组件挂载时加载字体
onMounted(async () => {
  initDrawStampUtils()
  await loadSystemFonts()

  // 设置初始拖动状态
  drawStampUtils.setDraggable(isDraggable.value)
  if (stampCanvas.value) {
    stampCanvas.value.style.cursor = isDraggable.value ? 'move' : 'default'
  }

  drawStamp()
  // 加载模板列表，这里是预览的模板列表
  loadTemplatesFromStorage()
  // 初始化所有字体选择器的预览
  document.querySelectorAll('.font-select, .font-input').forEach((element) => {
    if (element instanceof HTMLElement) {
      updateFontPreview({ target: element } as unknown as Event);
    }
  });
  isDrawStampUtilsReady.value = true
  window.addEventListener('mousemove', handleMouseMove)
  drawStampUtils?.canvas?.addEventListener('click', handleCanvasClick)
})

// 在组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  drawStampUtils?.canvas?.removeEventListener('click', handleCanvasClick)
})

// 添加新的类型定义
interface StampTypePreset {
  id: string;
  name: string;
  text: string;
  fontSize: number;
  letterSpacing: number;
  lineSpacing: number;
  positionY: number;
  compression: number;
}

// 添加预设数据
const stampTypePresets = ref<StampTypePreset[]>([
  {
    id: 'contract',
    name: '合同专用章',
    text: '合同专用章',
    fontSize: 4.6,
    letterSpacing: 0,
    lineSpacing: 1.2,
    positionY: -5,
    compression: 1
  },
  {
    id: 'invoice',
    name: '印章类型',
    text: '发票专章\n增值税专用',
    fontSize: 4.2,
    letterSpacing: 0,
    lineSpacing: 1.5,
    positionY: -4,
    compression: 0.9
  },
  {
    id: 'finance',
    name: '财务专用章',
    text: '财务专用章\n仅限报销使用',
    fontSize: 4.0,
    letterSpacing: 0,
    lineSpacing: 1.8,
    positionY: -3,
    compression: 0.85
  }
])

// 可以选择性地添加持久化存储功能
const savePresetsToLocalStorage = () => {
  localStorage.setItem('stampTypePresets', JSON.stringify(stampTypePresets.value))
}

const loadPresetsFromLocalStorage = () => {
  const saved = localStorage.getItem('stampTypePresets')
  if (saved) {
    stampTypePresets.value = JSON.parse(saved)
  }
}

// 在预设变化时保存
watch(stampTypePresets, () => {
  savePresetsToLocalStorage()
}, { deep: true })

// 打开提取印章工具网址
const openExtractStampTool = () => {
  window.open('https://xxss0903.github.io/extractstamp/', '_blank')
}

// 修改字体预览更新函数
const updateFontPreview = (event: Event) => {
  const element = event.target as HTMLElement;
  const fontFamily = element.tagName === 'SELECT'
    ? (element as HTMLSelectElement).value
    : (element as HTMLInputElement).value;

  element.style.setProperty('--current-font', fontFamily);

  // 如果是select变化，同步更新input
  if (element.tagName === 'SELECT') {
    const input = element.parentElement?.querySelector('.font-input') as HTMLInputElement;
    if (input) {
      input.value = fontFamily;
      input.style.setProperty('--current-font', fontFamily);
    }
  }

  // 如果input变化，同步更新select
  if (element.tagName === 'INPUT') {
    const select = element.parentElement?.querySelector('.font-select') as HTMLSelectElement;
    if (select) {
      select.value = fontFamily;
      select.style.setProperty('--current-font', fontFamily);
    }
  }
}

// 添加展开/折叠状态控制
const expandedGroups = ref({
  basic: false,
  company: false,
  stampType: false,
  code: false,
  taxNumber: false,
  star: false,
  security: false,
  roughEdge: false,
  aging: false,
  innerCircle: false,
  images: false // 新增图片列表设置
})

// 切换组的展开/折叠状态
const toggleGroup = (groupName: string) => {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName]
}

// 添加模板相关的类型定义
interface Template {
  name: string;
  preview: string;
  config: IDrawStampConfig;
}

// 添加模板相关的响应式数据
const currentTemplateIndex = ref(-1)

// 保存当前设置为模板
const saveCurrentAsTemplate = async () => {
  // 保存到本地存储
  localStorage.setItem('stampTemplates', JSON.stringify(templateList.value))
}

// 加载模板，从模板弹窗选中模板，需要将模板的值设置到左边设置里面
const loadSelectedTemplate = (template: Template) => {
  try {
    isDrawStampUtilsReady.value = false
    // 绘制印章
    drawStampUtils = new DrawStampUtils(stampCanvas.value, MM_PER_PIXEL)
    drawStamp()
    // 初始化所有字体选择器的预览
    document.querySelectorAll('.font-select, .font-input').forEach((element) => {
      if (element instanceof HTMLElement) {
        updateFontPreview({ target: element } as unknown as Event);
      }
    });
    isDrawStampUtilsReady.value = true
    window.addEventListener('mousemove', handleMouseMove)
    drawStampUtils?.canvas?.addEventListener('click', handleCanvasClick)

    // 将选中的config进行设置
    const newConfig = JSON.parse(JSON.stringify(template.config)) as IDrawStampConfig
    newConfig.ruler.showRuler = true
    newConfig.ruler.showFullRuler = true
    newConfig.ruler.showSideRuler = true
    newConfig.ruler.showCrossLine = true
    newConfig.ruler.showCurrentPositionText = true
    newConfig.ruler.showDashLine = true
    newConfig.company.startAngle = template.config.company.startAngle
    newConfig.company.rotateDirection = template.config.company.rotateDirection

    drawStampUtils.setDrawConfigs(newConfig)
    drawStamp()
    // drawStampUtils.refreshStamp()
    setTimeout(() => {
      isDrawStampUtilsReady.value = true
      console.log("refresh editor controls")
      editorControlsRef.value.restoreDrawConfigs()
    }, 100)

    // 更新当前选中的模板索引（使用负数表示默认模板）
    currentTemplateIndex.value = -1 - defaultTemplates.findIndex(t => t === template)
  } catch (error) {
    console.error('加载默认模板失败:', error)
    alert('加载默认模板失败')
  }
}

// 添加默认模板的类型定义和数据
const defaultTemplates: Template[] = [
  {
    name: '印章1',
    preview: '',
    config: stampTemplate1 as IDrawStampConfig
  },{
    name: '印章2',
    preview: '',
    config: stampTemplate2 as IDrawStampConfig
  }
]

// 添加新的响应式变量
const showSecurityWarning = ref(localStorage.getItem('showSecurityWarning') !== 'false')

watch(showSecurityWarning, (newValue) => {
  localStorage.setItem('showSecurityWarning', String(newValue))
})

// 更新印章绘制，从EditorControls组件中调用
const updateDrawStamp = (newConfig: IDrawStampConfig, refreshSecurityPattern: boolean, refreshOld: boolean, refreshRoughEdge: boolean) => {
  drawStampUtils.setDrawConfigs(newConfig)
  drawStampUtils.refreshStamp(refreshSecurityPattern, refreshOld, refreshRoughEdge)
}

// 添加模板弹窗控制
const showTemplateDialog = ref(false)


// 从本地存储加载模板列表
const loadTemplatesFromStorage = () => {
  // 生成默认模板的预览图
  defaultTemplates.forEach(async (template) => {
    // 临时创建一个 canvas 生成预览图
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = 500
    tempCanvas.height = 500
    const tempDrawStampUtils = new DrawStampUtils(tempCanvas, 8)
    template.config.ruler.showRuler = false;
    // 设置模板配置
    tempDrawStampUtils.setDrawConfigs(template.config)
    tempDrawStampUtils.refreshStamp()

    // 生成预览图
    template.preview = tempCanvas.toDataURL('image/png')
  })
}

// 添加提示相关的响应式数据
const showTooltip = ref(false)
const tooltipStyle = ref({
  left: '0px',
  top: '0px'
})

// 添加鼠标移动检测
const handleMouseMove = (event: MouseEvent) => {
  if (!drawStampUtils?.canvas) return

  const rect = drawStampUtils.canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 检查是否悬停在文字上
  let isOverText = false
  for (const textPath of allTextPaths) {
    if (x >= textPath.bounds.x &&
        x <= textPath.bounds.x + textPath.bounds.width &&
        y >= textPath.bounds.y &&
        y <= textPath.bounds.y + textPath.bounds.height) {

      isOverText = true
      showTooltip.value = true
      tooltipStyle.value = {
        left: `${event.clientX + 10}px`,
        top: `${event.clientY + 10}px`
      }

      // 设置鼠标样式为指针
      drawStampUtils.canvas.style.cursor = 'pointer'
      return
    }
  }

  if (!isOverText) {
    showTooltip.value = false
    drawStampUtils.canvas.style.cursor = 'default'
  }
}

// 添加点击事件处理
const handleCanvasClick = (event: MouseEvent) => {
  if (!drawStampUtils?.canvas) return

  const rect = drawStampUtils.canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 检查点击的文字
  for (const textPath of allTextPaths) {
    if (x >= textPath.bounds.x &&
        x <= textPath.bounds.x + textPath.bounds.width &&
        y >= textPath.bounds.y &&
        y <= textPath.bounds.y + textPath.bounds.height) {

      // 打印文字信息
      console.log('点击的文字:', textPath.text)
      console.log('文字路径:', textPath.path)
      console.log('文字边界:', textPath.bounds)
      console.log('文字类型:', textPath.type)

      // 根据文字类型处理点击
      if (textPath.type === 'company') {
        const companyIndex = findCompanyIndexByText(textPath.text)
        if (companyIndex !== -1) {
          const editorControlsRef = editorControlsRef.value
          if (editorControlsRef) {
            editorControlsRef.scrollToCompanyText(companyIndex)
          }
        }
      } else if (textPath.type === 'code') {
        // 点击编码文字时，展开编码设置组
        const editorControlsRef = editorControlsRef.value
        if (editorControlsRef) {
          editorControlsRef.scrollToCode()
        }
      } else if (textPath.type === 'stampType') {
        // 点击印章类型文字时，展开印章类型设置组
        const stampTypeIndex = findStampTypeIndexByText(textPath.text)
        if (stampTypeIndex !== -1) {
          const editorControlsRef = editorControlsRef.value
          if (editorControlsRef) {
            editorControlsRef.scrollToStampType(stampTypeIndex)
          }
        }
      } else if (textPath.type === 'taxNumber') {
        // 点击税号文字时，展开税号设置组
        const editorControlsRef = editorControlsRef.value
        if (editorControlsRef) {
          editorControlsRef.scrollToTaxNumber()
        }
      }
      return
    }
  }
}

// 查找文字对应的公司索引
const findCompanyIndexByText = (text: string) => {
  return drawStampUtils.getDrawConfigs().companyList.findIndex(
    company => company.companyName.includes(text)
  )
}

// 查找印章类型索引
const findStampTypeIndexByText = (text: string) => {
  return drawStampUtils.getDrawConfigs().stampTypeList.findIndex(
    stampType => stampType.stampType.includes(text)
  )
}

// 监听拖动状态变化
watch(isDraggable, (newValue) => {
  if (drawStampUtils) {
    // 更新 drawStampUtils 中的拖动状态
    drawStampUtils.setDraggable(newValue)

    // 更新鼠标样式
    if (stampCanvas.value) {
      stampCanvas.value.style.cursor = newValue ? 'move' : 'default'
    }
  }
})
</script>
<style scoped>
/* 模板弹窗样式 */
.template-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.template-dialog {
  background-color: white;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.template-dialog-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.template-dialog-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  text-align: right;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

/* 修改容器样式 */
.container {
  display: flex;
  background-color: #f5f5f5;
}

.canvas-wrapper {
  margin-bottom: 20px;
}

/* 底部工具栏样式 */
.bottom-toolbar {
  display: flex;
  gap: 12px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
}

.toolbar-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.toolbar-button:hover {
  background-color: #e6f7ff;
  transform: translateY(-1px);
}

.button-icon {
  font-size: 20px;
}

.close-button {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #333;
}

.tooltip {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  z-index: 1000;
}

/* 移除右侧工具栏相关样式 */
.right-toolbar {
  display: none;
}

/* 拖动开关样式 */
.drag-switch-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-label {
  font-size: 14px;
  color: #666;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:focus + .slider {
  box-shadow: 0 0 1px #4caf50;
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
