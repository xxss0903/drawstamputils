<template>
    <div class="editor-container" :class="{ 'has-warning': showSecurityWarning }">
      <div class="editor-controls" ref="editorControls">
        <BasicSettingsPanel
          v-show="props.showAll || currentGroupName === 'basic'"
          :expanded="props.showAll ? expandedGroups.basic : true"
          :is-circle-detect="isCircleDetect"
          :config="getDrawConfigs()"
          @update:expanded="value => (expandedGroups.basic = value)"
          @update:is-circle-detect="handleIsCircleDetectChange"
          @update-config="handleBasicConfigUpdate"
        />

        <CompanySettingsPanel
          v-show="props.showAll || currentGroupName === 'company'"
          :expanded="props.showAll ? expandedGroups.company : true"
          :config="getDrawConfigs()"
          :system-fonts="systemFonts"
          :selected-index="props.selectedElementType === 'company' ? props.selectedElementIndex ?? -1 : -1"
          @update:expanded="value => (expandedGroups.company = value)"
          @update-config="handleCompanyConfigUpdate"
        />

        <StampTypeSettingsPanel
          v-show="props.showAll || currentGroupName === 'stampType'"
          :expanded="props.showAll ? expandedGroups.stampType : true"
          :config="getDrawConfigs()"
          :system-fonts="systemFonts"
          :selected-index="props.selectedElementType === 'stampType' ? props.selectedElementIndex ?? -1 : -1"
          @update:expanded="value => (expandedGroups.stampType = value)"
          @update-config="handleStampTypeConfigUpdate"
        />

        <CodeSettingsPanel
          v-show="props.showAll || currentGroupName === 'code'"
          :expanded="props.showAll ? expandedGroups.code : true"
          :config="getDrawConfigs()"
          :system-fonts="systemFonts"
          :selected-index="props.selectedElementType === 'code' ? props.selectedElementIndex ?? -1 : -1"
          @update:expanded="value => (expandedGroups.code = value)"
          @update-config="handleCodeConfigUpdate"
        />

        <TaxNumberSettingsPanel
          v-show="props.showAll || currentGroupName === 'taxNumber'"
          :expanded="props.showAll ? expandedGroups.taxNumber : true"
          :config="getDrawConfigs()"
          :system-fonts="systemFonts"
          @update:expanded="value => (expandedGroups.taxNumber = value)"
          @update-config="handleTaxNumberConfigUpdate"
        />

        <ImageListSettingsPanel
          v-show="props.showAll || currentGroupName === 'images'"
          :expanded="props.showAll ? expandedGroups.images : true"
          :config="getDrawConfigs()"
          :selected-index="props.selectedElementType === 'image' ? props.selectedElementIndex ?? -1 : -1"
          @update:expanded="value => (expandedGroups.images = value)"
          @update-config="handleImageListConfigUpdate"
        />

        <SvgSettingsPanel
          v-show="props.showAll || currentGroupName === 'svg'"
          :expanded="props.showAll ? expandedGroups.svg : true"
          :config="getDrawConfigs()"
          :selected-index="props.selectedElementType === 'svg' ? props.selectedElementIndex ?? -1 : -1"
          @update:expanded="value => (expandedGroups.svg = value)"
          @update-config="handleSvgConfigUpdate"
        />

        <LineSettingsPanel
          v-show="props.showAll || currentGroupName === 'lines'"
          :expanded="props.showAll ? expandedGroups.lines : true"
          :config="getDrawConfigs()"
          :selected-index="props.selectedElementType === 'line' ? props.selectedElementIndex ?? -1 : -1"
          @update:expanded="value => (expandedGroups.lines = value)"
          @update-config="handleLineConfigUpdate"
        />

        <StarSettingsPanel
          v-show="props.showAll || currentGroupName === 'star'"
          :expanded="props.showAll ? expandedGroups.star : true"
          :config="getDrawConfigs()"
          @update:expanded="value => (expandedGroups.star = value)"
          @update-config="handleStarConfigUpdate"
        />

        <SecurityPatternSettingsPanel
          v-show="props.showAll || currentGroupName === 'security'"
          :expanded="props.showAll ? expandedGroups.security : true"
          :config="getDrawConfigs()"
          @update:expanded="value => (expandedGroups.security = value)"
          @update-config="handleSecurityPatternConfigUpdate"
          @refresh-security-pattern="refreshSecurityPattern"
        />

        <RoughEdgeSettingsPanel
          v-show="props.showAll || currentGroupName === 'roughEdge'"
          :expanded="props.showAll ? expandedGroups.roughEdge : true"
          :config="getDrawConfigs()"
          @update:expanded="value => (expandedGroups.roughEdge = value)"
          @update-config="handleRoughEdgeConfigUpdate"
          @refresh-rough-edge="refreshRoughEdge"
        />

        <AgingEffectSettingsPanel
          v-show="props.showAll || currentGroupName === 'aging'"
          :expanded="props.showAll ? expandedGroups.aging : true"
          :config="getDrawConfigs()"
          @update:expanded="value => (expandedGroups.aging = value)"
          @update-config="handleAgingEffectConfigUpdate"
          @refresh-aging-effect="refreshAgingEffect"
        />

        <InnerCircleSettingsPanel
          v-show="props.showAll || currentGroupName === 'innerCircle'"
          :expanded="props.showAll ? expandedGroups.innerCircle : true"
          :config="getDrawConfigs()"
          :selected-index="props.selectedElementType === 'circle' ? props.selectedElementIndex ?? -1 : -1"
          @update:expanded="value => (expandedGroups.innerCircle = value)"
          @update-config="handleInnerCircleConfigUpdate"
        />
      </div>
    </div>
  </template>
  <script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
  import {DrawStampUtils} from './DrawStampUtils'
  import { getSystemFonts } from './utils/fontUtils'
