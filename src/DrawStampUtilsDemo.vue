<template>
  <div class="container">
    <div class="editor-controls" ref="editorControls">
      <!-- 顶部固定按钮 -->
      <div
        class="button-group"
        style="position: sticky; top: 0; z-index: 1000; background-color: white; padding: 10px"
      >
        <button @click="extractStamp()">提取印章</button>
        <button @click="saveStampAsPNG">保存印章</button>
      </div>

      <!-- 印章基本设置 -->
      <div class="control-group" id="stamp-settings">
        <h3>印章基本设置</h3>
        <label
          >印章宽度 (mm):
          <input type="number" v-model.number="drawStampWidth" min="1" max="50" step="1"
        /></label>
        <label
          >印章高度 (mm):
          <input type="number" v-model.number="drawStampHeight" min="1" max="50" step="1"
        /></label>
        <label
          >圆形边框宽度 (mm): <input type="number" step="0.1" v-model.number="circleBorderWidth"
        /></label>
        <label>圆形边框颜色: <input type="color" v-model="circleBorderColor" /></label>
        <div class="control-group" id="inner-circle-settings">
          <h3>内圈圆形设置</h3>
          <label class="checkbox-label">
            <input type="checkbox" v-model="drawInnerCircle" /> 绘制内圈圆形
          </label>
          <label>
            内圈圆形线宽 (mm):
            <input
              type="number"
              v-model.number="innerCircleLineWidth"
              min="0.1"
              max="2"
              step="0.1"
            />
          </label>
          <label>
            内圈圆形宽度 (mm):
            <input type="number" v-model.number="innerCircleWidth" min="1" max="50" step="0.5" />
          </label>
          <label>
            内圈圆形高度 (mm):
            <input type="number" v-model.number="innerCircleHeight" min="1" max="50" step="0.5" />
          </label>
        </div>
      <div class="control-group" id="out-thin-circle-settings">
        <h3>外部细圈设置</h3>
        <label class="checkbox-label">
          <input type="checkbox" v-model="drawOutThinCircle" /> 绘制外部细圈
        </label>
        <label>
          外部细圈线宽 (mm):
          <input
            type="number"
            v-model.number="outThinCircleLineWidth"
            min="0.1"
            max="2"
            step="0.1"
          />
        </label>
        <label>
          外部细圈宽度 (mm):
          <input type="number" v-model.number="outThinCircleWidth" min="1" max="50" step="0.5" />
        </label>
        <label>
          外部细圈高度 (mm):
          <input type="number" v-model.number="outThinCircleHeight" min="1" max="50" step="0.5" />
        </label>
      </div>
      </div>
      <!-- 公司名称设置 -->
      <div class="control-group" id="company-name-settings">
        <h3>公司名称设置</h3>
        <label>公司名称: <input v-model="companyName" /></label>
        <label
          >字体大小 (mm): <input type="number" v-model.number="companyFontSizeMM" step="0.1"
        /></label>
        <label>
          字体粗细:
          <select v-model="companyNameFontWeight">
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
          <span>压缩比例：{{ companyNameCompression.toFixed(2) }}</span>
          <input
            type="range"
            v-model.number="companyNameCompression"
            min="0.5"
            max="1.5"
            step="0.05"
          />
        </label>
        <label>
          <span>分布因子：{{ textDistributionFactor.toFixed(1) }}</span>
          <input
            type="range"
            v-model.number="textDistributionFactor"
            min="1"
            max="100"
            step="0.5"
          />
        </label>
        <label>
          <span>边距 (mm): </span>
          <input type="number" v-model.number="textMarginMM" min="-10" max="10" step="0.05" />
        </label>
      </div>

      <!-- 底部文字设置 -->
      <div class="control-group" id="bottom-text-settings">
        <h3>底部文字设置</h3>
        <label>底部文字: <input type="text" v-model="bottomText" /></label>
        <label
          >字体大小 (mm):
          <input type="number" v-model.number="bottomTextFontSizeMM" min="1" max="10" step="0.1"
        /></label>
        <label>
          字体粗细:
          <select v-model="bottomTextFontWeight">
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
          <span>压缩比例：{{ bottomTextCompression.toFixed(2) }}</span>
          <input
            type="range"
            v-model.number="bottomTextCompression"
            min="0.5"
            max="1.5"
            step="0.05"
          />
        </label>
        <label>
          <span>字符间距 (mm)：{{ bottomTextLetterSpacing.toFixed(2) }}</span>
          <input
            type="range"
            v-model.number="bottomTextLetterSpacing"
            min="-1"
            max="10"
            step="0.05"
          />
        </label>
        <label>
          垂直位置调整 (mm):
          <input type="number" v-model.number="bottomTextPositionY" min="-10" max="10" step="0.1" />
        </label>
      </div>

      <!-- 印章编码设置 -->
      <div class="control-group" id="code-settings">
        <h3>印章编码设置</h3>
        <label>印章编码: <input v-model="stampCode" /></label>
        <label
          >字体大小 (mm): <input type="number" v-model.number="codeFontSizeMM" step="0.1"
        /></label>
        <label>
          字体粗细:
          <select v-model="codeFontWeight">
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
          <span>压缩比例：{{ codeCompression.toFixed(2) }}</span>
          <input type="range" v-model.number="codeCompression" min="0.0" max="3" step="0.01" />
        </label>
        <label>
          <span>分布因子: {{ codeDistributionFactor.toFixed(1) }}</span>
          <input
            type="range"
            v-model.number="codeDistributionFactor"
            min="0"
            max="100"
            step="0.5"
          />
        </label>
        <label>
          边距 (mm):
          <input type="number" v-model.number="codeMarginMM" min="-10" max="20" step="0.05" />
        </label>
      </div>

      <!-- 税号设置 -->
      <div class="control-group" id="tax-number-settings">
        <h3>税号设置</h3>
        <label>税号: <input v-model="taxNumberValue" /></label>
        <label>
          字体粗细:
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
          <span>压缩比例：{{ taxNumberCompression.toFixed(2) }}</span>
          <input type="range" v-model.number="taxNumberCompression" min="0.0" max="3" step="0.01" />
        </label>
        <label>
          <span>字符间距 (mm)：{{ taxNumberLetterSpacing.toFixed(2) }}</span>
          <input
            type="range"
            v-model.number="taxNumberLetterSpacing"
            min="-1"
            max="20"
            step="0.05"
          />
        </label>
        <label>
          <span>垂直位置调整 (mm)：{{ taxNumberPositionY.toFixed(1) }}</span>
          <input type="range" v-model.number="taxNumberPositionY" min="-10" max="10" step="0.1" />
        </label>
      </div>

      <!-- 五角星设置 -->
      <div class="control-group" id="star-settings">
        <h3>五角星设置</h3>
        <label class="checkbox-label">
          <input type="checkbox" v-model="shouldDrawStar" />
          绘制五角星
        </label>
        <label v-if="shouldDrawStar">
          五角星直径 (mm):
          <input type="number" v-model.number="starDiameter" step="0.1" />
        </label>
        <label v-if="shouldDrawStar">
          五角星垂直位置 (mm):
          <input type="number" v-model.number="starPositionY" min="-10" max="10" step="0.1" />
        </label>
      </div>

      <!-- 防伪纹路设置 -->
      <div class="control-group">
        <h3>防伪纹路设置</h3>
        <label>
          启用防伪纹路:
          <input type="checkbox" v-model="securityPatternEnabled" />
        </label>
        <button @click="drawStamp(true, false)">刷新纹路</button>
        <label
          >纹路数量:
          <input type="range" v-model.number="securityPatternCount" min="1" max="20" step="1"
        /></label>
        <label
          >纹路长度 (mm):
          <input type="range" v-model.number="securityPatternLength" min="0.1" max="20" step="0.1"
        /></label>
        <label
          >纹路宽度 (mm):
          <input
            type="range"
            v-model.number="securityPatternWidth"
            min="0.05"
            max="0.5"
            step="0.05"
        /></label>
      </div>
      <!-- 毛边效果设置 -->
    <div class="control-group">
      <h3>毛边效果设置</h3>
      <label class="checkbox-label">
        <input type="checkbox" v-model="shouldDrawRoughEdge" />
        启用毛边效果
      </label>
      <label v-if="shouldDrawRoughEdge">
        毛边宽度 (mm):
        <input type="range" v-model.number="roughEdgeWidth" min="0.05" max="0.5" step="0.05" />
      </label>
      <label v-if="shouldDrawRoughEdge">
        毛边高度 (mm):
        <input type="range" v-model.number="roughEdgeHeight" min="0.1" max="5" step="0.1" />
      </label>
      <label v-if="shouldDrawRoughEdge">
        毛边概率:
        <input type="range" v-model.number="roughEdgeProbability" min="0" max="1" step="0.01" />
      </label>
      <label v-if="shouldDrawRoughEdge">
        毛边偏移 (mm):
        <input type="range" v-model.number="roughEdgeShift" min="0" max="1" step="0.01" />
      </label>
      <label v-if="shouldDrawRoughEdge">
        毛边点数:
        <input type="range" v-model.number="roughEdgePoints" min="100" max="1000" step="10" />
      </label>
      <button @click="drawStamp(false, true)">刷新毛边</button>
    </div>  
    </div>
    

    <!-- Canvas 容器 -->
    <div class="canvas-container">
      <div style="display: flex; flex-direction: row; margin-top: 12px">
        <div>
          <img ref="stampImageRef" style="width: 100px; height: 100px;"/>
        </div>
        <!-- 做旧效果设置 -->
        <div class="control-group">
          <h3>做旧效果</h3>
          <label class="checkbox-label">
            <input type="checkbox" v-model="applyAging" />
            启用做旧效果
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="manualAging" />
            手动做旧
          </label>
          <label v-if="applyAging">
            做旧强度:
            <input type="range" v-model.number="agingIntensity" min="0" max="100" step="1" />
          </label>
          <button @click="drawStamp(false, true)">刷新做旧</button>
        </div>

        <!-- 标尺设置 -->
        <!-- <div class="control-group" style="margin-left: 12px">
          <h3>标尺设置</h3>
          <label class="checkbox-label">
            <input type="checkbox" v-model="showFullRuler" />
            显示完整标尺
          </label>
        </div> -->
      </div>

      <canvas ref="stampCanvas" width="600" height="600"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  DrawStampUtils,
  IRoughEdge,
  type ICode,
  type ICompany,
  type IDrawStar,
  type IInnerCircle,
  type ISecurityPattern,
  type IStampType,
  type ITaxNumber
} from './DrawStampUtils'
const editorControls = ref<HTMLDivElement | null>(null)
const stampCanvas = ref<HTMLCanvasElement | null>(null)
const MM_PER_PIXEL = 10 // 毫米换算像素

