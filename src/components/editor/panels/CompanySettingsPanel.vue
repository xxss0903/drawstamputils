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
        <div class="company-header" @click.stop="toggleItem(index)">
          <span>{{ t('stamp.common.line', { index: index + 1 }) }}</span>
          <div class="header-actions">
            <button class="small-button delete-button" @click.stop="removeCompany(index)">
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
                {{ font }}
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ICompany, IDrawStampConfig } from '../../../DrawStampTypes'

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

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const toggleItem = (index: number) => {
  // 点击 header 时不做任何操作，因为展开/折叠由 selectedIndex 控制
}

const isItemExpanded = (index: number) => selectedIndex.value === index

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
.company-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  margin: -8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.company-header:hover {
  background-color: #f5f5f5;
}

.header-actions {
  display: flex;
  gap: 6px;
}

.company-body {
  margin-top: 8px;
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
