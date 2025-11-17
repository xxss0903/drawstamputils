<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.innerCircle.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <button @click="addInnerCircle">{{ t('stamp.innerCircle.addNew') }}</button>
      <div v-for="(innerCircle, index) in innerCircleList" :key="index" class="inner-circle-item">
        <div class="inner-circle-header">
          <span>第 {{ index + 1 }} 行</span>
          <button class="small-button delete-button" @click="removeInnerCircle(index)">删除</button>
        </div>
        <label>
          {{ t('stamp.innerCircle.lineWidth') }}:
          <input
            type="number"
            :value="innerCircle.innerCircleLineWidth"
            min="0.05"
            max="0.5"
            step="0.05"
            @input="updateInnerCircle(index, 'innerCircleLineWidth', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.innerCircle.radiusX') }}:
          <input
            type="number"
            :value="innerCircle.innerCircleLineRadiusX"
            min="1"
            max="50"
            step="0.1"
            @input="updateInnerCircle(index, 'innerCircleLineRadiusX', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.innerCircle.radiusY') }}:
          <input
            type="number"
            :value="innerCircle.innerCircleLineRadiusY"
            min="1"
            max="50"
            step="0.1"
            @input="updateInnerCircle(index, 'innerCircleLineRadiusY', parseNumber($event))"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, IInnerCircle } from '../../../DrawStampTypes'

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const innerCircleList = computed(() => props.config.innerCircleList || [])

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateInnerCircle = <K extends keyof IInnerCircle>(
  index: number,
  key: K,
  value: IInnerCircle[K]
) => {
  emit('update-config', (config) => {
    const list = config.innerCircleList || []
    if (!list[index]) return
    list[index][key] = value
  })
}

const removeInnerCircle = (index: number) => {
  emit('update-config', (config) => {
    config.innerCircleList?.splice(index, 1)
  })
}

const addInnerCircle = () => {
  emit('update-config', (config) => {
    if (!config.innerCircleList) {
      config.innerCircleList = []
    }
    config.innerCircleList.push({
      drawInnerCircle: true,
      innerCircleLineWidth: 0.5,
      innerCircleLineRadiusX: 16,
      innerCircleLineRadiusY: 12
    })
  })
}
</script>

