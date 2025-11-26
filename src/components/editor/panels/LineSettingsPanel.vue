<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        线条设置
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
            <button class="expand-toggle-btn" @click.stop="toggleItem(index)" :title="isItemExpanded(index) ? '收起' : '展开'">
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ line.type === 'vertical' ? '竖线' : '横线' }} {{ index + 1 }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copyLine(index)">
              复制
            </button>
            <button class="action-btn delete-btn" @click.stop="removeLine(index)">
              删除
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="line-body">

        <label>
          方向:
          <select :value="line.type" @change="updateLine(index, 'type', ($event.target as HTMLSelectElement).value as 'horizontal' | 'vertical')">
            <option value="horizontal">横线</option>
            <option value="vertical">竖线</option>
          </select>
        </label>

        <label>
          长度 (mm):
          <input
            type="number"
            :value="line.length"
            min="1"
            :max="maxLength"
            step="0.5"
            @input="updateLine(index, 'length', parseNumber($event))"
          />
        </label>

        <label>
          线宽 (mm):
          <input
            type="number"
            :value="line.lineWidth"
            min="0.1"
            max="5"
            step="0.1"
            @input="updateLine(index, 'lineWidth', parseNumber($event))"
          />
        </label>

        <label>
          水平位置 X (mm):
          <div class="range-container">
            <input
              type="range"
              :value="line.positionX"
              :min="positionRangeX * -1"
              :max="positionRangeX"
              step="0.1"
              @input="updateLine(index, 'positionX', parseNumber($event))"
            />
            <span>{{ line.positionX.toFixed(1) }}</span>
          </div>
        </label>

        <label>
          垂直位置 Y (mm):
          <div class="range-container">
            <input
              type="range"
              :value="line.positionY"
              :min="positionRangeY * -1"
              :max="positionRangeY"
              step="0.1"
              @input="updateLine(index, 'positionY', parseNumber($event))"
            />
            <span>{{ line.positionY.toFixed(1) }}</span>
          </div>
        </label>

        <label>
          颜色:
          <input type="color" :value="line.color || defaultColor" @input="updateLine(index, 'color', ($event.target as HTMLInputElement).value)" />
        </label>

        <label>
          线型:
          <select :value="line.style" @change="updateLine(index, 'style', ($event.target as HTMLSelectElement).value as LineStyle)">
            <option value="solid">实线</option>
            <option value="dashed">虚线</option>
            <option value="dotted">点线</option>
          </select>
        </label>

        <div v-if="line.style !== 'solid'" class="dash-settings">
          <label>
            dash 长度 (mm):
            <input
              type="number"
              :value="line.dashLength ?? 2"
              min="0.2"
              max="10"
              step="0.1"
              @input="updateLine(index, 'dashLength', parseNumber($event))"
            />
          </label>
          <label>
            gap 长度 (mm):
            <input
              type="number"
              :value="line.gapLength ?? 1"
              min="0.2"
              max="10"
              step="0.1"
              @input="updateLine(index, 'gapLength', parseNumber($event))"
            />
          </label>
        </div>

        <label>
          透明度:
          <div class="range-container">
            <input
              type="range"
              :value="line.opacity ?? 1"
              min="0"
              max="1"
              step="0.05"
              @input="updateLine(index, 'opacity', parseNumber($event))"
            />
            <span>{{ ((line.opacity ?? 1) * 100).toFixed(0) }}%</span>
          </div>
        </label>
        </div>
        </transition>
      </div>

      <div class="line-actions">
        <button class="add-line-button" @click="addLine('horizontal')">添加横线</button>
        <button class="add-line-button" @click="addLine('vertical')">添加竖线</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { IDrawStampConfig, ILineConfig, LineStyle } from '../../../DrawStampTypes'

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

.line-header span {
  color: #262626;
  font-weight: 600;
  font-size: 14px;
}

.line-body {
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

