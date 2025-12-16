<template>
  <div class="control-group tax-number-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.taxNumber.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <!-- 文本/选择类设置 -->
      <div class="settings-section">
        <div class="text-input-item">
          <div class="text-input-header">
            <span class="text-input-label">{{ t('stamp.taxNumber.number') }}:</span>
          </div>
          <input 
            type="text" 
            class="text-input-field"
            :value="config.taxNumber.code"
            @input="updateTaxNumber('code', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <label>
          {{ t('stamp.taxNumber.font') }}:
          <div class="font-input-group">
            <select
              :value="config.taxNumber.fontFamily"
              class="font-select"
              @change="updateTaxNumber('fontFamily', ($event.target as HTMLSelectElement).value)"
            >
              <option
                v-for="font in systemFonts"
                :key="font"
                :value="font"
                :style="{ fontFamily: font }"
              >
                {{ getFontDisplayName(font) }}
              </option>
            </select>
            <input
              type="text"
              :value="config.taxNumber.fontFamily"
              class="font-input"
              @input="updateTaxNumber('fontFamily', ($event.target as HTMLInputElement).value)"
              :placeholder="t('stamp.common.fontPlaceholder')"
            />
          </div>
        </label>
        <label class="inline-label">
          <span class="label-text">{{ t('stamp.taxNumber.fontWeight') }}:</span>
          <select
            :value="config.taxNumber.fontWeight"
            @change="updateTaxNumber('fontWeight', ($event.target as HTMLSelectElement).value)"
          >
            <option value="normal">{{ t('stamp.common.fontWeight.normal') }}</option>
            <option value="bold">{{ t('stamp.common.fontWeight.bold') }}</option>
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
      </div>

      <!-- 拖动条类设置 -->
      <div class="range-section">
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.taxNumber.compression') }}</span>
            <span class="range-value-display">[ {{ config.taxNumber.compression.toFixed(2) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click.stop="adjustCompression(-0.01)">◀</button>
            <input
              type="range"
              :value="config.taxNumber.compression"
              min="0.0"
              max="3"
              step="0.01"
              @input="updateTaxNumber('compression', parseNumber($event))"
            />
            <button type="button" class="range-btn" @click.stop="adjustCompression(0.01)">▶</button>
          </div>
        </div>
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.taxNumber.letterSpacingShort') }}</span>
            <span class="range-value-display">[ {{ config.taxNumber.letterSpacing.toFixed(2) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click.stop="adjustLetterSpacing(-0.01)">◀</button>
            <input
              type="range"
              :value="config.taxNumber.letterSpacing"
              min="-1"
              max="20"
              step="0.01"
              @input="updateTaxNumber('letterSpacing', parseNumber($event))"
            />
            <button type="button" class="range-btn" @click.stop="adjustLetterSpacing(0.01)">▶</button>
          </div>
        </div>
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.taxNumber.verticalPositionShort') }}</span>
            <span class="range-value-display">[ {{ config.taxNumber.positionY.toFixed(1) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click.stop="adjustPositionY(-0.1)">◀</button>
            <input
              type="range"
              :value="config.taxNumber.positionY"
              min="-10"
              max="10"
              step="0.1"
              @input="updateTaxNumber('positionY', parseNumber($event))"
            />
            <button type="button" class="range-btn" @click.stop="adjustPositionY(0.1)">▶</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, ITaxNumber } from '../../../DrawStampTypes'
import { getFontDisplayName } from '../../../utils/fontUtils'

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
  systemFonts: string[]
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateTaxNumber = <K extends keyof ITaxNumber>(
  key: K,
  value: ITaxNumber[K]
) => {
  emit('update-config', (config) => {
    config.taxNumber[key] = value
  })
}

const adjustCompression = (delta: number) => {
  emit('update-config', (config) => {
    const newValue = Math.max(0.0, Math.min(3, config.taxNumber.compression + delta))
    config.taxNumber.compression = newValue
  })
}

const adjustLetterSpacing = (delta: number) => {
  emit('update-config', (config) => {
    const newValue = Math.max(-1, Math.min(20, config.taxNumber.letterSpacing + delta))
    config.taxNumber.letterSpacing = newValue
  })
}

const adjustPositionY = (delta: number) => {
  emit('update-config', (config) => {
    const newValue = Math.max(-10, Math.min(10, config.taxNumber.positionY + delta))
    config.taxNumber.positionY = newValue
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

/* 字体输入组样式 */
.font-input-group {
  display: flex;
  gap: 8px;
  width: 100%;
}

.font-select {
  min-width: 120px;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  transition: border-color 0.2s ease;
}

.font-select:focus {
  border-color: #3b82f6;
  outline: none;
}

.font-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.font-input:focus {
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
</style>
