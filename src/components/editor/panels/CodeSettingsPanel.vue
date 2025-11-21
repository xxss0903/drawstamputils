<template>
  <div class="control-group stamp-code-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.code.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <label>
        {{ t('stamp.code.code') }}:
        <input
          type="text"
          :value="config.stampCode.code"
          @input="updateCode('code', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label>
        {{ t('stamp.code.font') }}:
        <div class="font-input-group">
          <select
            :value="config.stampCode.fontFamily"
            class="font-select"
            @change="updateCode('fontFamily', ($event.target as HTMLSelectElement).value)"
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
            :value="config.stampCode.fontFamily"
            class="font-input"
            @input="updateCode('fontFamily', ($event.target as HTMLInputElement).value)"
            placeholder="输入字体名称"
          />
        </div>
      </label>
      <label>
        {{ t('stamp.code.fontSize') }}:
        <input
          type="number"
          :value="config.stampCode.fontHeight"
          step="0.1"
          @input="updateCode('fontHeight', parseNumber($event))"
        />
      </label>
      <label>
        {{ t('stamp.code.fontWeight') }}:
        <select
          :value="config.stampCode.fontWeight"
          @change="updateCode('fontWeight', ($event.target as HTMLSelectElement).value)"
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
      <label>
        <span>{{ t('stamp.common.compression', { value: config.stampCode.compression.toFixed(2) }) }}</span>
        <input
          type="range"
          :value="config.stampCode.compression"
          min="0.0"
          max="3"
          step="0.01"
          @input="updateCode('compression', parseNumber($event))"
        />
      </label>
      <label>
        <span>{{ t('stamp.common.distribution', { value: config.stampCode.textDistributionFactor.toFixed(1) }) }}</span>
        <input
          type="range"
          :value="config.stampCode.textDistributionFactor"
          min="0"
          max="100"
          step="0.5"
          @input="updateCode('textDistributionFactor', parseNumber($event))"
        />
      </label>
      <label>
        {{ t('stamp.code.margin') }}:
        <input
          type="number"
          :value="config.stampCode.borderOffset"
          min="-10"
          max="20"
          step="0.05"
          @input="updateCode('borderOffset', parseNumber($event))"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, ICode } from '../../../DrawStampTypes'
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

const updateCode = <K extends keyof ICode>(
  key: K,
  value: ICode[K]
) => {
  emit('update-config', (config) => {
    config.stampCode[key] = value
  })
}
</script>

