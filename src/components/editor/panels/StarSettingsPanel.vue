<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.star.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <!-- 文本/选择类设置 -->
      <div class="settings-section">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="config.drawStar.drawStar"
            @change="updateStar('drawStar', ($event.target as HTMLInputElement).checked)"
          />
          {{ t('stamp.star.enable') }}
        </label>
      </div>

      <!-- 拖动条类设置 -->
      <div v-if="config.drawStar.drawStar" class="range-section">
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.star.diameter') }}</span>
            <span class="range-value-display">[ {{ (config.drawStar.starDiameter ?? 0).toFixed(1) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click.stop="adjustDiameter(-0.1)">◀</button>
            <input
              type="range"
              :value="config.drawStar.starDiameter ?? 0"
              min="1"
              max="50"
              step="0.1"
              @input="updateStar('starDiameter', parseNumber($event))"
            />
            <button type="button" class="range-btn" @click.stop="adjustDiameter(0.1)">▶</button>
          </div>
        </div>
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.star.horizontalPosition') }}</span>
            <span class="range-value-display">[ {{ (config.drawStar.starPositionX ?? 0).toFixed(1) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click.stop="adjustPositionX(-0.1)">◀</button>
            <input
              type="range"
              :value="config.drawStar.starPositionX ?? 0"
              min="-50"
              max="50"
              step="0.1"
              @input="updateStar('starPositionX', parseNumber($event))"
            />
            <button type="button" class="range-btn" @click.stop="adjustPositionX(0.1)">▶</button>
          </div>
        </div>
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.star.verticalPosition') }}</span>
            <span class="range-value-display">[ {{ (config.drawStar.starPositionY ?? 0).toFixed(1) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click.stop="adjustPositionY(-0.1)">◀</button>
            <input
              type="range"
              :value="config.drawStar.starPositionY ?? 0"
              min="-50"
              max="50"
              step="0.1"
              @input="updateStar('starPositionY', parseNumber($event))"
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
import type { IDrawStampConfig, IDrawStar } from '../../../DrawStampTypes'

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateStar = <K extends keyof IDrawStar>(
  key: K,
  value: IDrawStar[K]
) => {
  emit('update-config', (config) => {
    config.drawStar[key] = value
  })
}

const adjustDiameter = (delta: number) => {
  emit('update-config', (config) => {
    const currentValue = config.drawStar.starDiameter ?? 0
    const newValue = Math.max(1, Math.min(50, currentValue + delta))
    config.drawStar.starDiameter = newValue
  })
}

const adjustPositionX = (delta: number) => {
  emit('update-config', (config) => {
    const currentValue = config.drawStar.starPositionX ?? 0
    const newValue = Math.max(-50, Math.min(50, currentValue + delta))
    config.drawStar.starPositionX = newValue
  })
}

const adjustPositionY = (delta: number) => {
  emit('update-config', (config) => {
    const currentValue = config.drawStar.starPositionY ?? 0
    const newValue = Math.max(-50, Math.min(50, currentValue + delta))
    config.drawStar.starPositionY = newValue
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

/* 拖动条类设置区域 */
.range-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
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