import { ICompany, IDrawStampConfig, IInnerCircle, IStampType } from './DrawStampTypes'
  import { useI18n } from 'vue-i18n'
import { useStampStore } from './stores/stampStore'
import BasicSettingsPanel from './components/editor/panels/BasicSettingsPanel.vue'
import CompanySettingsPanel from './components/editor/panels/CompanySettingsPanel.vue'
import StampTypeSettingsPanel from './components/editor/panels/StampTypeSettingsPanel.vue'
import CodeSettingsPanel from './components/editor/panels/CodeSettingsPanel.vue'
import TaxNumberSettingsPanel from './components/editor/panels/TaxNumberSettingsPanel.vue'
import ImageListSettingsPanel from './components/editor/panels/ImageListSettingsPanel.vue'
import StarSettingsPanel from './components/editor/panels/StarSettingsPanel.vue'
import SecurityPatternSettingsPanel from './components/editor/panels/SecurityPatternSettingsPanel.vue'
import RoughEdgeSettingsPanel from './components/editor/panels/RoughEdgeSettingsPanel.vue'
import AgingEffectSettingsPanel from './components/editor/panels/AgingEffectSettingsPanel.vue'
import InnerCircleSettingsPanel from './components/editor/panels/InnerCircleSettingsPanel.vue'
import LineSettingsPanel from './components/editor/panels/LineSettingsPanel.vue'
import SvgSettingsPanel from './components/editor/panels/SvgSettingsPanel.vue'

  const { t } = useI18n()

  const editorControls = ref<HTMLDivElement | null>(null)

  // 将drawStampUtils作为props传递给EditorControls
  const props = defineProps<{
    drawStampUtils: DrawStampUtils
    selectedElementType?: string
    selectedElementIndex?: number
    showAll?: boolean
    }>()

  // 元素类型到设置组名称的映射
const elementTypeToGroupMap: Record<string, string> = {
    'basic': 'basic',
    'company': 'company',
    'stampType': 'stampType',
    'code': 'code',
    'taxNumber': 'taxNumber',
    'star': 'star',
    'circle': 'innerCircle',
    'image': 'images',
    'svg': 'svg',
    'aging': 'aging',
    'roughEdge': 'roughEdge',
    'security': 'security',
    'line': 'lines'
  }

  // 获取当前应该显示的组名
  const currentGroupName = computed(() => {
    if (!props.selectedElementType) return ''
    return elementTypeToGroupMap[props.selectedElementType] || ''
  })

  // 更新drawStampUtils，更新绘制印章
  const emit = defineEmits(['updateDrawStamp'])
const stampStore = useStampStore()

