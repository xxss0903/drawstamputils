<template>
  <div class="control-group">
    <div class="group-header" @click="$emit('toggle')">
      <h3>
        {{ t('stamp.basic.title') }}
        <span class="expand-icon" :class="{ expanded: expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <label class="checkbox-label">
        <input type="checkbox" v-model="state.isCircleDetect.value" />
        {{ t('stamp.basic.extractCircle') }}
      </label>
      <label>
        {{ t('stamp.basic.width') }}:
        <input
          type="number"
          v-model.number="state.drawStampWidth.value"
          min="1"
          max="50"
          step="0.1"
        />
      </label>
      <label>
        {{ t('stamp.basic.height') }}:
        <input
          type="number"
          v-model.number="state.drawStampHeight.value"
          min="1"
          max="50"
          step="0.1"
        />
      </label>
      <label>
        {{ t('stamp.basic.borderWidth') }}:
        <input
          type="number"
          step="0.1"
          v-model.number="state.circleBorderWidth.value"
        />
      </label>
      <label>
        {{ t('stamp.basic.color') }}:
        <input type="color" v-model="state.primaryColor.value" />
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="state.drawOutBorder.value" />
        {{ t('stamp.outBorder.enable') }}
      </label>
      <label v-if="state.drawOutBorder.value">
        {{ t('stamp.outBorder.lineWidth') }}:
        <input
          type="number"
          v-model.number="state.outBorderLineWidth.value"
          min="0.1"
          max="5"
          step="0.1"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Ref } from 'vue'

interface BasicState {
  isCircleDetect: Ref<boolean>
  drawStampWidth: Ref<number>
  drawStampHeight: Ref<number>
  circleBorderWidth: Ref<number>
  primaryColor: Ref<string>
  drawOutBorder: Ref<boolean>
  outBorderLineWidth: Ref<number>
}

const props = defineProps<{
  expanded: boolean
  state: BasicState
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const { t } = useI18n()
</script>

<style scoped>
.control-group {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.group-header {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
}

.group-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.expand-icon {
  transition: transform 0.2s ease;
  margin-left: 8px;
  font-size: 12px;
  color: #6b7280;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.group-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #374151;
  gap: 6px;
}

.checkbox-label {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

input[type='number'],
input[type='color'] {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[type='number']:focus,
input[type='color']:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  outline: none;
}
</style>

