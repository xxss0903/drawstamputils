<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.company.title') }}
        <span class="expand-icon" :class="{ expanded: expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <div v-for="(company, index) in companyList" :key="index" class="company-item">
        <div class="company-header">
          <div class="header-left">
            <button
              class="expand-toggle-btn"
              @click.stop="toggleItem(index)"
              :title="isItemExpanded(index) ? t('stamp.common.collapse') : t('stamp.common.expand')"
            >
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ t('stamp.common.line', { index: index + 1 }) }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copyCompany(index)">
              {{ t('stamp.common.copy') }}
            </button>
            <button class="small-button delete-button" @click.stop="removeCompany(index)">
              {{ t('stamp.common.delete') }}
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="company-body">
          <!-- 文本/选择类设置 -->
          <div class="settings-section">
            <div class="text-input-item">
              <div class="text-input-header">
                <span class="text-input-label">{{ t('stamp.company.name') }}:</span>
              </div>
              <input
                type="text"
                class="text-input-field"
                :value="company.companyName"
                @input="onFieldInput(index, 'companyName', $event)"
              />
            </div>

            <!-- 顶部文字工具栏：字体 / 字号 / 粗体 / 颜色 -->
            <div class="text-toolbar">
              <select
                :value="company.fontFamily"
                class="toolbar-font-select"
                @change="onFieldInput(index, 'fontFamily', $event)"
              >
                <option v-for="font in fonts" :key="font" :value="font" :style="{ fontFamily: font }">
                  {{ getFontDisplayName(font) }}
                </option>
              </select>
              <input
                type="number"
                class="toolbar-font-size"
                :value="company.fontHeight"
                min="1"
                max="10"
                step="0.1"
                @input="onNumberInput(index, 'fontHeight', $event)"
              />
            </div>
            <div class="text-toolbar">
              <button
                type="button"
                class="toolbar-bold-btn"
                :class="{ active: company.fontWeight === 'bold' || company.fontWeight === 700 }"
                @click="toggleBold(index)"
              >
                B
              </button>
              <button
                type="button"
                class="toolbar-italic-btn"
                :class="{ active: company.fontStyle === 'italic' }"
                @click="toggleItalic(index)"
                :title="t('stamp.company.italic')"
              >
                <img :src="icItalicPng" :alt="t('stamp.company.italic')" class="toolbar-icon-img" />
              </button>
              <label class="toolbar-color-wrapper">
                <span class="toolbar-color-swatch" :style="{ backgroundColor: company.color || primaryColor }"></span>
                <input
                  type="color"
                  class="toolbar-color-input"
                  :value="company.color || primaryColor"
                  @input="onColorInput(index, $event)"
                />
              </label>
            </div>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.company.margin') }}:</span>
              <input
                type="number"
                :value="company.borderOffset"
                min="-20"
                max="20"
                step="0.01"
                @input="onNumberInput(index, 'borderOffset', $event)"
              />
            </label>
            <template v-if="company.shape === 'ellipse'">
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.company.rotateDirection') }}:</span>
                <select :value="company.rotateDirection" @change="onFieldInput(index, 'rotateDirection', $event)">
                  <option value="clockwise">{{ t('stamp.company.clockwise') }}</option>
                  <option value="counterclockwise">{{ t('stamp.company.counterclockwise') }}</option>
                </select>
              </label>
            </template>

            <template v-else>
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.company.textDirection') }}:</span>
                <select :value="company.rectangleTextDirection" @change="onFieldInput(index, 'rectangleTextDirection', $event)">
                  <option value="horizontal">{{ t('stamp.company.textDirectionOptions.horizontal') }}</option>
                  <option value="vertical">{{ t('stamp.company.textDirectionOptions.vertical') }}</option>
                </select>
              </label>
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.company.textPosition') }}:</span>
                <select :value="company.rectangleTextPosition" @change="onFieldInput(index, 'rectangleTextPosition', $event)">
                  <option value="top">{{ t('stamp.company.textPositionOptions.top') }}</option>
                  <option value="bottom">{{ t('stamp.company.textPositionOptions.bottom') }}</option>
                  <option value="left">{{ t('stamp.company.textPositionOptions.left') }}</option>
                  <option value="right">{{ t('stamp.company.textPositionOptions.right') }}</option>
                  <option value="center">{{ t('stamp.company.textPositionOptions.center') }}</option>
                </select>
              </label>
              <label v-if="company.rectangleTextDirection === 'horizontal'" class="inline-label">
                <span class="label-text">{{ t('stamp.company.horizontalAlign') }}:</span>
                <select :value="company.rectangleTextAlignment" @change="onFieldInput(index, 'rectangleTextAlignment', $event)">
                  <option value="left">{{ t('stamp.company.horizontalAlignOptions.left') }}</option>
                  <option value="center">{{ t('stamp.company.horizontalAlignOptions.center') }}</option>
                  <option value="right">{{ t('stamp.company.horizontalAlignOptions.right') }}</option>
                </select>
              </label>
              <label v-else class="inline-label">
                <span class="label-text">{{ t('stamp.company.verticalAlign') }}:</span>
                <select :value="company.rectangleVerticalAlignment" @change="onFieldInput(index, 'rectangleVerticalAlignment', $event)">
                  <option value="top">{{ t('stamp.company.verticalAlignOptions.top') }}</option>
                  <option value="center">{{ t('stamp.company.verticalAlignOptions.center') }}</option>
                  <option value="bottom">{{ t('stamp.company.verticalAlignOptions.bottom') }}</option>
                </select>
              </label>
              <label v-if="company.rectangleTextDirection === 'vertical'" class="inline-label">
                <span class="label-text">{{ t('stamp.company.lineSpacing') }}:</span>
                <input
                  type="number"
                  :value="company.rectangleLineSpacing"
                  min="0"
                  max="10"
                  step="0.1"
                  @input="onNumberInput(index, 'rectangleLineSpacing', $event)"
                />
              </label>
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.company.textMargin') }}:</span>
                <input
                  type="number"
                  :value="company.rectangleTextMargin"
                  min="0"
                  max="20"
                  step="0.1"
                  @input="onNumberInput(index, 'rectangleTextMargin', $event)"
                />
              </label>
            </template>
          </div>

          <!-- 拖动条类设置 -->
          <div class="range-section">
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.company.compression') }}</span>
                <span class="range-value-display">[ {{ company.compression.toFixed(2) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustCompression(index, -0.01)">◀</button>
                <input
                  type="range"
                  :value="company.compression"
                  min="0.5"
                  max="1.5"
                  step="0.01"
                  @input="onNumberInput(index, 'compression', $event)"
                />
                <button type="button" class="range-btn" @click.stop="adjustCompression(index, 0.01)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.company.distribution') }}</span>
                <span class="range-value-display">[ {{ company.textDistributionFactor.toFixed(2) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustDistribution(index, -0.01)">◀</button>
                <input
                  type="range"
                  :value="company.textDistributionFactor"
                  min="0"
                  max="50"
                  step="0.01"
                  @input="onNumberInput(index, 'textDistributionFactor', $event)"
                />
                <button type="button" class="range-btn" @click.stop="adjustDistribution(index, 0.01)">▶</button>
              </div>
            </div>
            <template v-if="company.shape === 'ellipse'">
              <div class="range-item">
                <div class="range-header">
                  <span class="range-label-text">{{ t('stamp.company.startAngle') }}</span>
                  <span class="range-value-display">[ {{ (company.startAngle * 180 / Math.PI).toFixed(0) }}° ]</span>
                </div>
                <div class="range-container">
                  <button type="button" class="range-btn" @click.stop="adjustStartAngle(index, -0.1)">◀</button>
                  <input
                    type="range"
                    :value="(company.startAngle * 180 / Math.PI)"
                    min="-360"
                    max="360"
                    step="1"
                    @input="onStartAngleInput(index, $event)"
                  />
                  <button type="button" class="range-btn" @click.stop="adjustStartAngle(index, 0.1)">▶</button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="range-item">
                <div class="range-header">
                  <span class="range-label-text">水平位置调整 (mm)</span>
                  <span class="range-value-display">[ {{ (company.rectanglePositionX || 0).toFixed(1) }} ]</span>
                </div>
                <div class="range-container">
                  <button type="button" class="range-btn" @click.stop="adjustRectanglePositionX(index, -0.1)">◀</button>
                  <input
                    type="range"
                    :value="company.rectanglePositionX || 0"
                    min="-50"
                    max="50"
                    step="0.1"
                    @input="onNumberInput(index, 'rectanglePositionX', $event)"
                  />
                  <button type="button" class="range-btn" @click.stop="adjustRectanglePositionX(index, 0.1)">▶</button>
                </div>
                <span class="help-text">正数向右，负数向左</span>
              </div>
              <div class="range-item">
                <div class="range-header">
                  <span class="range-label-text">垂直位置调整 (mm)</span>
                  <span class="range-value-display">[ {{ (company.rectanglePositionY || 0).toFixed(1) }} ]</span>
                </div>
                <div class="range-container">
                  <button type="button" class="range-btn" @click.stop="adjustRectanglePositionY(index, -0.1)">◀</button>
                  <input
                    type="range"
                    :value="company.rectanglePositionY || 0"
                    min="-50"
                    max="50"
                    step="0.1"
                    @input="onNumberInput(index, 'rectanglePositionY', $event)"
                  />
                  <button type="button" class="range-btn" @click.stop="adjustRectanglePositionY(index, 0.1)">▶</button>
                </div>
                <span class="help-text">正数向下，负数向上</span>
              </div>
            </template>
          </div>
        </div>
        </transition>
      </div>
      <button class="add-button" @click="addCompany">{{ t('stamp.common.addNew') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ICompany, IDrawStampConfig } from '../../../DrawStampTypes'
import { getFontDisplayName } from '../../../utils/fontUtils'
import icItalicPng from "../../../assets/icons/ic_italic.png";

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
  systemFonts: string[]
  selectedIndex?: number
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const companyList = computed(() => props.config.companyList || [])
const primaryColor = computed(() => props.config.primaryColor || '#d40000')
const fonts = computed(() => props.systemFonts || [])
const fontWeightOptions = [100, 200, 300, 400, 500, 600, 700, 800, 900]
const selectedIndex = computed(() => props.selectedIndex ?? -1)

// 跟踪每个项的展开状态
const expandedItems = ref<Record<number, boolean>>({})

// 当 selectedIndex 变化时，自动展开对应的项，并关闭其他项
watch(selectedIndex, (newIndex) => {
  if (newIndex >= 0) {
    // 关闭所有其他项
    Object.keys(expandedItems.value).forEach(key => {
      expandedItems.value[Number(key)] = false
    })
    // 展开当前选中的项
    expandedItems.value[newIndex] = true
  }
}, { immediate: true })

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const toggleItem = (index: number) => {
  // 如果当前项已展开，则关闭它；否则先关闭所有其他项，再展开当前项
  if (expandedItems.value[index]) {
    expandedItems.value[index] = false
  } else {
    // 关闭所有其他项
    Object.keys(expandedItems.value).forEach(key => {
      expandedItems.value[Number(key)] = false
    })
    // 展开当前项
    expandedItems.value[index] = true
  }
}

const isItemExpanded = (index: number) => {
  // 如果该项被选中，自动展开；否则使用本地展开状态
  if (selectedIndex.value === index) {
    return true
  }
  return expandedItems.value[index] ?? false
}

const updateConfig = (updater: (company: ICompany) => void, index: number) => {
  emit('update-config', (config) => {
    const list = config.companyList || []
    if (list[index]) {
      updater(list[index])
    }
  })
}

const onFieldInput = (index: number, field: keyof ICompany, event: Event) => {
  const value = (event.target as HTMLInputElement).value as any
  updateConfig((company) => {
    ;(company as any)[field] = value
  }, index)
}

const onNumberInput = (index: number, field: keyof ICompany, event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  updateConfig((company) => {
    ;(company as any)[field] = value
  }, index)
}

const onStartAngleInput = (index: number, event: Event) => {
  const degrees = Number((event.target as HTMLInputElement).value)
  const radians = degrees * Math.PI / 180
  updateConfig((company) => {
    company.startAngle = radians
  }, index)
}

const adjustStartAngle = (index: number, delta: number) => {
  updateConfig((company) => {
    const currentDegrees = company.startAngle * 180 / Math.PI
    const newDegrees = Math.max(-360, Math.min(360, currentDegrees + delta))
    company.startAngle = newDegrees * Math.PI / 180
  }, index)
}

const adjustCompression = (index: number, delta: number) => {
  updateConfig((company) => {
    const newValue = Math.max(0.5, Math.min(1.5, company.compression + delta))
    company.compression = newValue
  }, index)
}

const adjustDistribution = (index: number, delta: number) => {
  updateConfig((company) => {
    const newValue = Math.max(0, Math.min(50, company.textDistributionFactor + delta))
    company.textDistributionFactor = newValue
  }, index)
}

const adjustRectanglePositionX = (index: number, delta: number) => {
  updateConfig((company) => {
    const currentValue = company.rectanglePositionX || 0
    const newValue = Math.max(-50, Math.min(50, currentValue + delta))
    company.rectanglePositionX = newValue
  }, index)
}

const adjustRectanglePositionY = (index: number, delta: number) => {
  updateConfig((company) => {
    const currentValue = company.rectanglePositionY || 0
    const newValue = Math.max(-50, Math.min(50, currentValue + delta))
    company.rectanglePositionY = newValue
  }, index)
}

const onColorInput = (index: number, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  updateConfig((company) => {
    company.color = value
  }, index)
}

const onFontWeightChange = (index: number, event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value === 'normal' || target.value === 'bold' ? target.value : Number(target.value)
  updateConfig((company) => {
    company.fontWeight = value
  }, index)
}

const toggleBold = (index: number) => {
  updateConfig((company) => {
    const current = company.fontWeight
    if (current === 'bold' || current === 700) {
      company.fontWeight = 'normal'
    } else {
      company.fontWeight = 'bold'
    }
  }, index)
}

const toggleItalic = (index: number) => {
  updateConfig((company) => {
    const current = company.fontStyle || 'normal'
    if (current === 'italic') {
      company.fontStyle = 'normal'
    } else {
      company.fontStyle = 'italic'
    }
  }, index)
}

const removeCompany = (index: number) => {
  emit('update-config', (config) => {
    if (!config.companyList) {
      return
    }
    config.companyList.splice(index, 1)
  })
}

const copyCompany = (index: number) => {
  emit('update-config', (config) => {
    if (!config.companyList || !config.companyList[index]) return
    const original = config.companyList[index]
    const clone: ICompany = {
      ...original,
      companyName: original.companyName + ' (副本)',
      rectanglePositionY: original.rectanglePositionY ? original.rectanglePositionY + 1 : 1, // 稍微偏移
      borderOffset: original.borderOffset ? original.borderOffset + original.fontHeight : original.fontHeight
    }
    config.companyList.splice(index + 1, 0, clone)
  })
}

const addCompany = () => {
  emit('update-config', (config) => {
    if (!config.companyList) {
      config.companyList = []
    }
    const list = config.companyList
    const last = list[list.length - 1]

    // 获取当前印章的形状
    const currentShape = config.company.shape || 'ellipse'

    // 根据印章形状设置不同的默认值
    let newCompany: ICompany

    if (currentShape === 'rectangle' || currentShape === 'rhombus' || currentShape === 'triangle') {
      // 矩形印章：根据已有公司的位置来分配新位置
      const usedPositions = new Set(list.map(c => c.rectangleTextPosition))
      const availablePositions: Array<'top' | 'bottom' | 'left' | 'right' | 'center'> =
        ['top', 'bottom', 'left', 'right', 'center']
      const nextPosition = availablePositions.find(pos => !usedPositions.has(pos)) || 'center'

      newCompany = {
        companyName: '新公司名称',
        compression: 1,
        borderOffset: 1, // 矩形印章的 borderOffset 主要用于兼容，实际使用 rectangleTextMargin
        textDistributionFactor: 3,
        fontFamily: last?.fontFamily || 'SimSun',
        fontHeight: last?.fontHeight || 4.2,
        fontWeight: last?.fontWeight || 'normal',
        color: config.primaryColor || '#d40000',
        shape: currentShape,
        adjustEllipseText: false,
        adjustEllipseTextFactor: 0.5,
        startAngle: 0,
        rotateDirection: 'counterclockwise',
        rectangleTextDirection: last?.rectangleTextDirection || 'horizontal',
        rectangleTextPosition: nextPosition,
        rectangleTextAlignment: last?.rectangleTextAlignment || 'center',
        rectangleVerticalAlignment: last?.rectangleVerticalAlignment || 'center',
        rectangleLineSpacing: last?.rectangleLineSpacing || 0,
        rectangleTextMargin: last?.rectangleTextMargin || 1,
        rectanglePositionX: last?.rectanglePositionX || 0,
        rectanglePositionY: last?.rectanglePositionY || 0
      }
    } else {
      // 椭圆印章：使用原有的逻辑
      const nextBorderOffset = last ? last.borderOffset + last.fontHeight : 1
      newCompany = {
        companyName: '新公司名称',
        compression: 1,
        borderOffset: nextBorderOffset,
        textDistributionFactor: 3,
        fontFamily: last?.fontFamily || 'SimSun',
        fontHeight: last?.fontHeight || 4.2,
        fontWeight: last?.fontWeight || 'normal',
        color: config.primaryColor || '#d40000',
        shape: 'ellipse',
        adjustEllipseText: false,
        adjustEllipseTextFactor: 0.5,
        startAngle: last?.startAngle || 0,
        rotateDirection: last?.rotateDirection || 'counterclockwise',
        rectangleTextDirection: 'horizontal',
        rectangleTextPosition: 'center',
        rectangleTextAlignment: 'center',
        rectangleVerticalAlignment: 'center',
        rectangleLineSpacing: 0,
        rectangleTextMargin: 1
      }
    }

    list.push(newCompany)
  })
}
</script>

<style scoped>
.company-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.company-item:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.company-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.2s;
  gap: 12px;
}

.company-header:hover {
  background: linear-gradient(to bottom, #f5f5f5, #f0f0f0);
}

.expand-toggle-btn {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
  min-width: 24px;
  height: 24px;
}

.expand-toggle-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
  background: #e6f7ff;
}

.expand-icon {
  font-size: 10px;
  transition: transform 0.2s;
  display: inline-block;
  line-height: 1;
}

.expand-icon.expanded {
  transform: rotate(0deg);
}

.expand-icon:not(.expanded) {
  transform: rotate(-90deg);
}

.company-header span {
  color: #262626;
  font-weight: 600;
  font-size: 14px;
}

.action-btn {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  min-width: 50px;
}

.action-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
  background: #e6f7ff;
}

.delete-btn:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
  background: #fff1f0;
}

.company-body {
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 文本/选择类设置区域 */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 拖动条类设置区域 */
.range-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #374151;
  gap: 4px;
  margin-bottom: 0;
}

.inline-label {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.inline-label .label-text {
  min-width: 100px;
  flex-shrink: 0;
  font-size: 13px;
  color: #374151;
}

.inline-label input[type="text"],
.inline-label input[type="number"],
.inline-label select {
  flex: 1;
  width: 0;
  min-width: 0;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.inline-label input[type="text"]:focus,
.inline-label input[type="number"]:focus,
.inline-label select:focus {
  border-color: #3b82f6;
  outline: none;
}

/* 文本输入项样式（两行显示） */
.text-input-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.text-input-header {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.text-input-label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.text-input-field {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.text-input-field:focus {
  border-color: #3b82f6;
  outline: none;
}

/* 拖动条项样式 */
.range-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.range-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.range-label-text {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.range-value-display {
  font-size: 12px;
  color: #6b7280;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.text-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}

.toolbar-font-select {
  min-width: 120px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 13px;
}

.toolbar-font-size {
  width: 60px;
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 13px;
}

.toolbar-bold-btn {
  width: 28px;
  height: 26px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
}

.toolbar-bold-btn.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.toolbar-italic-btn {
  width: 28px;
  height: 26px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
}

.toolbar-italic-btn .toolbar-icon-img {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.toolbar-italic-btn.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.toolbar-italic-btn.active .toolbar-icon-img {
  filter: brightness(0) invert(1);
}

.toolbar-color-wrapper {
  position: relative;
  width: 32px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  overflow: hidden;
  cursor: pointer;
}

.toolbar-color-swatch {
  width: 100%;
  height: 100%;
  display: block;
}

.toolbar-color-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.range-container {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.range-btn {
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background-color: #f9fafb;
  color: #6b7280;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  line-height: 1;
}

.range-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.range-btn:active {
  background-color: #e5e7eb;
}

.range-container input[type="range"] {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
}

.range-container input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.range-container input[type="range"]::-webkit-slider-thumb:hover {
  background: #2563eb;
}

.range-container input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease;
}

.range-container input[type="range"]::-moz-range-thumb:hover {
  background: #2563eb;
}

.help-text {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
  padding-left: 0;
}

</style>