const getDrawConfigs = (): IDrawStampConfig => {
  if (!stampStore.state.config) {
    const config = props.drawStampUtils.getDrawConfigs()
    stampStore.setConfig(config)
    return config
  }
  return stampStore.state.config
}

  const isCircleDetect = ref(true)
  // 添加响应式数据
  const companyName = ref('绘制印章有限责任公司')
  // 公司名称字体大（毫米）
  const companyFontFamily = ref('Songti SC')
  const companyFontSizeMM = ref(4.2)
  // 圆形印章半径（毫米）
  const circleRadius = ref(20)
  // 圆形边框宽度（毫米）
  const circleBorderWidth = ref(1)
  // 主题颜色
  const primaryColor = ref('blue')
  // 做旧效果、防伪纹路、毛边效果、内圈圆设置现在从 config 中直接读取，不需要单独的 ref
  // 文字分布因子，控制公司名称文字在椭圆上的分布范围
  const textDistributionFactor = ref(3)
  // 调整椭圆文字
  const adjustEllipseText = ref(false)
  // 调整椭圆文字因子
  const adjustEllipseTextFactor = ref(0.5)
  // 文字边距，控制公司名称文字距离椭圆边缘的距离（单位：毫米）
  const textMarginMM = ref(1) // 默认值为1mm
  // 印章印章类型
  const bottomText = ref('合同专用章')
  // 印章类型大小，默认 4mm
  const bottomTextFontFamily = ref('SimSun')
  const bottomTextFontSizeMM = ref(4.6)
  const bottomTextFontWidthMM = ref(3)
  // 印章类型字符间距，默认 0
  const bottomTextLetterSpacing = ref(0)
  // 印章类型垂直位置调整，默认 0
  const bottomTextPositionY = ref(-5)
  const companyNameCompression = ref(1)
  const companyNameFontWeight = ref(400)
  const bottomTextFontWeight = ref<number|string>(400)
  const bottomTextCompression = ref(1)
  // 防伪纹路（部分属性仍需要 ref，用于其他用途）
  const securityPatternDensity = ref(0.5)
  const securityPatternColor = ref('#FF0000')
  // 五角星和图片列表设置现在从 config 中直接读取，不需要单独的 ref
  const drawInnerCircle = ref(true) // 是否绘制内圈圆
  const innerCircleLineWidth = ref(0.5) // 内圈圆线宽，单位为毫米
  const innerCircleWidth = ref(15) // 内圈圆宽度，单位为毫米
  const innerCircleHeight = ref(12) // 内圈圆高度，单位为毫米
  const drawOutThinCircle = ref(true) // 是否绘制内圈圆
  const outThinCircleLineWidth = ref(0.5) // 内圈圆线宽，单位为毫米
  const outThinCircleWidth = ref(25) // 内圈圆宽度，单位为毫米
  const outThinCircleHeight = ref(22) // 内圈圆高度，单位为毫米
  // 印章类型列表、图片列表、五角星、做旧效果、防伪纹路、毛边效果、内圈圆列表设置现在从 config 中直接读取，不需要单独的 ref

  // 添加外圈圆形边的响应式数据
  const drawOutBorder = ref(true)
  const outBorderLineWidth = ref(1)

