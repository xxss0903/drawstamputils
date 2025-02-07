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

  <div class="container" :class="{ 'has-warning': showSecurityWarning }">
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
      ref="editorControls"
      :drawStampUtils="drawStampUtils"
      @updateDrawStamp="updateDrawStamp"
    />

    <!-- Canvas 容器 -->
    <div class="canvas-container">
      <div style="display: flex; flex-direction: row; margin-top: 12px; gap: 12px">
        <!-- 做旧效果设置 -->
        <div class="control-group">
          <h3>{{ t('stamp.aging.title') }}</h3>
          <label class="checkbox-label">
            <input type="checkbox" v-model="applyAging" />
            {{ t('stamp.aging.enable') }}
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="manualAging" />
            {{ t('stamp.aging.manual') }}
          </label>
          <label v-if="applyAging">
            {{ t('stamp.aging.intensity') }}:
            <input type="range" v-model.number="agingIntensity" min="0" max="100" step="1" />
          </label>
          <button @click="drawStamp(false, true)">{{ t('stamp.aging.refresh') }}</button>
        </div>

        <!-- 修改提取印章功能部分 -->
        <div class="control-group">
          <h3>{{ t('stamp.extract.title') }}</h3>
          <button @click="openExtractStampTool">{{ t('stamp.extract.tool') }}</button>
        </div>
      </div>
      <div style="margin-top: 12px;">
        <canvas ref="stampCanvas" width="600" height="600"></canvas>
      </div>
    </div>

    <!-- 添加模板列表面板 -->
    <div class="template-panel">
      <div class="template-header">
        <h3>{{ t('stamp.template.title') }}</h3>
        <button class="add-template" @click="saveCurrentAsTemplate">
          <span>+</span> {{ t('stamp.template.save') }}
        </button>
      </div>
      
      <div class="template-list">
        <!-- 默认模板 -->
        <div class="template-category">
          <h4>{{ t('stamp.template.defaultTitle') }}</h4>
          <div v-for="(template, index) in defaultTemplates" 
               :key="'default-' + index" 
               class="template-item"
               :class="{ 'active': currentTemplateIndex === (-1 - index) }"
               @click="loadDefaultTemplate(template)">
            <div class="template-preview">
              <img :src="template.preview" :alt="t('stamp.template.preview')" />
            </div>
            <div class="template-info">
              <span class="template-name">{{ t('stamp.template.name') }}: {{ template.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import {DrawStampUtils} from './DrawStampUtils'
import { getSystemFonts } from './utils/fontUtils'
import { ICode, ICompany, IDrawImage, IDrawStampConfig, IDrawStar, IInnerCircle, IRoughEdge, ISecurityPattern, IStampType, ITaxNumber } from './DrawStampTypes'
import { useI18n } from 'vue-i18n'
import stampTemplate1 from './assets/templates/stamp_template1.json'
import stampTemplate2 from './assets/templates/stamp_template2.json'
import EditorControls from './EditorControls.vue'

const { t } = useI18n()
// 添加一个标志来控制 EditorControls 的加载
const isDrawStampUtilsReady = ref(false)

const editorControls = ref<HTMLDivElement | null>(null)
const stampCanvas = ref<HTMLCanvasElement | null>(null)
const MM_PER_PIXEL = 10 // 毫米换算像素

// 做旧效果
const applyAging = ref(false)
// 手动做旧
const manualAging = ref(false)
// 添加新的响应式数据
const agingIntensity = ref(50)
const showLegalDialog = ref(false) // 是否显示法律提示弹窗


// 保存模板
const saveAsTemplate = () => {
  const drawConfigs = drawStampUtils.getDrawConfigs()
  const jsonStr = JSON.stringify(drawConfigs, null, 2)

  // 创建 Blob
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // 创建下载链接
  const link = document.createElement('a')
  link.href = url
  link.download = 'stamp_template.json'
  document.body.appendChild(link)
  link.click()

  // 清理
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


// 绘制工具
let drawStampUtils: DrawStampUtils
// 初始化绘制印章参数
const initDrawStampUtils = () => {
  drawStampUtils = new DrawStampUtils(stampCanvas.value, MM_PER_PIXEL)
}

const drawStamp = (refreshSecurityPattern: boolean = false, refreshOld: boolean = false, refreshRoughEdge: boolean = false) => {
  // 使用drawstamputils进行绘制
  drawStampUtils.refreshStamp(refreshSecurityPattern, refreshOld, refreshRoughEdge)
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
  drawStamp()

  // 初始化所有字体选择器的预览
  document.querySelectorAll('.font-select, .font-input').forEach((element) => {
    if (element instanceof HTMLElement) {
      updateFontPreview({ target: element } as unknown as Event);
    }
  });
  isDrawStampUtilsReady.value = true
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

// 在组件挂载时加载保存的预设
onMounted(() => {
  loadPresetsFromLocalStorage()
})

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
  saveAsTemplate()
}

// 加载模板
const loadDefaultTemplate = (template: Template) => {
  try {
    const newConfig = JSON.parse(JSON.stringify(template.config)) as IDrawStampConfig
    newConfig.ruler.showRuler = true
    newConfig.ruler.showFullRuler = true
    newConfig.ruler.showSideRuler = true
    newConfig.ruler.showCrossLine = true
    newConfig.ruler.showCurrentPositionText = true
    newConfig.ruler.showDashLine = true
    newConfig.company.startAngle = template.config.company.startAngle
    newConfig.company.rotateDirection = template.config.company.rotateDirection

    console.log("load template", template, newConfig)
    // 设置新的配置
    drawStampUtils.setDrawConfigs(newConfig)
    // 刷新印章显示
    drawStamp()
    // 更新当前选中的模板索引（使用负数表示默认模板）
    currentTemplateIndex.value = -1 - defaultTemplates.findIndex(t => t === template)
  } catch (error) {
    console.error('加载默认模板失败:', error)
    alert('加载默认模板失败')
  }
}

// 保存模板列表到本地存储
const saveTemplatesToStorage = () => {
  localStorage.setItem('stampTemplates', JSON.stringify(templateList.value))
}

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

// 在组件挂载时加载保存的模板
onMounted(() => {
  loadTemplatesFromStorage()
})

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


</script>
<style scoped>
</style>
