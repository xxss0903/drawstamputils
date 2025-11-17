<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.security.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <label>
        {{ t('stamp.security.enable') }}:
        <input
          type="checkbox"
          :checked="config.securityPattern.openSecurityPattern"
          @change="updateSecurityPattern('openSecurityPattern', ($event.target as HTMLInputElement).checked)"
        />
      </label>
      <button @click="refreshSecurityPattern">{{ t('stamp.security.refresh') }}</button>
      <label>
        {{ t('stamp.security.count') }}:
        <input
          type="range"
          :value="config.securityPattern.securityPatternCount"
          min="1"
          max="100"
          step="1"
          @input="updateSecurityPattern('securityPatternCount', parseNumber($event))"
        />
      </label>
      <label>
        {{ t('stamp.security.length') }}:
        <input
          type="range"
          :value="config.securityPattern.securityPatternLength"
          min="0.1"
          max="100"
          step="0.1"
          @input="updateSecurityPattern('securityPatternLength', parseNumber($event))"
        />
      </label>
      <label>
        {{ t('stamp.security.width') }}:
        <input
          type="range"
          :value="config.securityPattern.securityPatternWidth"
          min="0.05"
          max="0.5"
          step="0.05"
          @input="updateSecurityPattern('securityPatternWidth', parseNumber($event))"
        />
      </label>
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
</script>

