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
            <button class="expand-toggle-btn" @click.stop="toggleItem(index)" :title="isItemExpanded(index) ? '收起' : '展开'">
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ t('stamp.common.line', { index: index + 1 }) }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copyCompany(index)">
              复制
            </button>
            <button class="action-btn delete-btn" @click.stop="removeCompany(index)">
              {{ t('stamp.common.delete') }}
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="company-body">
        <label>
          {{ t('stamp.company.name') }}:
          <input type="text" :value="company.companyName" @input="onFieldInput(index, 'companyName', $event)" />
        </label>
        <label>
          {{ t('stamp.company.font') }}:
          <div class="font-input-group">
            <select
              :value="company.fontFamily"
              class="font-select"
              @change="onFieldInput(index, 'fontFamily', $event)"
            >
              <option v-for="font in fonts" :key="font" :value="font" :style="{ fontFamily: font }">
                {{ getFontDisplayName(font) }}
              </option>
            </select>
            <input
              type="text"
              :value="company.fontFamily"
              class="font-input"
              @input="onFieldInput(index, 'fontFamily', $event)"
              :placeholder="t('stamp.common.fontPlaceholder')"
            />
          </div>
        </label>
        <label>
          {{ t('stamp.company.fontSize') }}:
          <input
            type="number"
            :value="company.fontHeight"
            min="1"
            max="10"
            step="0.1"
            @input="onNumberInput(index, 'fontHeight', $event)"
          />
        </label>
        <label>
          {{ t('stamp.company.fontWeight') }}:
          <select :value="company.fontWeight" @change="onFontWeightChange(index, $event)">
            <option value="normal">{{ t('stamp.common.fontWeight.normal') }}</option>
            <option value="bold">{{ t('stamp.common.fontWeight.bold') }}</option>
            <option v-for="value in fontWeightOptions" :key="value" :value="value">{{ value }}</option>
          </select>
        </label>
        <label>
          {{ t('stamp.company.compression') }}:
          <input
            type="range"
            :value="company.compression"
            min="0.5"
            max="1.5"
            step="0.05"
            @input="onNumberInput(index, 'compression', $event)"
          />
          <span>{{ company.compression.toFixed(2) }}</span>
        </label>
        <label>
          {{ t('stamp.company.distribution') }}:
          <input
            type="range"
            :value="company.textDistributionFactor"
            min="0"
            max="50"
            step="0.1"
            @input="onNumberInput(index, 'textDistributionFactor', $event)"
          />
          <span>{{ company.textDistributionFactor.toFixed(2) }}</span>
        </label>
        <label>
          {{ t('stamp.company.margin') }}:
          <input
            type="number"
            :value="company.borderOffset"
            min="-10"
            max="10"
            step="0.05"
            @input="onNumberInput(index, 'borderOffset', $event)"
          />
        </label>
        <template v-if="company.shape === 'ellipse'">
          <label>
            {{ t('stamp.company.startAngle') }}:
            <div class="range-container">
              <input
                type="range"
                :value="company.startAngle"
                min="-3.14"
                max="3.14"
                step="0.01"
                @input="onNumberInput(index, 'startAngle', $event)"
              />
              <span>{{ (company.startAngle * 180 / Math.PI).toFixed(0) }}°</span>
            </div>
          </label>
          <label>
            {{ t('stamp.company.rotateDirection') }}:
            <select :value="company.rotateDirection" @change="onFieldInput(index, 'rotateDirection', $event)">
              <option value="clockwise">{{ t('stamp.company.clockwise') }}</option>
              <option value="counterclockwise">{{ t('stamp.company.counterclockwise') }}</option>
            </select>
          </label>
        </template>

        <template v-else>
          <label>
            文字方向:
            <select :value="company.rectangleTextDirection" @change="onFieldInput(index, 'rectangleTextDirection', $event)">
              <option value="horizontal">横向</option>
              <option value="vertical">纵向</option>
            </select>
          </label>
          <label>
            文字位置:
            <select :value="company.rectangleTextPosition" @change="onFieldInput(index, 'rectangleTextPosition', $event)">
              <option value="top">顶部</option>
              <option value="bottom">底部</option>
              <option value="left">左侧</option>
              <option value="right">右侧</option>
              <option value="center">中心</option>
            </select>
          </label>
          <label v-if="company.rectangleTextDirection === 'horizontal'">
            横向对齐:
            <select :value="company.rectangleTextAlignment" @change="onFieldInput(index, 'rectangleTextAlignment', $event)">
              <option value="left">左对齐</option>
              <option value="center">居中</option>
              <option value="right">右对齐</option>
            </select>
          </label>
          <label v-else>
            纵向对齐:
            <select :value="company.rectangleVerticalAlignment" @change="onFieldInput(index, 'rectangleVerticalAlignment', $event)">
              <option value="top">顶部对齐</option>
              <option value="center">居中</option>
              <option value="bottom">底部对齐</option>
            </select>
          </label>
          <label v-if="company.rectangleTextDirection === 'vertical'">
            行间距 (mm):
            <input
              type="number"
              :value="company.rectangleLineSpacing"
              min="0"
              max="10"
              step="0.1"
              @input="onNumberInput(index, 'rectangleLineSpacing', $event)"
            />
          </label>
          <label>
            文字边距 (mm):
            <input
              type="number"
              :value="company.rectangleTextMargin"
              min="0"
              max="20"
              step="0.1"
              @input="onNumberInput(index, 'rectangleTextMargin', $event)"
            />
            <span class="help-text">文字距离边框的距离</span>
          </label>
          <label>
            水平位置调整 (mm):
            <div class="range-container">
              <input
                type="range"
                :value="company.rectanglePositionX || 0"
                min="-20"
                max="20"
                step="0.1"
                @input="onNumberInput(index, 'rectanglePositionX', $event)"
              />
              <span>{{ (company.rectanglePositionX || 0).toFixed(1) }}</span>
            </div>
            <span class="help-text">正数向右，负数向左</span>
          </label>
          <label>
            垂直位置调整 (mm):
            <div class="range-container">
              <input
                type="range"
                :value="company.rectanglePositionY || 0"
                min="-20"
                max="20"
                step="0.1"
                @input="onNumberInput(index, 'rectanglePositionY', $event)"
              />
              <span>{{ (company.rectanglePositionY || 0).toFixed(1) }}</span>
            </div>
            <span class="help-text">正数向下，负数向上</span>
          </label>
        </template>
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
const fonts = computed(() => props.systemFonts || [])
const fontWeightOptions = [100, 200, 300, 400, 500, 600, 700, 800, 900]
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

const onFontWeightChange = (index: number, event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value === 'normal' || target.value === 'bold' ? target.value : Number(target.value)
  updateConfig((company) => {
    company.fontWeight = value
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
    
    if (currentShape === 'rectangle') {
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
        shape: 'rectangle',
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

.company-header span {
  color: #262626;
  font-weight: 600;
  font-size: 14px;
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

.company-body {
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
