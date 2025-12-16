<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.innerCircle.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <div v-for="(innerCircle, index) in innerCircleList" :key="index" class="inner-circle-item">
        <div class="inner-circle-header">
          <div class="header-left">
            <button class="expand-toggle-btn" @click.stop="toggleItem(index)" :title="isItemExpanded(index) ? t('stamp.common.collapse') : t('stamp.common.expand')">
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ t('stamp.common.line', { index: index + 1 }) }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copyInnerCircle(index)">
              {{ t('stamp.common.copy') }}
            </button>
            <button class="small-button delete-button" @click.stop="removeInnerCircle(index)">
              {{ t('stamp.common.delete') }}
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="inner-circle-body">
          <!-- 文本/选择类设置 -->
          <div class="settings-section">
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.innerCircle.lineWidth') }}:</span>
              <input
                type="number"
                :value="innerCircle.innerCircleLineWidth"
                min="0.05"
                max="0.5"
                step="0.01"
                @input="updateInnerCircle(index, 'innerCircleLineWidth', parseNumber($event))"
              />
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.innerCircle.radiusX') }}:</span>
              <input
                type="number"
                :value="innerCircle.innerCircleLineRadiusX"
                min="1"
                max="50"
                step="0.1"
                @input="updateInnerCircle(index, 'innerCircleLineRadiusX', parseNumber($event))"
              />
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.innerCircle.radiusY') }}:</span>
              <input
                type="number"
                :value="getComputedRadiusY(innerCircle)"
                min="1"
                max="50"
                step="0.1"
                :disabled="innerCircle.shape === 'triangle' && (props.config.lockTriangleEquilateral ?? true)"
                @input="updateInnerCircle(index, 'innerCircleLineRadiusY', parseNumber($event))"
              />
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.innerCircle.color') }}:</span>
              <input
                type="color"
                :value="innerCircle.color || primaryColor"
                @input="updateInnerCircle(index, 'color', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="innerCircle.fillBackground ?? false"
                @change="updateInnerCircle(index, 'fillBackground', ($event.target as HTMLInputElement).checked)"
              />
              {{ t('stamp.innerCircle.fillBackground') }}
            </label>
            <label v-if="innerCircle.fillBackground" class="inline-label">
              <span class="label-text">{{ t('stamp.innerCircle.fillColor') }}:</span>
              <input
                type="color"
                :value="innerCircle.fillColor || innerCircle.color || primaryColor"
                @input="updateInnerCircle(index, 'fillColor', ($event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.innerCircle.shape') }}:</span>
              <select
                :value="innerCircle.shape || 'ellipse'"
                @change="onInnerCircleShapeChange(index, $event)"
              >
                <option value="ellipse">{{ t('stamp.basic.shapeOptions.ellipse') }}</option>
                <option value="rectangle">{{ t('stamp.basic.shapeOptions.rectangle') }}</option>
                <option value="rhombus">{{ t('stamp.basic.shapeOptions.rhombus') }}</option>
                <option value="triangle">{{ t('stamp.basic.shapeOptions.triangle') }}</option>
              </select>
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.innerCircle.lineStyle') }}:</span>
              <select
                :value="innerCircle.lineStyle || 'solid'"
                @change="updateInnerCircle(index, 'lineStyle', ($event.target as HTMLSelectElement).value as 'solid' | 'dashed' | 'dotted')"
              >
                <option value="solid">{{ t('stamp.basic.lineStyle.solid') }}</option>
                <option value="dashed">{{ t('stamp.basic.lineStyle.dashed') }}</option>
                <option value="dotted">{{ t('stamp.basic.lineStyle.dotted') }}</option>
              </select>
            </label>
            <template v-if="(innerCircle.lineStyle || 'solid') !== 'solid'">
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.innerCircle.dashLength') }}:</span>
                <input
                  type="number"
                  :value="innerCircle.dashLength ?? 2"
                  min="0.1"
                  max="20"
                  step="0.1"
                  @input="updateInnerCircle(index, 'dashLength', parseNumber($event))"
                />
              </label>
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.innerCircle.gapLength') }}:</span>
                <input
                  type="number"
                  :value="innerCircle.gapLength ?? 1"
                  min="0.1"
                  max="20"
                  step="0.1"
                  @input="updateInnerCircle(index, 'gapLength', parseNumber($event))"
                />
              </label>
            </template>
          </div>

          <!-- 拖动条类设置 -->
          <div class="range-section">
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.innerCircle.positionX') }}</span>
                <span class="range-value-display">[ {{ (innerCircle.offsetX ?? 0).toFixed(1) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustPositionX(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="innerCircle.offsetX ?? 0"
                  min="-50"
                  max="50"
                  step="0.1"
                  @input="updateInnerCircle(index, 'offsetX', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustPositionX(index, 0.1)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.innerCircle.positionY') }}</span>
                <span class="range-value-display">[ {{ (innerCircle.offsetY ?? 0).toFixed(1) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustPositionY(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="innerCircle.offsetY ?? 0"
                  min="-50"
                  max="50"
                  step="0.1"
                  @input="updateInnerCircle(index, 'offsetY', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustPositionY(index, 0.1)">▶</button>
              </div>
            </div>
          </div>
        </div>
        </transition>
      </div>
      <div class="add-buttons">
        <button class="add-button" @click="addInnerCircle('ellipse')">
          {{ t('stamp.innerCircle.addEllipse') }}
        </button>
        <button class="add-button" @click="addInnerCircle('rectangle')">
          {{ t('stamp.innerCircle.addRectangle') }}
        </button>
        <button class="add-button" @click="addInnerCircle('rhombus')">
          {{ t('stamp.innerCircle.addRhombus') }}
        </button>
        <button class="add-button" @click="addInnerCircle('triangle')">
          {{ t('stamp.innerCircle.addTriangle') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, IInnerCircle } from '../../../DrawStampTypes'

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
  selectedIndex?: number
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const innerCircleList = computed(() => props.config.innerCircleList || [])
const primaryColor = computed(() => props.config.primaryColor || '#d40000')
const selectedIndex = computed(() => props.selectedIndex ?? -1)

// 跟踪每个项的展开状态
const expandedItems = ref<Record<number, boolean>>({})

// 当 selectedIndex 变化时，自动展开对应的项，并收起其他项
watch(
  selectedIndex,
  (newIndex) => {
    if (newIndex >= 0) {
      // 先收起所有项
      Object.keys(expandedItems.value).forEach((key) => {
        expandedItems.value[Number(key)] = false
      })
      // 再展开当前选中的项
      expandedItems.value[newIndex] = true
    }
  },
  { immediate: true }
)

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const toggleItem = (index: number) => {
  // 如果当前项已展开，则收起它；否则先收起其他项，再展开当前项
  if (expandedItems.value[index]) {
    expandedItems.value[index] = false
  } else {
    Object.keys(expandedItems.value).forEach((key) => {
      expandedItems.value[Number(key)] = false
    })
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

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

// 计算 radiusY 值：如果是三角形且开启了等边三角形锁定，根据 radiusX 计算等边三角形的高度
const getComputedRadiusY = (innerCircle: IInnerCircle) => {
  if (innerCircle.shape === 'triangle' && (props.config.lockTriangleEquilateral ?? true)) {
    const sqrt3Over2 = Math.sqrt(3) / 2
    return innerCircle.innerCircleLineRadiusX * sqrt3Over2
  }
  return innerCircle.innerCircleLineRadiusY
}

const onInnerCircleShapeChange = (index: number, event: Event) => {
  const value = (event.target as HTMLSelectElement).value as 'ellipse' | 'rectangle' | 'rhombus' | 'triangle'
  emit('update-config', (config) => {
    const list = config.innerCircleList || []
    if (!list[index]) return
    list[index].shape = value
    // 如果选择三角形且开启了等边三角形锁定，调整 radiusY 使其成为等边三角形
    if (value === 'triangle' && (config.lockTriangleEquilateral ?? true)) {
      const sqrt3Over2 = Math.sqrt(3) / 2
      list[index].innerCircleLineRadiusY = list[index].innerCircleLineRadiusX * sqrt3Over2
    }
  })
}

const updateInnerCircle = <K extends keyof IInnerCircle>(
  index: number,
  key: K,
  value: IInnerCircle[K]
) => {
  emit('update-config', (config) => {
    const list = config.innerCircleList || []
    if (!list[index]) return
    list[index][key] = value
    // 如果修改的是 radiusX 且形状是三角形且开启了等边三角形锁定，自动更新 radiusY
    if (key === 'innerCircleLineRadiusX' && list[index].shape === 'triangle' && (config.lockTriangleEquilateral ?? true)) {
      const sqrt3Over2 = Math.sqrt(3) / 2
      list[index].innerCircleLineRadiusY = Number(value) * sqrt3Over2
    }
    // 如果修改的是 radiusY 且形状是三角形且开启了等边三角形锁定，根据 radiusY 反向计算 radiusX
    if (key === 'innerCircleLineRadiusY' && list[index].shape === 'triangle' && (config.lockTriangleEquilateral ?? true)) {
      const sqrt3Over2 = Math.sqrt(3) / 2
      list[index].innerCircleLineRadiusX = Number(value) / sqrt3Over2
      // 重新计算 radiusY 以确保精度
      list[index].innerCircleLineRadiusY = list[index].innerCircleLineRadiusX * sqrt3Over2
    }
  })
}

const removeInnerCircle = (index: number) => {
  emit('update-config', (config) => {
    config.innerCircleList?.splice(index, 1)
  })
}

const copyInnerCircle = (index: number) => {
  emit('update-config', (config) => {
    if (!config.innerCircleList || !config.innerCircleList[index]) return
    const original = config.innerCircleList[index]
    let radiusX = original.innerCircleLineRadiusX + 1 // 稍微偏移
    let radiusY = original.innerCircleLineRadiusY + 1
    // 如果形状是三角形且开启了等边三角形锁定，根据 radiusX 计算 radiusY
    if (original.shape === 'triangle' && (config.lockTriangleEquilateral ?? true)) {
      const sqrt3Over2 = Math.sqrt(3) / 2
      radiusY = radiusX * sqrt3Over2
    }
    const clone: IInnerCircle = {
      ...original,
      innerCircleLineRadiusX: radiusX,
      innerCircleLineRadiusY: radiusY
    }
    config.innerCircleList.splice(index + 1, 0, clone)
  })
}

const addInnerCircle = (shape?: 'ellipse' | 'rectangle' | 'rhombus' | 'triangle') => {
  emit('update-config', (config) => {
    if (!config.innerCircleList) {
      config.innerCircleList = []
    }
    const companyShape = config.company.shape
    const newShape = shape || (companyShape === 'organic' ? 'ellipse' : (companyShape === 'ellipse' || companyShape === 'rectangle' || companyShape === 'rhombus' || companyShape === 'triangle' ? companyShape : 'ellipse'))
    let radiusX = 16
    let radiusY = 12
    // 如果形状是三角形且开启了等边三角形锁定，根据 radiusX 计算 radiusY
    if (newShape === 'triangle' && (config.lockTriangleEquilateral ?? true)) {
      const sqrt3Over2 = Math.sqrt(3) / 2
      radiusY = radiusX * sqrt3Over2
    }
    config.innerCircleList.push({
      drawInnerCircle: true,
      innerCircleLineWidth: 0.5,
      innerCircleLineRadiusX: radiusX,
      innerCircleLineRadiusY: radiusY,
      lineStyle: 'solid',
      dashLength: 2,
      gapLength: 1,
      shape: newShape,
      color: config.primaryColor || '#d40000',
      offsetX: 0,
      offsetY: 0
    })
  })
}

const adjustPositionX = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.innerCircleList || []
    if (!list[index]) return
    const currentValue = list[index].offsetX ?? 0
    const newValue = Math.max(-50, Math.min(50, currentValue + delta))
    list[index].offsetX = newValue
  })
}

const adjustPositionY = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.innerCircleList || []
    if (!list[index]) return
    const currentValue = list[index].offsetY ?? 0
    const newValue = Math.max(-50, Math.min(50, currentValue + delta))
    list[index].offsetY = newValue
  })
}
</script>

<style scoped>
.inner-circle-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.inner-circle-item:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.inner-circle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.2s;
  gap: 12px;
}

.inner-circle-header:hover {
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

.inner-circle-header span {
  color: #262626;
  font-weight: 600;
  font-size: 14px;
}

.inner-circle-body {
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

.inline-label input[type="number"],
.inline-label input[type="color"],
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

.inline-label input[type="number"]:focus,
.inline-label select:focus {
  border-color: #3b82f6;
  outline: none;
}

.inline-label input[type="color"] {
  width: 40px;
  height: 28px;
  padding: 2px;
  cursor: pointer;
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

.action-btn {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
  font-size: 12px;
  white-space: nowrap;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

