<template>
  <div class="stamp-toolbar">
    <button v-if="showSaveTemplate" class="primary-button" @click="$emit('save-template')">
      {{ t('stamp.saveTemplate') }}
    </button>
    <button v-if="showReset" class="primary-button" @click="$emit('reset')">
      {{ t('stamp.resetStamp') }}
    </button>
    <button
      v-if="showDownload"
      class="primary-button"
      :class="{ disabled: downloadDisabled }"
      @click="$emit('download')"
      :disabled="downloadDisabled"
    >
      {{ t('stamp.downloadStamp') }}
      <span v-if="remainingSavesLabel" class="save-count-badge">
        {{ remainingSavesLabel }}
      </span>
    </button>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  showSaveTemplate?: boolean
  showReset?: boolean
  showDownload?: boolean
  downloadDisabled?: boolean
  remainingSaves?: number
  totalSaves?: number
}>(), {
  showSaveTemplate: true,
  showReset: true,
  showDownload: true,
  downloadDisabled: false,
  remainingSaves: -1,
  totalSaves: 3
})

defineEmits<{
  (e: 'save-template'): void
  (e: 'reset'): void
  (e: 'download'): void
}>()

const { t } = useI18n()

const remainingSavesLabel = computed(() => {
  if (props.remainingSaves === undefined || props.remainingSaves < 0) {
    return ''
  }
  return `(${props.remainingSaves}/${props.totalSaves})`
})
</script>

<style scoped>
.stamp-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
</style>

