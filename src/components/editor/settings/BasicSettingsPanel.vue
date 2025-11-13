<template>
  <div class="control-group">
    <div class="group-header" @click="onToggle()">
      <h3>
        {{ t('stamp.basic.title') }}
        <span class="expand-icon" :class="{ expanded: isExpanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="isExpanded">
      <label class="checkbox-label">
        <input type="checkbox" v-model="isCircleDetect.value" />
        {{ t('stamp.basic.extractCircle') }}
      </label>
      <label>
        {{ t('stamp.basic.width') }}:
        <input type="number" v-model.number="drawStampWidth.value" min="1" max="50" step="1" />
      </label>
      <label>
        {{ t('stamp.basic.height') }}:
        <input type="number" v-model.number="drawStampHeight.value" min="1" max="50" step="1" />
      </label>
      <label>
        {{ t('stamp.basic.borderWidth') }}:
        <input type="number" step="0.1" v-model.number="circleBorderWidth.value" />
      </label>
      <label>
        {{ t('stamp.basic.color') }}:
        <input type="color" v-model="primaryColor.value" />
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="drawOutBorder.value" />
        {{ t('stamp.outBorder.enable') }}
      </label>
      <label v-if="drawOutBorder.value">
        {{ t('stamp.outBorder.lineWidth') }}:
        <input type="number" v-model.number="outBorderLineWidth.value" min="0.1" max="5" step="0.1" />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  isExpanded: boolean
  onToggle: () => void
  isCircleDetect: Ref<boolean>
  drawStampWidth: Ref<number>
  drawStampHeight: Ref<number>
  circleBorderWidth: Ref<number>
  primaryColor: Ref<string>
  drawOutBorder: Ref<boolean>
  outBorderLineWidth: Ref<number>
}

const props = defineProps<Props>()
const { t } = useI18n()

const {
  isExpanded,
  onToggle,
  isCircleDetect,
  drawStampWidth,
  drawStampHeight,
  circleBorderWidth,
  primaryColor,
  drawOutBorder,
  outBorderLineWidth
} = props
</script>
