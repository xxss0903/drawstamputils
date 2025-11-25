<template>
  <div class="contact-us">
    <div class="page-container">
    <div class="template-manage">
    <div class="manage-header">
      <div>
        <!-- <p class="sub-title">{{ t('templateManage.subtitle') }}</p> -->
        <h1>{{ t('templateManage.title') }}</h1>
        <div class="limit-info">
          <span v-if="isVip" class="vip-text">{{ t('templateManage.vipUnlimited') }}</span>
          <span v-else class="limit-text">
            {{ t('templateManage.remaining', { count: remainingSlots }) }}
          </span>
        </div>
      </div>
      <button
        class="upload-btn"
        :disabled="!canUploadMore"
        @click="openUploadDialog"
        :title="!canUploadMore ? t('templateManage.needVip') : ''"
      >
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
        <div class="template-preview-wrapper">
          <img
            v-if="template.localPreviewUrl || template.preview_url"
            :src="template.localPreviewUrl || template.preview_url"
            :alt="template.name"
            loading="lazy"
          />
          <div v-else class="preview-placeholder">
            <span>{{ template.name.charAt(0) }}</span>
          </div>
        </div>

        <div class="template-card-header">
          <div class="template-title">
            <h3>{{ template.name }}</h3>
            <span v-if="isTemplateShared(template.id)" class="badge badge-shared">
              {{ t('templateManage.sharedBadge') }}
            </span>
          </div>
          <span class="template-size">{{ formatFileSize(template.file_size) }}</span>
        </div>

        <p v-if="template.description" class="description">
          {{ template.description }}
        </p>
        <p v-else class="description muted">
          {{ t('templateManage.noDescription') }}
        </p>

        <div class="template-meta">
          <span class="meta-chip">
            <span class="icon">📅</span>
            {{ formatDate(template.created_at) }}
          </span>
          <!-- <span class="meta-chip">
            <span class="icon">📦</span>
            {{ formatFileSize(template.file_size) }}
          </span> -->
        </div>

        <div class="template-actions">
          <button @click="loadTemplate(template.id)" class="btn btn-primary">
            {{ t('templateManage.load') }}
          </button>
          <button
            @click="shareTemplate(template)"
            class="btn btn-share"
            :disabled="isTemplateShared(template.id) || isSharingTemplate(template.id)"
            :title="isTemplateShared(template.id) ? t('templateManage.sharedTooltip') : ''"
          >
            <span v-if="isSharingTemplate(template.id)">...</span>
            <span v-else>
              {{ isTemplateShared(template.id) ? t('templateManage.sharedBadge') : t('templateManage.share') }}
            </span>
          </button>
          <button @click="editTemplate(template)" class="btn btn-outline">
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
            <input type="file" @change="handleTemplateFileSelect" accept=".json" required />
          </div>
          <div class="form-group">
            <label>{{ t('templateManage.previewImage') }}</label>
            <input type="file" @change="handlePreviewSelect" accept="image/*" required />
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
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { templateApi, publicTemplateApi, type Template } from '../utils/api'
import type { IDrawStampConfig } from '../DrawStampTypes'
import { useUserStore } from '../stores/userStore'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
userStore.initAuth?.()

type TemplateWithPreview = Template & { localPreviewUrl?: string }

const templates = ref<TemplateWithPreview[]>([])
const loading = ref(false)
const error = ref('')
const sharedTemplateIds = ref<Set<string>>(new Set())
const sharingTemplateIds = ref<Set<string>>(new Set())
const previewObjectUrls = new Map<string, string>()
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
  preview: null as File | null,
})

const editForm = ref({
  name: '',
  description: '',
})

const MAX_TEMPLATES = 5
const isVip = computed(() => Boolean((userStore.user?.value as any)?.is_vip))
const remainingSlots = computed(() => {
  if (isVip.value) return Infinity
  return Math.max(0, MAX_TEMPLATES - templates.value.length)
})
const canUploadMore = computed(() => isVip.value || remainingSlots.value > 0)

onMounted(() => {
  loadTemplates()
})

onUnmounted(() => {
  previewObjectUrls.forEach(url => URL.revokeObjectURL(url))
  previewObjectUrls.clear()
})

const loadTemplates = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await templateApi.getTemplates()
    if (response.success && response.data) {
      const templateData = response.data as TemplateWithPreview[]
      await Promise.all(templateData.map(resolveTemplatePreview))
      templates.value = templateData
      await loadSharedTemplates()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('templateManage.loadError')
  } finally {
    loading.value = false
  }
}

