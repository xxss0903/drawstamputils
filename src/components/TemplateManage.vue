<template>
  <div class="template-manage">
    <div class="manage-header">
      <h1>{{ t('templateManage.title') }}</h1>
      <button class="upload-btn" @click="showUploadDialog = true">
        {{ t('templateManage.upload') }}
      </button>
    </div>

    <div v-if="loading" class="loading">{{ t('templateManage.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="templates.length === 0" class="empty">
      {{ t('templateManage.empty') }}
    </div>
    <div v-else class="template-list">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-item"
      >
        <div class="template-info">
          <h3>{{ template.name }}</h3>
          <p v-if="template.description" class="description">{{ template.description }}</p>
          <div class="meta">
            <span>{{ formatDate(template.created_at) }}</span>
            <span>{{ formatFileSize(template.file_size) }}</span>
          </div>
        </div>
        <div class="template-actions">
          <button @click="loadTemplate(template.id)" class="btn btn-primary">
            {{ t('templateManage.load') }}
          </button>
          <button @click="shareTemplate(template)" class="btn btn-share">
            {{ t('templateManage.share') }}
          </button>
          <button @click="editTemplate(template)" class="btn btn-secondary">
            {{ t('templateManage.edit') }}
          </button>
          <button @click="deleteTemplate(template.id)" class="btn btn-danger">
            {{ t('templateManage.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 上传对话框 -->
    <div v-if="showUploadDialog" class="dialog-overlay" @click.self="showUploadDialog = false">
      <div class="dialog">
        <h2>{{ t('templateManage.uploadTitle') }}</h2>
        <form @submit.prevent="handleUpload">
          <div class="form-group">
            <label>{{ t('templateManage.name') }}</label>
            <input v-model="uploadForm.name" required />
          </div>
          <div class="form-group">
            <label>{{ t('templateManage.description') }}</label>
            <textarea v-model="uploadForm.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>{{ t('templateManage.file') }}</label>
            <input type="file" @change="handleFileSelect" accept=".json" required />
          </div>
          <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
          <div class="dialog-actions">
            <button type="button" @click="showUploadDialog = false" class="btn btn-secondary">
              {{ t('templateManage.cancel') }}
            </button>
            <button type="submit" :disabled="uploading" class="btn btn-primary">
              <span v-if="uploading">{{ t('templateManage.uploading') }}</span>
              <span v-else>{{ t('templateManage.upload') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <div v-if="editingTemplate" class="dialog-overlay" @click.self="editingTemplate = null">
      <div class="dialog">
        <h2>{{ t('templateManage.editTitle') }}</h2>
        <form @submit.prevent="handleUpdate">
          <div class="form-group">
            <label>{{ t('templateManage.name') }}</label>
            <input v-model="editForm.name" required />
          </div>
          <div class="form-group">
            <label>{{ t('templateManage.description') }}</label>
            <textarea v-model="editForm.description" rows="3"></textarea>
          </div>
          <div v-if="editError" class="error-message">{{ editError }}</div>
          <div class="dialog-actions">
            <button type="button" @click="editingTemplate = null" class="btn btn-secondary">
              {{ t('templateManage.cancel') }}
            </button>
            <button type="submit" :disabled="updating" class="btn btn-primary">
              <span v-if="updating">{{ t('templateManage.updating') }}</span>
              <span v-else>{{ t('templateManage.save') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { templateApi, publicTemplateApi, type Template } from '../utils/api'
import type { IDrawStampConfig } from '../DrawStampTypes'

const { t } = useI18n()
const router = useRouter()

const templates = ref<Template[]>([])
const loading = ref(false)
const error = ref('')
const showUploadDialog = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const editingTemplate = ref<Template | null>(null)
const updating = ref(false)
const editError = ref('')

const uploadForm = ref({
  name: '',
  description: '',
  file: null as File | null,
})

const editForm = ref({
  name: '',
  description: '',
})

onMounted(() => {
  loadTemplates()
})

const loadTemplates = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await templateApi.getTemplates()
    if (response.success && response.data) {
      templates.value = response.data
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('templateManage.loadError')
  } finally {
    loading.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    uploadForm.value.file = input.files[0]
  }
}

const handleUpload = async () => {
  if (!uploadForm.value.file) return

  uploading.value = true
  uploadError.value = ''
  try {
    const response = await templateApi.uploadTemplate(
      uploadForm.value.name,
      uploadForm.value.description || undefined,
      uploadForm.value.file
    )
    if (response.success) {
      showUploadDialog.value = false
      uploadForm.value = { name: '', description: '', file: null }
      loadTemplates()
    }
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : t('templateManage.uploadError')
  } finally {
    uploading.value = false
  }
}

const editTemplate = (template: Template) => {
  editingTemplate.value = template
  editForm.value = {
    name: template.name,
    description: template.description || '',
  }
}

const handleUpdate = async () => {
  if (!editingTemplate.value) return

  updating.value = true
  editError.value = ''
  try {
    const response = await templateApi.updateTemplate(
      editingTemplate.value.id,
      editForm.value.name,
      editForm.value.description || undefined
    )
    if (response.success) {
      editingTemplate.value = null
      loadTemplates()
    }
  } catch (err) {
    editError.value = err instanceof Error ? err.message : t('templateManage.updateError')
  } finally {
    updating.value = false
  }
}

const deleteTemplate = async (id: string) => {
  if (!confirm(t('templateManage.deleteConfirm'))) return

  try {
    const response = await templateApi.deleteTemplate(id)
    if (response.success) {
      loadTemplates()
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : t('templateManage.deleteError'))
  }
}

const loadTemplate = async (id: string) => {
  try {
    const response = await templateApi.getTemplate(id)
    if (response.success && response.data && response.data.content) {
      const config = JSON.parse(response.data.content) as IDrawStampConfig
      // 将配置保存到 localStorage 或通过事件传递给编辑器
      localStorage.setItem('stamp_config', JSON.stringify(config))
      router.push('/maker')
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : t('templateManage.loadError'))
  }
}

const shareTemplate = async (template: Template) => {
  if (!confirm(t('templateManage.shareConfirm'))) return

  try {
    const response = await publicTemplateApi.shareTemplate(
      template.id,
      template.name,
      template.description
    )
    if (response.success) {
      alert(t('templateManage.shareSuccess'))
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : t('templateManage.shareError'))
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
</script>

<style scoped>
.template-manage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.manage-header h1 {
  margin: 0;
  color: #333;
}

.upload-btn {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #0056b3;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #c33;
}

.template-list {
  display: grid;
  gap: 1.5rem;
}

.template-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.template-info {
  flex: 1;
}

.template-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.description {
  color: #666;
  margin: 0.5rem 0;
}

.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #999;
  margin-top: 0.5rem;
}

.template-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-share {
  background-color: #28a745;
  color: white;
}

.btn-share:hover {
  background-color: #218838;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.dialog {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.error-message {
  padding: 0.75rem;
  background-color: #fee;
  color: #c33;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.dialog-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .template-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .template-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .btn {
    flex: 1;
    min-width: 80px;
  }
}
</style>