const handleIsCircleDetectChange = (value: boolean) => {
  isCircleDetect.value = value
}



  const drawStampWidth = ref(40)
  const drawStampHeight = ref(30)

  // 添加新的响应式变量
  const bottomTextLineSpacing = ref(1.2) // 默认行间距为1.2mm

  const drawStamp = (refreshSecurityPattern: boolean = false, refreshOld: boolean = false, refreshRoughEdge: boolean = false) => {
    // 使用drawstamputils进行绘制
    props.drawStampUtils.refreshStamp(refreshSecurityPattern, refreshOld, refreshRoughEdge)
    emit('updateDrawStamp', getDrawConfigs(), refreshSecurityPattern, refreshOld, refreshRoughEdge)
  }


  // 更新绘制配置
  const updateDrawConfigs = () => {
    const drawConfigs = getDrawConfigs()
    // 做旧效果、防伪纹路、毛边效果、内圈圆列表已在组件中直接更新到 config

    // 公司名称
    const company: ICompany = drawConfigs.company
    company.companyName = companyName.value
    company.textDistributionFactor = textDistributionFactor.value
    company.borderOffset = textMarginMM.value
    company.fontHeight = companyFontSizeMM.value
    company.fontFamily = companyFontFamily.value
    company.compression = companyNameCompression.value
    company.fontWeight = companyNameFontWeight.value
    company.adjustEllipseText = adjustEllipseText.value
    company.adjustEllipseTextFactor = adjustEllipseTextFactor.value

    // 税号和印章编码已在组件中直接更新到 config

    // 印章类型
    const stampType: IStampType = drawConfigs.stampType
    stampType.stampType = bottomText.value
    stampType.fontFamily = bottomTextFontFamily.value
    stampType.fontHeight = bottomTextFontSizeMM.value
    stampType.fontWidth = bottomTextFontWidthMM.value
    stampType.letterSpacing = bottomTextLetterSpacing.value
    stampType.positionY = bottomTextPositionY.value
    stampType.compression = bottomTextCompression.value
    stampType.fontWeight = bottomTextFontWeight.value
    stampType.lineSpacing = bottomTextLineSpacing.value // 新增：置行间距

    // 印章配置
    drawConfigs.primaryColor = primaryColor.value
    drawConfigs.borderWidth = circleBorderWidth.value
    drawConfigs.width = drawStampWidth.value
    drawConfigs.height = drawStampHeight.value

    // 五角星/图片配置已在组件中直接更新到 config

    // 外部细圈
    const outThinCircle: IInnerCircle = drawConfigs.outThinCircle
    outThinCircle.drawInnerCircle = drawOutThinCircle.value
    outThinCircle.innerCircleLineWidth = outThinCircleLineWidth.value
    outThinCircle.innerCircleLineRadiusX = outThinCircleWidth.value
    outThinCircle.innerCircleLineRadiusY = outThinCircleHeight.value

    // 印章类型列表、图片列表、内圈圆列表已在组件中直接更新到 config

      // 外圈圆形边
      const outBorder: IInnerCircle = drawConfigs.outBorder
    outBorder.drawInnerCircle = drawOutBorder.value
    outBorder.innerCircleLineWidth = outBorderLineWidth.value

    drawStamp()
  }

  const restoreDrawConfigs = () => {
    const drawConfigs = getDrawConfigs()

    // 做旧效果、防伪纹路、毛边效果、内圈圆列表现在从 config 中直接读取，不需要单独的 ref

    // 印章基本设置
    drawStampWidth.value = drawConfigs.width
    drawStampHeight.value = drawConfigs.height
    circleBorderWidth.value = drawConfigs.borderWidth
    primaryColor.value = drawConfigs.primaryColor

    // 公司名称
    companyName.value = drawConfigs.company.companyName
    companyFontSizeMM.value = drawConfigs.company.fontHeight
    companyNameCompression.value = drawConfigs.company.compression
    textDistributionFactor.value = drawConfigs.company.textDistributionFactor
    textMarginMM.value = drawConfigs.company.borderOffset
    // 印章编码和税号现在从 config 中直接读取，不需要单独的 ref

    // 印章类型
    const stampTypeConfig: IStampType = drawConfigs.stampType
    bottomText.value = stampTypeConfig.stampType
    bottomTextFontSizeMM.value = stampTypeConfig.fontHeight
    bottomTextFontWidthMM.value = stampTypeConfig.fontWidth
    bottomTextLetterSpacing.value = stampTypeConfig.letterSpacing
    bottomTextPositionY.value = stampTypeConfig.positionY
    bottomTextFontFamily.value = stampTypeConfig.fontFamily
    bottomTextFontWeight.value = stampTypeConfig.fontWeight
    bottomTextCompression.value = stampTypeConfig.compression
    bottomTextLineSpacing.value = stampTypeConfig.lineSpacing
    // stampTypeList 现在从 config 中直接读取，不需要单独的 ref

    // 五角星/图片配置现在从 config 中直接读取，不需要单独的 ref

    // 内圈圆形
    drawInnerCircle.value = drawConfigs.innerCircle.drawInnerCircle
    innerCircleLineWidth.value = drawConfigs.innerCircle.innerCircleLineWidth
    innerCircleWidth.value = drawConfigs.innerCircle.innerCircleLineRadiusX
    innerCircleHeight.value = drawConfigs.innerCircle.innerCircleLineRadiusY
    // 内圈圆列表现在从 config 中直接读取，不需要单独的 ref

    // 外部细圈
    drawOutThinCircle.value = drawConfigs.outThinCircle.drawInnerCircle
    outThinCircleLineWidth.value = drawConfigs.outThinCircle.innerCircleLineWidth
    outThinCircleWidth.value = drawConfigs.outThinCircle.innerCircleLineRadiusX
    outThinCircleHeight.value = drawConfigs.outThinCircle.innerCircleLineRadiusY

    // 图片列表现在从 config 中直接读取，不需要单独的 ref

      // 外圈圆形边
      drawOutBorder.value = drawConfigs.outBorder.drawInnerCircle
    outBorderLineWidth.value = drawConfigs.outBorder.innerCircleLineWidth
  }

const handleBasicConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    console.log("update config company", config.company)
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const handleCompanyConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const handleStampTypeConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    if (!config.stampTypeList) {
      config.stampTypeList = []
    }
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const handleCodeConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const handleTaxNumberConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const handleImageListConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    if (!config.imageList) {
      config.imageList = []
    }
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const handleSvgConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    if (!config.svgList) {
      config.svgList = []
    }
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const handleStarConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const handleSecurityPatternConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const refreshSecurityPattern = () => {
  drawStamp(true, false, false)
}

const handleRoughEdgeConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const refreshRoughEdge = () => {
  drawStamp(false, false, true)
}

const handleAgingEffectConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    updater(config)
  })
  restoreDrawConfigs()
}

const refreshAgingEffect = () => {
  emit('updateDrawStamp', getDrawConfigs(), false, true, false)
}

const handleInnerCircleConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    if (!config.innerCircleList) {
      config.innerCircleList = []
    }
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

const handleLineConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    if (!config.lineList) {
      config.lineList = []
    }
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

  // 添加系统字体列表
  const systemFonts = ref<string[]>([])

  // 加载系统字体
  const loadSystemFonts = async () => {
    try {
      const fonts = await getSystemFonts()
      systemFonts.value = fonts
      console.log('EditorControls: 加载系统字体成功，共', fonts.length, '个字体')
    } catch (error) {
      console.error('EditorControls: 加载系统字体失败', error)
      // 即使失败也设置一个默认字体列表
    systemFonts.value = await getSystemFonts()
    }
  }

  // 在组件挂载时加载字体
  onMounted(async () => {
    console.log('EditorControls: onMounted drawStampUtils', props.drawStampUtils)
    await loadSystemFonts()
    console.log('EditorControls: 系统字体列表已加载，共', systemFonts.value.length, '个字体')
    restoreDrawConfigs()
    drawStamp()
    loadPresetsFromLocalStorage()
    // 初始化所有字体选择器的预览
    document.querySelectorAll('.font-select, .font-input').forEach((element) => {
      if (element instanceof HTMLElement) {
        updateFontPreview({ target: element } as unknown as Event);
      }
    });
  })

  // 监听所有响应式数据的变化
  watch(
    [
      companyName,
      companyFontFamily,
      companyFontSizeMM,
      circleRadius,
      circleBorderWidth,
      primaryColor,
      textDistributionFactor,
      textMarginMM,
      bottomText,
      bottomTextFontFamily,
      bottomTextFontSizeMM,
      bottomTextLetterSpacing,
      bottomTextPositionY,
      companyNameCompression,
      bottomTextCompression,
      bottomTextLetterSpacing,
      securityPatternColor,
      securityPatternDensity,
      securityPatternColor,
      drawStampWidth,
      drawStampHeight,
      drawInnerCircle,
      innerCircleLineWidth,
      innerCircleWidth,
      innerCircleHeight,
      outThinCircleLineWidth,
      outThinCircleWidth,
      outThinCircleHeight,
      drawOutThinCircle,
      companyNameFontWeight,
      bottomTextFontWeight,
      adjustEllipseText,
      adjustEllipseTextFactor,
      bottomTextLineSpacing,
      drawOutBorder,
      outBorderLineWidth,
    ],
    () => {
      updateDrawConfigs()
    },
    { deep: true }
  )

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
type GroupKey =
  | 'basic'
  | 'company'
  | 'stampType'
  | 'code'
  | 'taxNumber'
  | 'star'
  | 'security'
  | 'roughEdge'
  | 'aging'
  | 'innerCircle'
  | 'images'
  | 'svg'
  | 'lines'

const expandedGroups = reactive<Record<GroupKey, boolean>>({
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
    images: false,
    svg: false,
    lines: false
  })

  // 切换组的展开/折叠状态
