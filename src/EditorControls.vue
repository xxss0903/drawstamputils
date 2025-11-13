<template>
    <div class="container" :class="{ 'has-warning': showSecurityWarning }">
      <div class="editor-controls" ref="editorControls">
        <!-- 印章基本设置 -->
        <div class="control-group">
          <div class="group-header" @click="toggleGroup('basic')">
            <h3>{{ t('stamp.basic.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.basic }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.basic">
            <label class="checkbox-label">
              <input type="checkbox" v-model="isCircleDetect" />
              {{ t('stamp.basic.extractCircle') }}
            </label>
            <label>
              {{ t('stamp.basic.width') }}:
              <input type="number" v-model.number="drawStampWidth" min="1" max="50" step="1" />
            </label>
            <label>
              {{ t('stamp.basic.height') }}:
              <input type="number" v-model.number="drawStampHeight" min="1" max="50" step="1" />
            </label>
            <label>
              {{ t('stamp.basic.borderWidth') }}: <input type="number" step="0.1" v-model.number="circleBorderWidth" />
            </label>
            <label>
              {{ t('stamp.basic.color') }}: <input type="color" v-model="primaryColor" />
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="drawOutBorder" />
              {{ t('stamp.outBorder.enable') }}
            </label>
            <label v-if="drawOutBorder">
              {{ t('stamp.outBorder.lineWidth') }}:
              <input type="number" v-model.number="outBorderLineWidth" min="0.1" max="5" step="0.1" />
            </label>
          </div>
        </div>
  
        <!-- 公司名称设置 -->
        <div class="control-group">
          <div class="group-header" @click="toggleGroup('company')">
            <h3>{{ t('stamp.company.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.company }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.company">
            <div v-for="(company, index) in companyList" :key="index" class="company-item">
              <div class="company-header">
                <span>{{ t('stamp.common.line', { index: index + 1 }) }}</span>
                <button class="small-button delete-button" @click="removeCompany(index)">{{ t('stamp.common.delete') }}</button>
              </div>
              <label>
                {{ t('stamp.company.name') }}:
                <input type="text" v-model="company.companyName" />
              </label>
              <label>
                {{ t('stamp.company.font') }}:
                <div class="font-input-group">
                  <select
                    v-model="company.fontFamily"
                    class="font-select"
                    @change="updateFontPreview"
                  >
                    <option
                      v-for="font in systemFonts"
                      :key="font"
                      :value="font"
                      :style="{ fontFamily: font }"
                    >
                      {{ font }}
                    </option>
                  </select>
                  <input
                    type="text"
                    v-model="company.fontFamily"
                    class="font-input"
                    @input="updateFontPreview"
                    :placeholder="t('stamp.common.fontPlaceholder')"
                  />
                </div>
              </label>
              <label>
                {{ t('stamp.company.fontSize') }}:
                <input type="number" v-model.number="company.fontHeight" min="1" max="10" step="0.1" />
              </label>
              <label>
                {{ t('stamp.company.fontWeight') }}:
                <select v-model="company.fontWeight">
                  <option value="normal">{{ t('stamp.common.fontWeight.normal') }}</option>
                  <option value="bold">{{ t('stamp.common.fontWeight.bold') }}</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </label>
              <label>
                {{ t('stamp.company.compression') }}:
                <input
                  type="range"
                  v-model.number="company.compression"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                />
                <span>{{ company.compression.toFixed(2) }}</span>
              </label>
              <label>
                {{ t('stamp.company.distribution') }}:
                <input
                  type="range"
                  v-model.number="company.textDistributionFactor"
                  min="0"
                  max="50"
                  step="0.1"
                />
                <span>{{ company.textDistributionFactor.toFixed(2) }}</span>
              </label>
              <label>
                {{ t('stamp.company.margin') }}:
                <input type="number" v-model.number="company.borderOffset" min="-10" max="10" step="0.05" />
              </label>
              <label>
                {{ t('stamp.company.startAngle') }}:
                <div class="range-container">
                  <input
                    type="range"
                    v-model.number="company.startAngle"
                    min="-3.14"
                    max="3.14"
                    step="0.01"
                  />
                  <span>{{ (company.startAngle * 180 / Math.PI).toFixed(0) }}°</span>
                </div>
              </label>
              <label>
                {{ t('stamp.company.rotateDirection') }}:
                <select v-model="company.rotateDirection">
                  <option value="clockwise">{{ t('stamp.company.clockwise') }}</option>
                  <option value="counterclockwise">{{ t('stamp.company.counterclockwise') }}</option>
                </select>
              </label>
            </div>
            <button class="add-button" @click="addNewCompany">{{ t('stamp.common.addNew') }}</button>
          </div>
        </div>
  
        <!-- 印章类型设置 -->
        <div class="control-group">
          <div class="group-header" @click="toggleGroup('stampType')">
            <h3>{{ t('stamp.stampType.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.stampType }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.stampType">

            <div v-for="(type, index) in stampTypeList" :key="index" class="stamp-type-item">
              <div class="stamp-type-header">
                <span>{{ t('stamp.stampType.line', { index: index + 1 }) }}</span>
                <button class="small-button delete-button" @click="removeStampType(index)">{{ t('stamp.stampType.delete') }}</button>
              </div>
              <label>
                {{ t('stamp.stampType.type') }}:
                <input type="text" v-model="type.stampType" />
              </label>
              <label>
                {{ t('stamp.stampType.fontSize') }}:
                <input type="number" v-model.number="type.fontHeight" min="1" max="10" step="0.1" />
              </label>
              <label>
                {{ t('stamp.stampType.font') }}:
                <div class="font-input-group">
                  <input
                    type="text"
                    v-model="type.fontFamily"
                    list="stampTypeFontList"
                    class="font-input"
                  />
                  <datalist id="stampTypeFontList">
                    <option v-for="font in systemFonts"
                            :key="font"
                            :value="font">
                      {{ font }}
                    </option>
                  </datalist>
                </div>
              </label>
              <label>
                {{ t('stamp.stampType.fontWeight') }}:
                <select v-model="type.fontWeight">
                  <option value="normal">正常</option>
                  <option value="bold">粗体</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </label>
              <label>
                {{ t('stamp.stampType.compression') }}:
                <input
                  type="range"
                  v-model.number="type.compression"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                />
                <span>{{ type.compression.toFixed(2) }}</span>
              </label>
              <label>
                {{ t('stamp.stampType.letterSpacing') }}:
                <input
                  type="range"
                  v-model.number="type.letterSpacing"
                  min="-1"
                  max="10"
                  step="0.05"
                />
                <span>{{ type.letterSpacing.toFixed(2) }}</span>
              </label>
              <label>
                {{ t('stamp.stampType.verticalPosition') }}:
                <input
                  type="number"
                  v-model.number="type.positionY"
                  min="-20"
                  max="20"
                  step="0.5"
                />
              </label>
            </div>
            <button class="add-button" @click="addNewStampType">{{ t('stamp.stampType.addNew') }}</button>
          </div>
        </div>
  
        <!-- 印章编码设置 -->
        <div class="control-group stamp-code-group">
          <div class="group-header" @click="toggleGroup('code')">
            <h3>{{ t('stamp.code.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.code }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.code">

            <label>{{ t('stamp.code.code') }}: <input v-model="stampCode" /></label>
            <label>
              {{ t('stamp.code.font') }}:
              <div class="font-input-group">
                <select
                  v-model="codeFontFamily"
                  class="font-select"
                  @change="updateFontPreview"
                >
                  <option
                    v-for="font in systemFonts"
                    :key="font"
                    :value="font"
                    :style="{ fontFamily: font }"
                  >
                    {{ font }}
                  </option>
                </select>
                <input
                  type="text"
                  v-model="codeFontFamily"
                  class="font-input"
                  @input="updateFontPreview"
                  placeholder="输入字体名称"
                />
              </div>
            </label>
            <label>
              {{ t('stamp.code.fontSize') }}: <input type="number" v-model.number="codeFontSizeMM" step="0.1" />
            </label>
            <label>
              {{ t('stamp.code.fontWeight') }}:
              <select v-model="codeFontWeight">
                <option value="normal">{{ t('stamp.common.fontWeight.normal') }}</option>
                <option value="bold">{{ t('stamp.common.fontWeight.bold') }}</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </label>
            <label>
              <span>{{ t('stamp.common.compression', { value: codeCompression.toFixed(2) }) }}</span>
              <input type="range" v-model.number="codeCompression" min="0.0" max="3" step="0.01" />
            </label>
            <label>
              <span>{{ t('stamp.common.distribution', { value: codeDistributionFactor.toFixed(1) }) }}</span>
              <input
                type="range"
                v-model.number="codeDistributionFactor"
                min="0"
                max="100"
                step="0.5"
              />
            </label>
            <label>
              {{ t('stamp.code.margin') }}:
              <input type="number" v-model.number="codeMarginMM" min="-10" max="20" step="0.05" />
            </label>
          </div>
        </div>
  
        <!-- 税号设置 -->
        <div class="control-group tax-number-group">
          <div class="group-header" @click="toggleGroup('taxNumber')">
            <h3>{{ t('stamp.taxNumber.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.taxNumber }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.taxNumber">

            <label>{{ t('stamp.taxNumber.number') }}: <input v-model="taxNumberValue" /></label>
            <label>
              {{ t('stamp.taxNumber.font') }}:
              <div class="font-input-group">
                <select
                  v-model="taxNumberFontFamily"
                  class="font-select"
                  @change="updateFontPreview"
                >
                  <option
                    v-for="font in systemFonts"
                    :key="font"
                    :value="font"
                    :style="{ fontFamily: font }"
                  >
                    {{ font }}
                  </option>
                </select>
                <input
                  type="text"
                  v-model="taxNumberFontFamily"
                  class="font-input"
                  @input="updateFontPreview"
                  placeholder="输入字体名称"
                />
              </div>
            </label>
            <label>
              {{ t('stamp.taxNumber.fontWeight') }}:
              <select v-model="taxNumberFontWeight">
                <option value="normal">正常</option>
                <option value="bold">粗体</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </label>
            <label>
              <span>{{ t('stamp.common.compression', { value: taxNumberCompression.toFixed(2) }) }}</span>
              <input type="range" v-model.number="taxNumberCompression" min="0.0" max="3" step="0.01" />
            </label>
            <label>
              <span>{{ t('stamp.common.letterSpacing', { value: taxNumberLetterSpacing.toFixed(2) }) }}</span>
              <input
                type="range"
                v-model.number="taxNumberLetterSpacing"
                min="-1"
                max="20"
                step="0.05"
              />
            </label>
            <label>
              <span>{{ t('stamp.common.verticalPosition', { value: taxNumberPositionY.toFixed(1) }) }}</span>
              <input type="range" v-model.number="taxNumberPositionY" min="-10" max="10" step="0.1" />
            </label>
          </div>
        </div>
  
        <!-- 图片列表设置 -->
        <div class="control-group">
          <div class="group-header" @click="toggleGroup('images')">
            <h3>{{ t('stamp.images.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.images }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.images">

            <div v-for="(image, index) in imageList" :key="index" class="image-item">
              <div class="image-header">
                <span>{{ t('stamp.images.image', { index: index + 1 }) }}</span>
                <button class="small-button delete-button" @click="removeImage(index)">删除</button>
              </div>
              <div class="image-preview" v-if="image.imageUrl">
                <img :src="image.imageUrl" :alt="t('stamp.common.preview')" />
              </div>
              <label>
                {{ t('stamp.images.select') }}:
                <input type="file" @change="(e) => handleImageUpload(e, index)" accept="image/*" />
              </label>
              <label>
                {{ t('stamp.images.width') }}:
                <input type="number" v-model.number="image.imageWidth" min="1" max="100" step="0.5" />
              </label>
              <label>
                {{ t('stamp.images.height') }}:
                <input type="number" v-model.number="image.imageHeight" min="1" max="100" step="0.5" />
              </label>
              <label>
                {{ t('stamp.images.positionX') }}:
                <input type="number" v-model.number="image.positionX" min="-20" max="20" step="0.5" />
              </label>
              <label>
                {{ t('stamp.images.positionY') }}:
                <input type="number" v-model.number="image.positionY" min="-20" max="20" step="0.5" />
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="image.keepAspectRatio" />
                {{ t('stamp.images.keepRatio') }}
              </label>
            </div>
            <button class="add-button" @click="addNewImage">{{ t('stamp.common.addNew') }}</button>
          </div>
        </div>
  
        <!-- 五角星设置 -->
        <div class="control-group">
          <div class="group-header" @click="toggleGroup('star')">
            <h3>{{ t('stamp.star.title') }}<span class="expand-icon" :class="{ 'expanded': expandedGroups.star }">▼</span></h3>
          </div>
          <div class="group-content" v-show="expandedGroups.star">

            <label class="checkbox-label">
              <input type="checkbox" v-model="shouldDrawStar" />
              {{ t('stamp.star.enable') }}
            </label>
            <div v-if="shouldDrawStar">
              <label>
                {{ t('stamp.star.diameter') }}:
                <input type="number" v-model.number="starDiameter" step="0.1" />
              </label>
              <label>
                {{ t('stamp.star.verticalPosition') }}:
                <input type="number" v-model.number="starPositionY" min="-10" max="10" step="0.1" />
              </label>
            </div>
          </div>
        </div>
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
  import { ref, onMounted, watch, computed, onUnmounted, nextTick } from 'vue'
  import {DrawStampUtils} from './DrawStampUtils'
  import { getSystemFonts } from './utils/fontUtils'
  import { ICode, ICompany, IDrawImage, IDrawStampConfig, IDrawStar, IInnerCircle, IRoughEdge, ISecurityPattern, IStampType, ITaxNumber } from './DrawStampTypes'
  import { useI18n } from 'vue-i18n'
  
  const { t } = useI18n()
  
  const editorControls = ref<HTMLDivElement | null>(null)

  // 将drawStampUtils作为props传递给EditorControls
  const props = defineProps<{
    drawStampUtils: DrawStampUtils
    }>()

  // 更新drawStampUtils，更新绘制印章
  const emit = defineEmits(['updateDrawStamp'])

  const isCircleDetect = ref(true)
  // 添加响应式数据
  const companyName = ref('绘制印章有限责任公司')
  // 印章编码
  const stampCode = ref('1234567890123')
  // 税号
  const taxNumberValue = ref('000000000000000000')
  // 公司名称字体大（毫米）
  const companyFontFamily = ref('Songti SC')
  const companyFontSizeMM = ref(4.2)
  const codeFontFamily = ref('SimSun')
  // 编码字体大小（毫米）
  const codeFontSizeMM = ref(1.2)
  // 编码字体宽度（毫米）
  const codeFontWidthMM = ref(1.2)
  // 圆形印章半径（毫米）
  const circleRadius = ref(20)
  // 圆形边框宽度（毫米）
  const circleBorderWidth = ref(1)
  // 主题颜色
  const primaryColor = ref('blue')
  // 五角星直径（毫米）
  const starDiameter = ref(14)
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
  // 编码边距，控制印章编码距离椭圆边缘的距离（单位毫米）
  const codeMarginMM = ref(1) // 默认值为1mm
  // 编码分布因子，控制印章编码在椭圆下方的分布范围
  const codeDistributionFactor = ref(20) // 默认值可以根据需要调整
  // 印章印章类型
  const bottomText = ref('合同专用章')
  // 印章类型大小，默认 4mm
  const bottomTextFontFamily = ref('SimSun')
  const bottomTextFontSizeMM = ref(4.6)
  const bottomTextFontWidthMM = ref(3)
  // 印章类型字符间距，默认 0
  const bottomTextLetterSpacing = ref(0)
  // 五角星垂直位置调整，认 0
  const starPositionY = ref(0)
  // 印章类型垂直位置调整，默认 0
  const bottomTextPositionY = ref(-5)
  const companyNameCompression = ref(1)
  const companyNameFontWeight = ref(400)
  const bottomTextFontWeight = ref<number|string>(400)
  const codeFontWeight = ref<number|string>(400)
  const taxNumberFontFamily = ref('Songti SC')
  const taxNumberFontWeight = ref<number|string>(400)
  const bottomTextCompression = ref(1)
  const codeCompression = ref(1)
  // 防伪纹路
  const securityPatternEnabled = ref(true)
  const securityPatternDensity = ref(0.5)
  const securityPatternWidth = ref(0.2) // 纹路宽度，单位为毫米
  const securityPatternColor = ref('#FF0000')
  const securityPatternCount = ref(5) // 防伪纹路数量
  const securityPatternLength = ref(2) // 纹路长度，单为毫米
  const showFullRuler = ref(false)
  const shouldDrawStar = ref(false) // 默认绘制五角星
  const taxNumberCompression = ref(1) // 税号文字宽度缩放比例
  const taxNumberLetterSpacing = ref(0.3) // 税号文字间距（单位：毫米）
  const taxNumberPositionY = ref(0) // 税号垂直位置调，默认为0
  const drawInnerCircle = ref(true) // 是否绘制内圈圆
  const innerCircleLineWidth = ref(0.5) // 内圈圆线宽，单位为毫米
  const innerCircleWidth = ref(15) // 内圈圆宽度，单位为毫米
  const innerCircleHeight = ref(12) // 内圈圆高度，单位为毫米
  const drawOutThinCircle = ref(true) // 是否绘制内圈圆
  const outThinCircleLineWidth = ref(0.5) // 内圈圆线宽，单位为毫米
  const outThinCircleWidth = ref(25) // 内圈圆宽度，单位为毫米
  const outThinCircleHeight = ref(22) // 内圈圆高度，单位为毫米
  const stampImageRef = ref<HTMLImageElement | null>(null)
  const shouldDrawRoughEdge = ref(false) // 是否绘制毛边
  const roughEdgeWidth = ref(0.2) // 毛边宽度，单位为毫米
  const roughEdgeHeight = ref(5) // 毛边高度，单位为毫米
  const roughEdgeProbability = ref(0.5) // 毛边概率
  const roughEdgeShift = ref(8) // 毛边偏移
  const roughEdgePoints = ref(360) // 毛边点数
  const showLegalDialog = ref(false) // 是否显示法律提示弹窗
  // 添加印章类型列表的响式数据
  const stampTypeList = ref<IStampType[]>([
    {
      stampType: '印章类型',
      fontHeight: 4.6,
      fontFamily: 'SimSun',
      compression: 0.75,
      letterSpacing: 0,
      positionY: -3,
      fontWeight: 'normal',
      lineSpacing: 2,
      fontWidth: 3
    }
  ])
  // 添加公司列表的响应式数据
  const companyList = ref<ICompany[]>([
    {
      companyName: '绘制印章有限责任公司',
      compression: 1,
      borderOffset: 1,
      textDistributionFactor: 3,
      fontFamily: 'SimSun',
      fontHeight: 4.2,
      fontWeight: 'normal',
      shape: 'ellipse',
      adjustEllipseText: false,
      adjustEllipseTextFactor: 0.5,
      startAngle: 0,
      rotateDirection: "counterclockwise"
    }
  ])
  // 添加新的响应式变量
  const useStarImage = ref(false)
  const starImageWidth = ref(10) // 图片宽度，单位mm
  const starImageHeight = ref(10) // 图片高度，单位mm
  const keepAspectRatio = ref(true) // 是否保持宽高比
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
  const templateFileInput = ref<HTMLInputElement | null>(null)
  // 添加图片列表的响应式数据
  const imageList = ref<IDrawImage[]>([{
    imageUrl: '',
    imageWidth: 10,
    imageHeight: 10,
    positionX: 0,
    positionY: 0,
    keepAspectRatio: true
  }])
  
  // 添加外圈圆形边的响应式数据
  const drawOutBorder = ref(true)
  const outBorderLineWidth = ref(1)
  
  // 添加新图片
  const addNewImage = () => {
    console.log("add new image", imageList.value)
    if(imageList.value === undefined || imageList.value === null) {
      imageList.value = []
    }
    if(imageList.value.length < 10) {
      imageList.value.push({
        imageUrl: '',
        imageWidth: 10,
        imageHeight: 10,
        positionX: 0,
        positionY: 0,
        keepAspectRatio: true
      })
    }
  }
  
  // 删除图片
  const removeImage = (index: number) => {
    imageList.value.splice(index, 1)
  }
  
  // 修改图片上传处理函数
  const handleImageUpload = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      const file = target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          imageList.value[index].imageUrl = e.target.result as string
          drawStamp()
        }
      }
      reader.readAsDataURL(file)
    }
  }
  
  // 添加新的印章类型行
  const addNewStampType = () => {
    let newPositionY = -3
    if(stampTypeList.value.length > 0){
      const lastStampType = stampTypeList.value[stampTypeList.value.length - 1]
      newPositionY = lastStampType.positionY + lastStampType.fontHeight
    }
    stampTypeList.value.push({
      stampType: '新印章类型',
      fontHeight: 4.0,
      fontFamily: 'SimSun',
      compression: 0.75,
      letterSpacing: 0,
      positionY: newPositionY,
      fontWeight: 'normal',
      lineSpacing: 2,
      fontWidth: 3
    })
  }
  
  // 删除指定的印章型行
  const removeStampType = (index: number) => {
    stampTypeList.value.splice(index, 1)
  }
  
  // 添加新的公司行
  const addNewCompany = () => {
    let newBorderOffset = 1
    if(companyList.value.length > 0) {
      const lastCompany = companyList.value[companyList.value.length - 1]
      newBorderOffset = lastCompany.borderOffset + lastCompany.fontHeight
    }
    companyList.value.push({
      companyName: '新公司名称',
      compression: 1,
      borderOffset: newBorderOffset,
      textDistributionFactor: 3,
      fontFamily: 'SimSun',
      fontHeight: 4.2,
      fontWeight: 'normal',
      shape: 'ellipse',
      adjustEllipseText: false,
      adjustEllipseTextFactor: 0.5,
      startAngle: 0,
      rotateDirection: "counterclockwise"
    })
  }
  
  // 删除指定的公司行
  const removeCompany = (index: number) => {
    companyList.value.splice(index, 1)
  }
  
  const drawStampWidth = ref(40)
  const drawStampHeight = ref(30)
  
  // 添加新的响应式变量
  const bottomTextLineSpacing = ref(1.2) // 默认行间距为1.2mm
  
  const drawStamp = (refreshSecurityPattern: boolean = false, refreshOld: boolean = false, refreshRoughEdge: boolean = false) => {
    // 使用drawstamputils进行绘制
    props.drawStampUtils.refreshStamp(refreshSecurityPattern, refreshOld, refreshRoughEdge)
    emit('updateDrawStamp', props.drawStampUtils.getDrawConfigs(), refreshSecurityPattern, refreshOld, refreshRoughEdge)
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
    const drawConfigs = props.drawStampUtils.getDrawConfigs()
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
  
    // 税号
    const taxNumber: ITaxNumber = drawConfigs.taxNumber
    taxNumber.code = taxNumberValue.value
    taxNumber.compression = taxNumberCompression.value
    taxNumber.positionY = taxNumberPositionY.value
    taxNumber.letterSpacing = taxNumberLetterSpacing.value
    taxNumber.fontFamily = taxNumberFontFamily.value
    taxNumber.fontWeight = taxNumberFontWeight.value
  
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
  
    // 印章编码
    const code: ICode = drawConfigs.stampCode
    code.code = stampCode.value
    code.compression = codeCompression.value
    code.fontFamily = codeFontFamily.value
    code.fontHeight = codeFontSizeMM.value
    code.fontWidth = codeFontWidthMM.value
    code.borderOffset = codeMarginMM.value
    code.textDistributionFactor = codeDistributionFactor.value
    code.fontWeight = codeFontWeight.value
    // 印章配置
    drawConfigs.primaryColor = primaryColor.value
    drawConfigs.borderWidth = circleBorderWidth.value
    drawConfigs.width = drawStampWidth.value
    drawConfigs.height = drawStampHeight.value
  
    // 五角星/图片配置
    const drawStar: IDrawStar = drawConfigs.drawStar
    drawStar.drawStar = shouldDrawStar.value
    drawStar.useImage = useStarImage.value
    drawStar.imageWidth = starImageWidth.value
    drawStar.imageHeight = starImageHeight.value
    drawStar.keepAspectRatio = keepAspectRatio.value
    drawStar.starDiameter = starDiameter.value
    drawStar.starPositionY = starPositionY.value
  
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
  
    // 更新印章类型列表
    drawConfigs.stampTypeList = stampTypeList.value
  
    // 更新公司列表
    drawConfigs.companyList = companyList.value
    // 更新内圈列表
    drawConfigs.innerCircleList = innerCircleList.value
    // 更新图片列表
    drawConfigs.imageList = imageList.value
  
      // 外圈圆形边
      const outBorder: IInnerCircle = drawConfigs.outBorder
    outBorder.drawInnerCircle = drawOutBorder.value
    outBorder.innerCircleLineWidth = outBorderLineWidth.value
  
    drawStamp()
  }

  const restoreDrawConfigs = () => {
    const drawConfigs = props.drawStampUtils.getDrawConfigs()
  
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
    companyList.value = drawConfigs.companyList
  
    // 印章编码
    const stampCodeConfig: ICode = drawConfigs.stampCode
    stampCode.value = stampCodeConfig.code
    codeFontSizeMM.value = stampCodeConfig.fontHeight
    codeFontWidthMM.value = stampCodeConfig.fontWidth
    codeDistributionFactor.value = stampCodeConfig.textDistributionFactor
    codeMarginMM.value = stampCodeConfig.borderOffset
    codeFontFamily.value = stampCodeConfig.fontFamily
    codeFontWeight.value = stampCodeConfig.fontWeight
    codeCompression.value = stampCodeConfig.compression
  
    // 税号
    const taxNumber: ITaxNumber = drawConfigs.taxNumber
    taxNumberValue.value = taxNumber.code
    taxNumberCompression.value = taxNumber.compression
    taxNumberLetterSpacing.value = taxNumber.letterSpacing
    taxNumberPositionY.value = taxNumber.positionY
    taxNumberFontFamily.value = taxNumber.fontFamily
    taxNumberFontWeight.value = taxNumber.fontWeight
  
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
    stampTypeList.value = drawConfigs.stampTypeList
  
    // 五角星/图片配置
    shouldDrawStar.value = drawConfigs.drawStar.drawStar
    useStarImage.value = drawConfigs.drawStar.useImage
    starImageWidth.value = drawConfigs.drawStar.imageWidth
    starImageHeight.value = drawConfigs.drawStar.imageHeight
    keepAspectRatio.value = drawConfigs.drawStar.keepAspectRatio
    starDiameter.value = drawConfigs.drawStar.starDiameter
    starPositionY.value = drawConfigs.drawStar.starPositionY
  
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
  
    // 图片列表
    imageList.value = drawConfigs.imageList || []
  
      // 外圈圆形边
      drawOutBorder.value = drawConfigs.outBorder.drawInnerCircle
    outBorderLineWidth.value = drawConfigs.outBorder.innerCircleLineWidth
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
      stampCode,
      companyFontSizeMM,
      codeFontSizeMM,
      circleRadius,
      circleBorderWidth,
      primaryColor,
      starDiameter,
      codeDistributionFactor,
      textDistributionFactor,
      textMarginMM,
      codeMarginMM,
      agingIntensity,
      bottomText,
      bottomTextFontFamily,
      bottomTextFontSizeMM,
      bottomTextLetterSpacing,
      bottomTextPositionY,
      taxNumberValue,
      applyAging,
      agingIntensity,
      companyNameCompression,
      bottomTextCompression,
      codeCompression,
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
      shouldDrawStar,
      starPositionY,
      taxNumberCompression,
      taxNumberFontFamily,
      taxNumberLetterSpacing,
      taxNumberPositionY,
      starDiameter,
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
      codeFontWeight,
      codeFontFamily,
      taxNumberFontWeight,
      adjustEllipseText,
      adjustEllipseTextFactor,
      bottomTextLineSpacing,
      stampTypeList,
      companyList,
      useStarImage,
      starImageWidth,
      starImageHeight,
      keepAspectRatio,
      innerCircleList,
      imageList,
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
  
  // 添加新的响应式变量
  const showSecurityWarning = ref(localStorage.getItem('showSecurityWarning') !== 'false')
  
  watch(showSecurityWarning, (newValue) => {
    localStorage.setItem('showSecurityWarning', String(newValue))
  })

  // 更新做旧效果
  const updateAgingEffect = () => {
    const config = props.drawStampUtils.getDrawConfigs()
    config.agingEffect = {
      ...config.agingEffect,
      applyAging: applyAging.value,
      manualAging: manualAging.value,
      intensity: agingIntensity.value
    }
    
    emit('updateDrawStamp', config, false, true, false)
  }

  // 刷新做旧效果
  const refreshAgingEffect = () => {
    emit('updateDrawStamp', props.drawStampUtils.getDrawConfigs(), false, true, false)
  }

  // 添加滚动到公司文字组件的方法
  const scrollToCompanyText = (index: number) => {
    // 展开公司设置组
    expandedGroups.value.company = true
    
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
    expandedGroups.value.code = true
    
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
    expandedGroups.value.stampType = true
    
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
    expandedGroups.value.taxNumber = true
    
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
  