const resolveTemplatePreview = async (template: TemplateWithPreview) => {
  if (!template.preview_url) return
  if (previewObjectUrls.has(template.preview_url)) {
    template.localPreviewUrl = previewObjectUrls.get(template.preview_url)!
    return
  }

  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(template.preview_url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: 'include',
    })
    if (!response.ok) {
      console.warn('加载预览图失败', template.preview_url)
      return
    }
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    previewObjectUrls.set(template.preview_url, objectUrl)
    template.localPreviewUrl = objectUrl
  } catch (error) {
    console.error('获取预览图失败', error)
  }
}

const loadSharedTemplates = async () => {
  const currentUser = userStore.user?.value
  if (!currentUser) return

  try {
    const response = await publicTemplateApi.getPublicTemplates(200, 0, 'created_at')
    if (response.success && response.data) {
      const sharedIds = response.data
        .filter(template => template.user_id === currentUser.id && template.source_template_id)
        .map(template => template.source_template_id as string)
      sharedTemplateIds.value = new Set(sharedIds)
    }
  } catch (error) {
    console.error('Failed to load shared templates', error)
  }
}

const handleTemplateFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    uploadForm.value.file = input.files[0]
    if (!uploadForm.value.name) {
      const fileName = input.files[0].name
      uploadForm.value.name = fileName.replace(/\.[^.]+$/, '')
    }
  }
}

const handlePreviewSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    uploadForm.value.preview = input.files[0]
  }
}

const openUploadDialog = () => {
  if (!canUploadMore.value) {
    alert(t('templateManage.needVip'))
    return
  }
  showUploadDialog.value = true
}

const handleUpload = async () => {
  if (!uploadForm.value.file || !uploadForm.value.preview) {
    uploadError.value = t('templateManage.previewRequired')
    return
  }

  uploading.value = true
  uploadError.value = ''
  try {
    const response = await templateApi.uploadTemplate(
      uploadForm.value.name,
      uploadForm.value.description || undefined,
      uploadForm.value.file,
      uploadForm.value.preview
    )
    if (response.success) {
      showUploadDialog.value = false
      uploadForm.value = { name: '', description: '', file: null, preview: null }
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
  if (isTemplateShared(template.id) || isSharingTemplate(template.id)) {
    alert(t('templateManage.sharedTooltip'))
    return
  }

  if (!confirm(t('templateManage.shareConfirm'))) return

  try {
    sharingTemplateIds.value.add(template.id)
    const response = await publicTemplateApi.shareTemplate(
      template.id,
      template.name,
      template.description
    )
    if (response.success) {
      alert(t('templateManage.shareSuccess'))
      await loadSharedTemplates()
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : t('templateManage.shareError'))
  } finally {
    sharingTemplateIds.value.delete(template.id)
  }
}

const isTemplateShared = (templateId: string) => sharedTemplateIds.value.has(templateId)
const isSharingTemplate = (templateId: string) => sharingTemplateIds.value.has(templateId)

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
  align-items: flex-end;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.limit-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #475467;
}

.limit-text {
  font-weight: 500;
}

.vip-text {
  color: #2563eb;
  font-weight: 600;
}

.manage-header h1 {
  margin: 0;
  color: #0f172a;
  font-size: 2rem;
  font-weight: 700;
}

.sub-title {
  margin: 0 0 0.25rem 0;
  color: #64748b;
  font-size: 0.95rem;
}

.upload-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px rgba(99, 102, 241, 0.35);
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.error {
  color: #dc2626;
}

.template-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.template-item {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.template-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 18px rgba(15, 23, 42, 0.12);
}

.template-preview-wrapper {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-preview-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #94a3b8;
}

.template-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.template-card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.template-size {
  font-size: 0.9rem;
  color: #94a3b8;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-shared {
  background: rgba(59, 130, 246, 0.15);
  color: #1d4ed8;
}

.description {
  background: #f8fafc;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  margin: 0;
  color: #475467;
  line-height: 1.5;
  height: 50px;
}

.description.muted {
  color: #94a3b8;
  font-style: italic;
}

.template-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.meta-chip {
  background: #eef2ff;
  color: #4f46e5;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.template-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

.btn {
  padding: 0.55rem 1rem;
  border: none;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #0ea5e9;
  color: white;
}

.btn-primary:hover {
  background: #0284c7;
}

.btn-share {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.btn-share:hover {
  filter: brightness(0.95);
}

.btn-outline {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475467;
}

.btn-outline:hover {
  background: #f8fafc;
  color: #111827;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
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
  background-color: rgba(15, 23, 42, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.dialog {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.25);
}

.dialog h2 {
  margin: 0 0 1.5rem 0;
  color: #111827;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #334155;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.error-message {
  padding: 0.75rem;
  background-color: #fef2f2;
  color: #b91c1c;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .template-manage {
    padding: 1.25rem;
  }

  .template-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>

