<template>
  <div class="homepage">
    <div class="page-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">最好的在线电子印章制作工具 - DrawStamp</h1>
          <p class="hero-subtitle">DrawStamp 是现代企业和个人使用的专业解决方案！我们的印章设计工具将帮助您为任何场合创建独特的印章产品！</p>
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
              <button class="canvas-action-btn" @click="triggerTemplateFileLoad" title="导入模板">
                <span>📥</span>
              </button>
              <button class="canvas-action-btn" @click="saveCurrentAsTemplate" title="导出模板">
                <span>📤</span>
              </button>
              <button class="canvas-action-btn" @click="saveStampAsPNG" title="下载">
                <span>💾</span>
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
          <h2 class="section-title">支持多种印章类型</h2>
          <div class="stamp-types-grid">
            <div class="stamp-type-item">原型印章</div>
            <div class="stamp-type-item">椭圆印章</div>
            <div class="stamp-type-item">矩形印章</div>
            <div class="stamp-type-item">签名印章</div>
            <div class="stamp-type-item">日期印章</div>
            <div class="stamp-type-item">文字印章</div>
            <div class="stamp-type-item">中文印章</div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="why-choose-section">
        <div class="item-container">
          <h2 class="section-title">为什么选择 DrawStamp？</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🎨</div>
              <h3>所有印章类型一站式服务</h3>
              <p>支持各种类型的印章制作，满足不同需求</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⏰</div>
              <h3>24/7 随时制作</h3>
              <p>不受时间限制，随时随地创建您的印章</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <h3>多设备兼容</h3>
              <p>支持电脑、平板和手机，随时随地使用</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🌍</div>
              <h3>全球可用</h3>
              <p>无论您在世界任何角落，都可以使用我们的服务</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💰</div>
              <h3>完全免费</h3>
              <p>无需设计师，无需等待，完全免费使用</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💾</div>
              <h3>随时下载</h3>
              <p>下载您的设计结果，可无限次使用</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works-section">
        <div class="item-container">
          <h2 class="section-title">只需几个步骤，即可完成您的印章！</h2>
          <div class="steps-container">
            <div class="step-item">
              <div class="step-number">1</div>
              <h3>选择形状和尺寸</h3>
              <p>选择圆形、矩形或三角形，设置您需要的尺寸</p>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <h3>添加文本和内容</h3>
              <p>输入公司名称、印章类型、编码、税号等信息</p>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <h3>自定义设计</h3>
              <p>调整字体、颜色、大小、位置等细节参数</p>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <h3>下载使用</h3>
              <p>以 PNG 格式下载，可直接使用或添加到文档中</p>
            </div>
          </div>
          <div class="cta-section">
            <router-link to="/maker" class="cta-button-large">免费试用</router-link>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="item-container">
          <h2 class="section-title">我们的印章制作工具让您能够快速：</h2>
          <div class="features-list">
            <div class="feature-card">
              <h3>创建带 Logo 的印章</h3>
              <p>支持上传自定义 Logo 或从图库中选择</p>
            </div>
            <div class="feature-card">
              <h3>选择模板快速制作</h3>
              <p>提供多种预设模板，只需输入数据即可</p>
            </div>
            <div class="feature-card">
              <h3>多种格式下载</h3>
              <p>支持 PNG、SVG 等格式，满足不同需求</p>
            </div>
            <div class="feature-card">
              <h3>添加到文档</h3>
              <p>可直接添加到 PDF 或 Word 文档中</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="item-container">
          <h2 class="section-title">常见问题</h2>
          <div class="faq-list">
            <div class="faq-item">
              <h3>如何在线制作自己的印章？</h3>
              <p>访问 DrawStamp，使用我们的图形编辑器即可创建。直观的界面简单易用。创建完成后，您可以下载设计文件。</p>
            </div>
            <div class="faq-item">
              <h3>制作印章需要多长时间？</h3>
              <p>使用我们的在线工具，只需几分钟即可完成印章设计。整个过程简单快捷，无需等待。</p>
            </div>
            <div class="faq-item">
              <h3>可以自定义印章吗？</h3>
              <p>当然可以！您可以完全自定义印章的所有元素，包括文本、字体、颜色、大小、位置等。</p>
            </div>
            <div class="faq-item">
              <h3>支持哪些文件格式？</h3>
              <p>我们支持 PNG 格式下载，保证印章的清晰度和质量。所有处理都在本地完成，保护您的隐私。</p>
            </div>
            <div class="faq-item">
              <h3>可以在手机上使用吗？</h3>
              <p>可以！DrawStamp 支持所有智能设备，包括电脑、平板和手机，只要有网络连接即可使用。</p>
            </div>
            <div class="faq-item">
              <h3>使用是免费的吗？</h3>
              <p>是的，DrawStamp 完全免费使用。您可以随时创建、编辑和下载您的印章设计。</p>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { DrawStampUtils } from '../DrawStampUtils'
import { getSystemFonts } from '../utils/fontUtils'
import { IDrawStampConfig } from '../DrawStampTypes'
import ElementList from './editor/ElementList.vue'
import PropertiesPanel from './editor/PropertiesPanel.vue'
import { useStampStore } from '../stores/stampStore'

const stampStore = useStampStore()

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
  templateFileInput.value?.click()
}

// 加载模板文件
const loadTemplateFile = async (event: Event) => {
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

    drawStampUtils.setDrawConfigs(newConfig)
    stampStore.setConfig(newConfig)
    drawStamp()

    // 更新编辑器控件
    await nextTick()
    propertiesPanelRef.value?.restoreDrawConfigs()
  } catch (error) {
    console.error('加载模板文件失败:', error)
    alert('加载模板文件失败，请检查文件格式是否正确')
  } finally {
    // 清除文件选择，以便可以再次选择同一个文件
    input.value = ''
  }
}

// 保存图片
const saveStampAsPNG = () => {
  drawStampUtils.saveStampAsPNG()
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

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding-bottom: 2rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto 2rem;
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

