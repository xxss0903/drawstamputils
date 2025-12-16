<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.images.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <div v-for="(image, index) in imageList" :key="index" class="image-item">
        <div class="image-header">
          <div class="header-left">
            <button class="expand-toggle-btn" @click.stop="toggleItem(index)" :title="isItemExpanded(index) ? t('stamp.common.collapse') : t('stamp.common.expand')">
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ t('stamp.images.image', { index: index + 1 }) }}</span>
          </div>
          <div class="header-actions">
            <button class="small-button delete-button" @click.stop="removeImage(index)">{{ t('stamp.common.delete') }}</button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="image-body">
          <!-- 图片预览 -->
          <div class="image-preview" v-if="image.imageUrl">
            <img :src="image.imageUrl" :alt="t('stamp.common.preview')" />
          </div>

          <!-- 文本/选择类设置 -->
          <div class="settings-section">
            <label>
              {{ t('stamp.images.select') }}:
              <input type="file" @change="(e) => handleImageUpload(e, index)" accept="image/*" />
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.images.width') }}:</span>
              <input
                type="number"
                :value="image.imageWidth"
                min="1"
                max="100"
                step="0.5"
                @input="updateImage(index, 'imageWidth', parseNumber($event))"
              />
            </label>
            <label class="inline-label">
              <span class="label-text">{{ t('stamp.images.height') }}:</span>
              <input
                type="number"
                :value="image.imageHeight"
                min="1"
                max="100"
                step="0.5"
                @input="updateImage(index, 'imageHeight', parseNumber($event))"
              />
            </label>
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="image.keepAspectRatio"
                @change="updateImage(index, 'keepAspectRatio', ($event.target as HTMLInputElement).checked)"
              />
              {{ t('stamp.images.keepRatio') }}
            </label>
          </div>

          <!-- 拖动条类设置 -->
          <div class="range-section">
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.images.positionX') }}</span>
                <span class="range-value-display">[ {{ image.positionX.toFixed(1) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustPositionX(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="image.positionX"
                  min="-50"
                  max="50"
                  step="0.1"
                  @input="updateImage(index, 'positionX', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustPositionX(index, 0.1)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.images.positionY') }}</span>
                <span class="range-value-display">[ {{ image.positionY.toFixed(1) }} ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustPositionY(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="image.positionY"
                  min="-50"
                  max="50"
                  step="0.1"
                  @input="updateImage(index, 'positionY', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustPositionY(index, 0.1)">▶</button>
              </div>
            </div>
            <div class="range-item">
              <div class="range-header">
                <span class="range-label-text">{{ t('stamp.images.rotation') }}</span>
                <span class="range-value-display">[ {{ (image.rotation || 0).toFixed(1) }}° ]</span>
              </div>
              <div class="range-container">
                <button type="button" class="range-btn" @click.stop="adjustRotation(index, -0.1)">◀</button>
                <input
                  type="range"
                  :value="image.rotation || 0"
                  min="0"
                  max="360"
                  step="0.1"
                  @input="updateImage(index, 'rotation', parseNumber($event))"
                />
                <button type="button" class="range-btn" @click.stop="adjustRotation(index, 0.1)">▶</button>
              </div>
            </div>
          </div>
        </div>
        </transition>
      </div>
      <button class="add-button" @click="addImage">
        {{ t('stamp.common.addNew') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, IDrawImage } from '../../../DrawStampTypes'

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

const imageList = computed(() => props.config.imageList || [])
const selectedIndex = computed(() => props.selectedIndex ?? -1)

// 跟踪每个项的展开状态
const expandedItems = ref<Record<number, boolean>>({})

// 当 selectedIndex 变化时，自动只展开对应的项并收起其他项
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

const updateImage = <K extends keyof IDrawImage>(
  index: number,
  key: K,
  value: IDrawImage[K]
) => {
  emit('update-config', (config) => {
    const list = config.imageList || []
    if (!list[index]) return
    list[index][key] = value
  })
}

const removeImage = (index: number) => {
  emit('update-config', (config) => {
    config.imageList?.splice(index, 1)
  })
}

const addImage = () => {
  emit('update-config', (config) => {
    if (!config.imageList) {
      config.imageList = []
    }
    if (config.imageList.length < 10) {
      config.imageList.push({
        imageUrl: '',
        imageWidth: 10,
        imageHeight: 10,
        positionX: 0,
        positionY: 0,
        keepAspectRatio: true,
        rotation: 0
      })
    }
  })
}

const handleImageUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        updateImage(index, 'imageUrl', e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
}

const adjustPositionX = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.imageList || []
    if (!list[index]) return
    const newValue = Math.max(-50, Math.min(50, list[index].positionX + delta))
    list[index].positionX = newValue
  })
}

const adjustPositionY = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.imageList || []
    if (!list[index]) return
    const newValue = Math.max(-50, Math.min(50, list[index].positionY + delta))
    list[index].positionY = newValue
  })
}

const adjustRotation = (index: number, delta: number) => {
  emit('update-config', (config) => {
    const list = config.imageList || []
    if (!list[index]) return
    const currentValue = list[index].rotation || 0
    const newValue = Math.max(0, Math.min(360, currentValue + delta))
    list[index].rotation = newValue
  })
}
</script>

<style scoped>
.image-body {
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-preview {
  margin-bottom: 8px;
}

.image-preview img {
  max-width: 100%;
  max-height: 150px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
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

.inline-label input[type="number"] {
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

.inline-label input[type="number"]:focus {
  border-color: #3b82f6;
  outline: none;
}

.checkbox-label {
  flex-direction: row !important;
  align-items: center;
  cursor: pointer;
  gap: 6px;
}

.checkbox-label input[type='checkbox'] {
  margin: 0;
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

.image-item:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.2s;
  gap: 12px;
}

.image-header:hover {
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

.image-header span {
  color: #262626;
  font-weight: 600;
  font-size: 14px;
}

.image-body {
  padding: 16px;
  background: #fff;
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