const toggleGroup = (groupName: GroupKey) => {
  expandedGroups[groupName] = !expandedGroups[groupName]
  }

  // 展开指定的设置组
const expandGroup = (groupName: GroupKey) => {
  expandedGroups[groupName] = true
  // 等待 DOM 更新后滚动到对应位置
  nextTick(() => {
    // 根据组名查找对应的设置组元素
    let selector = '.control-group'
    if (groupName === 'code') {
      selector = '.stamp-code-group'
    } else if (groupName === 'taxNumber') {
      selector = '.tax-number-group'
    }

    // 查找所有匹配的元素，然后找到对应的那个
    const allGroups = document.querySelectorAll(selector)
    if (allGroups.length > 0) {
      // 根据组名在 expandedGroups 中的顺序来定位
      const groupKeys = Object.keys(expandedGroups) as GroupKey[]
      const groupIndex = groupKeys.indexOf(groupName)
      if (groupIndex >= 0 && allGroups[groupIndex]) {
        allGroups[groupIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      } else if (allGroups[0]) {
        allGroups[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  })
}

  // 只展开指定的设置组，收起其他所有组
const expandOnlyGroup = (groupName: GroupKey) => {
  // 先收起所有组
  Object.keys(expandedGroups).forEach((key) => {
    expandedGroups[key as GroupKey] = false
  })
  // 然后展开指定的组
  expandedGroups[groupName] = true
  // 等待 DOM 更新后滚动到对应位置
  nextTick(() => {
    // 根据组名查找对应的设置组元素
    let selector = '.control-group'
    if (groupName === 'code') {
      selector = '.stamp-code-group'
    } else if (groupName === 'taxNumber') {
      selector = '.tax-number-group'
    }

    // 查找所有匹配的元素，然后找到对应的那个
    const allGroups = document.querySelectorAll(selector)
    if (allGroups.length > 0) {
      // 根据组名在 expandedGroups 中的顺序来定位
      const groupKeys = Object.keys(expandedGroups) as GroupKey[]
      const groupIndex = groupKeys.indexOf(groupName)
      if (groupIndex >= 0 && allGroups[groupIndex]) {
        allGroups[groupIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      } else if (allGroups[0]) {
        allGroups[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  })
}

  // 添加新的响应式变量
  const showSecurityWarning = ref(localStorage.getItem('showSecurityWarning') !== 'false')

  watch(showSecurityWarning, (newValue) => {
    localStorage.setItem('showSecurityWarning', String(newValue))
  })


  // 添加滚动到公司文字组件的方法
  const scrollToCompanyText = (index: number) => {
    // 展开公司设置组
    expandedGroups.company = true

    // 等待 DOM 更新后滚动
    nextTick(() => {
      const companyItem = document.querySelector(`.company-item:nth-child(${index + 1})`)
      if (companyItem) {
        companyItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  // 添加滚动到编码的方法
  const scrollToCode = () => {
    // 展开编码设置组
    expandedGroups.code = true

    // 等待 DOM 更新后滚动
    nextTick(() => {
      const codeSection = document.querySelector('.stamp-code-group')
      if (codeSection) {
        codeSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })

  }

  // 添加滚动到印章类型的方法
  const scrollToStampType = (index: number) => {
    // 展开印章类型设置组
    expandedGroups.stampType = true

    // 等待 DOM 更新后滚动
    nextTick(() => {
      const stampTypeItem = document.querySelector(`.stamp-type-item:nth-child(${index + 1})`)
      if (stampTypeItem) {
        stampTypeItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  // 添加滚动到税号的方法
  const scrollToTaxNumber = () => {
    // 展开税号设置组
    expandedGroups.taxNumber = true

    // 等待 DOM 更新后滚动
    nextTick(() => {
      const taxNumberItem = document.querySelector('.tax-number-group')
      if (taxNumberItem) {
        taxNumberItem.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  // 暴露方法给父组件
  defineExpose({
    expandGroup,
    expandOnlyGroup,
    scrollToCompanyText,
    scrollToCode,
    scrollToStampType,
    scrollToTaxNumber,
    restoreDrawConfigs
  })
  </script>
  <style scoped>
  .refresh-button {
    margin-top: 8px;
    padding: 6px 12px;
    background-color: #f5f5f5;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .refresh-button:hover {
    background-color: #e6f7ff;
    border-color: #1890ff;
  }
  </style>