// 添加响应式数据
const companyName = ref('绘制印章有限责任公司')
// 印章编码
const stampCode = ref('1234567890123')
// 税号
const taxNumberValue = ref('000000000000000000')
// 公司名称字体大小（毫米）
const companyFontSizeMM = ref(4.2)
// 编码字体大小（毫米）
const codeFontSizeMM = ref(1.2)
// 编码字体宽度（毫米）
const codeFontWidthMM = ref(1.2)
// 圆形印章半径（毫米）
const circleRadius = ref(20)
// 圆形边框宽度（毫米）
const circleBorderWidth = ref(1)
// 圆形边框颜色
const circleBorderColor = ref('#ff0000')
// 五角星直径（毫米）
const starDiameter = ref(14)
// 做旧效果
const applyAging = ref(false)
// 手动做旧
const manualAging = ref(false)
// 添加新的响应式数据
const agingIntensity = ref(50)
// 文字分布因子，控制公司名称文字在椭圆上的分布范围
const textDistributionFactor = ref(20)
// 文字边距，控制公司名称文字距离椭圆边缘的距离（单位：毫米）
const textMarginMM = ref(1) // 默认值为1mm
// 编码边距，控制印章编码距离椭圆边缘的距离（单位：毫米）
const codeMarginMM = ref(1) // 默认值为1mm
// 编码分布因子，控制印章编码在椭圆下方的分布范围
const codeDistributionFactor = ref(20) // 默认值可以根据需要调整
// 印章底部文字
const bottomText = ref('合同专用章')
// 底部文字大小，默认 4mm
const bottomTextFontSizeMM = ref(4.6)
const bottomTextFontWidthMM = ref(3)
// 底部文字字符间距，默认 0
const bottomTextLetterSpacing = ref(0)
// 五角星垂直位置调整，默认 0
const starPositionY = ref(0)
// 底部文字垂直位置调整，默认 0
const bottomTextPositionY = ref(-5)
const companyNameCompression = ref(1)
const companyNameFontWeight = ref(400)
const bottomTextFontWeight = ref(400)
const codeFontWeight = ref(400)
const taxNumberFontWeight = ref(400)
const bottomTextCompression = ref(1)
const codeCompression = ref(1)
// 防伪纹路
const securityPatternEnabled = ref(true)
const securityPatternDensity = ref(0.5)
const securityPatternWidth = ref(0.2) // 纹路宽度，单位为毫米
const securityPatternColor = ref('#FF0000')
const securityPatternCount = ref(5) // 防伪纹路数量
const securityPatternLength = ref(2) // 纹路长度，单位为毫米

