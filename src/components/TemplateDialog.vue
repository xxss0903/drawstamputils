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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { IDrawStampConfig } from '../DrawStampTypes'

const { t } = useI18n()
const templateFileInput = ref<HTMLInputElement | null>(null)

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
  emit('select', template)
}

// 保存当前模板
const saveAsTemplate = () => {
  if (!props.drawStampUtils) return
  
  const drawConfigs = props.drawStampUtils.getDrawConfigs()
  const jsonStr = JSON.stringify(drawConfigs, null, 2)

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
  templateFileInput.value?.click()
}

// 加载模板文件
const loadTemplateFile = async (event: Event) => {
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
    console.error('加载模板失败:', error)
    alert(t('stamp.template.loadError'))
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