<template>
  <div class="control-group tax-number-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.taxNumber.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <label>
        {{ t('stamp.taxNumber.number') }}:
        <input
          type="text"
          :value="config.taxNumber.code"
          @input="updateTaxNumber('code', ($event.target as HTMLInputElement).value)"
        />
      </label>
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
              {{ font }}
            </option>
          </select>
          <input
            type="text"
            :value="config.taxNumber.fontFamily"
            class="font-input"
            @input="updateTaxNumber('fontFamily', ($event.target as HTMLInputElement).value)"
            placeholder="输入字体名称"
          />
        </div>
      </label>
      <label>
        {{ t('stamp.taxNumber.fontWeight') }}:
        <select
          :value="config.taxNumber.fontWeight"
          @change="updateTaxNumber('fontWeight', ($event.target as HTMLSelectElement).value)"
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
        <span>{{ t('stamp.common.compression', { value: config.taxNumber.compression.toFixed(2) }) }}</span>
        <input
          type="range"
          :value="config.taxNumber.compression"
          min="0.0"
          max="3"
          step="0.01"
          @input="updateTaxNumber('compression', parseNumber($event))"
        />
      </label>
      <label>
        <span>{{ t('stamp.common.letterSpacing', { value: config.taxNumber.letterSpacing.toFixed(2) }) }}</span>
        <input
          type="range"
          :value="config.taxNumber.letterSpacing"
          min="-1"
          max="20"
          step="0.05"
          @input="updateTaxNumber('letterSpacing', parseNumber($event))"
        />
      </label>
      <label>
        <span>{{ t('stamp.common.verticalPosition', { value: config.taxNumber.positionY.toFixed(1) }) }}</span>
        <input
          type="range"
          :value="config.taxNumber.positionY"
          min="-10"
          max="10"
          step="0.1"
          @input="updateTaxNumber('positionY', parseNumber($event))"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, ITaxNumber } from '../../../DrawStampTypes'

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
</script>