const showFullRuler = ref(false)
const shouldDrawStar = ref(false) // 默认绘制五角星

const taxNumberCompression = ref(1) // 税号文字宽度缩放比例
const taxNumberLetterSpacing = ref(0.3) // 税号文字间距（单位：毫米）
const taxNumberPositionY = ref(0) // 税号垂直位置调整，默认为0
const drawInnerCircle = ref(false) // 是否绘制内圈圆
const innerCircleLineWidth = ref(0.5) // 内圈圆线宽，单位为毫米
const innerCircleWidth = ref(15) // 内圈圆宽度，单位为毫米
const innerCircleHeight = ref(12) // 内圈圆高度，单位为毫米 
const drawOutThinCircle = ref(false) // 是否绘制内圈圆
const outThinCircleLineWidth = ref(0.5) // 内圈圆线宽，单位为毫米
const outThinCircleWidth = ref(15) // 内圈圆宽度，单位为毫米
const outThinCircleHeight = ref(12) // 内圈圆高度，单位为毫米
const stampImageRef = ref<HTMLImageElement | null>(null)
const shouldDrawRoughEdge = ref(false) // 是否绘制毛边
const roughEdgeWidth = ref(0.2) // 毛边宽度，单位为毫米
const roughEdgeHeight = ref(5) // 毛边高度，单位为毫米
const roughEdgeProbability = ref(0.5) // 毛边概率
const roughEdgeShift = ref(0.5) // 毛边偏移
const roughEdgePoints = ref(360) // 毛边点数

