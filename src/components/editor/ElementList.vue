<template>
  <div class="element-list-panel">
    <div class="panel-header">
      <h3>元素列表</h3>
    </div>
    <div class="panel-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-button', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="panel-content">
      <!-- 全部元素 -->
      <div v-show="activeTab === 'all'" class="element-category">
        <div class="element-item" 
             v-for="(company, index) in companyList" 
             :key="`company-${index}`"
             :class="{ active: selectedElement === `company-${index}` }"
             @click="selectElement(`company-${index}`, 'company', index)">
          <span class="element-icon">📝</span>
          <span class="element-name">{{ company.companyName || `公司名称 ${index + 1}` }}</span>
          <span class="element-type">{{ company.shape === 'rectangle' ? '矩形' : '椭圆' }}</span>
        </div>
        <div class="element-item" 
             v-for="(type, index) in stampTypeList" 
             :key="`stampType-${index}`"
             :class="{ active: selectedElement === `stampType-${index}` }"
             @click="selectElement(`stampType-${index}`, 'stampType', index)">
          <span class="element-icon">🏷️</span>
          <span class="element-name">{{ type.stampType || `印章类型 ${index + 1}` }}</span>
          <span class="element-type">类型</span>
        </div>
        <div class="element-item" 
             v-if="stampCode.code"
             :class="{ active: selectedElement === 'code' }"
             @click="selectElement('code', 'code', 0)">
          <span class="element-icon">🔢</span>
          <span class="element-name">{{ stampCode.code }}</span>
          <span class="element-type">编码</span>
        </div>
        <div class="element-item" 
             v-if="taxNumber.code"
             :class="{ active: selectedElement === 'taxNumber' }"
             @click="selectElement('taxNumber', 'taxNumber', 0)">
          <span class="element-icon">💼</span>
          <span class="element-name">{{ taxNumber.code }}</span>
          <span class="element-type">税号</span>
        </div>
        <div class="element-item" 
             v-if="drawStar.drawStar"
             :class="{ active: selectedElement === 'star' }"
             @click="selectElement('star', 'star', 0)">
          <span class="element-icon">⭐</span>
          <span class="element-name">五角星</span>
          <span class="element-type">图形</span>
        </div>
      </div>

      <!-- 文字元素 -->
      <div v-show="activeTab === 'text'" class="element-category">
        <div class="element-item" 
             v-for="(company, index) in companyList" 
             :key="`company-${index}`"
             :class="{ active: selectedElement === `company-${index}` }"
             @click="selectElement(`company-${index}`, 'company', index)">
          <span class="element-icon">📝</span>
          <span class="element-name">{{ company.companyName || `公司名称 ${index + 1}` }}</span>
        </div>
        <div class="element-item" 
             v-for="(type, index) in stampTypeList" 
             :key="`stampType-${index}`"
             :class="{ active: selectedElement === `stampType-${index}` }"
             @click="selectElement(`stampType-${index}`, 'stampType', index)">
          <span class="element-icon">🏷️</span>
          <span class="element-name">{{ type.stampType || `印章类型 ${index + 1}` }}</span>
        </div>
        <div class="element-item" 
             v-if="stampCode.code"
             :class="{ active: selectedElement === 'code' }"
             @click="selectElement('code', 'code', 0)">
          <span class="element-icon">🔢</span>
          <span class="element-name">{{ stampCode.code }}</span>
        </div>
        <div class="element-item" 
             v-if="taxNumber.code"
             :class="{ active: selectedElement === 'taxNumber' }"
             @click="selectElement('taxNumber', 'taxNumber', 0)">
          <span class="element-icon">💼</span>
          <span class="element-name">{{ taxNumber.code }}</span>
        </div>
      </div>

      <!-- 图形元素 -->
      <div v-show="activeTab === 'figure'" class="element-category">
        <div class="element-item" 
             v-if="drawStar.drawStar"
             :class="{ active: selectedElement === 'star' }"
             @click="selectElement('star', 'star', 0)">
          <span class="element-icon">⭐</span>
          <span class="element-name">五角星</span>
        </div>
        <div class="element-item" 
             v-for="(circle, index) in innerCircleList" 
             :key="`circle-${index}`"
             :class="{ active: selectedElement === `circle-${index}` }"
             @click="selectElement(`circle-${index}`, 'circle', index)">
          <span class="element-icon">⭕</span>
          <span class="element-name">内圈 {{ index + 1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IDrawStampConfig } from '../../DrawStampTypes'
import { useStampStore } from '../../stores/stampStore'

interface Props {
  drawStampUtils?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'selectElement', elementId: string, elementType: string, index: number): void
}>()

const activeTab = ref<'all' | 'text' | 'figure'>('all')
const selectedElement = ref<string>('')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'text', label: '文字' },
  { key: 'figure', label: '图形' }
]

const stampStore = useStampStore()

const config = computed(() => {
  if (stampStore.state.config) {
    return stampStore.state.config
  }
  return (props.drawStampUtils?.getDrawConfigs?.() || {}) as IDrawStampConfig
})

const companyList = computed(() => config.value.companyList || [])
const stampTypeList = computed(() => config.value.stampTypeList || [])
const stampCode = computed(() => config.value.stampCode || { code: '' })
const taxNumber = computed(() => config.value.taxNumber || { code: '' })
const drawStar = computed(() => config.value.drawStar || { drawStar: false })
const innerCircleList = computed(() => config.value.innerCircleList || [])

const selectElement = (elementId: string, elementType: string, index: number) => {
  selectedElement.value = elementId
  emit('selectElement', elementId, elementType, index)
}
</script>

<style scoped>
.element-list-panel {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.tab-button {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  background: #f0f0f0;
}

.tab-button.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
  background: white;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.element-category {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.element-item:hover {
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.element-item.active {
  background: #e6f7ff;
  border-color: #1890ff;
}

.element-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.element-name {
  flex: 1;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.element-type {
  font-size: 12px;
  color: #999;
  padding: 2px 8px;
  background: #f0f0f0;
  border-radius: 4px;
}
</style>

