<template>
  <div class="public-templates">
    <div class="templates-header">
      <h1>{{ t('publicTemplates.title') }}</h1>
      <div class="header-actions">
        <div class="filter-tabs">
          <button
            class="tab-btn"
            :class="{ active: currentTab === 'all' }"
            @click="currentTab = 'all'"
          >
            {{ t('publicTemplates.all') }}
          </button>
          <button
            v-if="userStore.isAuthenticated.value"
            class="tab-btn"
            :class="{ active: currentTab === 'collections' }"
            @click="currentTab = 'collections'"
          >
            {{ t('publicTemplates.myCollections') }}
          </button>
        </div>
        <select v-model="orderBy" @change="loadTemplates" class="order-select">
          <option value="created_at">{{ t('publicTemplates.sortByDate') }}</option>
          <option value="collect_count">{{ t('publicTemplates.sortByCollect') }}</option>
          <option value="view_count">{{ t('publicTemplates.sortByView') }}</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('publicTemplates.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="templates.length === 0" class="empty">
      {{ t('publicTemplates.empty') }}
    </div>
    <div v-else class="template-grid">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-card"
      >
        <div class="template-badge" v-if="template.is_system">
          {{ t('publicTemplates.systemTemplate') }}
        </div>
        <div class="template-header">
          <h3>{{ template.name }}</h3>
          <button
            v-if="userStore.isAuthenticated.value"
            @click="toggleCollect(template)"
            class="collect-btn"
            :class="{ collected: template.is_collected }"
            :title="template.is_collected ? t('publicTemplates.uncollect') : t('publicTemplates.collect')"
          >
            {{ template.is_collected ? '★' : '☆' }}
          </button>
        </div>
        <p v-if="template.description" class="description">{{ template.description }}</p>
        <div class="template-meta">
          <span>{{ formatDate(template.created_at) }}</span>
          <span>{{ formatFileSize(template.file_size) }}</span>
          <span v-if="template.author_email">{{ t('publicTemplates.by') }} {{ template.author_email }}</span>
        </div>
        <div class="template-stats">
          <span>👁️ {{ template.view_count }}</span>
          <span>⭐ {{ template.collect_count }}</span>
        </div>
        <div class="template-actions">
          <button @click="loadTemplate(template.id)" class="btn btn-primary">
            {{ t('publicTemplates.load') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { publicTemplateApi, type PublicTemplate } from '../utils/api'
import type { IDrawStampConfig } from '../DrawStampTypes'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const templates = ref<PublicTemplate[]>([])
const loading = ref(false)
const error = ref('')
const currentTab = ref<'all' | 'collections'>('all')
const orderBy = ref<'created_at' | 'collect_count' | 'view_count'>('created_at')

onMounted(() => {
  loadTemplates()
})

watch(currentTab, () => {
  loadTemplates()
})

const loadTemplates = async () => {
  loading.value = true
  error.value = ''
  try {
    let response
    if (currentTab.value === 'collections') {
      response = await publicTemplateApi.getCollections()
    } else {
      response = await publicTemplateApi.getPublicTemplates(50, 0, orderBy.value)
    }
    if (response.success && response.data) {
      templates.value = response.data
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('publicTemplates.loadError')
  } finally {
    loading.value = false
  }
}

const toggleCollect = async (template: PublicTemplate) => {
  if (!userStore.isAuthenticated.value) {
    return
  }

  try {
    let response
    if (template.is_collected) {
      response = await publicTemplateApi.uncollectTemplate(template.id)
    } else {
      response = await publicTemplateApi.collectTemplate(template.id)
    }

    if (response.success) {
      template.is_collected = !template.is_collected
      if (template.is_collected) {
        template.collect_count++
      } else {
        template.collect_count = Math.max(0, template.collect_count - 1)
      }
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : t('publicTemplates.collectError'))
  }
}

const loadTemplate = async (id: string) => {
  try {
    const response = await publicTemplateApi.getPublicTemplate(id)
    if (response.success && response.data && response.data.content) {
      const config = JSON.parse(response.data.content) as IDrawStampConfig
      localStorage.setItem('stamp_config', JSON.stringify(config))
      router.push('/maker')
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : t('publicTemplates.loadError'))
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
.public-templates {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.templates-header {
  margin-bottom: 2rem;
}

.templates-header h1 {
  margin: 0 0 1rem 0;
  color: #333;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover {
  background: #f5f5f5;
}

.tab-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.order-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.template-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.template-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

.template-header h3 {
  margin: 0;
  color: #333;
  flex: 1;
}

.collect-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
  padding: 0;
  line-height: 1;
}

.collect-btn:hover {
  color: #ffc107;
}

.collect-btn.collected {
  color: #ffc107;
}

.description {
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.template-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #999;
  margin: 0.5rem 0;
}

.template-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0;
}

.template-actions {
  margin-top: 1rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
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

@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