const saveStampAsPNG = () => {
  drawStampUtils.saveStampAsPNG(512)
}

const drawStampWidth = ref(40)
const drawStampHeight = ref(30)


const extractStamp = () => {
  // 选择图片进行印章提取
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log('选择了图片', file)
        // 这里可以进一步处理base64数据，比如传递给extractRedStamp函数
        drawStampUtils.extractStampWithFile(file, '#ff0000', '#ff0000')
        .then(res => {
          // 下载提取的印章图片
          const downloadExtractedStamp = (base64Data: string) => {
            const link = document.createElement('a');
            link.href = base64Data;
            link.download = '提取的印章.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
          
          // 调用下载函数
          downloadExtractedStamp(res as string);
          console.log(res)
        // 将提取的印章图片设置给 stampImageRef
        if (stampImageRef.value) {
          stampImageRef.value.src = res as string;
        }
        });
        
    } else {
      console.error('未选择图片')
    }
  };
  fileInput.click();
}

// 绘制工具
let drawStampUtils: DrawStampUtils
// 初始化绘制印章参数
const initDrawStampUtils = () => {
  drawStampUtils = new DrawStampUtils(stampCanvas.value, MM_PER_PIXEL)
}

const drawStamp = (refreshSecurityPattern: boolean = false, refreshOld: boolean = false) => {
  // 使用drawstamputils进行绘制
  drawStampUtils.refreshStamp(refreshSecurityPattern, refreshOld)
}

