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
            <button class="expand-toggle-btn" @click.stop="toggleItem(index)" :title="isItemExpanded(index) ? '收起' : '展开'">
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>第 {{ index + 1 }} 行</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copyInnerCircle(index)">
              复制
            </button>
            <button class="action-btn delete-btn" @click.stop="removeInnerCircle(index)">
              删除
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="inner-circle-body">
        <label>
          {{ t('stamp.innerCircle.lineWidth') }}:
          <input
            type="number"
            :value="innerCircle.innerCircleLineWidth"
            min="0.05"
            max="0.5"
            step="0.05"
            @input="updateInnerCircle(index, 'innerCircleLineWidth', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.innerCircle.radiusX') }}:
          <input
            type="number"
            :value="innerCircle.innerCircleLineRadiusX"
            min="1"
            max="50"
            step="0.1"
            @input="updateInnerCircle(index, 'innerCircleLineRadiusX', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.innerCircle.radiusY') }}:
          <input
            type="number"
            :value="innerCircle.innerCircleLineRadiusY"
            min="1"
            max="50"
            step="0.1"
            @input="updateInnerCircle(index, 'innerCircleLineRadiusY', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.innerCircle.color') }}:
          <input
            type="color"
            :value="innerCircle.color || primaryColor"
            @input="updateInnerCircle(index, 'color', ($event.target as HTMLInputElement).value)"
          />
        </label>
        <label>
          {{ t('stamp.innerCircle.positionX') }}:
          <input
            type="number"
            :value="innerCircle.offsetX ?? 0"
            min="-50"
            max="50"
            step="0.1"
            @input="updateInnerCircle(index, 'offsetX', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.innerCircle.positionY') }}:
          <input
            type="number"
            :value="innerCircle.offsetY ?? 0"
            min="-50"
            max="50"
            step="0.1"
            @input="updateInnerCircle(index, 'offsetY', parseNumber($event))"
          />
        </label>
        <label>
          形状:
          <select
            :value="innerCircle.shape || 'ellipse'"
            @change="updateInnerCircle(index, 'shape', ($event.target as HTMLSelectElement).value as 'ellipse' | 'rectangle' | 'rhombus')"
          >
            <option value="ellipse">{{ t('stamp.basic.shapeOptions.ellipse') }}</option>
            <option value="rectangle">{{ t('stamp.basic.shapeOptions.rectangle') }}</option>
            <option value="rhombus">{{ t('stamp.basic.shapeOptions.rhombus') }}</option>
          </select>
        </label>
        <label>
          线条样式:
          <select
            :value="innerCircle.lineStyle || 'solid'"
            @change="updateInnerCircle(index, 'lineStyle', ($event.target as HTMLSelectElement).value as 'solid' | 'dashed' | 'dotted')"
          >
            <option value="solid">实线</option>
            <option value="dashed">虚线</option>
            <option value="dotted">点线</option>
          </select>
        </label>
        <template v-if="(innerCircle.lineStyle || 'solid') !== 'solid'">
          <label>
            虚线长度 (mm):
            <input
              type="number"
              :value="innerCircle.dashLength ?? 2"
              min="0.1"
              max="20"
              step="0.1"
              @input="updateInnerCircle(index, 'dashLength', parseNumber($event))"
            />
          </label>
          <label>
            虚线间距 (mm):
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

// 当 selectedIndex 变化时，自动展开对应的项
watch(selectedIndex, (newIndex) => {
  if (newIndex >= 0) {
    expandedItems.value[newIndex] = true
  }
}, { immediate: true })

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const toggleItem = (index: number) => {
  expandedItems.value[index] = !expandedItems.value[index]
}

const isItemExpanded = (index: number) => {
  // 如果该项被选中，自动展开；否则使用本地展开状态
  if (selectedIndex.value === index) {
    return true
  }
  return expandedItems.value[index] ?? false
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateInnerCircle = <K extends keyof IInnerCircle>(
  index: number,
  key: K,
  value: IInnerCircle[K]
) => {
  emit('update-config', (config) => {
    const list = config.innerCircleList || []
    if (!list[index]) return
    list[index][key] = value
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
    const clone: IInnerCircle = {
      ...original,
      innerCircleLineRadiusX: original.innerCircleLineRadiusX + 1, // 稍微偏移
      innerCircleLineRadiusY: original.innerCircleLineRadiusY + 1
    }
    config.innerCircleList.splice(index + 1, 0, clone)
  })
}

const addInnerCircle = (shape?: 'ellipse' | 'rectangle' | 'rhombus') => {
  emit('update-config', (config) => {
    if (!config.innerCircleList) {
      config.innerCircleList = []
    }
    config.innerCircleList.push({
      drawInnerCircle: true,
      innerCircleLineWidth: 0.5,
      innerCircleLineRadiusX: 16,
      innerCircleLineRadiusY: 12,
      lineStyle: 'solid',
      dashLength: 2,
      gapLength: 1,
      shape: shape || config.company.shape || 'ellipse',
      color: config.primaryColor || '#d40000',
      offsetX: 0,
      offsetY: 0
    })
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

.inner-circle-header span {
  color: #262626;
  font-weight: 600;
  font-size: 14px;
}

.inner-circle-body {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.add-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.add-button {
  border: 1px dashed #1890ff;
  background: #e6f7ff;
  color: #1890ff;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.add-button:hover {
  background: #bae7ff;
  border-color: #40a9ff;
  color: #096dd9;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

