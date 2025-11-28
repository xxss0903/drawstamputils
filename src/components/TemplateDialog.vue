<template>
  <div v-if="show" class="template-dialog-overlay">
    <div class="template-dialog">
      <div class="template-dialog-header">
        <h3>{{ t('stamp.template.title') }}</h3>
        <button class="close-button" @click="onClose">×</button>
      </div>
      <div class="template-dialog-content">
        <div class="template-list">
          <!-- 默认模板 -->
          <div class="template-category">
            <h4>{{ t('stamp.template.defaultTitle') }}</h4>
            <div class="template-grid">
              <div v-for="(template, index) in templates" 
                   :key="'default-' + index" 
                   class="template-item"
                   :class="{ 'active': currentIndex === (-1 - index) }"
                   @click="onSelectTemplate(template)">
                <div class="template-preview">
                  <img :src="template.preview" :alt="t('stamp.template.preview')" />
                </div>
                <div class="template-info">
                  <span class="template-name">{{ template.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 公共模板 -->
          <div class="template-category">
            <h4>{{ t('stamp.template.publicTemplates') }}</h4>
            <div v-if="loadingPublicTemplates" class="loading-text">
              {{ t('stamp.template.loadingPublicTemplates') }}
            </div>
            <div v-else-if="publicTemplatesError" class="error-text">
              {{ publicTemplatesError }}
            </div>
            <div v-else-if="publicTemplates.length === 0" class="empty-text">
              {{ t('stamp.template.noPublicTemplates') }}
            </div>
            <div v-else class="template-grid">
              <div v-for="template in publicTemplates" 
                   :key="'public-' + template.id" 
                   class="template-item public-template-item"
                   :class="{ 'active': selectedPublicTemplateId === template.id }"
                   @click="onSelectPublicTemplate(template)">
                <div class="template-badge" v-if="template.is_system">
                  {{ t('publicTemplates.systemTemplate') }}
                </div>
                <div class="template-preview">
                  <img
                    v-if="template.preview_url"
                    :src="template.preview_url"
                    :alt="template.name"
                    loading="lazy"
                  />
                  <div v-else class="template-placeholder">
                    {{ template.name.charAt(0) }}
                  </div>
                </div>
                <div class="template-info">
                  <span class="template-name">{{ template.name }}</span>
                  <span v-if="template.description" class="template-description">{{ template.description }}</span>
                  <div class="template-stats">
                    <span>👁️ {{ template.view_count }}</span>
                    <span>⭐ {{ template.collect_count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="template-dialog-footer">
        <input 
          type="file" 
          ref="templateFileInput"
          style="display: none"
          accept=".json"
          @change="loadTemplateFile"
        />
        <div class="footer-buttons">
          <button class="load-template" @click="triggerTemplateLoad">
            {{ t('stamp.template.load') }}
          </button>
          <button class="add-template" @click="saveAsTemplate">
            {{ t('stamp.template.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { IDrawStampConfig } from '../DrawStampTypes'
import { publicTemplateApi, type PublicTemplate } from '../utils/api'
import { useUserStore } from '../stores/userStore'

const { t } = useI18n()
const userStore = useUserStore()
const templateFileInput = ref<HTMLInputElement | null>(null)

const publicTemplates = ref<PublicTemplate[]>([])
const loadingPublicTemplates = ref(false)
const publicTemplatesError = ref('')
const selectedPublicTemplateId = ref<string | null>(null)

interface Template {
  name: string
  preview: string
  config: IDrawStampConfig
}

interface Props {
  show: boolean
  templates: Template[]
  currentIndex: number
  drawStampUtils: any // 添加 drawStampUtils 属性
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save'): void
  (e: 'select', template: Template): void
  (e: 'update'): void
}>()

const onClose = () => {
  emit('close')
}

const onSelectTemplate = (template: Template) => {
  selectedPublicTemplateId.value = null
  emit('select', template)
}

const onSelectPublicTemplate = async (template: PublicTemplate) => {
  selectedPublicTemplateId.value = template.id
  loadingPublicTemplates.value = true
  
  try {
    const response = await publicTemplateApi.getPublicTemplate(template.id)
    if (response.success && response.data && response.data.content) {
      const config = JSON.parse(response.data.content) as IDrawStampConfig

      const templateObj: Template = {
        name: template.name,
        preview: template.preview_url || '',
        config,
      }
      
      emit('select', templateObj)
    }
  } catch (err) {
    console.error('加载公共模板失败:', err)
    alert(err instanceof Error ? err.message : t('stamp.template.loadPublicTemplateError'))
    selectedPublicTemplateId.value = null
  } finally {
    loadingPublicTemplates.value = false
  }
}

const loadPublicTemplates = async () => {
  loadingPublicTemplates.value = true
  publicTemplatesError.value = ''
  
  try {
    const response = await publicTemplateApi.getPublicTemplates(20, 0, 'collect_count')
    if (response.success && response.data) {
      publicTemplates.value = response.data
    }
  } catch (err) {
    publicTemplatesError.value = err instanceof Error ? err.message : t('stamp.template.loadPublicTemplatesError')
  } finally {
    loadingPublicTemplates.value = false
  }
}

// 当对话框显示时加载公共模板
watch(() => props.show, (newVal) => {
  if (newVal && publicTemplates.value.length === 0) {
    loadPublicTemplates()
  }
})

onMounted(() => {
  if (props.show) {
    loadPublicTemplates()
  }
})

// 清理未启用的效果数组，减小模板文件大小
const cleanConfigForTemplate = (config: IDrawStampConfig): IDrawStampConfig => {
  const cleanedConfig = JSON.parse(JSON.stringify(config)) as IDrawStampConfig
  
  // 如果做旧效果未开启，删除做旧参数数组
  if (cleanedConfig.agingEffect && !cleanedConfig.agingEffect.applyAging) {
    (cleanedConfig.agingEffect as any).agingEffectParams = undefined
  }
  
  // 如果毛边效果未开启，删除毛边参数数组
  if (cleanedConfig.roughEdge && !cleanedConfig.roughEdge.drawRoughEdge) {
    (cleanedConfig.roughEdge as any).roughEdgeParams = undefined
  }
  
  // 如果防伪纹路未开启，删除防伪纹路参数数组
  if (cleanedConfig.securityPattern && !cleanedConfig.securityPattern.openSecurityPattern) {
    (cleanedConfig.securityPattern as any).securityPatternParams = undefined
  }
  
  return cleanedConfig
}

// 保存当前模板
const saveAsTemplate = () => {
  if (!props.drawStampUtils) return
  
  const drawConfigs = props.drawStampUtils.getDrawConfigs()
  // 清理未启用的效果数组
  const cleanedConfig = cleanConfigForTemplate(drawConfigs)
  // 使用紧凑格式（无缩进和换行）来减小文件大小，并排除 undefined 字段
  const jsonStr = JSON.stringify(cleanedConfig, (_key, value) => {
    // JSON.stringify 会自动排除 undefined 值，所以直接返回 value 即可
    return value
  })

  // 创建 Blob
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // 创建下载链接
  const link = document.createElement('a')
  link.href = url
  link.download = 'stamp_template.json'
  document.body.appendChild(link)
  link.click()

  // 清理
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 触发文件选择
const triggerTemplateLoad = () => {
  // 检查登录状态，未登录用户无法导入模板
  if (!userStore.isAuthenticated.value) {
    alert(t('stamp.needLoginForImport'))
    return
  }
  templateFileInput.value?.click()
}

// 加载模板文件
const loadTemplateFile = async (event: Event) => {
  // 检查登录状态，未登录用户无法导入模板
  if (!userStore.isAuthenticated.value) {
    alert(t('stamp.needLoginForImport'))
    const input = event.target as HTMLInputElement
    if (input) {
      input.value = '' // 清空文件选择
    }
    return
  }
  
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  try {
    const file = input.files[0]
    const text = await file.text()
    const config = JSON.parse(text) as IDrawStampConfig

    // 设置新的配置
    if (props.drawStampUtils) {
      props.drawStampUtils.setDrawConfigs(config)
      emit('update') // 通知父组件更新
    }
  } catch (error) {
    console.error(t('errors.loadTemplateError') + ':', error)
    alert(t('errors.loadTemplateError'))
  }

  // 清除文件选择
  input.value = ''
}
</script>

<style scoped>
.template-dialog-overlay {
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

.template-dialog {
  background-color: white;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.template-dialog-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.template-dialog-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  text-align: right;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

.template-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.template-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.template-item.active {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.public-template-item {
  position: relative;
}

.template-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #28a745;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  z-index: 1;
}

.template-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 4px;
}

.template-description {
  font-size: 0.85rem;
  color: #666;
  margin-top: 4px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.template-stats {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #999;
}

.loading-text,
.error-text,
.empty-text {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error-text {
  color: #c33;
}

.template-preview {
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 8px;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.close-button {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #333;
}

.add-template {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #1890ff;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.add-template:hover {
  background-color: #40a9ff;
}

.footer-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.load-template {
  padding: 8px 16px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background-color: white;
  color: #1890ff;
  cursor: pointer;
  transition: all 0.3s;
}

.load-template:hover {
  background-color: #e6f7ff;
}
</style> 