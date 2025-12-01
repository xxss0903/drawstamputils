<template>
  <div v-if="showFormatDialog" class="legal-dialog-overlay" @click.self="closeFormatDialog">
    <div class="legal-dialog">
      <h3>{{ t('stamp.exportFormat.title') }}</h3>
      <div class="legal-content">
        <p>{{ t('stamp.exportFormat.description') }}</p>
        <div class="format-options">
          <button
            v-for="format in exportFormats"
            :key="format.value"
            type="button"
            class="format-button"
            :class="{ active: selectedFormat === format.value }"
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
  <div class="homepage">
    <div class="page-container">
      <!-- QQ群通知横幅 -->
      <div v-if="showQqNotification" class="qq-notification-banner">
        <div class="qq-notification-content">
          <span class="qq-notification-icon">💬</span>
          <span class="qq-notification-text">{{ t('homepage.qqNotification.text') }}</span>
          <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=RheepCUCpXh6hT9CI-AAYtm0XATHVWQR&jump_from=webapi&authKey=V8c0e3oZG2Uku+JLVZA2bM7OaEUZaYHNVrO/bZojWoJVOlojVx/Gh6655XpfflRR"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="DrawStamp交流群" title="DrawStamp交流群"></a>
          <!-- <a
            class="qq-notification-link"
            :href="qqGroupUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            {{ t('homepage.qqNotification.joinButton') }}
          </a> -->
        </div>
        <button class="qq-notification-close" @click="dismissQqNotification" title="关闭">×</button>
      </div>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">{{ t('homepage.hero.title') }}</h1>
          <p class="hero-subtitle">{{ t('homepage.hero.subtitle') }}</p>
        </div>
        <!-- 主内容区域：三栏布局 -->
        <div class="main-workspace">
          <!-- 左侧：元素列表 -->
          <ElementList
            v-if="isDrawStampUtilsReady"
            :drawStampUtils="drawStampUtils"
            @selectElement="handleSelectElement"
            @update-config="handleElementListUpdate"
            @refresh="handleElementListRefresh"
          />

          <!-- 中间：Canvas 绘制区域 -->
          <div class="canvas-area">
            <div class="canvas-header">
              <div class="canvas-tabs">
                <div class="canvas-tab active">
                  <span>Canvas #0</span>
                </div>
              </div>
            </div>
            <div class="canvas-wrapper">
              <canvas ref="stampCanvas" width="600" height="600"></canvas>
            </div>
            <div class="canvas-footer">
              <input
                ref="templateFileInput"
                type="file"
                accept=".json"
                style="display: none"
                @change="loadTemplateFile"
              />
              <button class="canvas-action-btn" @click="triggerTemplateFileLoad" :title="t('homepage.canvas.importTemplate')">
                <span>📥</span>
              </button>
              <button class="canvas-action-btn" @click="saveCurrentAsTemplate" :title="t('homepage.canvas.exportTemplate')">
                <span>📤</span>
              </button>
              <button class="canvas-action-btn" @click="resetStamp" :title="t('homepage.canvas.resetStamp')">
                <span>♻️</span>
              </button>
              <button
                class="canvas-action-btn"
                @click="saveStampAsPNG"
                :title="t('homepage.canvas.download')"
                :disabled="!userStore.isAuthenticated.value && getRemainingSaveCount() === 0"
              >
                <span>💾</span>
                <span
                  v-if="!userStore.isAuthenticated.value"
                  class="save-count-small"
                >
                  {{ getRemainingSaveCount() }}/{{ DAILY_SAVE_LIMIT }}
                </span>
              </button>
            </div>
          </div>

          <!-- 右侧：属性编辑器 -->
          <PropertiesPanel
            v-if="isDrawStampUtilsReady"
            ref="propertiesPanelRef"
            :drawStampUtils="drawStampUtils"
            :selectedElement="selectedElement"
            :elementType="selectedElementType"
            :elementIndex="selectedElementIndex"
            @updateDrawStamp="updateDrawStamp"
          />
        </div>
      </section>

      <!-- Stamp Types Section -->
      <section class="stamp-types-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.stampTypes.title') }}</h2>
          <div class="stamp-types-grid">
            <button
              v-for="option in templateOptions"
              :key="option.key"
              class="stamp-type-item"
              @click="selectTemplate(option.templateName)"
            >
              {{ t(`homepage.stampTypes.types.${option.labelKey}`) }}
            </button>
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="why-choose-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.whyChoose.title') }}</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🎨</div>
              <h3>{{ t('homepage.whyChoose.features.allInOne.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.allInOne.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⏰</div>
              <h3>{{ t('homepage.whyChoose.features.available247.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.available247.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <h3>{{ t('homepage.whyChoose.features.multiDevice.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.multiDevice.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🌍</div>
              <h3>{{ t('homepage.whyChoose.features.global.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.global.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💰</div>
              <h3>{{ t('homepage.whyChoose.features.free.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.free.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💾</div>
              <h3>{{ t('homepage.whyChoose.features.download.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.download.description') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.howItWorks.title') }}</h2>
          <div class="steps-container">
            <div class="step-item">
              <div class="step-number">1</div>
              <h3>{{ t('homepage.howItWorks.steps.step1.title') }}</h3>
              <p>{{ t('homepage.howItWorks.steps.step1.description') }}</p>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <h3>{{ t('homepage.howItWorks.steps.step2.title') }}</h3>
              <p>{{ t('homepage.howItWorks.steps.step2.description') }}</p>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <h3>{{ t('homepage.howItWorks.steps.step3.title') }}</h3>
              <p>{{ t('homepage.howItWorks.steps.step3.description') }}</p>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <h3>{{ t('homepage.howItWorks.steps.step4.title') }}</h3>
              <p>{{ t('homepage.howItWorks.steps.step4.description') }}</p>
            </div>
          </div>
          <div class="cta-section">
            <router-link to="/maker" class="cta-button-large">{{ t('homepage.howItWorks.cta') }}</router-link>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.features.title') }}</h2>
          <div class="features-list">
            <div class="feature-card">
              <h3>{{ t('homepage.features.items.logo.title') }}</h3>
              <p>{{ t('homepage.features.items.logo.description') }}</p>
            </div>
            <div class="feature-card">
              <h3>{{ t('homepage.features.items.template.title') }}</h3>
              <p>{{ t('homepage.features.items.template.description') }}</p>
            </div>
            <div class="feature-card">
              <h3>{{ t('homepage.features.items.formats.title') }}</h3>
              <p>{{ t('homepage.features.items.formats.description') }}</p>
            </div>
            <div class="feature-card">
              <h3>{{ t('homepage.features.items.documents.title') }}</h3>
              <p>{{ t('homepage.features.items.documents.description') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.faq.title') }}</h2>
          <div class="faq-list">
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q1.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q1.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q2.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q2.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q3.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q3.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q4.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q4.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q5.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q5.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q6.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q6.answer') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Warning Section -->
      <!--    <section class="warning-section">-->
      <!--      <div class="container">-->
      <!--        <div class="warning-box">-->
      <!--          <h3>⚠️ 重要提示</h3>-->
      <!--          <p>本工具仅供学习和参考使用！严禁用于任何非法用途！</p>-->
      <!--          <p>使用本工具生成的任何图片请勿用于任何非法用途。因违法使用本工具造成的任何法律责任和损失，需自行承担。请遵守相关法律法规，合法使用本工具。</p>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </section>-->
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { DrawStampUtils } from '../DrawStampUtils'
import { getSystemFonts } from '../utils/fontUtils'
import { IDrawStampConfig } from '../DrawStampTypes'
import ElementList from './editor/ElementList.vue'
import PropertiesPanel from './editor/PropertiesPanel.vue'
import { useStampStore } from '../stores/stampStore'
import { templateApi, type Template } from '../utils/api'
import { useUserStore } from '../stores/userStore'

const { t } = useI18n()
const router = useRouter()

const stampStore = useStampStore()
const userStore = useUserStore()
const templateMap = ref<Record<string, Template>>({})

// QQ群相关
const QQ_GROUP_NUMBER = '644574395'
const qqGroupUrl = `https://qm.qq.com/q/${QQ_GROUP_NUMBER}`
const QQ_NOTIFICATION_DISMISSED_KEY = 'qq_notification_dismissed'
const showQqNotification = ref(false)

// 检查是否已关闭通知
const checkQqNotificationStatus = () => {
  const dismissed = localStorage.getItem(QQ_NOTIFICATION_DISMISSED_KEY)
  showQqNotification.value = !dismissed
}

// 关闭通知
const dismissQqNotification = () => {
  showQqNotification.value = false
  localStorage.setItem(QQ_NOTIFICATION_DISMISSED_KEY, 'true')
}
const templateOptions = [
  { key: 'circle', labelKey: 'circle', templateName: '原型印章' },
  { key: 'ellipse', labelKey: 'ellipse', templateName: '心形印章' },
  { key: 'rectangle', labelKey: 'rectangle', templateName: '矩形印章' },
  { key: 'signature', labelKey: 'signature', templateName: '指纹印章' },
  { key: 'date', labelKey: 'date', templateName: '检验日期' },
  { key: 'text', labelKey: 'text', templateName: '作废印章' },
  { key: 'chinese', labelKey: 'chinese', templateName: '受控印章' },
]

const preloadTemplates = async () => {
  if (Object.keys(templateMap.value).length > 0) {
    return
  }

  try {
    const response = await templateApi.getTemplates()
    if (response.success && response.data) {
      response.data.forEach(template => {
        templateMap.value[template.name] = template
      })
    }
  } catch (error) {
    console.error('Failed to preload templates', error)
  }
}

const selectTemplate = async (templateName: string) => {
  if (!templateName) {
    router.push('/maker')
    return
  }

  if (!templateMap.value[templateName]) {
    await preloadTemplates()
  }

  const templateMeta = templateMap.value[templateName]
  if (!templateMeta) {
    router.push('/maker')
    return
  }

  try {
    const detail = await templateApi.getTemplate(templateMeta.id)
    if (detail.success && detail.data?.content) {
      localStorage.setItem('stamp_config', detail.data.content)
    }
    router.push('/maker')
  } catch (error) {
    console.error('Failed to load template', templateName, error)
    alert(t('templateManage.loadError'))
  }
}

// 添加一个标志来控制 EditorControls 的加载
const isDrawStampUtilsReady = ref(false)
const propertiesPanelRef = ref<InstanceType<typeof PropertiesPanel> | null>(null)

// 选中的元素
const selectedElement = ref<string>('')
const selectedElementType = ref<string>('')
const selectedElementIndex = ref<number>(-1)

// 处理元素选择
const handleSelectElement = (elementId: string, elementType: string, index: number) => {
  selectedElement.value = elementId
  selectedElementType.value = elementType
  selectedElementIndex.value = index
}

// 处理元素列表配置更新
const handleElementListUpdate = () => {
  // 配置已通过 stampStore 更新，这里触发重新绘制
  drawStamp()
}

// 处理元素列表刷新
const handleElementListRefresh = () => {
  // 刷新绘制
  drawStamp()
}

const stampCanvas = ref<any | null>(null)
const templateFileInput = ref<HTMLInputElement | null>(null)
const MM_PER_PIXEL = 10 // 毫米换算像素
const isDraggable = ref(false) // 是否开启拖动
const showFormatDialog = ref(false)
const selectedFormat = ref<'png' | 'jpeg' | 'svg'>('png')
const jpegQuality = ref(92)
const MIN_EXPORT_SIZE = 100
const MAX_EXPORT_SIZE = 4096
const defaultExportWidth = ref(0)
const defaultExportHeight = ref(0)
const exportWidth = ref(0)
const exportHeight = ref(0)
const selectedRatio = ref<'original' | 'square' | '4:3' | '16:9' | 'custom'>('original')

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

// 绘制工具
let drawStampUtils: DrawStampUtils

// 获取所有文字路径（公司名称、编码和印章类型）
let allTextPaths: any[] = []
let companyTextPaths: any[] = []
let codeTextPaths: any[] = []
let stampTypeTextPaths: any[] = []
let taxNumberTextPaths: any[] = []

// 初始化绘制印章参数
const initDrawStampUtils = () => {
  drawStampUtils = new DrawStampUtils(stampCanvas.value, MM_PER_PIXEL)
  stampStore.setConfig(drawStampUtils.getDrawConfigs())
}

const drawStamp = (refreshSecurityPattern: boolean = false, refreshOld: boolean = false, refreshRoughEdge: boolean = false) => {
  // 使用drawstamputils进行绘制
  drawStampUtils.refreshStamp(refreshSecurityPattern, refreshOld, refreshRoughEdge)

  // 确保拖动设置与当前状态一致
  drawStampUtils.setDraggable(isDraggable.value)
  stampStore.setConfig(drawStampUtils.getDrawConfigs())

  // 更新文字路径
  companyTextPaths = drawStampUtils.drawCompanyUtils.getTextPaths()
  codeTextPaths = drawStampUtils.drawCodeUtils.getTextPaths()
  stampTypeTextPaths = drawStampUtils.drawStampTypeUtils.getTextPaths()
  taxNumberTextPaths = drawStampUtils.drawTaxNumberUtils.getTextPaths()
  allTextPaths = [...companyTextPaths, ...codeTextPaths, ...stampTypeTextPaths, ...taxNumberTextPaths]
}

// 触发文件选择
const triggerTemplateFileLoad = () => {
  // 检查登录状态，未登录用户无法导入模板
  if (!userStore.isAuthenticated.value) {
    alert(t('stamp.needLoginForImport'))
    return
  }
  templateFileInput.value?.click()
}

// 加载模板文件
const loadTemplateFile = async (event: Event) => {
  // 检查登录状态，未登录用户无法导入模板
  if (!userStore.isAuthenticated.value) {
    alert(t('stamp.needLoginForImport'))
    const input = event.target as HTMLInputElement
    if (input) {
      input.value = '' // 清空文件选择
    }
    return
  }
  
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !drawStampUtils) return

  try {
    const file = input.files[0]
    const text = await file.text()
    const config = JSON.parse(text) as IDrawStampConfig

    // 设置新的配置
    const newConfig = JSON.parse(JSON.stringify(config)) as IDrawStampConfig
    newConfig.ruler.showRuler = true
    newConfig.ruler.showFullRuler = true
    newConfig.ruler.showSideRuler = true
    newConfig.ruler.showCrossLine = true
    newConfig.ruler.showCurrentPositionText = true
    newConfig.ruler.showDashLine = true

    if (config.company) {
      newConfig.company.startAngle = config.company.startAngle
      newConfig.company.rotateDirection = config.company.rotateDirection
    }

    if (!newConfig.svgList) {
      newConfig.svgList = []
    }

    drawStampUtils.setDrawConfigs(newConfig)
    stampStore.setConfig(newConfig)
    drawStamp()

    // 更新编辑器控件
    await nextTick()
    propertiesPanelRef.value?.restoreDrawConfigs()
  } catch (error) {
    console.error(t('errors.loadTemplateFailed') + ':', error)
    alert(t('errors.loadTemplateFailed'))
  } finally {
    // 清除文件选择，以便可以再次选择同一个文件
    input.value = ''
  }
}

// 每日保存次数管理
const DAILY_SAVE_LIMIT = 3
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

// 保存图片
const saveStampAsPNG = () => {
  // 检查是否可以保存
  const { canSave, message } = canSaveStamp()
  if (!canSave) {
    alert(message || t('stamp.dailyLimitReached', { limit: DAILY_SAVE_LIMIT }))
    return
  }

  if (!drawStampUtils) return
  const baseSize = drawStampUtils.getExportBaseSize()
  defaultExportWidth.value = Math.round(baseSize.width)
  defaultExportHeight.value = Math.round(baseSize.height)
  resetExportSize()
  selectedFormat.value = 'png'
  jpegQuality.value = 92

  showFormatDialog.value = true
}

const closeFormatDialog = () => {
  showFormatDialog.value = false
}

const getRemainingSaveCount = (): number => {
  if (userStore.isAuthenticated.value) {
    return -1
  }
  const todayCount = getTodaySaveCount()
  return Math.max(0, DAILY_SAVE_LIMIT - todayCount)
}

const confirmExport = () => {
  closeFormatDialog()

  // 如果是未登录用户，增加保存次数
  if (!userStore.isAuthenticated.value) {
    incrementTodaySaveCount()
  }

  if (!drawStampUtils) return
  const width = clampExportSize(exportWidth.value, Math.round(defaultExportWidth.value) || MIN_EXPORT_SIZE)
  const height = clampExportSize(exportHeight.value, Math.round(defaultExportHeight.value) || MIN_EXPORT_SIZE)
  const quality = selectedFormat.value === 'jpeg' ? jpegQuality.value / 100 : 0.92

  drawStampUtils.saveStampAsPNG(selectedFormat.value, quality, Math.round(width), Math.round(height))
}

const resetStamp = () => {
  if (!drawStampUtils) return
  const blankConfig = JSON.parse(JSON.stringify(drawStampUtils.getDrawConfigs())) as IDrawStampConfig
  blankConfig.companyList = []
  blankConfig.company.companyName = ''
  blankConfig.stampTypeList = []
  blankConfig.stampCode.code = ''
  blankConfig.taxNumber.code = ''
  blankConfig.imageList = []
  blankConfig.lineList = []
  blankConfig.innerCircleList = []
  blankConfig.svgList = []
  blankConfig.drawStar.drawStar = false
  blankConfig.drawStar.starPositionX = 0
  blankConfig.company.shape = 'ellipse'
  if (blankConfig.companyList) {
    blankConfig.companyList.forEach(company => company.shape = 'ellipse')
  }
  blankConfig.securityPattern.openSecurityPattern = false
  blankConfig.roughEdge.drawRoughEdge = false
  blankConfig.agingEffect.applyAging = false
  blankConfig.agingEffect.agingEffectParams = []
  blankConfig.openManualAging = false
  blankConfig.width = 40
  blankConfig.height = 40

  drawStampUtils.setDrawConfigs(blankConfig)
  stampStore.setConfig(blankConfig)
  selectedElement.value = ''
  selectedElementType.value = ''
  selectedElementIndex.value = -1
  drawStamp()
  handleSelectElement('basic-settings', 'basic', 0)
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

// 导出当前设置为模板
const saveCurrentAsTemplate = () => {
  // 检查登录状态，未登录用户无法导出模板
  if (!userStore.isAuthenticated.value) {
    alert(t('stamp.needLoginForExport'))
    return
  }
  
  if (!drawStampUtils) return

  const currentConfig = drawStampUtils.getDrawConfigs()
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

// 更新印章绘制，从EditorControls组件中调用
const updateDrawStamp = (newConfig: IDrawStampConfig, refreshSecurityPattern: boolean, refreshOld: boolean, refreshRoughEdge: boolean) => {
  drawStampUtils.setDrawConfigs(newConfig)
  drawStampUtils.refreshStamp(refreshSecurityPattern, refreshOld, refreshRoughEdge)
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
      drawStampUtils.canvas.style.cursor = 'pointer'
      return
    }
  }

  if (!isOverText) {
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
      // 可以在这里添加点击文字的处理逻辑
      return
    }
  }
}

// 在组件挂载时初始化
onMounted(async () => {
  checkQqNotificationStatus()
  initDrawStampUtils()
  await getSystemFonts()

  // 设置初始拖动状态
  drawStampUtils.setDraggable(isDraggable.value)
  if (stampCanvas.value) {
    stampCanvas.value.style.cursor = isDraggable.value ? 'move' : 'default'
  }

  drawStamp()
  // 初始化所有字体选择器的预览
  document.querySelectorAll('.font-select, .font-input').forEach((element) => {
    if (element instanceof HTMLElement) {
      updateFontPreview({ target: element } as unknown as Event);
    }
  });
  isDrawStampUtilsReady.value = true

  // 默认选中基础设置
  await nextTick()
  handleSelectElement('basic-settings', 'basic', 0)

  window.addEventListener('mousemove', handleMouseMove)
  drawStampUtils?.canvas?.addEventListener('click', handleCanvasClick)
})

// 在组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  drawStampUtils?.canvas?.removeEventListener('click', handleCanvasClick)
})
</script>

<style scoped>
.homepage {
  width: 100%;
  padding: 2rem;
}

/* QQ群通知横幅 */
.qq-notification-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.qq-notification-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.qq-notification-icon {
  font-size: 1.5rem;
}

.qq-notification-text {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
}

.qq-notification-link {
  background: white;
  color: #4caf50;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.qq-notification-link:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.qq-notification-close {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  transition: all 0.2s ease;
  margin-left: 1rem;
  opacity: 0.8;
}

.qq-notification-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .qq-notification-banner {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  .qq-notification-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
  }

  .qq-notification-link {
    width: 100%;
    text-align: center;
  }

  .qq-notification-close {
    align-self: flex-end;
    margin-left: 0;
  }
}

/* Hero Section */
.hero-section {
  color: white;
  padding-bottom: 2rem;
  text-align: center;
}

.hero-content {
  padding: 2rem 0;
    /* max-width: 800px; */
    margin: 0 auto 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.95;
}

.cta-button {
  display: inline-block;
  background: #fff;
  color: #667eea;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* 主工作区：三栏布局 */
.main-workspace {
  display: flex;
  background: white;
  border-radius: 12px;
  margin-top: 2rem;
  min-height: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Canvas 区域 */
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
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

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Section Title */
.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
}

/* Stamp Types Section */
.stamp-types-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.stamp-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.stamp-type-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  color: #555;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stamp-type-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Why Choose Section */
.why-choose-section {
  padding: 4rem 0;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-item {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: transform 0.2s;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
}

/* How It Works Section */
.how-it-works-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.step-item {
  text-align: center;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.step-number {
  width: 60px;
  height: 60px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.step-item h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.step-item p {
  color: #666;
  line-height: 1.6;
}

.cta-section {
  text-align: center;
}

.cta-button-large {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2rem;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.cta-button-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* Features Section */
.features-section {
  padding: 4rem 0;
  background: white;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* FAQ Section */
.faq-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.faq-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.faq-item p {
  color: #666;
  line-height: 1.6;
}

/* Warning Section */
.warning-section {
  padding: 3rem 0;
  background: #fff1f0;
}

.warning-box {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #ff4d4f;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-box h3 {
  color: #ff4d4f;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.warning-box p {
  color: #cf1322;
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .stamp-types-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .features-grid,
  .steps-container,
  .features-list {
    grid-template-columns: 1fr;
  }

  .main-workspace {
    flex-direction: column;
    min-height: auto;
  }

  .canvas-area {
    min-height: 400px;
  }
}
</style>

