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
        <div class="image-preview" v-if="image.imageUrl">
          <img :src="image.imageUrl" :alt="t('stamp.common.preview')" />
        </div>
        <label>
          {{ t('stamp.images.select') }}:
          <input type="file" @change="(e) => handleImageUpload(e, index)" accept="image/*" />
        </label>
        <label>
          {{ t('stamp.images.width') }}:
          <input
            type="number"
            :value="image.imageWidth"
            min="1"
            max="100"
            step="0.5"
            @input="updateImage(index, 'imageWidth', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.images.height') }}:
          <input
            type="number"
            :value="image.imageHeight"
            min="1"
            max="100"
            step="0.5"
            @input="updateImage(index, 'imageHeight', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.images.positionX') }}:
          <div class="range-container">
            <input
              type="range"
              :value="image.positionX"
              min="-20"
              max="20"
              step="0.1"
              @input="updateImage(index, 'positionX', parseNumber($event))"
            />
            <span>{{ image.positionX.toFixed(1) }}</span>
          </div>
        </label>
        <label>
          {{ t('stamp.images.positionY') }}:
          <div class="range-container">
            <input
              type="range"
              :value="image.positionY"
              min="-20"
              max="20"
              step="0.1"
              @input="updateImage(index, 'positionY', parseNumber($event))"
            />
            <span>{{ image.positionY.toFixed(1) }}</span>
          </div>
        </label>
        <label>
          {{ t('stamp.images.rotation') }}:
          <div class="range-container">
            <input
              type="range"
              :value="image.rotation || 0"
              min="0"
              max="360"
              step="0.1"
              @input="updateImage(index, 'rotation', parseNumber($event))"
            />
            <span>{{ (image.rotation || 0).toFixed(0) }}°</span>
          </div>
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
</script>

<style scoped>
.range-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-container input[type="range"] {
  flex: 1;
}

.range-container span {
  min-width: 50px;
  text-align: right;
  font-size: 14px;
  color: #666;
}

.image-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
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

