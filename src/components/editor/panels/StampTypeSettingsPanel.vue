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
            <button class="action-btn delete-btn" @click.stop="removeStampType(index)">
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
        <label>
          {{ t('stamp.stampType.fontSize') }}:
          <input
            type="number"
            :value="type.fontHeight"
            min="1"
            max="10"
            step="0.1"
            @input="updateStampType(index, 'fontHeight', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.stampType.font') }}:
          <div class="font-input-group">
            <select
              :value="type.fontFamily"
              class="font-select"
              @change="updateStampType(index, 'fontFamily', ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="font in systemFonts" :key="font" :value="font" :style="{ fontFamily: font }">
                {{ getFontDisplayName(font) }}
              </option>
            </select>
            <input
              type="text"
              :value="type.fontFamily"
              class="font-input"
              @input="updateStampType(index, 'fontFamily', ($event.target as HTMLInputElement).value)"
              :placeholder="t('stamp.common.fontPlaceholder')"
            />
          </div>
        </label>
        <label>
          {{ t('stamp.stampType.fontWeight') }}:
          <select
            :value="type.fontWeight"
            @change="updateStampType(index, 'fontWeight', ($event.target as HTMLSelectElement).value)"
          >
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
            :value="type.compression"
            min="0.1"
            max="1.5"
            step="0.05"
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
            step="0.05"
            @input="updateStampType(index, 'letterSpacing', parseNumber($event))"
          />
          <span>{{ type.letterSpacing.toFixed(2) }}</span>
        </label>
        <label>
          {{ t('stamp.stampType.color') }}:
          <input
            type="color"
            :value="type.color || primaryColor"
            @input="onColorInput(index, $event)"
          />
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
              step="1"
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

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: stretch;
  flex-shrink: 0;
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
</style>