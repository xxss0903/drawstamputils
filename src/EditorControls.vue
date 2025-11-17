<template>
    <div class="editor-container" :class="{ 'has-warning': showSecurityWarning }">
      <div class="editor-controls" ref="editorControls">
        <BasicSettingsPanel
          :expanded="expandedGroups.basic"
          :is-circle-detect="isCircleDetect"
          :config="getDrawConfigs()"
          @update:expanded="value => (expandedGroups.basic = value)"
          @update:is-circle-detect="handleIsCircleDetectChange"
          @update-config="handleBasicConfigUpdate"
        />

        <CompanySettingsPanel
          :expanded="expandedGroups.company"
          :config="getDrawConfigs()"
          :system-fonts="systemFonts"
          @update:expanded="value => (expandedGroups.company = value)"
          @update-config="handleCompanyConfigUpdate"
        />

        <StampTypeSettingsPanel
          :expanded="expandedGroups.stampType"
          :config="getDrawConfigs()"
          :system-fonts="systemFonts"
          @update:expanded="value => (expandedGroups.stampType = value)"
          @update-config="handleStampTypeConfigUpdate"
        />

        <CodeSettingsPanel
          :expanded="expandedGroups.code"
          :config="getDrawConfigs()"
          :system-fonts="systemFonts"
          @update:expanded="value => (expandedGroups.code = value)"
          @update-config="handleCodeConfigUpdate"
        />

        <TaxNumberSettingsPanel
          :expanded="expandedGroups.taxNumber"
          :config="getDrawConfigs()"
          :system-fonts="systemFonts"
          @update:expanded="value => (expandedGroups.taxNumber = value)"
          @update-config="handleTaxNumberConfigUpdate"
        />

        <ImageListSettingsPanel
          :expanded="expandedGroups.images"
          :config="getDrawConfigs()"
          @update:expanded="value => (expandedGroups.images = value)"
          @update-config="handleImageListConfigUpdate"
        />

        <StarSettingsPanel
          :expanded="expandedGroups.star"
          :config="getDrawConfigs()"
          @update:expanded="value => (expandedGroups.star = value)"
          @update-config="handleStarConfigUpdate"
        />
        <!-- 防伪纹路设置 -->
        <div class="control-group">
          <div class="group-header" @click="toggleGroup('security')">
            <h3>{{ t('stamp.security.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.security }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.security">

            <label>
              {{ t('stamp.security.enable') }}:
              <input type="checkbox" v-model="securityPatternEnabled" />
            </label>
            <button @click="drawStamp(true, false)">{{ t('stamp.security.refresh') }}</button>
            <label
              >{{ t('stamp.security.count') }}:
              <input type="range" v-model.number="securityPatternCount" min="1" max="100" step="1"
            /></label>
            <label
              >{{ t('stamp.security.length') }}:
              <input type="range" v-model.number="securityPatternLength" min="0.1" max="100" step="0.1"
            /></label>
            <label
              >{{ t('stamp.security.width') }}:
              <input
                type="range"
                v-model.number="securityPatternWidth"
                min="0.05"
                max="0.5"
                step="0.05"
            /></label>
          </div>
        </div>

        <!-- 毛边效果设置 -->
        <div class="control-group">
          <div class="group-header" @click="toggleGroup('roughEdge')">
            <h3>{{ t('stamp.roughEdge.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.roughEdge }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.roughEdge">

            <label class="checkbox-label">
              <input type="checkbox" v-model="shouldDrawRoughEdge" />
              {{ t('stamp.roughEdge.enable') }}
            </label>
            <label v-if="shouldDrawRoughEdge">
              {{ t('stamp.roughEdge.width') }}:
              <input type="range" v-model.number="roughEdgeWidth" min="0.05" max="0.5" step="0.05" />
              <span>{{ roughEdgeWidth.toFixed(2) }}</span>
            </label>
            <label v-if="shouldDrawRoughEdge">
              {{ t('stamp.roughEdge.height') }}:
              <input type="range" v-model.number="roughEdgeHeight" min="0.1" max="5" step="0.1" />
              <span>{{ roughEdgeHeight.toFixed(1) }}</span>
            </label>
            <label v-if="shouldDrawRoughEdge">
              {{ t('stamp.roughEdge.probability') }}:
              <input type="range" v-model.number="roughEdgeProbability" min="0" max="1" step="0.01" />
              <span>{{ roughEdgeProbability.toFixed(2) }}</span>
            </label>
            <label v-if="shouldDrawRoughEdge">
              {{ t('stamp.roughEdge.shift') }}:
              <input type="range" v-model.number="roughEdgeShift" min="-10" max="10" step="0.01" />
              <span>{{ roughEdgeShift.toFixed(2) }}</span>
            </label>
            <label v-if="shouldDrawRoughEdge">
              {{ t('stamp.roughEdge.points') }}:
              <input type="range" v-model.number="roughEdgePoints" min="100" max="1000" step="10" />
              <span>{{ roughEdgePoints }}</span>
            </label>
            <button @click="drawStamp(false, false, true)">{{ t('stamp.roughEdge.refresh') }}</button>
          </div>
        </div>

        <!-- 做旧效果设置 -->
        <div class="control-group">
          <div class="group-header" @click="toggleGroup('aging')">
            <h3>{{ t('stamp.aging.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.aging }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.aging">

            <label class="checkbox-label">
              <input type="checkbox" v-model="applyAging" @change="updateAgingEffect" />
              {{ t('stamp.aging.enable') }}
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="manualAging" @change="updateAgingEffect" />
              {{ t('stamp.aging.manual') }}
            </label>
            <label v-if="applyAging">
              {{ t('stamp.aging.intensity') }}:
              <input
                type="range"
                v-model.number="agingIntensity"
                min="0"
                max="100"
                step="1"
                @input="updateAgingEffect"
              />
              <span>{{ agingIntensity }}%</span>
            </label>
            <button @click="refreshAgingEffect" class="refresh-button">
              {{ t('stamp.aging.refresh') }}
            </button>
          </div>
        </div>

        <!-- 内圈圆形设置 -->
        <div class="control-group">
          <div class="group-header" @click="toggleGroup('innerCircle')">
            <h3>{{ t('stamp.innerCircle.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.innerCircle }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.innerCircle">
            <button @click="addNewInnerCircle">{{ t('stamp.innerCircle.addNew') }}</button>
            <div v-for="(innerCircle, index) in innerCircleList" :key="index" class="inner-circle-item">
              <div class="inner-circle-header">
                <span>第 {{ index + 1 }} 行</span>
                <button class="small-button delete-button" @click="removeInnerCircle(index)">删除</button>
              </div>
              <label>
                {{ t('stamp.innerCircle.lineWidth') }}:
                <input type="number" v-model.number="innerCircle.innerCircleLineWidth" min="0.05" max="0.5" step="0.05" />
              </label>
              <label>
                {{ t('stamp.innerCircle.radiusX') }}:
                <input type="number" v-model.number="innerCircle.innerCircleLineRadiusX" min="1" max="50" step="0.1" />
              </label>
              <label>
                {{ t('stamp.innerCircle.radiusY') }}:
                <input type="number" v-model.number="innerCircle.innerCircleLineRadiusY" min="1" max="50" step="0.1" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import {DrawStampUtils} from './DrawStampUtils'
import { getSystemFonts } from './utils/fontUtils'
import { ICompany, IDrawStampConfig, IInnerCircle, IRoughEdge, ISecurityPattern, IStampType } from './DrawStampTypes'
import { useI18n } from 'vue-i18n'
import { useStampStore } from './stores/stampStore'
import BasicSettingsPanel from './components/editor/panels/BasicSettingsPanel.vue'
import CompanySettingsPanel from './components/editor/panels/CompanySettingsPanel.vue'
import StampTypeSettingsPanel from './components/editor/panels/StampTypeSettingsPanel.vue'
import CodeSettingsPanel from './components/editor/panels/CodeSettingsPanel.vue'
import TaxNumberSettingsPanel from './components/editor/panels/TaxNumberSettingsPanel.vue'
import ImageListSettingsPanel from './components/editor/panels/ImageListSettingsPanel.vue'
import StarSettingsPanel from './components/editor/panels/StarSettingsPanel.vue'

  const { t } = useI18n()

  const editorControls = ref<HTMLDivElement | null>(null)

  // 将drawStampUtils作为props传递给EditorControls
  const props = defineProps<{
    drawStampUtils: DrawStampUtils
    }>()

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
  // 做旧效果
  const applyAging = ref(false)
  // 手动做旧
  const manualAging = ref(false)
  // 添加新的响应式数据
  const agingIntensity = ref(50)
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
  // 防伪纹路
  const securityPatternEnabled = ref(true)
  const securityPatternDensity = ref(0.5)
  const securityPatternWidth = ref(0.2) // 纹路宽度，单位为毫米
  const securityPatternColor = ref('#FF0000')
  const securityPatternCount = ref(5) // 防伪纹路数量
  const securityPatternLength = ref(2) // 纹路长度，单为毫米
  // 五角星和图片列表设置现在从 config 中直接读取，不需要单独的 ref
  const drawInnerCircle = ref(true) // 是否绘制内圈圆
  const innerCircleLineWidth = ref(0.5) // 内圈圆线宽，单位为毫米
  const innerCircleWidth = ref(15) // 内圈圆宽度，单位为毫米
  const innerCircleHeight = ref(12) // 内圈圆高度，单位为毫米
  const drawOutThinCircle = ref(true) // 是否绘制内圈圆
  const outThinCircleLineWidth = ref(0.5) // 内圈圆线宽，单位为毫米
  const outThinCircleWidth = ref(25) // 内圈圆宽度，单位为毫米
  const outThinCircleHeight = ref(22) // 内圈圆高度，单位为毫米
  const shouldDrawRoughEdge = ref(false) // 是否绘制毛边
  const roughEdgeWidth = ref(0.2) // 毛边宽度，单位为毫米
  const roughEdgeHeight = ref(5) // 毛边高度，单位为毫米
  const roughEdgeProbability = ref(0.5) // 毛边概率
  const roughEdgeShift = ref(8) // 毛边偏移
  const roughEdgePoints = ref(360) // 毛边点数
  // 印章类型列表、图片列表、五角星设置现在从 config 中直接读取，不需要单独的 ref
  // 添加公司列表的响应式数据
  // 添加内圈列表的响应式数据
  const innerCircleList = ref<IInnerCircle[]>([
    {
      drawInnerCircle: true,
      innerCircleLineWidth: 0.5,
      innerCircleLineRadiusX: 36,
      innerCircleLineRadiusY: 27
    },
    {
      drawInnerCircle: true,
      innerCircleLineWidth: 0.5,
      innerCircleLineRadiusX: 16,
      innerCircleLineRadiusY: 12
    }
  ])

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

  // 添加新内圈
  const addNewInnerCircle = () => {
    innerCircleList.value.push({
      drawInnerCircle: true,
      innerCircleLineWidth: 0.5,
      innerCircleLineRadiusX: 16,
      innerCircleLineRadiusY: 12
    })
  }

  // 删除内圈
  const removeInnerCircle = (index: number) => {
    innerCircleList.value.splice(index, 1)
  }

  // 更新绘制配置
  const updateDrawConfigs = () => {
    const drawConfigs = getDrawConfigs()
    // 做旧效果
    const agingEffect = drawConfigs.agingEffect
    agingEffect.applyAging = applyAging.value
    agingEffect.agingIntensity = agingIntensity.value
    drawConfigs.openManualAging = manualAging.value

    // 防伪纹路
    const securityPattern: ISecurityPattern = drawConfigs.securityPattern
    securityPattern.openSecurityPattern = securityPatternEnabled.value
    securityPattern.securityPatternCount = securityPatternCount.value
    securityPattern.securityPatternWidth = securityPatternWidth.value
    securityPattern.securityPatternLength = securityPatternLength.value

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

    // 毛边
    const roughEdge: IRoughEdge = drawConfigs.roughEdge
    roughEdge.drawRoughEdge = shouldDrawRoughEdge.value
    roughEdge.roughEdgeWidth = roughEdgeWidth.value
    roughEdge.roughEdgeHeight = roughEdgeHeight.value
    roughEdge.roughEdgeProbability = roughEdgeProbability.value
    roughEdge.roughEdgeShift = roughEdgeShift.value
    roughEdge.roughEdgePoints = roughEdgePoints.value

    // 内圈圆
    const innerCircle: IInnerCircle = drawConfigs.innerCircle
    innerCircle.drawInnerCircle = drawInnerCircle.value
    innerCircle.innerCircleLineWidth = innerCircleLineWidth.value
    innerCircle.innerCircleLineRadiusX = innerCircleWidth.value
    innerCircle.innerCircleLineRadiusY = innerCircleHeight.value

    // 外部细圈
    const outThinCircle: IInnerCircle = drawConfigs.outThinCircle
    outThinCircle.drawInnerCircle = drawOutThinCircle.value
    outThinCircle.innerCircleLineWidth = outThinCircleLineWidth.value
    outThinCircle.innerCircleLineRadiusX = outThinCircleWidth.value
    outThinCircle.innerCircleLineRadiusY = outThinCircleHeight.value

    // 印章类型列表已在组件中直接更新到 config

    // 更新公司列表
    // 更新内圈列表
    drawConfigs.innerCircleList = innerCircleList.value
    // 图片列表已在组件中直接更新到 config

      // 外圈圆形边
      const outBorder: IInnerCircle = drawConfigs.outBorder
    outBorder.drawInnerCircle = drawOutBorder.value
    outBorder.innerCircleLineWidth = outBorderLineWidth.value

    drawStamp()
  }

  const restoreDrawConfigs = () => {
    const drawConfigs = getDrawConfigs()

    // 做旧效果
    applyAging.value = drawConfigs.agingEffect.applyAging
    agingIntensity.value = drawConfigs.agingEffect.agingIntensity
    manualAging.value = drawConfigs.openManualAging

    // 防伪纹路
    securityPatternEnabled.value = drawConfigs.securityPattern.openSecurityPattern
    securityPatternCount.value = drawConfigs.securityPattern.securityPatternCount
    securityPatternWidth.value = drawConfigs.securityPattern.securityPatternWidth
    securityPatternLength.value = drawConfigs.securityPattern.securityPatternLength

    // 毛边效果
    shouldDrawRoughEdge.value = drawConfigs.roughEdge.drawRoughEdge
    roughEdgeWidth.value = drawConfigs.roughEdge.roughEdgeWidth
    roughEdgeHeight.value = drawConfigs.roughEdge.roughEdgeHeight
    roughEdgeProbability.value = drawConfigs.roughEdge.roughEdgeProbability
    roughEdgeShift.value = drawConfigs.roughEdge.roughEdgeShift
    roughEdgePoints.value = drawConfigs.roughEdge.roughEdgePoints

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
    innerCircleList.value = drawConfigs.innerCircleList

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

const handleStarConfigUpdate = (updater: (config: IDrawStampConfig) => void) => {
  stampStore.updateConfig((config) => {
    updater(config)
  })
  restoreDrawConfigs()
  drawStamp()
}

  // 添加系统字体列表
  const systemFonts = ref<string[]>([])

  // 加载系统字体
  const loadSystemFonts = async () => {
    systemFonts.value = await getSystemFonts()
  }

  // 在组件挂载时加载字体
  onMounted(async () => {
    console.log('onMounted drawStampUtils', props.drawStampUtils)
    await loadSystemFonts()
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
      agingIntensity,
      bottomText,
      bottomTextFontFamily,
      bottomTextFontSizeMM,
      bottomTextLetterSpacing,
      bottomTextPositionY,
      applyAging,
      agingIntensity,
      companyNameCompression,
      bottomTextCompression,
      bottomTextLetterSpacing,
      securityPatternColor,
      securityPatternDensity,
      securityPatternColor,
      securityPatternEnabled,
      securityPatternCount,
      securityPatternLength,
      securityPatternWidth,
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
      manualAging,
      shouldDrawRoughEdge,
      roughEdgeWidth,
      roughEdgeHeight,
      roughEdgeProbability,
      roughEdgeShift,
      roughEdgePoints,
      companyNameFontWeight,
      bottomTextFontWeight,
      adjustEllipseText,
      adjustEllipseTextFactor,
      bottomTextLineSpacing,
      innerCircleList,
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
  images: false // 新增图片列表设置
})

// 切换组的展开/折叠状态
const toggleGroup = (groupName: GroupKey) => {
  expandedGroups[groupName] = !expandedGroups[groupName]
}

  // 添加新的响应式变量
  const showSecurityWarning = ref(localStorage.getItem('showSecurityWarning') !== 'false')

  watch(showSecurityWarning, (newValue) => {
    localStorage.setItem('showSecurityWarning', String(newValue))
  })

  // 更新做旧效果
  const updateAgingEffect = () => {
    const config = getDrawConfigs()
    config.agingEffect = {
      ...config.agingEffect,
      applyAging: applyAging.value,
      agingIntensity: agingIntensity.value
    }
    config.openManualAging = manualAging.value

    emit('updateDrawStamp', config, false, true, false)
  }

  // 刷新做旧效果
  const refreshAgingEffect = () => {
    emit('updateDrawStamp', getDrawConfigs(), false, true, false)
  }

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
