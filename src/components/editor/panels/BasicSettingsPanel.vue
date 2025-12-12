<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.basic.title') }}
        <span class="expand-icon" :class="{ expanded: expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <!-- 文本/选择类设置 -->
      <div class="settings-section">
        <label class="inline-label">
          <span class="label-text">{{ t('stamp.basic.width') }}:</span>
          <input type="number" :value="props.config.width" min="1" max="50" step="0.1" @input="onWidthInput" />
        </label>
        <label class="inline-label">
          <span class="label-text">{{ t('stamp.basic.height') }}:</span>
          <input
            type="number"
            :value="computedHeight"
            min="1"
            max="50"
            step="0.1"
            :disabled="props.config.company.shape === 'triangle' && (props.config.lockTriangleEquilateral ?? true)"
            @input="onHeightInput"
          />
        </label>
        <label class="inline-label">
          <span class="label-text">{{ t('stamp.basic.borderLineStyle') }}:</span>
          <select :value="props.config.outBorder.lineStyle || 'solid'" @change="onBorderLineStyleChange">
            <option value="solid">{{ t('stamp.basic.lineStyle.solid') }}</option>
            <option value="dashed">{{ t('stamp.basic.lineStyle.dashed') }}</option>
            <option value="dotted">{{ t('stamp.basic.lineStyle.dotted') }}</option>
          </select>
        </label>
        <template v-if="(props.config.outBorder.lineStyle || 'solid') !== 'solid'">
          <label class="inline-label">
            <span class="label-text">{{ t('stamp.basic.dashLength') }}:</span>
            <input
              type="number"
              :value="props.config.outBorder.dashLength ?? 2"
              min="0.1"
              max="20"
              step="0.1"
              @input="onBorderDashInput"
            />
          </label>
          <label class="inline-label">
            <span class="label-text">{{ t('stamp.basic.gapLength') }}:</span>
            <input
              type="number"
              :value="props.config.outBorder.gapLength ?? 1"
              min="0.1"
              max="20"
              step="0.1"
              @input="onBorderGapInput"
            />
          </label>
        </template>
        <label class="inline-label">
          <span class="label-text">{{ t('stamp.basic.color') }}:</span>
          <input type="color" :value="props.config.primaryColor" @input="onPrimaryColorInput" />
        </label>
        <label class="inline-label">
          <span class="label-text">{{ t('stamp.basic.shape') }}:</span>
          <select :value="props.config.company.shape" @change="onCompanyShapeChange">
            <option value="ellipse">{{ t('stamp.basic.shapeOptions.ellipse') }}</option>
            <option value="rectangle">{{ t('stamp.basic.shapeOptions.rectangle') }}</option>
            <option value="rhombus">{{ t('stamp.basic.shapeOptions.rhombus') }}</option>
            <option value="triangle">{{ t('stamp.basic.shapeOptions.triangle') }}</option>
            <option value="organic">{{ t('stamp.basic.shapeOptions.organic') }}</option>
          </select>
        </label>
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="props.config.outBorder.drawInnerCircle"
            @change="onDrawOutBorderChange"
          />
          {{ t('stamp.outBorder.enable') }}
        </label>
        <label v-if="props.config.company.shape === 'triangle'" class="checkbox-label">
          <input
            type="checkbox"
            :checked="props.config.lockTriangleEquilateral ?? true"
            @change="onLockTriangleEquilateralChange"
          />
          {{ t('stamp.basic.lockEquilateralTriangle') }}
        </label>
        <label v-if="props.config.outBorder.drawInnerCircle" class="inline-label">
          <span class="label-text">{{ t('stamp.outBorder.lineWidth') }}:</span>
          <input
            type="number"
            :value="props.config.outBorder.innerCircleLineWidth"
            min="0.1"
            max="5"
            step="0.1"
            @input="onOutBorderWidthInput"
          />
        </label>
        <label v-if="props.config.outBorder.drawInnerCircle" class="checkbox-label">
          <input
            type="checkbox"
            :checked="props.config.outBorder.fillBackground || false"
            @change="onFillBackgroundChange"
          />
          {{ t('stamp.outBorder.fillBackground') }}
        </label>
        <label v-if="props.config.outBorder.drawInnerCircle && (props.config.outBorder.fillBackground || false)" class="inline-label">
          <span class="label-text">{{ t('stamp.outBorder.backgroundColor') }}:</span>
          <input
            type="color"
            :value="props.config.outBorder.color || props.config.primaryColor"
            @input="onOutBorderColorInput"
          />
        </label>
        <!-- 有机/不规则形状的样式选择与随机刷新 -->
        <div v-if="props.config.company.shape === 'organic'" class="organic-style-group">
          <label class="inline-label">
            <span class="label-text">{{ t('stamp.outBorder.organicStyle') }}:</span>
            <select
              :value="props.config.outBorder.organicStyleId ?? 0"
              @change="onOrganicStyleChange"
            >
              <option v-for="i in 10" :key="i" :value="i - 1">
                {{ t('stamp.outBorder.organicStyleItem', { index: i }) }}
              </option>
            </select>
          </label>
          <button type="button" class="organic-random-btn" @click="onRandomOrganicStyle">
            {{ t('stamp.outBorder.randomOrganic') }}
          </button>
        </div>
      </div>

      <!-- 拖动条类设置 -->
      <div class="range-section">
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.basic.positionX') }}</span>
            <span class="range-value-display">[ {{ (props.config.offsetX || 0).toFixed(1) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click="adjustPositionX(-0.1)">◀</button>
            <input
              type="range"
              :value="props.config.offsetX || 0"
              min="-50"
              max="50"
              step="0.1"
              @input="onPositionXInput"
            />
            <button type="button" class="range-btn" @click="adjustPositionX(0.1)">▶</button>
          </div>
          <span class="help-text">{{ t('stamp.basic.positionXHint') }}</span>
        </div>
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.basic.positionY') }}</span>
            <span class="range-value-display">[ {{ (props.config.offsetY || 0).toFixed(1) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click="adjustPositionY(-0.1)">◀</button>
            <input
              type="range"
              :value="props.config.offsetY || 0"
              min="-50"
              max="50"
              step="0.1"
              @input="onPositionYInput"
            />
            <button type="button" class="range-btn" @click="adjustPositionY(0.1)">▶</button>
          </div>
          <span class="help-text">{{ t('stamp.basic.positionYHint') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

import type { IDrawStampConfig } from '../../../DrawStampTypes'
import { computed } from 'vue'

const props = defineProps<{
  expanded: boolean
  isCircleDetect: boolean
  config: IDrawStampConfig
}>()

// 计算高度值：如果是三角形且开启了等边三角形锁定，根据宽度计算等边三角形的高度
const computedHeight = computed(() => {
  if (props.config.company.shape === 'triangle' && (props.config.lockTriangleEquilateral ?? true)) {
    const sqrt3Over2 = Math.sqrt(3) / 2
    return props.config.width * sqrt3Over2
  }
  return props.config.height
})

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update:is-circle-detect', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const onCircleDetectChange = (event: Event) => {
  emit('update:is-circle-detect', (event.target as HTMLInputElement).checked)
}

const onWidthInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.width = value
    // 如果当前形状是三角形且开启了等边三角形锁定，自动调整高度以保持等边三角形
    if (config.company.shape === 'triangle' && (config.lockTriangleEquilateral ?? true)) {
      const sqrt3Over2 = Math.sqrt(3) / 2
      config.height = value * sqrt3Over2
    }
  })
}

const onHeightInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    // 如果当前形状是三角形且开启了等边三角形锁定，高度输入框应该被禁用，不应该执行到这里
    // 但为了安全起见，如果用户通过其他方式修改了高度，我们根据高度反向计算宽度
    if (config.company.shape === 'triangle' && (config.lockTriangleEquilateral ?? true)) {
      const sqrt3Over2 = Math.sqrt(3) / 2
      config.width = value / sqrt3Over2
      // 重新计算高度以确保精度
      config.height = config.width * sqrt3Over2
    } else {
      config.height = value
    }
  })
}

const onBorderWidthInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.borderWidth = value
  })
}

const onBorderLineStyleChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as 'solid' | 'dashed' | 'dotted'
  emit('update-config', (config) => {
    config.outBorder.lineStyle = value
  })
}

const onBorderDashInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.outBorder.dashLength = value
  })
}

const onBorderGapInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.outBorder.gapLength = value
  })
}

const onPrimaryColorInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update-config', (config) => {
    const previousColor = config.primaryColor
    config.primaryColor = value
    if (config.svgList && config.svgList.length > 0) {
      config.svgList.forEach((svg) => {
        if (!svg.color || svg.color === previousColor) {
          svg.color = value
        }
      })
    }
    if (config.company && (!config.company.color || config.company.color === previousColor)) {
      config.company.color = value
    }
    if (config.stampCode && (!config.stampCode.color || config.stampCode.color === previousColor)) {
      config.stampCode.color = value
    }
    if (config.companyList && config.companyList.length > 0) {
      config.companyList.forEach((company) => {
        if (!company.color || company.color === previousColor) {
          company.color = value
        }
      })
    }
    if (config.stampTypeList && config.stampTypeList.length > 0) {
      config.stampTypeList.forEach((type) => {
        if (!type.color || type.color === previousColor) {
          type.color = value
        }
      })
    }
    if (config.innerCircleList && config.innerCircleList.length > 0) {
      config.innerCircleList.forEach((circle) => {
        if (!circle.color || circle.color === previousColor) {
          circle.color = value
        }
      })
    }
  })
}

const onLockTriangleEquilateralChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit('update-config', (config) => {
    config.lockTriangleEquilateral = checked
    // 如果开启锁定且当前是三角形，调整高度使其成为等边三角形
    if (checked && config.company.shape === 'triangle') {
      const sqrt3Over2 = Math.sqrt(3) / 2
      config.height = config.width * sqrt3Over2
    }
  })
}

const onCompanyShapeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as 'ellipse' | 'rectangle' | 'rhombus' | 'triangle' | 'organic'
  emit('update-config', (config) => {
    config.company.shape = value
    // 如果选择三角形且开启了等边三角形锁定，调整高度使其成为等边三角形
    // 等边三角形：高度 = 宽度 * sqrt(3) / 2
    if (value === 'triangle' && (config.lockTriangleEquilateral ?? true)) {
      const sqrt3Over2 = Math.sqrt(3) / 2
      config.height = config.width * sqrt3Over2
    }
    // 同时更新 companyList 中所有公司的形状，因为绘制逻辑检查的是 companyList
    if (config.companyList && config.companyList.length > 0) {
      config.companyList.forEach(company => {
        company.shape = value
      })
    }
    if (config.innerCircleList) {
      config.innerCircleList.forEach(circle => {
        // 只更新支持的形状类型（内圈不支持 organic）
        if (value === 'ellipse' || value === 'rectangle' || value === 'rhombus' || value === 'triangle') {
          circle.shape = value
        }
      })
    }
  })
}

const onDrawOutBorderChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).checked
  emit('update-config', (config) => {
    config.outBorder.drawInnerCircle = value
  })
}

const onOutBorderWidthInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.outBorder.innerCircleLineWidth = value
  })
}

const onOutBorderColorInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update-config', (config) => {
    config.outBorder.color = value
  })
}

const onFillBackgroundChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).checked
  emit('update-config', (config) => {
    config.outBorder.fillBackground = value
    // 如果关闭背景填充，清除背景颜色
    if (!value) {
      config.outBorder.color = undefined
    } else if (!config.outBorder.color) {
      // 如果开启背景填充但没有设置颜色，使用主色
      config.outBorder.color = config.primaryColor
    }
  })
}

const onPositionXInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.offsetX = value
  })
}

const onPositionYInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.offsetY = value
  })
}

const onOrganicStyleChange = (event: Event) => {
  const value = Number((event.target as HTMLSelectElement).value)
  emit('update-config', (config) => {
    config.outBorder.organicStyleId = value
  })
}

const onRandomOrganicStyle = () => {
  const randomId = Math.floor(Math.random() * 10)
  emit('update-config', (config) => {
    config.outBorder.organicStyleId = randomId
  })
}

const adjustPositionX = (delta: number) => {
  const currentValue = props.config.offsetX || 0
  const newValue = Math.max(-50, Math.min(50, currentValue + delta))
  emit('update-config', (config) => {
    config.offsetX = newValue
  })
}

const adjustPositionY = (delta: number) => {
  const currentValue = props.config.offsetY || 0
  const newValue = Math.max(-50, Math.min(50, currentValue + delta))
  emit('update-config', (config) => {
    config.offsetY = newValue
  })
}
</script>

<style scoped>
.group-content {
  padding: 12px;
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

.help-text {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
  padding-left: 0;
}

.organic-style-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.organic-random-btn {
  padding: 5px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.organic-random-btn:hover {
  background-color: #f3f4f6;
  border-color: #3b82f6;
  color: #3b82f6;
}
</style>

