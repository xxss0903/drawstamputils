<template>
  <div class="template-panel">
    <div class="template-header">
      <h3>{{ t('stamp.template.title') }}</h3>
      <button class="add-template" @click="saveCurrentAsTemplate">
        <span>+</span> {{ t('stamp.template.save') }}
      </button>
    </div>
    
    <div class="template-list">
      <!-- 默认模板 -->
      <div class="template-category">
        <h4>{{ t('stamp.template.defaultTitle') }}</h4>
        <div v-for="(template, index) in defaultTemplates" 
             :key="'default-' + index" 
             class="template-item"
             :class="{ 'active': currentTemplateIndex === (-1 - index) }"
             @click="handleTemplateClick(template, index)">
          <div class="template-preview">
            <img :src="template.preview" :alt="t('stamp.template.preview')" />
          </div>
          <div class="template-info">
            <span class="template-name">{{ t('stamp.template.name') }}: {{ template.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { IDrawStampConfig } from '../DrawStampTypes'
import { onMounted, ref } from 'vue'
import { DrawStampUtils } from '../DrawStampUtils'
import stampTemplate1 from '../assets/templates/stamp_template1.json'
import stampTemplate2 from '../assets/templates/stamp_template2.json'

const { t } = useI18n()

interface Template {
  name: string
  preview: string
  config: IDrawStampConfig
}

const props = defineProps<{
  defaultTemplates: Template[]
  currentTemplateIndex: number
}>()

const emit = defineEmits<{
  (e: 'loadTemplate', template: Template): void
  (e: 'saveTemplate'): void
  (e: 'updateTemplates', templates: Template[]): void
}>()

const handleTemplateClick = (template: Template, index: number) => {
  emit('loadTemplate', template)
}

const saveCurrentAsTemplate = () => {
  emit('saveTemplate')
}

// 生成模板预览图
const generateTemplatePreview = async (template: Template) => {
  // 临时创建一个 canvas 生成预览图
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = 500
  tempCanvas.height = 500
  const tempDrawStampUtils = new DrawStampUtils(tempCanvas, 8)
  
  // 关闭标尺显示
  if (template.config.ruler) {
    template.config.ruler.showRuler = false
  }
  
  // 设置模板配置
  tempDrawStampUtils.setDrawConfigs(template.config)
  tempDrawStampUtils.refreshStamp()
  
  // 生成预览图
  template.preview = tempCanvas.toDataURL('image/png')
}


// 添加默认模板的类型定义和数据
const defaultTemplates: Template[] = [
  {
    name: '印章1',
    preview: '',
    config: stampTemplate1 as IDrawStampConfig
  },{
    name: '印章2',
    preview: '',
    config: stampTemplate2 as IDrawStampConfig
  }
]

// 从本地存储加载模板列表
const loadTemplatesFromStorage = async () => {
  // 生成默认模板的预览图
  await Promise.all(defaultTemplates.map(async (template) => {
    // 临时创建一个 canvas 生成预览图
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = 500
    tempCanvas.height = 500
    const tempDrawStampUtils = new DrawStampUtils(tempCanvas, 8)
    template.config.ruler.showRuler = false;
    // 设置模板配置
    tempDrawStampUtils.setDrawConfigs(template.config)
    tempDrawStampUtils.refreshStamp()
    
    // 生成预览图
    template.preview = tempCanvas.toDataURL('image/png')
  }))
  console.log("defaultTemplates", defaultTemplates)
  setTimeout(() => {
    emit('updateTemplates', defaultTemplates)
  }, 500)
}

// 在组件挂载时加载模板
onMounted(() => {
  loadTemplatesFromStorage()
})
</script>

<style scoped>
.template-panel {
  width: 300px;
  background: #fff;
  border-left: 1px solid #eee;
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.template-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-header h3 {
  margin: 0;
  color: #333;
}

.add-template {
  background: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.template-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.template-item {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.template-item.active {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76,175,80,0.2);
}

.template-preview {
  height: 150px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  background: #f5f5f5;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.template-info {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-name {
  font-size: 14px;
  color: #333;
}
</style> 