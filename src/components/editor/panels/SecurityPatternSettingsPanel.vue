<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.security.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <!-- 文本/选择类设置 -->
      <div class="settings-section">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="config.securityPattern.openSecurityPattern"
            @change="updateSecurityPattern('openSecurityPattern', ($event.target as HTMLInputElement).checked)"
          />
          {{ t('stamp.security.enable') }}
        </label>
        <button @click="refreshSecurityPattern" class="refresh-button">
          {{ t('stamp.security.refresh') }}
        </button>
      </div>

      <!-- 拖动条类设置 -->
      <div v-if="config.securityPattern.openSecurityPattern" class="range-section">
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.security.count') }}</span>
            <span class="range-value-display">[ {{ config.securityPattern.securityPatternCount.toFixed(1) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click.stop="adjustCount(-0.1)">◀</button>
            <input
              type="range"
              :value="config.securityPattern.securityPatternCount"
              min="1"
              max="100"
              step="0.1"
              @input="updateSecurityPattern('securityPatternCount', parseNumber($event))"
            />
            <button type="button" class="range-btn" @click.stop="adjustCount(0.1)">▶</button>
          </div>
        </div>
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.security.length') }}</span>
            <span class="range-value-display">[ {{ config.securityPattern.securityPatternLength.toFixed(1) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click.stop="adjustLength(-0.1)">◀</button>
            <input
              type="range"
              :value="config.securityPattern.securityPatternLength"
              min="0.1"
              max="100"
              step="0.1"
              @input="updateSecurityPattern('securityPatternLength', parseNumber($event))"
            />
            <button type="button" class="range-btn" @click.stop="adjustLength(0.1)">▶</button>
          </div>
        </div>
        <div class="range-item">
          <div class="range-header">
            <span class="range-label-text">{{ t('stamp.security.width') }}</span>
            <span class="range-value-display">[ {{ config.securityPattern.securityPatternWidth.toFixed(2) }} ]</span>
          </div>
          <div class="range-container">
            <button type="button" class="range-btn" @click.stop="adjustWidth(-0.01)">◀</button>
            <input
              type="range"
              :value="config.securityPattern.securityPatternWidth"
              min="0.05"
              max="0.5"
              step="0.01"
              @input="updateSecurityPattern('securityPatternWidth', parseNumber($event))"
            />
            <button type="button" class="range-btn" @click.stop="adjustWidth(0.01)">▶</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, ISecurityPattern } from '../../../DrawStampTypes'

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
  (e: 'refresh-security-pattern'): void
}>()

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateSecurityPattern = <K extends keyof ISecurityPattern>(
  key: K,
  value: ISecurityPattern[K]
) => {
  emit('update-config', (config) => {
    config.securityPattern[key] = value
  })
}

const refreshSecurityPattern = () => {
  emit('refresh-security-pattern')
}

const adjustCount = (delta: number) => {
  emit('update-config', (config) => {
    const newValue = Math.max(1, Math.min(100, config.securityPattern.securityPatternCount + delta))
    config.securityPattern.securityPatternCount = newValue
  })
}

const adjustLength = (delta: number) => {
  emit('update-config', (config) => {
    const newValue = Math.max(0.1, Math.min(100, config.securityPattern.securityPatternLength + delta))
    config.securityPattern.securityPatternLength = newValue
  })
}

const adjustWidth = (delta: number) => {
  emit('update-config', (config) => {
    const newValue = Math.max(0.05, Math.min(0.5, config.securityPattern.securityPatternWidth + delta))
    config.securityPattern.securityPatternWidth = newValue
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

.refresh-button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.refresh-button:hover {
  background-color: #f3f4f6;
  border-color: #3b82f6;
  color: #3b82f6;
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