// 更新绘制配置
const updateDrawConfigs = () => {
  const drawConfigs = drawStampUtils.getDrawConfigs()
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
  company.compression = companyNameCompression.value
  company.fontWeight = companyNameFontWeight.value

  // 税号
  const taxNumber: ITaxNumber = drawConfigs.taxNumber
  taxNumber.code = taxNumberValue.value
  taxNumber.compression = taxNumberCompression.value
  taxNumber.positionY = taxNumberPositionY.value
  taxNumber.letterSpacing = taxNumberLetterSpacing.value
  taxNumber.fontWeight = taxNumberFontWeight.value

  // 印章类型
  const stampType: IStampType = drawConfigs.stampType
  stampType.stampType = bottomText.value
  stampType.fontHeight = bottomTextFontSizeMM.value
  stampType.fontWidth = bottomTextFontWidthMM.value
  stampType.letterSpacing = bottomTextLetterSpacing.value
  stampType.positionY = bottomTextPositionY.value
  stampType.compression = bottomTextCompression.value
  stampType.fontWeight = bottomTextFontWeight.value

  // 印章编码
  const code: ICode = drawConfigs.stampCode
  code.code = stampCode.value
  code.compression = codeCompression.value
  code.fontHeight = codeFontSizeMM.value
  code.fontWidth = codeFontWidthMM.value
  code.borderOffset = codeMarginMM.value
  code.textDistributionFactor = codeDistributionFactor.value
  code.fontWeight = codeFontWeight.value
  // 印章配置
  drawConfigs.primaryColor = circleBorderColor.value
  drawConfigs.borderWidth = circleBorderWidth.value
  drawConfigs.width = drawStampWidth.value
  drawConfigs.height = drawStampHeight.value

  // 五角星
  const drawStar: IDrawStar = drawConfigs.drawStar
  drawStar.drawStar = shouldDrawStar.value
  drawStar.starDiameter = starDiameter.value
  drawStar.starPositionY = starPositionY.value

  /*
  * 毛边效果
      drawRoughEdge: true,
    roughEdgeWidth: 0.2,
    roughEdgeHeight: 5,
    roughEdgeColor: 'rgba(255, 0, 0, 0.5)',
    roughEdgeParams: [],
    roughEdgeProbability: 0.3,
    roughEdgeShift: 0.5,
    roughEdgePoints: 360
  */
  const roughEdge: IRoughEdge = drawConfigs.roughEdge
  roughEdge.drawRoughEdge = shouldDrawRoughEdge.value
  roughEdge.roughEdgeWidth = roughEdgeWidth.value
  roughEdge.roughEdgeHeight = roughEdgeHeight.value
  roughEdge.roughEdgeProbability = roughEdgeProbability.value
  roughEdge.roughEdgeShift = roughEdgeShift.value
  roughEdge.roughEdgePoints = roughEdgePoints.value
//   if(drawStar.drawStar) {
//     drawStar.svgPath = `<svg width="40px" height="40px" viewBox="0 0 24 24" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">
//  <g transform="translate(0 -1028.4)">
//   <path d="m12 1028.4 4 9 8 1-6 5 2 9-8-5-8 5 2-9-6-5 8-1z" fill="#f39c12"/>
//   <path d="m12 1028.4-4 9-6.9688 0.8 4.9688 4.2-0.1875 0.8 0.1875 0.2-1.75 7.8 7.75-4.8 7.75 4.8-1.75-7.8 0.188-0.2-0.188-0.8 4.969-4.2-6.969-0.8-4-9z" fill="#f1c40f"/>
//  </g>
// </svg>`
//   }

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

  drawStamp()
}

