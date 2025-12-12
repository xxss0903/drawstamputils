<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.line.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <div
        class="line-item"
        v-for="(line, index) in lineList"
        :key="line.id || index"
      >
        <div class="line-header">
          <div class="header-left">
            <button class="expand-toggle-btn" @click.stop="toggleItem(index)" :title="isItemExpanded(index) ? t('stamp.common.collapse') : t('stamp.common.expand')">
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ line.type === 'vertical' ? t('stamp.line.verticalLine') : t('stamp.line.horizontalLine') }} {{ index + 1 }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copyLine(index)">
              {{ t('stamp.common.copy') }}
            </button>
            <button class="action-btn delete-btn" @click.stop="removeLine(index)">
              {{ t('stamp.common.delete') }}
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="line-body">
          <!-- 文本/选择类设置 -->
          <div class="settings-section">
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.line.direction') }}:</span>
              <select :value="line.type" @change="updateLine(index, 'type', ($event.target as HTMLSelectElement).value as 'horizontal' | 'vertical')">
                <option value="horizontal">{{ t('stamp.line.directionOptions.horizontal') }}</option>
                <option value="vertical">{{ t('stamp.line.directionOptions.vertical') }}</option>
              </select>
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.line.length') }}:</span>
              <input
                type="number"
                :value="line.length"
                min="1"
                :max="maxLength"
                step="0.5"
                @input="updateLine(index, 'length', parseNumber($event))"
              />
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.line.lineWidth') }}:</span>
              <input
                type="number"
                :value="line.lineWidth"
                min="0.1"
                max="5"
                step="0.1"
                @input="updateLine(index, 'lineWidth', parseNumber($event))"
              />
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.line.color') }}:</span>
              <input type="color" :value="line.color || defaultColor" @input="updateLine(index, 'color', ($event.target as HTMLInputElement).value)" />
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.line.lineStyle') }}:</span>
              <select :value="line.style" @change="updateLine(index, 'style', ($event.target as HTMLSelectElement).value as LineStyle)">
                <option value="solid">{{ t('stamp.line.lineStyleOptions.solid') }}</option>
                <option value="dashed">{{ t('stamp.line.lineStyleOptions.dashed') }}</option>
                <option value="dotted">{{ t('stamp.line.lineStyleOptions.dotted') }}</option>
              </select>
            </label>
            <template v-if="line.style !== 'solid'">
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.line.dashLength') }}:</span>
                <input
                  type="number"
                  :value="line.dashLength ?? 2"
                  min="0.2"
                  max="10"
                  step="0.1"
                  @input="updateLine(index, 'dashLength', parseNumber($event))"
                />
              </label>
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.line.gapLength') }}:</span>
                <input
                  type="number"
                  :value="line.gapLength ?? 1"
                  min="0.2"
                  max="10"
                  step="0.1"
                  @input="updateLine(index, 'gapLength', parseNumber($event))"
                />
              </label>
            </template>
          </div>

          <!-- 拖动条类设置 -->
          <div class="range-section">
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.line.horizontalPositionX') }}</span>
                <span class="range-value-display">[ {{ line.positionX.toFixed(1) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustPositionX(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="line.positionX"
                  :min="positionRangeX * -1"
                  :max="positionRangeX"
                  step="0.1"
                  @input="updateLine(index, 'positionX', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustPositionX(index, 0.1)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.line.verticalPositionY') }}</span>
                <span class="range-value-display">[ {{ line.positionY.toFixed(1) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustPositionY(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="line.positionY"
                  :min="positionRangeY * -1"
                  :max="positionRangeY"
                  step="0.1"
                  @input="updateLine(index, 'positionY', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustPositionY(index, 0.1)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.line.opacity') }}</span>
                <span class="range-value-display">[ {{ ((line.opacity ?? 1) * 100).toFixed(0) }}% ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustOpacity(index, -0.01)">◀</button>
                <input
                  type="range"
                  :value="line.opacity ?? 1"
                  min="0"
                  max="1"
                  step="0.01"
                  @input="updateLine(index, 'opacity', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustOpacity(index, 0.01)">▶</button>
              </div>
            </div>
          </div>
        </div>
        </transition>
      </div>

      <div class="line-actions">
        <button class="add-line-button" @click="addLine('horizontal')">{{ t('stamp.line.addHorizontal') }}</button>
        <button class="add-line-button" @click="addLine('vertical')">{{ t('stamp.line.addVertical') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, ILineConfig, LineStyle } from '../../../DrawStampTypes'

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

const lineList = computed(() => props.config.lineList || [])
const defaultColor = computed(() => props.config.primaryColor || '#d40000')
const positionRangeX = computed(() => Math.max(10, (props.config.width ?? 40) / 2))
const positionRangeY = computed(() => Math.max(10, (props.config.height ?? 40) / 2))
const maxLength = computed(() => {
  const width = props.config.width ?? 40
  const height = props.config.height ?? 40
  return Math.max(width, height, 10)
})
const selectedIndex = computed(() => props.selectedIndex ?? -1)

// 跟踪每个项的展开状态
const expandedItems = ref<Record<number, boolean>>({})

// 当 selectedIndex 变化时，自动展开对应的项
watch(selectedIndex, (newIndex) => {
  if (newIndex >= 0) {
    expandedItems.value = { [newIndex]: true }
  } else {
    expandedItems.value = {}
  }
}, { immediate: true })

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const toggleItem = (index: number) => {
  const current = expandedItems.value[index]
  if (current) {
    expandedItems.value = {}
  } else {
    expandedItems.value = { [index]: true }
  }
}

const isItemExpanded = (index: number) => {
  return expandedItems.value[index] ?? false
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateLine = <K extends keyof ILineConfig>(index: number, key: K, value: ILineConfig[K]) => {
  emit('update-config', (config) => {
    const list = config.lineList || []
    if (!list[index]) return
    list[index][key] = value
  })
}

const createDefaultLine = (type: 'horizontal' | 'vertical'): ILineConfig => ({
  id: `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  type,
  positionX: 0,
  positionY: 0,
  length: type === 'horizontal' ? props.config.width || 30 : props.config.height || 30,
  lineWidth: 0.5,
  color: defaultColor.value,
  style: 'solid',
  dashLength: 2,
  gapLength: 1,
  opacity: 1
})

const addLine = (type: 'horizontal' | 'vertical') => {
  emit('update-config', (config) => {
    if (!config.lineList) {
      config.lineList = []
    }
    config.lineList.push(createDefaultLine(type))
  })
}

const removeLine = (index: number) => {
  emit('update-config', (config) => {
    config.lineList?.splice(index, 1)
  })
}

const copyLine = (index: number) => {
  emit('update-config', (config) => {
    if (!config.lineList || !config.lineList[index]) return
    const original = config.lineList[index]
    const clone: ILineConfig = {
      ...original,
      id: `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      positionY: original.positionY + (original.type === 'horizontal' ? 1 : 0),
      positionX: original.positionX + (original.type === 'vertical' ? 1 : 0)
    }
    config.lineList.splice(index + 1, 0, clone)
  })
}

const adjustPositionX = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.lineList || []
    if (!list[index]) return
    const range = positionRangeX.value
    const newValue = Math.max(range * -1, Math.min(range, list[index].positionX + delta))
    list[index].positionX = newValue
  })
}

const adjustPositionY = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.lineList || []
    if (!list[index]) return
    const range = positionRangeY.value
    const newValue = Math.max(range * -1, Math.min(range, list[index].positionY + delta))
    list[index].positionY = newValue
  })
}

const adjustOpacity = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.lineList || []
    if (!list[index]) return
    const currentValue = list[index].opacity ?? 1
    const newValue = Math.max(0, Math.min(1, currentValue + delta))
    list[index].opacity = newValue
  })
}
</script>

<style scoped>
.line-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.line-item:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.line-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.2s;
  gap: 12px;
}

.line-header:hover {
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

.line-header span {
  color: #262626;
  font-weight: 600;
  font-size: 14px;
}

.line-body {
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

.dash-settings {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.line-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.add-line-button {
  flex: 1;
  padding: 10px;
  border: 1px dashed #1890ff;
  background: #f0f7ff;
  color: #1890ff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-line-button:hover {
  background: #e0f0ff;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

