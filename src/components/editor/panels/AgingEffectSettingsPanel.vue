<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.aging.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <label class="checkbox-label">
        <input
          type="checkbox"
          :checked="config.agingEffect.applyAging"
          @change="updateAgingEffect"
        />
        {{ t('stamp.aging.enable') }}
      </label>
      <label class="checkbox-label">
        <input
          type="checkbox"
          :checked="config.openManualAging"
          @change="updateManualAging"
        />
        {{ t('stamp.aging.manual') }}
      </label>
      <label v-if="config.agingEffect.applyAging">
        {{ t('stamp.aging.intensity') }}:
        <input
          type="range"
          :value="config.agingEffect.agingIntensity"
          min="0"
          max="100"
          step="0.1"
          @input="updateAgingIntensity"
        />
        <span>{{ config.agingEffect.agingIntensity }}%</span>
      </label>
      <button @click="refreshAgingEffect" class="refresh-button">
        {{ t('stamp.aging.refresh') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig } from '../../../DrawStampTypes'

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
  (e: 'refresh-aging-effect'): void
}>()

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const updateAgingEffect = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit('update-config', (config) => {
    config.agingEffect.applyAging = checked
  })
  emit('refresh-aging-effect')
}

const updateManualAging = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit('update-config', (config) => {
    config.openManualAging = checked
  })
  emit('refresh-aging-effect')
}

const updateAgingIntensity = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.agingEffect.agingIntensity = value
  })
  emit('refresh-aging-effect')
}

const refreshAgingEffect = () => {
  emit('refresh-aging-effect')
}
</script>

