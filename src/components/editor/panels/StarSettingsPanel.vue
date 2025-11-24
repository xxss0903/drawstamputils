<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.star.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <label class="checkbox-label">
        <input
          type="checkbox"
          :checked="config.drawStar.drawStar"
          @change="updateStar('drawStar', ($event.target as HTMLInputElement).checked)"
        />
        {{ t('stamp.star.enable') }}
      </label>
      <div v-if="config.drawStar.drawStar">
        <label>
          {{ t('stamp.star.diameter') }}:
          <div class="range-container">
            <input
              type="range"
              :value="config.drawStar.starDiameter ?? 0"
              min="1"
              max="50"
              step="0.1"
              @input="updateStar('starDiameter', parseNumber($event))"
            />
            <span>{{ (config.drawStar.starDiameter ?? 0).toFixed(1) }} mm</span>
          </div>
        </label>
        <label>
          {{ t('stamp.star.horizontalPosition') }}:
          <div class="range-container">
            <input
              type="range"
              :value="config.drawStar.starPositionX ?? 0"
              min="-20"
              max="20"
              step="0.1"
              @input="updateStar('starPositionX', parseNumber($event))"
            />
            <span>{{ (config.drawStar.starPositionX ?? 0).toFixed(1) }} mm</span>
          </div>
        </label>
        <label>
          {{ t('stamp.star.verticalPosition') }}:
          <div class="range-container">
            <input
              type="range"
              :value="config.drawStar.starPositionY ?? 0"
              min="-10"
              max="10"
              step="0.1"
              @input="updateStar('starPositionY', parseNumber($event))"
            />
            <span>{{ (config.drawStar.starPositionY ?? 0).toFixed(1) }} mm</span>
          </div>
        </label>
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
</script>

<style scoped>
.range-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-container input[type='range'] {
  flex: 1;
}

.range-container span {
  min-width: 60px;
  text-align: right;
  font-size: 14px;
  color: #666;
}
</style>

