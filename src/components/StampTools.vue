<template>
  <div class="stamp-tools">
    <button class="primary-button" v-if="showSaveTemplate" @click="$emit('save-template')">
      {{ t('stamp.saveTemplate') }}
    </button>
    <button class="primary-button" v-if="showReset" @click="$emit('reset')">
      {{ t('stamp.resetStamp') }}
    </button>
    <button
      class="primary-button"
      :class="{ disabled: downloadDisabled }"
      :title="downloadTitle"
      :disabled="downloadDisabled"
      @click="$emit('download')"
    >
      {{ t('stamp.downloadStamp') }}
      <span v-if="downloadBadge" class="save-count-badge">({{ downloadBadge }})</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  downloadTitle: string
  downloadDisabled: boolean
  downloadBadge?: string | null
  showSaveTemplate?: boolean
  showReset?: boolean
}>()

defineEmits(['download', 'reset', 'save-template'])

const { t } = useI18n()
</script>

<style scoped>
.stamp-tools {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>

