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
          <input
            type="number"
            :value="config.drawStar.starDiameter"
            step="0.1"
            @input="updateStar('starDiameter', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.star.verticalPosition') }}:
          <input
            type="number"
            :value="config.drawStar.starPositionY"
            min="-10"
            max="10"
            step="0.1"
            @input="updateStar('starPositionY', parseNumber($event))"
          />
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

