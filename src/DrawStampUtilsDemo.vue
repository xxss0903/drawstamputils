<template>
  <!-- 格式选择对话框 -->
  <div v-if="showFormatDialog" class="legal-dialog-overlay" @click.self="closeFormatDialog">
    <div class="legal-dialog">
      <h3>{{ t('stamp.exportFormat.title') }}</h3>
      <div class="legal-content">
        <p>{{ t('stamp.exportFormat.description') }}</p>
        <div class="format-options">
          <button
            v-for="format in exportFormats"
            :key="format.value"
            class="format-button"
            :class="{ 'active': selectedFormat === format.value }"
            @click="selectedFormat = format.value"
          >
            <span class="format-icon">{{ format.icon }}</span>
            <span class="format-name">{{ format.name }}</span>
            <span class="format-desc">{{ format.desc }}</span>
          </button>
        </div>
        <div v-if="selectedFormat === 'jpeg'" class="quality-setting">
          <label>{{ t('stamp.exportFormat.quality') }}: {{ jpegQuality }}%</label>
          <input
            type="range"
            v-model.number="jpegQuality"
            min="10"
            max="100"
            step="5"
            class="quality-slider"
          />
        </div>
        <div class="size-setting">
          <div class="size-setting-header">
            <label>{{ t('stamp.exportFormat.sizeTitle') }}</label>
            <button class="size-reset" type="button" @click="resetExportSize">
              {{ t('stamp.exportFormat.resetSize') }}
            </button>
          </div>

          <div class="ratio-setting">
            <label>{{ t('stamp.exportFormat.ratioTitle') }}</label>
            <div class="ratio-options">
              <button
                v-for="option in ratioOptions"
                :key="option.value"
                type="button"
                class="ratio-button"
                :class="{ active: selectedRatio === option.value }"
                @click="applyRatio(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
            <p class="ratio-hint">{{ t('stamp.exportFormat.ratioHint') }}</p>
          </div>

          <div class="size-inputs">
            <div class="size-field">
              <span>{{ t('stamp.exportFormat.width') }} (px)</span>
              <input
                type="number"
                v-model.number="exportWidth"
                :min="MIN_EXPORT_SIZE"
                :max="MAX_EXPORT_SIZE"
                @input="handleWidthInput"
                @change="handleWidthInput"
              />
            </div>
            <div class="size-field">
              <span>{{ t('stamp.exportFormat.height') }} (px)</span>
              <input
                type="number"
                v-model.number="exportHeight"
                :min="MIN_EXPORT_SIZE"
                :max="MAX_EXPORT_SIZE"
                @input="handleHeightInput"
                @change="handleHeightInput"
              />
            </div>
          </div>
          <p class="size-hint">
            {{ t('stamp.exportFormat.sizeHint', { width: Math.round(defaultExportWidth) || 0, height: Math.round(defaultExportHeight) || 0 }) }}
          </p>
          <p class="size-hint">
            {{ t('stamp.exportFormat.sizeLimit', { min: MIN_EXPORT_SIZE, max: MAX_EXPORT_SIZE }) }}
          </p>
        </div>
      </div>
      <div class="dialog-buttons">
        <button @click="closeFormatDialog" class="cancel-button">{{ t('stamp.exportFormat.cancel') }}</button>
        <button @click="confirmExport" class="confirm-button">{{ t('stamp.exportFormat.export') }}</button>
      </div>
    </div>
  </div>
  <div class="maker-container">
    <div class="page-container" :class="{ 'has-warning': showSecurityWarning }">

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

      <!-- 顶部工具栏 -->
      <div v-if="false" class="top-toolbar">
        <div class="toolbar-left">
          <span v-if="false" class="app-title">DrawStamp - 印章制作工具</span>
        </div>
        <div v-if="false" class="toolbar-center">
          <button class="tool-icon" title="添加文字">
            <span>A+</span>
          </button>
          <button class="tool-icon" title="文字选项">
            <span>A</span>
          </button>
          <button class="tool-icon" title="放大">
            <span>🔍+</span>
          </button>
          <button class="tool-icon" title="缩小">
            <span>🔍-</span>
          </button>
          <button class="tool-icon" title="新建">
            <span>📄+</span>
          </button>
        </div>
        <div class="toolbar-right">
          <button v-if="false" class="primary-button" @click="showTemplateDialog = true">
            < Templates
          </button>
          <button class="primary-button" @click="openSaveTemplateDialog">
            {{ t('stamp.saveTemplate') }}
          </button>
          <button class="primary-button" @click="resetStamp">
            {{ t('stamp.resetStamp') }}
          </button>
          <button
            class="primary-button"
            :class="{ 'disabled': !userStore.isAuthenticated && getRemainingSaveCount() === 0 }"
            @click="saveStampAsPNG"
            :title="getDownloadButtonTitle()"
            :disabled="!userStore.isAuthenticated && getRemainingSaveCount() === 0"
          >
            {{ t('stamp.downloadStamp') }}
            <span v-if="!userStore.isAuthenticated && getRemainingSaveCount() >= 0" class="save-count-badge">
              ({{ getRemainingSaveCount() }}/{{ DAILY_SAVE_LIMIT }})
            </span>
          </button>
        </div>
      </div>

      <!-- 主内容区域：使用 StampWorkspace 组件封装三栏编辑区 -->
      <div class="main-workspace">
        <StampWorkspace
          v-model="stampConfig"
          @selectElement="handleSelectElement"
        />
      </div>

      <!-- 底部：模板选择列表 -->
      <div class="template-bar">
        <div class="template-bar-header">
          <h4>📋 {{ t('stamp.template.select') }}</h4>
          <div class="template-bar-actions">
            <input
              v-model="templateSearchQuery"
              type="text"
              class="template-search-input"
              placeholder="搜索模板名称或标签"
            />
            <button class="load-template-btn" @click="triggerTemplateFileLoad" :disabled="isLoadingTemplate">
              <span v-if="!isLoadingTemplate">📂</span>
              <span v-else class="loading-spinner-small"></span>
              {{ isLoadingTemplate ? t('stamp.template.loading') : t('stamp.template.loadFile') }}
            </button>
            <input
              type="file"
              ref="templateFileInput"
              style="display: none"
              accept=".json"
              @change="loadTemplateFile"
            />
            <button class="save-template-btn" @click="saveCurrentAsTemplate">
              <span>💾</span>
              {{ t('stamp.template.saveCurrent') }}
            </button>
          </div>
        </div>
        <div class="template-list-horizontal">
          <!-- 默认模板 -->
          <div
            v-for="(template, index) in filteredDefaultTemplates"
            :key="'default-' + index"
            class="template-item-horizontal"
            :class="{ 'active': currentTemplateIndex === (-1 - index) }"
            @click="loadSelectedTemplate(template)"
            :title="template.name"
          >
            <div class="template-preview-small">
              <img v-if="template.preview" :src="template.preview" :alt="template.name" />
              <div v-else class="template-placeholder">
                <div class="loading-spinner"></div>
                <span>{{ t('stamp.template.generatingPreview') }}</span>
              </div>
            </div>
            <div class="template-name-small">{{ template.name }}</div>
          </div>

          <!-- 分隔线 -->
          <div v-if="filteredPublicTemplates.length > 0" class="template-divider">
            <span>{{ t('stamp.template.publicTemplates') }}</span>
          </div>

          <!-- 公共模板 -->
          <div
            v-for="template in filteredPublicTemplates"
            :key="'public-' + template.id"
            class="template-item-horizontal public-template-item"
            :class="{ 'active': selectedPublicTemplateId === template.id }"
            @click="loadPublicTemplate(template)"
            :title="getTemplateDisplayName(template) + (template.description ? ' - ' + template.description : '')"
          >
            <div class="template-preview-small">
              <img
                v-if="template.preview"
                :src="template.preview"
                :alt="getTemplateDisplayName(template)"
              />
              <div v-else class="template-placeholder public-template-placeholder">
                {{ getTemplateDisplayName(template).charAt(0) }}
              </div>
              <div v-if="template.is_system" class="template-badge-small">系统</div>
            </div>
            <div class="template-name-small">{{ template.name }}</div>
          </div>

          <!-- 加载更多提示 -->
          <div v-if="loadingPublicTemplates" class="template-loading">
            <div class="loading-spinner"></div>
            <span>{{ t('stamp.template.loadingPublicTemplates') }}</span>
          </div>
        </div>
      </div>

      <!-- 使用模板弹窗组件 -->
      <TemplateDialog
        :show="showTemplateDialog"
        :templates="defaultTemplates"
        :currentIndex="currentTemplateIndex"
        :drawStampUtils="templateDialogDrawStampUtils"
        @close="showTemplateDialog = false"
        @save="saveCurrentAsTemplate"
        @select="loadSelectedTemplate"
      />

      <!-- 保存模板对话框 -->
      <div v-if="showSaveTemplateDialog" class="legal-dialog-overlay" @click.self="closeSaveTemplateDialog">
        <div class="legal-dialog">
          <h3>{{ t('stamp.saveTemplate') }}</h3>
          <div class="legal-content">
            <div class="form-group">
              <label>{{ t('template.name') }}:</label>
              <input
                type="text"
                v-model="saveTemplateForm.name"
                :placeholder="t('template.name')"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>{{ t('template.description') }}:</label>
              <textarea
                v-model="saveTemplateForm.description"
                :placeholder="t('template.description')"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
            <div v-if="saveTemplateError" class="error-message">
              {{ saveTemplateError }}
            </div>
          </div>
          <div class="dialog-buttons">
            <button @click="closeSaveTemplateDialog" class="cancel-button">{{ t('legal.cancel') }}</button>
            <button @click="handleSaveTemplate" class="confirm-button" :disabled="savingTemplate">
              {{ savingTemplate ? t('template.loading') : t('legal.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { IDrawStampConfig } from './DrawStampTypes'
import { useI18n } from 'vue-i18n'
import TemplateDialog from './components/TemplateDialog.vue'
import StampWorkspace from './components/editor/StampWorkspace.vue'
import { publicTemplateApi, templateApi, type PublicTemplate } from './utils/api'
import { useUserStore } from './stores/userStore'

const { t } = useI18n()
// 当前印章配置，由 StampWorkspace 维护并通过 v-model 同步
const stampConfig = ref<IDrawStampConfig | null>(null)

// 选中的元素
const selectedElement = ref<string>('')
const selectedElementType = ref<string>('')
const selectedElementIndex = ref<number>(-1)

// 处理元素选择（与 StampWorkspace 的事件 payload 兼容）
const handleSelectElement = (payloadOrId: string | { id: string; type: string; index: number }, elementType?: string, index?: number) => {
  if (typeof payloadOrId === 'object') {
    selectedElement.value = payloadOrId.id
    selectedElementType.value = payloadOrId.type
    selectedElementIndex.value = payloadOrId.index
  } else {
    selectedElement.value = payloadOrId
    selectedElementType.value = elementType || ''
    selectedElementIndex.value = index ?? -1
  }
}

// 处理元素列表配置更新（占位，保留与旧接口兼容）
const handleElementListUpdate = () => {}

// 处理元素列表刷新（占位，保留与旧接口兼容）
const handleElementListRefresh = () => {}
const showFormatDialog = ref(false) // 是否显示格式选择对话框
const selectedFormat = ref<'png' | 'jpeg' | 'svg'>('png') // 选中的导出格式
const jpegQuality = ref(92) // JPEG 质量（0-100）
const MIN_EXPORT_SIZE = 100
const MAX_EXPORT_SIZE = 4096
const defaultExportWidth = ref(0)
const defaultExportHeight = ref(0)
const exportWidth = ref(0)
const exportHeight = ref(0)
const selectedRatio = ref<'original' | 'square' | '4:3' | '16:9' | 'custom'>('original')
const isDraggable = ref(false) // 是否开启拖动

// 导出格式选项
const exportFormats = computed(() => [
  { value: 'png' as const, name: 'PNG', icon: '🖼️', desc: t('stamp.exportFormat.pngDesc') },
  { value: 'jpeg' as const, name: 'JPEG', icon: '📷', desc: t('stamp.exportFormat.jpegDesc') },
  { value: 'svg' as const, name: 'SVG', icon: '📐', desc: t('stamp.exportFormat.svgDesc') }
])

const ratioOptions = computed(() => [
  { value: 'original' as const, label: t('stamp.exportFormat.ratioOriginal') },
  { value: 'square' as const, label: t('stamp.exportFormat.ratioSquare') },
  { value: '4:3' as const, label: '4 : 3' },
  { value: '16:9' as const, label: '16 : 9' },
  { value: 'custom' as const, label: t('stamp.exportFormat.ratioCustom') }
])

const getRatioValue = (ratio: 'original' | 'square' | '4:3' | '16:9'): number => {
  if (ratio === 'square') return 1
  if (ratio === '4:3') return 4 / 3
  if (ratio === '16:9') return 16 / 9
  const baseWidth = Math.max(defaultExportWidth.value || MIN_EXPORT_SIZE, MIN_EXPORT_SIZE)
  const baseHeight = Math.max(defaultExportHeight.value || MIN_EXPORT_SIZE, MIN_EXPORT_SIZE)
  return baseWidth / baseHeight
}

const clampExportSize = (value: number, fallback: number) => {
  if (!value || Number.isNaN(value)) return fallback
  return Math.min(Math.max(value, MIN_EXPORT_SIZE), MAX_EXPORT_SIZE)
}

const applyRatio = (ratio: 'original' | 'square' | '4:3' | '16:9' | 'custom') => {
  selectedRatio.value = ratio
  if (ratio === 'custom') {
    return
  }
  const baseWidth = clampExportSize(defaultExportWidth.value, MIN_EXPORT_SIZE)
  const ratioValue = getRatioValue(ratio)
  exportWidth.value = Math.round(baseWidth)
  exportHeight.value = Math.round(baseWidth / ratioValue)
  exportHeight.value = clampExportSize(exportHeight.value, MIN_EXPORT_SIZE)
}

const resetExportSize = () => {
  applyRatio('original')
}

const handleWidthInput = () => {
  const fallback = Math.round(defaultExportWidth.value) || MIN_EXPORT_SIZE
  exportWidth.value = clampExportSize(exportWidth.value, fallback)
  if (selectedRatio.value !== 'custom') {
    const ratioValue = getRatioValue(selectedRatio.value)
    exportHeight.value = Math.round(exportWidth.value / ratioValue)
    exportHeight.value = clampExportSize(exportHeight.value, Math.round(defaultExportHeight.value) || MIN_EXPORT_SIZE)
  }
}

const handleHeightInput = () => {
  const fallback = Math.round(defaultExportHeight.value) || MIN_EXPORT_SIZE
  exportHeight.value = clampExportSize(exportHeight.value, fallback)
  if (selectedRatio.value !== 'custom') {
    const ratioValue = getRatioValue(selectedRatio.value)
    exportWidth.value = Math.round(exportHeight.value * ratioValue)
    exportWidth.value = clampExportSize(exportWidth.value, Math.round(defaultExportWidth.value) || MIN_EXPORT_SIZE)
  }
}

// 保存模板相关
const showSaveTemplateDialog = ref(false)
const savingTemplate = ref(false)
const saveTemplateError = ref('')
const saveTemplateForm = ref({
  name: '',
  description: ''
})
const userStore = useUserStore()


// 打开格式选择对话框
const saveStampAsPNG = () => {
  // 检查是否可以保存
  const { canSave, message } = canSaveStamp()
  if (!canSave) {
    alert(message || t('stamp.dailyLimitReached', { limit: DAILY_SAVE_LIMIT }))
    return
  }

  showFormatDialog.value = true
  selectedFormat.value = 'png'
  jpegQuality.value = 92
}

// 关闭格式选择对话框
const closeFormatDialog = () => {
  showFormatDialog.value = false
}


// 每日保存次数管理
const DAILY_SAVE_LIMIT = 5
const SAVE_COUNT_KEY = 'stamp_daily_save_count'
const SAVE_DATE_KEY = 'stamp_daily_save_date'

// 获取今日保存次数
const getTodaySaveCount = (): number => {
  const today = new Date().toDateString()
  const savedDate = localStorage.getItem(SAVE_DATE_KEY)
  const savedCount = localStorage.getItem(SAVE_COUNT_KEY)

  // 如果是新的一天，重置计数
  if (savedDate !== today) {
    localStorage.setItem(SAVE_DATE_KEY, today)
    localStorage.setItem(SAVE_COUNT_KEY, '0')
    return 0
  }

  return parseInt(savedCount || '0', 10)
}

// 增加今日保存次数
const incrementTodaySaveCount = (): void => {
  const today = new Date().toDateString()
  const currentCount = getTodaySaveCount()
  localStorage.setItem(SAVE_DATE_KEY, today)
  localStorage.setItem(SAVE_COUNT_KEY, String(currentCount + 1))
}

// 检查是否可以保存（未登录用户每天最多3次）
const canSaveStamp = (): { canSave: boolean; message?: string } => {
  // 已登录用户无限制
  if (userStore.isAuthenticated.value) {
    return { canSave: true }
  }

  // 未登录用户检查每日限制
  const todayCount = getTodaySaveCount()
  if (todayCount >= DAILY_SAVE_LIMIT) {
    return {
      canSave: false,
      message: t('stamp.dailyLimitReached', { limit: DAILY_SAVE_LIMIT })
    }
  }

  return { canSave: true }
}

// 获取剩余保存次数
const getRemainingSaveCount = (): number => {
  if (userStore.isAuthenticated.value) {
    return -1 // 已登录用户无限制，返回-1表示不显示
  }
  const todayCount = getTodaySaveCount()
  return Math.max(0, DAILY_SAVE_LIMIT - todayCount)
}

// 获取下载按钮标题
const getDownloadButtonTitle = (): string => {
  if (userStore.isAuthenticated.value) {
    return t('stamp.downloadStamp')
  }
  const remaining = getRemainingSaveCount()
  if (remaining === 0) {
    return t('stamp.dailyLimitReached', { limit: DAILY_SAVE_LIMIT })
  }
  return t('stamp.downloadStamp') + ` (${t('stamp.remainingSaves', { count: remaining, limit: DAILY_SAVE_LIMIT })})`
}

// 确认导出
const confirmExport = async () => {
  closeFormatDialog()

  // 如果是未登录用户，增加保存次数
  if (!userStore.isAuthenticated.value) {
    incrementTodaySaveCount()
  }

  if (!stampConfig.value) return

  // 计算 JPEG 质量（0-1）
  const quality = selectedFormat.value === 'jpeg' ? jpegQuality.value / 100 : 0.92
  const width = clampExportSize(exportWidth.value, Math.round(defaultExportWidth.value) || MIN_EXPORT_SIZE)
  const height = clampExportSize(exportHeight.value, Math.round(defaultExportHeight.value) || MIN_EXPORT_SIZE)

  // 使用临时 Canvas 和 DrawStampUtils 进行导出
  const tempCanvas = document.createElement('canvas')
  const { DrawStampUtils } = await import('./DrawStampUtils')
  const tempUtils = new DrawStampUtils(tempCanvas, 10)
  tempUtils.setDrawConfigs(stampConfig.value)
  tempUtils.refreshStamp()

  tempUtils.saveStampAsPNG(selectedFormat.value, quality, Math.round(width), Math.round(height))
}

const resetStamp = () => {
  if (!stampConfig.value) return
  const currentConfig = JSON.parse(JSON.stringify(stampConfig.value)) as IDrawStampConfig
  currentConfig.companyList = []
  currentConfig.company.companyName = ''
  currentConfig.stampTypeList = []
  currentConfig.stampCode.code = ''
  currentConfig.taxNumber.code = ''
  currentConfig.imageList = []
  currentConfig.lineList = []
  currentConfig.innerCircleList = []
  currentConfig.svgList = []
  currentConfig.drawStar.drawStar = false
  currentConfig.company.shape = 'ellipse'
  if (currentConfig.companyList) {
    currentConfig.companyList.forEach(company => company.shape = 'ellipse')
  }
  currentConfig.outBorder.shape = currentConfig.outBorder.shape || 'ellipse'
  currentConfig.securityPattern.openSecurityPattern = false
  currentConfig.roughEdge.drawRoughEdge = false
  currentConfig.agingEffect.applyAging = false
  currentConfig.agingEffect.agingEffectParams = []
  currentConfig.openManualAging = false
  currentConfig.width = 40
  currentConfig.height = 40

  stampConfig.value = currentConfig
  selectedElement.value = ''
  selectedElementType.value = ''
  selectedElementIndex.value = -1
}

// 打开保存模板对话框
const openSaveTemplateDialog = () => {
  if (!userStore.isAuthenticated.value) {
    alert(t('stamp.needLoginForTemplate'))
    return
  }
  saveTemplateForm.value = {
    name: '',
    description: ''
  }
  saveTemplateError.value = ''
  showSaveTemplateDialog.value = true
}

// 关闭保存模板对话框
const closeSaveTemplateDialog = () => {
  showSaveTemplateDialog.value = false
  saveTemplateError.value = ''
}

// 保存模板
const handleSaveTemplate = async () => {
  if (!saveTemplateForm.value.name.trim()) {
    saveTemplateError.value = t('templateManage.nameRequired')
    return
  }

  if (!userStore.isAuthenticated.value) {
    saveTemplateError.value = t('templateManage.needLogin')
    return
  }

  savingTemplate.value = true
  saveTemplateError.value = ''

  try {
    // 获取当前配置
    if (!stampConfig.value) {
      saveTemplateError.value = t('errors.loadTemplateError')
      return
    }
    const currentConfig = stampConfig.value
    const cleanedConfig = cleanConfigForTemplate(currentConfig)

    // 生成JSON文件
    const jsonBlob = new Blob([JSON.stringify(cleanedConfig, null, 2)], { type: 'application/json' })
    const jsonFile = new File([jsonBlob], `${saveTemplateForm.value.name}.json`, { type: 'application/json' })

    // 生成预览图片
    const previewDataUrl = await generateTemplatePreview(cleanedConfig)
    const previewBlob = await fetch(previewDataUrl).then(res => res.blob())
    const previewFile = new File([previewBlob], `${saveTemplateForm.value.name}.png`, { type: 'image/png' })

    // 上传模板
    const response = await templateApi.uploadTemplate(
      saveTemplateForm.value.name,
      saveTemplateForm.value.description.trim() || undefined,
      jsonFile,
      previewFile
    )

    if (response.success) {
      closeSaveTemplateDialog()
      alert(t('templateManage.uploadSuccess'))
    } else {
      saveTemplateError.value = response.error || t('templateManage.uploadError')
    }
  } catch (err) {
    saveTemplateError.value = err instanceof Error ? err.message : t('templateManage.uploadError')
  } finally {
    savingTemplate.value = false
  }
}

// 在组件挂载时加载字体
onMounted(async () => {
  // 检查是否有从模板管理页面传递的配置
  const savedConfig = localStorage.getItem('stamp_config')
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig) as IDrawStampConfig
      // 清除 localStorage
      localStorage.removeItem('stamp_config')
      stampConfig.value = config

      // 加载模板列表
      await loadTemplatesFromStorage()
      // 加载公共模板
      await loadPublicTemplates()

      return
    } catch (error) {
      console.error('Failed to load saved config:', error)
    }
  }

  // 正常初始化流程
  // 加载模板列表，这里是预览的模板列表
  await loadTemplatesFromStorage()
  // 加载公共模板
  await loadPublicTemplates()
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

// 在预设变化时保存
watch(stampTypePresets, () => {
  savePresetsToLocalStorage()
}, { deep: true })

// 添加展开/折叠状态控制
// 添加模板相关的类型定义
interface Template {
  name: string;
  preview: string;
  config: IDrawStampConfig;
}

// 添加模板相关的响应式数据
const currentTemplateIndex = ref(-1)
const templateFileInput = ref<HTMLInputElement | null>(null)
const isLoadingTemplate = ref(false)

// 触发文件选择
const triggerTemplateFileLoad = () => {
  templateFileInput.value?.click()
}

// 加载模板文件
const loadTemplateFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  try {
    isLoadingTemplate.value = true
    const file = input.files[0]
    const text = await file.text()
    const config = JSON.parse(text) as IDrawStampConfig

    // 关闭模板弹窗（如果打开）
    showTemplateDialog.value = false

    // 将选中的 config 设置到当前配置，StampWorkspace 会通过 v-model 接管渲染
    const newConfig = JSON.parse(JSON.stringify(config)) as IDrawStampConfig
    if (newConfig.ruler) {
      newConfig.ruler.showRuler = true
      newConfig.ruler.showFullRuler = true
      newConfig.ruler.showSideRuler = true
      newConfig.ruler.showCrossLine = true
      newConfig.ruler.showCurrentPositionText = true
      newConfig.ruler.showDashLine = true
    }
    if (config.company && newConfig.company) {
      newConfig.company.startAngle = config.company.startAngle
      newConfig.company.rotateDirection = config.company.rotateDirection
    }
    if (!newConfig.svgList) {
      newConfig.svgList = []
    }

    stampConfig.value = newConfig

    // 重置模板索引（因为是从文件加载的）
    currentTemplateIndex.value = -1
  } catch (error) {
    console.error('加载模板文件失败:', error)
    alert('加载模板文件失败，请检查文件格式是否正确')
  } finally {
    isLoadingTemplate.value = false
    // 清除文件选择，以便可以再次选择同一个文件
    if (input) {
      input.value = ''
    }
  }
}

// 清理未启用的效果数组，减小模板文件大小
const cleanConfigForTemplate = (config: IDrawStampConfig): IDrawStampConfig => {
  const cleanedConfig = JSON.parse(JSON.stringify(config)) as IDrawStampConfig

  // 如果做旧效果未开启，删除做旧参数数组
  if (cleanedConfig.agingEffect && !cleanedConfig.agingEffect.applyAging) {
    (cleanedConfig.agingEffect as any).agingEffectParams = undefined
  }

  // 如果毛边效果未开启，删除毛边参数数组
  if (cleanedConfig.roughEdge && !cleanedConfig.roughEdge.drawRoughEdge) {
    (cleanedConfig.roughEdge as any).roughEdgeParams = undefined
  }

  // 如果防伪纹路未开启，删除防伪纹路参数数组
  if (cleanedConfig.securityPattern && !cleanedConfig.securityPattern.openSecurityPattern) {
    (cleanedConfig.securityPattern as any).securityPatternParams = undefined
  }

  return cleanedConfig
}

// 保存当前设置为模板
const saveCurrentAsTemplate = async () => {
  // 保存到本地存储（如果需要保存自定义模板，可以在这里实现）
  if (!stampConfig.value) {
    alert(t('errors.loadTemplateError'))
    return
  }
  const currentConfig = stampConfig.value
  // 清理未启用的效果数组
  const cleanedConfig = cleanConfigForTemplate(currentConfig)
  // 使用紧凑格式（无缩进和换行）来减小文件大小，并排除 undefined 字段
  const jsonStr = JSON.stringify(cleanedConfig, (_key, value) => {
    // JSON.stringify 会自动排除 undefined 值，所以直接返回 value 即可
    return value
  })
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'stamp_template.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 加载模板，从模板弹窗选中模板，需要将模板的值设置到编辑器中
const loadSelectedTemplate = (template: Template) => {
  try {
    // 关闭模板弹窗
    showTemplateDialog.value = false

    // 清除公共模板选中状态（如果不是公共模板）
    if (!selectedPublicTemplateId.value) {
      selectedPublicTemplateId.value = null
    }

    // 将选中的 config 设置到当前配置，StampWorkspace 会通过 v-model 接管渲染
    const newConfig = JSON.parse(JSON.stringify(template.config)) as IDrawStampConfig
    if (newConfig.ruler) {
      newConfig.ruler.showRuler = true
      newConfig.ruler.showFullRuler = true
      newConfig.ruler.showSideRuler = true
      newConfig.ruler.showCrossLine = true
      newConfig.ruler.showCurrentPositionText = true
      newConfig.ruler.showDashLine = true
    }
    if (template.config.company && newConfig.company) {
      newConfig.company.startAngle = template.config.company.startAngle
      newConfig.company.rotateDirection = template.config.company.rotateDirection
    }
    if (!newConfig.svgList) {
      newConfig.svgList = []
    }

    stampConfig.value = newConfig

    // 更新当前选中的模板索引（使用负数表示默认模板）
    currentTemplateIndex.value = -1 - defaultTemplates.findIndex(t => t === template)
  } catch (error) {
    console.error('加载默认模板失败:', error)
    alert('加载默认模板失败')
  }
}

// 直接从 assets/templates 目录加载默认模板
const templateModules = import.meta.glob('./assets/templates/*.json', {
  eager: true
}) as Record<string, { default: IDrawStampConfig; name?: string }>
const templatePreviewModules = import.meta.glob('./assets/templates/*.png', {
  eager: true
}) as Record<string, { default: string }>

const formatTemplateName = (path: string, index: number) => {
  const fileName = path.split('/').pop() || `template-${index + 1}`
  return fileName.replace('.json', '')
}

const defaultTemplates: Template[] = Object.entries(templateModules).map(([path, module], index) => {
  const previewPath = path.replace('.json', '.png')
  const previewModule = templatePreviewModules[previewPath]
  return {
    name: module.name || formatTemplateName(path, index),
    preview: previewModule?.default || '',
    config: module.default
  }
})

// 模板搜索关键字
const templateSearchQuery = ref('')

// 过滤后的默认模板（按名称 / 标题 / 分类匹配）
const filteredDefaultTemplates = computed(() => {
  const q = templateSearchQuery.value.trim().toLowerCase()
  if (!q) return defaultTemplates
  return defaultTemplates.filter((tpl) => {
    const cfg = tpl.config
    const parts: string[] = []
    if (tpl.name) parts.push(tpl.name)
    if (cfg.title) parts.push(cfg.title)
    if (cfg.category) parts.push(cfg.category)
    if (cfg.categories && cfg.categories.length > 0) parts.push(...cfg.categories)
    const text = parts.join(' ').toLowerCase()
    return text.includes(q)
  })
})

// 添加新的响应式变量
const showSecurityWarning = ref(localStorage.getItem('showSecurityWarning') !== 'false')

watch(showSecurityWarning, (newValue) => {
  localStorage.setItem('showSecurityWarning', String(newValue))
})

// 更新印章绘制（旧接口占位，StampWorkspace 内部自行管理）
const updateDrawStamp = (_newConfig: IDrawStampConfig, _refreshSecurityPattern: boolean, _refreshOld: boolean, _refreshRoughEdge: boolean) => {}

// 添加模板弹窗控制
const showTemplateDialog = ref(false)

type PublicTemplateItem = PublicTemplate & {
  displayName?: string
  preview?: string
}

// 公共模板相关
const publicTemplates = ref<PublicTemplateItem[]>([])
const loadingPublicTemplates = ref(false)
const selectedPublicTemplateId = ref<string | null>(null)

// 过滤后的公共模板（按显示名称和描述匹配）
const filteredPublicTemplates = computed(() => {
  const q = templateSearchQuery.value.trim().toLowerCase()
  if (!q) return publicTemplates.value
  return publicTemplates.value.filter((tpl) => {
    const name = getTemplateDisplayName(tpl).toLowerCase()
    const desc = (tpl.description || '').toLowerCase()
    return name.includes(q) || desc.includes(q)
  })
})

// 从模板配置中解析名称
const parseTemplateName = (config: any): string | null => {
  // 尝试从配置中获取名称
  if (config.name) {
    return config.name
  }
  // 如果配置中有公司名称，可以使用公司名称作为模板名称
  if (config.company?.companyName) {
    return config.company.companyName
  }
  if (config.companyList && config.companyList.length > 0 && config.companyList[0]?.companyName) {
    return config.companyList[0].companyName
  }
  return null
}

// 获取模板显示名称（优先使用解析出的名称）
const getTemplateDisplayName = (template: PublicTemplateItem): string => {
  return template.displayName || template.name
}

// 模板名称缓存
const templateNameCache = new Map<string, string>()
const templatePreviewCache = new Map<string, string>()
const templateConfigCache = new Map<string, IDrawStampConfig>()

// 提供给 TemplateDialog 的简易 drawStampUtils 适配器
const templateDialogDrawStampUtils = {
  getDrawConfigs() {
    return stampConfig.value as IDrawStampConfig
  },
  setDrawConfigs(config: IDrawStampConfig) {
    // 深拷贝一份，避免外部修改直接影响内部引用
    stampConfig.value = JSON.parse(JSON.stringify(config)) as IDrawStampConfig
  }
}

const generateTemplatePreview = async (config: IDrawStampConfig): Promise<string> => {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = 500
  tempCanvas.height = 500
  const { DrawStampUtils } = await import('./DrawStampUtils')
  const tempDrawStampUtils = new DrawStampUtils(tempCanvas, 8)

  const previewConfig = JSON.parse(JSON.stringify(config)) as IDrawStampConfig
  if (previewConfig.ruler) {
    previewConfig.ruler.showRuler = false
    previewConfig.ruler.showFullRuler = false
    previewConfig.ruler.showSideRuler = false
    previewConfig.ruler.showCrossLine = false
    previewConfig.ruler.showCurrentPositionText = false
    previewConfig.ruler.showDashLine = false
  }

  tempDrawStampUtils.setDrawConfigs(previewConfig)
  tempDrawStampUtils.refreshStamp()

  await new Promise((resolve) => setTimeout(resolve, 100))

  return tempCanvas.toDataURL('image/png')
}

// 加载公共模板列表
const loadPublicTemplates = async () => {
  if (loadingPublicTemplates.value || publicTemplates.value.length > 0) return

  loadingPublicTemplates.value = true
  try {
    const response = await publicTemplateApi.getPublicTemplates(10, 0, 'collect_count')
    if (response.success && response.data) {
      const templatesWithParsedData = await Promise.all(
        response.data.map(async (template) => {
          const cachedName = templateNameCache.get(template.id)
          const cachedPreview = templatePreviewCache.get(template.id)
          const cachedConfig = templateConfigCache.get(template.id)

          if (cachedName && cachedPreview) {
            return { ...template, displayName: cachedName, preview: cachedPreview }
          }

          let config: IDrawStampConfig | null = cachedConfig || null

          if (!config) {
            try {
              const detailResponse = await publicTemplateApi.getPublicTemplate(template.id)
              if (detailResponse.success && detailResponse.data?.content) {
                config = JSON.parse(detailResponse.data.content) as IDrawStampConfig
                templateConfigCache.set(template.id, config)
              }
            } catch (err) {
              console.error(`获取模板 ${template.id} 详情失败:`, err)
            }
          }

          if (config) {
            const parsedName = parseTemplateName(config)
            if (parsedName) {
              templateNameCache.set(template.id, parsedName)
            }

            let preview = cachedPreview
            if (!preview) {
              try {
                preview = await generateTemplatePreview(config)
                templatePreviewCache.set(template.id, preview)
              } catch (err) {
                console.error(`生成模板 ${template.id} 预览失败:`, err)
              }
            }

            return {
              ...template,
              displayName: parsedName || cachedName,
              preview: preview || cachedPreview,
            }
          }

          return {
            ...template,
            displayName: cachedName,
            preview: cachedPreview,
          }
        })
      )
      publicTemplates.value = templatesWithParsedData
    }
  } catch (err) {
    console.error('加载公共模板失败:', err)
  } finally {
    loadingPublicTemplates.value = false
  }
}

// 加载公共模板
const loadPublicTemplate = async (template: PublicTemplateItem) => {
  selectedPublicTemplateId.value = template.id
  loadingPublicTemplates.value = true

  try {
    let config: IDrawStampConfig | null = templateConfigCache.get(template.id) || null

    if (!config) {
      const response = await publicTemplateApi.getPublicTemplate(template.id)
      if (response.success && response.data && response.data.content) {
        config = JSON.parse(response.data.content) as IDrawStampConfig
        templateConfigCache.set(template.id, config)
      }
    }

    if (config) {
      const parsedName = parseTemplateName(config)
      const templateName = parsedName || getTemplateDisplayName(template)

      const templateObj: Template = {
        name: templateName,
        preview: template.preview || '',
        config,
      }

      loadSelectedTemplate(templateObj)
      selectedPublicTemplateId.value = template.id
    }
  } catch (err) {
    console.error('加载公共模板失败:', err)
    alert(err instanceof Error ? err.message : t('stamp.template.loadPublicTemplateError'))
    selectedPublicTemplateId.value = null
  } finally {
    loadingPublicTemplates.value = false
  }
}


// 从本地存储加载模板列表
const loadTemplatesFromStorage = async () => {
  // 生成默认模板的预览图
  for (const template of defaultTemplates) {
    try {
      if (!template.preview) {
        template.preview = await generateTemplatePreview(template.config)
      }
    } catch (error) {
      console.error('生成模板预览失败:', error)
    }
  }
}

// 监听拖动状态变化（保留占位，未来可用于传递给 StampWorkspace）
watch(isDraggable, () => {
  // 暂时不直接控制画布拖动，由 StampWorkspace 内部管理
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

/* 顶部工具栏 */
.top-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  flex-shrink: 0;
}

.toolbar-left {
  flex: 1;
}

.app-title {
  font-size: 14px;
  font-weight: 500;
}

.toolbar-center {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tool-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.tool-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.primary-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #52c41a;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.primary-button:hover {
  background: #73d13d;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}



/* Canvas 区域 */
.canvas-area {
  /*flex: 1;*/
  /*display: flex;*/
  /*flex-direction: column;*/
  /*background: white;*/
  /*margin: 12px;*/
  /*border-radius: 8px;*/
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.canvas-header {
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  flex-shrink: 0;
}

.canvas-tabs {
  display: flex;
  gap: 8px;
}

.canvas-tab {
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
}

.canvas-tab.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background:
    linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.canvas-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
  flex-shrink: 0;
}

.canvas-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
}

.canvas-action-btn:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  transform: scale(1.1);
}

/* 底部模板选择栏 */
.template-bar {
  background: white;
  border-top: 2px solid #e0e0e0;
  padding: 20px;
  flex-shrink: 0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.template-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.template-bar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.template-search-input {
  width: 220px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
}

.template-search-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.15);
}

.template-bar-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.load-template-btn {
  padding: 8px 16px;
  border: 1px solid #1890ff;
  border-radius: 6px;
  background: white;
  color: #1890ff;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.load-template-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid #e0e0e0;
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

.load-template-btn:hover {
  background: #e6f7ff;
  border-color: #40a9ff;
}

.save-template-btn {
  padding: 8px 16px;
  border: 1px solid #52c41a;
  border-radius: 6px;
  background: white;
  color: #52c41a;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.save-template-btn:hover {
  background: #f6ffed;
  border-color: #73d13d;
}

.template-list-horizontal {
  display: grid;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 0;
  scrollbar-width: thin;
  scrollbar-color: #d0d0d0 #f5f5f5;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.template-list-horizontal::-webkit-scrollbar {
  height: 8px;
}

.template-list-horizontal::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.template-list-horizontal::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

.template-list-horizontal::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.template-item-horizontal {
  flex-shrink: 0;
  width: 140px;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.template-item-horizontal:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  transform: translateY(-2px);
}

.template-item-horizontal.active {
  border-color: #1890ff;
  background: #e6f7ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transform: translateY(-4px);
}

.template-preview-small {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.template-preview-small img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.template-placeholder {
  font-size: 12px;
  color: #999;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e0e0e0;
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.template-name-small {
  font-size: 13px;
  text-align: center;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.template-divider {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  margin: 16px 0 8px 0;
  padding: 8px 0;
  border-top: 1px solid #e0e0e0;
}

.template-divider span {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  background: white;
  padding: 0 12px;
  margin-top: -20px;
}

.public-template-item {
  position: relative;
}

.public-template-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 6px;
}

.template-badge-small {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #28a745;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  z-index: 1;
}

.template-loading {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
  gap: 8px;
}

.canvas-wrapper {
  margin-bottom: 0;
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

/* 表单样式 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #262626;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1890ff;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 8px;
}

.save-count-badge {
  font-size: 12px;
  margin-left: 4px;
  color: #666;
  font-weight: normal;
}

.primary-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.canvas-action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
