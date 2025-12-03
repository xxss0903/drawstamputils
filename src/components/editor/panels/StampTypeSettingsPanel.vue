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
            <button class="expand-toggle-btn" @click.stop="toggleItem(index)" :title="isItemExpanded(index) ? '收起' : '展开'">
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ t('stamp.stampType.line', { index: index + 1 }) }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copyStampType(index)">
              复制
            </button>
            <button class="small-button delete-button" @click.stop="removeStampType(index)">
              删除
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="stamp-type-body">
        <label>
          {{ t('stamp.stampType.type') }}:
          <input
            type="text"
            :value="type.stampType"
            @input="updateStampType(index, 'stampType', ($event.target as HTMLInputElement).value)"
          />
        </label>

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
            title="倾斜"
          >
            <img :src="icItalicPng" alt="倾斜" class="toolbar-icon-img" />
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

        <label>
          {{ t('stamp.stampType.compression') }}:
          <input
            type="range"
            :value="type.compression"
            min="0.1"
            max="1.5"
            step="0.01"
            @input="updateStampType(index, 'compression', parseNumber($event))"
          />
          <span>{{ type.compression.toFixed(2) }}</span>
        </label>
        <label>
          {{ t('stamp.stampType.letterSpacing') }}:
          <input
            type="range"
            :value="type.letterSpacing"
            min="-1"
            max="10"
            step="0.01"
            @input="updateStampType(index, 'letterSpacing', parseNumber($event))"
          />
          <span>{{ type.letterSpacing.toFixed(2) }}</span>
        </label>
        <label>
          水平位置 X (mm):
          <div class="range-container">
            <input
              type="range"
              :value="type.positionX || 0"
              min="-20"
              max="20"
              step="0.1"
              @input="updateStampType(index, 'positionX', parseNumber($event))"
            />
            <span>{{ (type.positionX || 0).toFixed(1) }}</span>
          </div>
        </label>
        <label>
          垂直位置 Y (mm):
          <div class="range-container">
            <input
              type="range"
              :value="type.positionY"
              min="-20"
              max="20"
              step="0.1"
              @input="updateStampType(index, 'positionY', parseNumber($event))"
            />
            <span>{{ type.positionY.toFixed(1) }}</span>
          </div>
        </label>
        <label>
          显示方向:
          <select
            :value="type.orientation || 'horizontal'"
            @change="updateStampType(index, 'orientation', ($event.target as HTMLSelectElement).value as 'horizontal' | 'vertical')"
          >
            <option value="horizontal">水平</option>
            <option value="vertical">竖直</option>
          </select>
        </label>
        <label>
          旋转角度 (°):
          <div class="range-container">
            <input
              type="range"
              :value="type.rotation || 0"
              min="-180"
              max="180"
              step="0.1"
              @input="updateStampType(index, 'rotation', parseNumber($event))"
            />
            <span>{{ (type.rotation || 0).toFixed(0) }}</span>
          </div>
        </label>
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
      stampType: '新印章类型',
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

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
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
  padding: 16px;
  background: #fff;
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

.header-actions {
  display: flex;
  gap: 6px;
}

.stamp-type-body {
  margin-top: 8px;
}

.range-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-container input[type='range'] {
  flex: 1;
}

.range-container span {
  min-width: 50px;
  text-align: right;
  font-size: 14px;
  color: #666;
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