const restoreDrawConfigs = () => {
  const drawConfigs = drawStampUtils.getDrawConfigs()
  const company: ICompany = drawConfigs.company

  // 公司名称
  companyName.value = company.companyName
  companyFontSizeMM.value = company.fontHeight
  companyNameCompression.value = company.compression
  textDistributionFactor.value = company.textDistributionFactor
  textMarginMM.value = company.borderOffset

  // 印章编码
  const stampCodeConfig: ICode = drawConfigs.stampCode
  stampCode.value = stampCodeConfig.code
  codeFontSizeMM.value = stampCodeConfig.fontHeight
  codeFontWidthMM.value = stampCodeConfig.fontWidth
  codeDistributionFactor.value = stampCodeConfig.textDistributionFactor
  codeMarginMM.value = stampCodeConfig.borderOffset

  // 税号
  const taxNumber: ITaxNumber = drawConfigs.taxNumber
  taxNumberValue.value = taxNumber.code
  taxNumberCompression.value = taxNumber.compression
  taxNumberLetterSpacing.value = taxNumber.letterSpacing
  taxNumberPositionY.value = taxNumber.positionY

  // 印章类型
  const stampTypeConfig: IStampType = drawConfigs.stampType
  bottomText.value = stampTypeConfig.stampType
  bottomTextFontSizeMM.value = stampTypeConfig.fontHeight
  bottomTextFontWidthMM.value = stampTypeConfig.fontWidth
  bottomTextLetterSpacing.value = stampTypeConfig.letterSpacing
  bottomTextPositionY.value = stampTypeConfig.positionY

  // 五角星
  shouldDrawStar.value = drawConfigs.drawStar.drawStar
  starDiameter.value = drawConfigs.drawStar.starDiameter
  starPositionY.value = drawConfigs.drawStar.starPositionY

  // 主题颜色
  circleBorderColor.value = drawConfigs.primaryColor
  manualAging.value = drawConfigs.openManualAging
}

onMounted(() => {
  initDrawStampUtils()
  // 将绘制参数反射到当前界面
  restoreDrawConfigs()
  drawStamp()
})

// 监听所有响应式数据的变化
watch(
  [
    companyName,
    stampCode,
    companyFontSizeMM,
    codeFontSizeMM,
    circleRadius,
    circleBorderWidth,
    circleBorderColor,
    starDiameter,
    codeDistributionFactor,
    textDistributionFactor,
    textMarginMM,
    codeMarginMM,
    agingIntensity,
    bottomText,
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
    taxNumberFontWeight
  ],
  () => {
    updateDrawConfigs()
  }
)
</script>
<style scoped>
.container {
  display: flex;
  height: 50%; /* 使用视口高度 */
  overflow: hidden;
}

.editor-controls {
  width: 300px;
  padding: 10px;
  background-color: #f0f0f0;
  overflow-y: auto; /* 允许垂直滚动 */
  max-height: 70vh; /* 最大高度为视口高度 */
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

.control-group {
  margin-bottom: 15px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.control-group h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.editor-controls label {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  font-size: 14px;
}

.editor-controls input[type='text'],
.editor-controls input[type='number'],
.editor-controls input[type='range'] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

.editor-controls input[type='color'] {
  width: 100%;
  height: 30px;
  padding: 0;
  border: none;
}

.checkbox-label {
  flex-direction: row !important;
  align-items: center;
}

.checkbox-label input {
  margin-right: 5px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #45a049;
}

.canvas-container {
  flex-grow: 1;
  flex-direction: column;
  background-color: aliceblue;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto; /* 允许内容溢出时滚动 */
}

canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
