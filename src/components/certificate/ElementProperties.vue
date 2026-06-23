<template>
  <div class="element-properties" v-if="element">
    <div class="property-group">
      <label>X (mm):</label>
      <input
        type="number"
        :value="element.x"
        @input="update('x', $event)"
        step="0.1"
      />
    </div>
    <div class="property-group">
      <label>Y (mm):</label>
      <input
        type="number"
        :value="element.y"
        @input="update('y', $event)"
        step="0.1"
      />
    </div>
    <div class="property-group" v-if="element.width !== undefined">
      <label>Width (mm):</label>
      <input
        type="number"
        :value="element.width"
        @input="update('width', $event)"
        min="0"
        step="0.1"
      />
    </div>
    <div class="property-group" v-if="element.height !== undefined">
      <label>Height (mm):</label>
      <input
        type="number"
        :value="element.height"
        @input="update('height', $event)"
        min="0"
        step="0.1"
      />
    </div>
    <div class="property-group" v-if="element.type === 'text'">
      <label>Text:</label>
      <textarea
        :value="element.text"
        @input="update('text', $event)"
        rows="3"
      ></textarea>
    </div>
    <div class="property-group" v-if="element.type === 'text'">
      <label>Font Size (mm):</label>
      <input
        type="number"
        :value="element.fontSize"
        @input="update('fontSize', $event)"
        min="1"
        step="0.1"
      />
    </div>
    <div class="property-group" v-if="element.type === 'text'">
      <label>Font Family:</label>
      <select
        :value="element.fontFamily"
        @change="update('fontFamily', $event)"
      >
        <option value="Arial">Arial</option>
        <option value="SimSun, serif">SimSun (宋体)</option>
        <option value="SimHei, sans-serif">SimHei (黑体)</option>
        <option value="KaiTi, serif">KaiTi (楷体)</option>
        <option value="Microsoft YaHei, sans-serif">Microsoft YaHei (微软雅黑)</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>
    </div>
    <div class="property-group" v-if="element.type === 'text'">
      <label>Font Weight:</label>
      <select
        :value="element.fontWeight"
        @change="update('fontWeight', $event)"
      >
        <option value="normal">Normal</option>
        <option value="bold">Bold</option>
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
    </div>
    <div class="property-group" v-if="element.type === 'text'">
      <label>Text Align:</label>
      <select
        :value="element.textAlign"
        @change="update('textAlign', $event)"
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>
    </div>
    <div class="property-group" v-if="element.type === 'text'">
      <label>Color:</label>
      <input
        type="color"
        :value="element.color"
        @input="update('color', $event)"
      />
    </div>
    <div class="property-group" v-if="element.type === 'line'">
      <label>Line Width (mm):</label>
      <input
        type="number"
        :value="element.lineWidth"
        @input="update('lineWidth', $event)"
        min="0.1"
        step="0.1"
      />
    </div>
    <div class="property-group" v-if="element.type === 'line'">
      <label>Line Color:</label>
      <input
        type="color"
        :value="element.lineColor"
        @input="update('lineColor', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICertificateElement } from '../../CertificateTypes'

const props = defineProps<{
  element: ICertificateElement | null
}>()

const emit = defineEmits<{
  (e: 'update', updates: Partial<ICertificateElement>): void
}>()

const update = (key: string, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  let value: any = target.value

  if (target.type === 'number') {
    value = parseFloat(value) || 0
  }

  emit('update', { [key]: value } as Partial<ICertificateElement>)
}
</script>

<style scoped>
.element-properties {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.property-group label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.property-group input,
.property-group textarea,
.property-group select {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
}

.property-group select {
  background: #fff;
  cursor: pointer;
}

.property-group textarea {
  resize: vertical;
  min-height: 60px;
}
</style>

