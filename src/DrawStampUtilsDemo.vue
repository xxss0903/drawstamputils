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
      <div class="top-toolbar">
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
          <button class="primary-button" @click="saveStampAsPNG">
            {{ t('stamp.downloadStamp') }}
          </button>
        </div>
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
            <button v-if="false" class="canvas-action-btn" title="可见性">
              <span>👁️</span>
            </button>
            <button v-if="false" class="canvas-action-btn" title="效果">
              <span>✨</span>
            </button>
            <button class="canvas-action-btn" @click="saveStampAsPNG" title="下载">
              <span>💾</span>
            </button>
<!--            <button class="canvas-action-btn" title="帮助">-->
<!--              <span>❓</span>-->
<!--            </button>-->
<!--            <button class="canvas-action-btn" title="联系">-->
<!--              <span>✉️</span>-->
<!--            </button>-->
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

      <!-- 底部：模板选择列表 -->
      <div class="template-bar">
        <div class="template-bar-header">
          <h4>📋 {{ t('stamp.template.select') }}</h4>
          <div class="template-bar-actions">
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
            v-for="(template, index) in defaultTemplates"
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
          <div v-if="publicTemplates.length > 0" class="template-divider">
            <span>{{ t('stamp.template.publicTemplates') }}</span>
          </div>

          <!-- 公共模板 -->
          <div
            v-for="template in publicTemplates"
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
        :drawStampUtils="drawStampUtils"
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
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import {DrawStampUtils} from './DrawStampUtils'
import { getSystemFonts } from './utils/fontUtils'
import { IDrawStampConfig } from './DrawStampTypes'
import { useI18n } from 'vue-i18n'
import TemplateDialog from './components/TemplateDialog.vue'
import ElementList from './components/editor/ElementList.vue'
import PropertiesPanel from './components/editor/PropertiesPanel.vue'
import { useStampStore } from './stores/stampStore'
import { publicTemplateApi, templateApi, type PublicTemplate } from './utils/api'
import { useUserStore } from './stores/userStore'

const { t } = useI18n()
// 添加一个标志来控制 EditorControls 的加载
const isDrawStampUtilsReady = ref(false)

const propertiesPanelRef = ref<InstanceType<typeof PropertiesPanel> | null>(null)

const stampStore = useStampStore()

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
const MM_PER_PIXEL = 10 // 毫米换算像素

const showLegalDialog = ref(false) // 是否显示法律提示弹窗
const isDraggable = ref(false) // 是否开启拖动

// 保存模板相关
const showSaveTemplateDialog = ref(false)
const savingTemplate = ref(false)
const saveTemplateError = ref('')
const saveTemplateForm = ref({
  name: '',
  description: ''
})
const userStore = useUserStore()


