<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.stampType.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <div v-for="(type, index) in stampTypeList" :key="index" class="stamp-type-item">
        <div class="stamp-type-header">
          <div class="header-left">
            <button class="expand-toggle-btn" @click.stop="toggleItem(index)" :title="isItemExpanded(index) ? t('stamp.common.collapse') : t('stamp.common.expand')">
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ t('stamp.stampType.line', { index: index + 1 }) }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copyStampType(index)">
              {{ t('stamp.common.copy') }}
            </button>
            <button class="small-button delete-button" @click.stop="removeStampType(index)">
              {{ t('stamp.common.delete') }}
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="stamp-type-body">
          <!-- 文本/选择类设置 -->
          <div class="settings-section">
            <div class="text-input-item">
              <div class="text-input-header">
                <span class="text-input-label">{{ t('stamp.stampType.type') }}:</span>
              </div>
              <input
                type="text"
                class="text-input-field"
                :value="type.stampType"
                @input="updateStampType(index, 'stampType', ($event.target as HTMLInputElement).value)"
              />
            </div>

            <!-- 顶部文字工具栏：字体 / 字号 / 粗体 / 倾斜 / 颜色 -->
            <div class="text-toolbar">
              <select
                :value="type.fontFamily"
                class="toolbar-font-select"
                @change="updateStampType(index, 'fontFamily', ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="font in systemFonts" :key="font" :value="font" :style="{ fontFamily: font }">
                  {{ getFontDisplayName(font) }}
                </option>
              </select>
              <input
                type="number"
                class="toolbar-font-size"
                :value="type.fontHeight"
                min="1"
                max="10"
                step="0.1"
                @input="updateStampType(index, 'fontHeight', parseNumber($event))"
              />
            </div>
            <div class="text-toolbar">
              <button
                type="button"
                class="toolbar-bold-btn"
                :class="{ active: type.fontWeight === 'bold' || type.fontWeight === 700 }"
                @click="toggleBold(index)"
              >
                B
              </button>
              <button
                type="button"
                class="toolbar-italic-btn"
                :class="{ active: type.fontStyle === 'italic' }"
                @click="toggleItalic(index)"
                :title="t('stamp.common.italic')"
              >
                <img :src="icItalicPng" :alt="t('stamp.common.italic')" class="toolbar-icon-img" />
              </button>
              <label class="toolbar-color-wrapper">
                <span class="toolbar-color-swatch" :style="{ backgroundColor: type.color || primaryColor }"></span>
                <input
                  type="color"
                  class="toolbar-color-input"
                  :value="type.color || primaryColor"
                  @input="onColorInput(index, $event)"
                />
              </label>
            </div>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.stampType.displayDirection') }}:</span>
              <select
                :value="type.orientation || 'horizontal'"
                @change="updateStampType(index, 'orientation', ($event.target as HTMLSelectElement).value as 'horizontal' | 'vertical')"
              >
                <option value="horizontal">{{ t('stamp.stampType.displayDirectionOptions.horizontal') }}</option>
                <option value="vertical">{{ t('stamp.stampType.displayDirectionOptions.vertical') }}</option>
              </select>
            </label>
          </div>

          <!-- 拖动条类设置 -->
          <div class="range-section">
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.stampType.compression') }}</span>
                <span class="range-value-display">[ {{ type.compression.toFixed(2) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustCompression(index, -0.01)">◀</button>
                <input
                  type="range"
                  :value="type.compression"
                  min="0.1"
                  max="1.5"
                  step="0.01"
                  @input="updateStampType(index, 'compression', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustCompression(index, 0.01)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.stampType.letterSpacing') }}</span>
                <span class="range-value-display">[ {{ type.letterSpacing.toFixed(2) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustLetterSpacing(index, -0.01)">◀</button>
                <input
                  type="range"
                  :value="type.letterSpacing"
                  min="-1"
                  max="10"
                  step="0.01"
                  @input="updateStampType(index, 'letterSpacing', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustLetterSpacing(index, 0.01)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.stampType.horizontalPositionX') }}</span>
                <span class="range-value-display">[ {{ (type.positionX || 0).toFixed(1) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustPositionX(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="type.positionX || 0"
                  min="-50"
                  max="50"
                  step="0.1"
                  @input="updateStampType(index, 'positionX', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustPositionX(index, 0.1)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.stampType.verticalPositionY') }}</span>
                <span class="range-value-display">[ {{ type.positionY.toFixed(1) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustPositionY(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="type.positionY"
                  min="-50"
                  max="50"
                  step="0.1"
                  @input="updateStampType(index, 'positionY', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustPositionY(index, 0.1)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.stampType.rotationAngle') }}</span>
                <span class="range-value-display">[ {{ (type.rotation || 0).toFixed(1) }}° ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustRotation(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="type.rotation || 0"
                  min="-180"
                  max="180"
                  step="0.1"
                  @input="updateStampType(index, 'rotation', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustRotation(index, 0.1)">▶</button>
              </div>
            </div>
          </div>
        </div>
        </transition>
      </div>
      <button class="add-button" @click="addStampType">
        {{ t('stamp.stampType.addNew') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, IStampType } from '../../../DrawStampTypes'
import { getFontDisplayName } from '../../../utils/fontUtils'
import icItalicPng from '../../../assets/icons/ic_italic.png'

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

const stampTypeList = computed(() => props.config.stampTypeList || [])
const primaryColor = computed(() => props.config.primaryColor || '#d40000')
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

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const onColorInput = (index: number, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  updateStampType(index, 'color', value)
}

const toggleBold = (index: number) => {
  emit('update-config', (config) => {
    const list = config.stampTypeList || []
    if (!list[index]) return
    const current = list[index].fontWeight
    if (current === 'bold' || current === 700) {
      list[index].fontWeight = 'normal'
    } else {
      list[index].fontWeight = 'bold'
    }
  })
}

const toggleItalic = (index: number) => {
  emit('update-config', (config) => {
    const list = config.stampTypeList || []
    if (!list[index]) return
    const current = list[index].fontStyle || 'normal'
    if (current === 'italic') {
      list[index].fontStyle = 'normal'
    } else {
      list[index].fontStyle = 'italic'
    }
  })
}

const updateStampType = <K extends keyof IStampType>(
  index: number,
  key: K,
  value: IStampType[K]
) => {
  emit('update-config', (config) => {
    const list = config.stampTypeList || []
    if (!list[index]) return
    list[index][key] = value
  })
}

const removeStampType = (index: number) => {
  emit('update-config', (config) => {
    config.stampTypeList?.splice(index, 1)
  })
}

const copyStampType = (index: number) => {
  emit('update-config', (config) => {
    if (!config.stampTypeList || !config.stampTypeList[index]) return
    const original = config.stampTypeList[index]
    const clone = { ...original, positionY: original.positionY + 2 }
    config.stampTypeList.splice(index + 1, 0, clone)
  })
}

const isItemExpanded = (index: number) => {
  // 如果该项被选中，自动展开；否则使用本地展开状态
  if (selectedIndex.value === index) {
    return true
  }
  return expandedItems.value[index] ?? false
}

const addStampType = () => {
  emit('update-config', (config) => {
    if (!config.stampTypeList) {
      config.stampTypeList = []
    }
    let newPositionY = -3
    if (config.stampTypeList.length > 0) {
      const lastStampType = config.stampTypeList[config.stampTypeList.length - 1]
      newPositionY = lastStampType.positionY + lastStampType.fontHeight
    }
    config.stampTypeList.push({
      stampType: t('stamp.stampType.defaultNewStampType'),
      fontHeight: 4.0,
      fontFamily: 'SimSun',
      compression: 0.75,
      letterSpacing: 0,
      positionY: newPositionY,
      fontWeight: 'normal',
      lineSpacing: 2,
      fontWidth: 3,
      orientation: 'horizontal',
      rotation: 0,
      color: config.primaryColor || '#d40000'
    })
  })
}

const adjustCompression = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.stampTypeList || []
    if (!list[index]) return
    const newValue = Math.max(0.1, Math.min(1.5, list[index].compression + delta))
    list[index].compression = newValue
  })
}

const adjustLetterSpacing = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.stampTypeList || []
    if (!list[index]) return
    const newValue = Math.max(-1, Math.min(10, list[index].letterSpacing + delta))
    list[index].letterSpacing = newValue
  })
}

const adjustPositionX = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.stampTypeList || []
    if (!list[index]) return
    const currentValue = list[index].positionX || 0
    const newValue = Math.max(-50, Math.min(50, currentValue + delta))
    list[index].positionX = newValue
  })
}

const adjustPositionY = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.stampTypeList || []
    if (!list[index]) return
    const newValue = Math.max(-50, Math.min(50, list[index].positionY + delta))
    list[index].positionY = newValue
  })
}

const adjustRotation = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.stampTypeList || []
    if (!list[index]) return
    const currentValue = list[index].rotation || 0
    const newValue = Math.max(-180, Math.min(180, currentValue + delta))
    list[index].rotation = newValue
  })
}
</script>

<style scoped>
.stamp-type-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.stamp-type-item:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stamp-type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.2s;
  gap: 12px;
}

.stamp-type-header:hover {
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

.stamp-type-header span {
  color: #262626;
  font-weight: 600;
  font-size: 14px;
}

.stamp-type-body {
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
</style>
