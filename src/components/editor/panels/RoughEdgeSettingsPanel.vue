<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.roughEdge.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <label class="checkbox-label">
        <input
          type="checkbox"
          :checked="config.roughEdge.drawRoughEdge"
          @change="updateRoughEdge('drawRoughEdge', ($event.target as HTMLInputElement).checked)"
        />
        {{ t('stamp.roughEdge.enable') }}
      </label>
      <template v-if="config.roughEdge.drawRoughEdge">
        <label>
          {{ t('stamp.roughEdge.width') }}:
          <input
            type="range"
            :value="config.roughEdge.roughEdgeWidth"
            min="0.05"
            max="0.5"
            step="0.05"
            @input="updateRoughEdge('roughEdgeWidth', parseNumber($event))"
          />
          <span>{{ config.roughEdge.roughEdgeWidth.toFixed(2) }}</span>
        </label>
        <label>
          {{ t('stamp.roughEdge.height') }}:
          <input
            type="range"
            :value="config.roughEdge.roughEdgeHeight"
            min="0.1"
            max="5"
            step="0.1"
            @input="updateRoughEdge('roughEdgeHeight', parseNumber($event))"
          />
          <span>{{ config.roughEdge.roughEdgeHeight.toFixed(1) }}</span>
        </label>
        <label>
          {{ t('stamp.roughEdge.probability') }}:
          <input
            type="range"
            :value="config.roughEdge.roughEdgeProbability"
            min="0"
            max="1"
            step="0.01"
            @input="updateRoughEdge('roughEdgeProbability', parseNumber($event))"
          />
          <span>{{ config.roughEdge.roughEdgeProbability.toFixed(2) }}</span>
        </label>
        <label>
          {{ t('stamp.roughEdge.shift') }}:
          <input
            type="range"
            :value="config.roughEdge.roughEdgeShift"
            min="-10"
            max="10"
            step="0.01"
            @input="updateRoughEdge('roughEdgeShift', parseNumber($event))"
          />
          <span>{{ config.roughEdge.roughEdgeShift.toFixed(2) }}</span>
        </label>
        <label>
          {{ t('stamp.roughEdge.points') }}:
          <input
            type="range"
            :value="config.roughEdge.roughEdgePoints"
            min="100"
            max="1000"
            step="10"
            @input="updateRoughEdge('roughEdgePoints', parseNumber($event))"
          />
          <span>{{ config.roughEdge.roughEdgePoints }}</span>
        </label>
        <button @click="refreshRoughEdge">{{ t('stamp.roughEdge.refresh') }}</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, IRoughEdge } from '../../../DrawStampTypes'

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
  (e: 'refresh-rough-edge'): void
}>()

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateRoughEdge = <K extends keyof IRoughEdge>(
  key: K,
  value: IRoughEdge[K]
) => {
  emit('update-config', (config) => {
    config.roughEdge[key] = value
  })
}

const refreshRoughEdge = () => {
  emit('refresh-rough-edge')
}
</script>

