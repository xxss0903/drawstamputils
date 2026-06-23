<template>
  <div class="certificate-maker">
    <div class="maker-tabs">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'editor' }"
        @click="activeTab = 'editor'"
      >
        {{ t('certificate.tabs.editor') }}
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'batch' }"
        @click="activeTab = 'batch'"
        :disabled="!template"
      >
        {{ t('certificate.tabs.batch') }}
      </button>
    </div>

    <div class="maker-content">
      <CertificateEditor
        v-if="activeTab === 'editor'"
        @template-updated="handleTemplateUpdated"
      />
      <BatchGenerator
        v-if="activeTab === 'batch'"
        :template="template"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CertificateEditor from './CertificateEditor.vue'
import BatchGenerator from './BatchGenerator.vue'
import type { ICertificateTemplate } from '../../CertificateTypes'

const { t } = useI18n()

const activeTab = ref<'editor' | 'batch'>('editor')
const template = ref<ICertificateTemplate | null>(null)

const handleTemplateUpdated = (updatedTemplate: ICertificateTemplate) => {
  template.value = updatedTemplate
}
</script>

<style scoped>
.certificate-maker {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.maker-tabs {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
}

.tab-button {
  padding: 12px 24px;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover:not(:disabled) {
  color: #374151;
  background: #f9fafb;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.maker-content {
  flex: 1;
  overflow: hidden;
}
</style>