// 绘制工具
let drawStampUtils: DrawStampUtils
// 初始化绘制印章参数
const initDrawStampUtils = () => {
  drawStampUtils = new DrawStampUtils(stampCanvas.value, MM_PER_PIXEL)
  stampStore.setConfig(drawStampUtils.getDrawConfigs())
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
  stampStore.setConfig(drawStampUtils.getDrawConfigs())

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

const resetStamp = () => {
  const currentConfig = JSON.parse(JSON.stringify(drawStampUtils.getDrawConfigs())) as IDrawStampConfig
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

  drawStampUtils.setDrawConfigs(currentConfig)
  stampStore.setConfig(currentConfig)
  selectedElement.value = ''
  selectedElementType.value = ''
  selectedElementIndex.value = -1
  drawStamp()
  handleSelectElement('basic-settings', 'basic', 0)
}

// 打开保存模板对话框
const openSaveTemplateDialog = () => {
  if (!userStore.isAuthenticated) {
    alert(t('templateManage.needLogin'))
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

  if (!userStore.isAuthenticated) {
    saveTemplateError.value = t('templateManage.needLogin')
    return
  }

  savingTemplate.value = true
  saveTemplateError.value = ''

  try {
    // 获取当前配置
    const currentConfig = drawStampUtils.getDrawConfigs()
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

// 添加系统字体列表
const systemFonts = ref<string[]>([])

// 加载系统字体
const loadSystemFonts = async () => {
  systemFonts.value = await getSystemFonts()
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
      
      // 初始化绘制工具
      initDrawStampUtils()
      await loadSystemFonts()

      // 设置初始拖动状态
      drawStampUtils.setDraggable(isDraggable.value)
      if (stampCanvas.value) {
        stampCanvas.value.style.cursor = isDraggable.value ? 'move' : 'default'
      }
      
      // 设置配置
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
      
      // 更新文字路径
      companyTextPaths = drawStampUtils.drawCompanyUtils.getTextPaths()
      codeTextPaths = drawStampUtils.drawCodeUtils.getTextPaths()
      stampTypeTextPaths = drawStampUtils.drawStampTypeUtils.getTextPaths()
      taxNumberTextPaths = drawStampUtils.drawTaxNumberUtils.getTextPaths()
      allTextPaths = [...companyTextPaths, ...codeTextPaths, ...stampTypeTextPaths, ...taxNumberTextPaths]
      
      // 加载模板列表
      await loadTemplatesFromStorage()
      // 加载公共模板
      await loadPublicTemplates()
      
      // 初始化所有字体选择器的预览
      await nextTick()
      document.querySelectorAll('.font-select, .font-input').forEach((element) => {
        if (element instanceof HTMLElement) {
          updateFontPreview({ target: element } as unknown as Event);
        }
      });
      
      // 标记为就绪
      isDrawStampUtilsReady.value = true
      
      // 选中基础设置，这样属性面板会显示
      await nextTick()
      handleSelectElement('basic-settings', 'basic', 0)
      
      // 恢复编辑器控件的配置
      await nextTick()
      propertiesPanelRef.value?.restoreDrawConfigs()
      
      // 添加事件监听器
      window.addEventListener('mousemove', handleMouseMove)
      drawStampUtils?.canvas?.addEventListener('click', handleCanvasClick)
      
      return
    } catch (error) {
      console.error('Failed to load saved config:', error)
    }
  }
  
  // 正常初始化流程
  initDrawStampUtils()
  await loadSystemFonts()

  // 设置初始拖动状态
  drawStampUtils.setDraggable(isDraggable.value)
  if (stampCanvas.value) {
    stampCanvas.value.style.cursor = isDraggable.value ? 'move' : 'default'
  }

  drawStamp()
  // 加载模板列表，这里是预览的模板列表
  await loadTemplatesFromStorage()
  // 加载公共模板
  await loadPublicTemplates()
  // 初始化所有字体选择器的预览
  document.querySelectorAll('.font-select, .font-input').forEach((element) => {
    if (element instanceof HTMLElement) {
      updateFontPreview({ target: element } as unknown as Event);
    }
  });
  isDrawStampUtilsReady.value = true
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

// 打开提取印章工具网址
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
    drawStamp()
    setTimeout(() => {
      isDrawStampUtilsReady.value = true
      console.log("refresh editor controls")
      propertiesPanelRef.value?.restoreDrawConfigs()
    }, 100)

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

// 加载模板，从模板弹窗选中模板，需要将模板的值设置到左边设置里面
const loadSelectedTemplate = (template: Template) => {
  try {
    // 关闭模板弹窗
    showTemplateDialog.value = false
    
    // 清除公共模板选中状态（如果不是公共模板）
    if (!selectedPublicTemplateId.value) {
      selectedPublicTemplateId.value = null
    }

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
    if (!newConfig.svgList) {
      newConfig.svgList = []
    }

    drawStampUtils.setDrawConfigs(newConfig)
    drawStamp()
    // drawStampUtils.refreshStamp()
    setTimeout(() => {
      isDrawStampUtilsReady.value = true
      console.log("refresh editor controls")
      propertiesPanelRef.value?.restoreDrawConfigs()
    }, 100)

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

type PublicTemplateItem = PublicTemplate & {
  displayName?: string
  preview?: string
}

// 公共模板相关
const publicTemplates = ref<PublicTemplateItem[]>([])
const loadingPublicTemplates = ref(false)
const selectedPublicTemplateId = ref<string | null>(null)

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

const generateTemplatePreview = async (config: IDrawStampConfig): Promise<string> => {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = 500
  tempCanvas.height = 500
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

      // 根据文字类型处理点击，选中对应元素
      if (textPath.type === 'company') {
        const companyIndex = findCompanyIndexByText(textPath.text)
        if (companyIndex !== -1) {
          handleSelectElement(`company-${companyIndex}`, 'company', companyIndex)
          propertiesPanelRef.value?.restoreDrawConfigs()
        }
      } else if (textPath.type === 'code') {
        handleSelectElement('code', 'code', 0)
        propertiesPanelRef.value?.restoreDrawConfigs()
      } else if (textPath.type === 'stampType') {
        const stampTypeIndex = findStampTypeIndexByText(textPath.text)
        if (stampTypeIndex !== -1) {
          handleSelectElement(`stampType-${stampTypeIndex}`, 'stampType', stampTypeIndex)
          propertiesPanelRef.value?.restoreDrawConfigs()
        }
      } else if (textPath.type === 'taxNumber') {
        handleSelectElement('taxNumber', 'taxNumber', 0)
        propertiesPanelRef.value?.restoreDrawConfigs()
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

/* 主工作区：三栏布局 */
.main-workspace {
  display: flex;
  flex: 1;
  overflow: hidden;
  background: #f5f5f5;
  min-height: 0; /* 确保 flex 子元素可以正确收缩 */
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
</style>
