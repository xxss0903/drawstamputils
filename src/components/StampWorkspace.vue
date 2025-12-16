<template>
  <div class="main-workspace">
    <ElementList
      v-if="isReady"
      :drawStampUtils="drawStampUtils"
      @selectElement="(elementId, elementType, index) => $emit('select-element', elementId, elementType, index)"
      @update-config="$emit('update-config')"
      @refresh="$emit('refresh')"
    />

    <div class="canvas-area">
      <div class="canvas-header">
        <div class="canvas-tabs">
          <div class="canvas-tab active">
            <span>Canvas #0</span>
          </div>
        </div>
      </div>
      <div class="canvas-wrapper">
        <canvas :ref="setCanvasRef" width="600" height="600"></canvas>
      </div>
      <div class="canvas-footer">
        <slot name="canvas-footer-left" />
        <button
          v-if="showDownloadButton"
          class="canvas-action-btn"
          @click="$emit('download')"
          :title="downloadTitle"
          :disabled="downloadDisabled"
        >
          <span>💾</span>
          <span v-if="downloadBadge" class="save-count-small">
            {{ downloadBadge }}
          </span>
        </button>
      </div>
    </div>

    <PropertiesPanel
      v-if="isReady"
      :ref="setPropertiesPanelRef"
      :drawStampUtils="drawStampUtils"
      :selectedElement="selectedElement"
      :elementType="selectedElementType"
      :elementIndex="selectedElementIndex"
      @updateDrawStamp="$emit('update-draw-stamp')"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import ElementList from './editor/ElementList.vue'
import PropertiesPanel from './editor/PropertiesPanel.vue'
import { DrawStampUtils } from '../DrawStampUtils'

const props = withDefaults(defineProps<{
  isReady: boolean
  drawStampUtils: DrawStampUtils | null
  selectedElement: string
  selectedElementType: string
  selectedElementIndex: number
  canvasRef: Ref<HTMLCanvasElement | null>
  propertiesPanelRef: Ref<InstanceType<typeof PropertiesPanel> | null>
  downloadTitle?: string
  downloadBadge?: string
  downloadDisabled?: boolean
  showDownloadButton?: boolean
}>(), {
  downloadTitle: 'Download',
  downloadBadge: undefined,
  downloadDisabled: false,
  showDownloadButton: true
})

defineEmits<{
  (e: 'select-element', id: string, type: string, index: number): void
  (e: 'update-config'): void
  (e: 'refresh'): void
  (e: 'update-draw-stamp'): void
  (e: 'download'): void
}>()

const setCanvasRef = (el: HTMLCanvasElement | null) => {
  props.canvasRef.value = el
}

const setPropertiesPanelRef = (el: InstanceType<typeof PropertiesPanel> | null) => {
  props.propertiesPanelRef.value = el
}
</script>

