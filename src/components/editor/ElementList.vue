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
             @click.stop="selectElement(`company-${index}`, 'company', index)">
          <span class="element-icon">📝</span>
          <span class="element-name" v-if="editingElement !== `company-${index}`" @dblclick.stop="startEdit(`company-${index}`, 'company', index, company.companyName)">
            {{ company.companyName || `公司名称 ${index + 1}` }}
          </span>
          <input
            v-else
            v-model="editingValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="element-edit-input"
            @click.stop
            ref="editInputRef"
          />
          <span class="element-type">{{ company.shape === 'rectangle' ? '矩形' : '椭圆' }}</span>
          <div class="element-actions" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit(`company-${index}`, 'company', index, company.companyName)" title="编辑">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('company', index)" title="清除">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('company', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(type, index) in stampTypeList"
             :key="`stampType-${index}`"
             :class="{ active: selectedElement === `stampType-${index}` }"
             @click.stop="selectElement(`stampType-${index}`, 'stampType', index)">
          <span class="element-icon">🏷️</span>
          <span class="element-name" v-if="editingElement !== `stampType-${index}`" @dblclick.stop="startEdit(`stampType-${index}`, 'stampType', index, type.stampType)">
            {{ type.stampType || `印章类型 ${index + 1}` }}
          </span>
          <input
            v-else
            v-model="editingValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="element-edit-input"
            @click.stop
            ref="editInputRef"
          />
          <span class="element-type">类型</span>
          <div class="element-actions" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit(`stampType-${index}`, 'stampType', index, type.stampType)" title="编辑">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('stampType', index)" title="清除">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('stampType', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'code' }"
             @click.stop="selectElement('code', 'code', 0)">
          <span class="element-icon">🔢</span>
          <span class="element-name" v-if="editingElement !== 'code'" @dblclick.stop="startEdit('code', 'code', 0, stampCode.code || '')">
            {{ stampCode.code || '编码（未设置）' }}
          </span>
          <input
            v-else
            v-model="editingValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="element-edit-input"
            @click.stop
            ref="editInputRef"
          />
          <span class="element-type">编码</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit('code', 'code', 0, stampCode.code || '')" title="编辑">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('code', 0)" title="清除">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('code', 0)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'taxNumber' }"
             @click.stop="selectElement('taxNumber', 'taxNumber', 0)">
          <span class="element-icon">💼</span>
          <span class="element-name" v-if="editingElement !== 'taxNumber'" @dblclick.stop="startEdit('taxNumber', 'taxNumber', 0, taxNumber.code || '')">
            {{ taxNumber.code || '税号（未设置）' }}
          </span>
          <input
            v-else
            v-model="editingValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="element-edit-input"
            @click.stop
            ref="editInputRef"
          />
          <span class="element-type">税号</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit('taxNumber', 'taxNumber', 0, taxNumber.code || '')" title="编辑">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('taxNumber', 0)" title="清除">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('taxNumber', 0)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-if="drawStar.drawStar"
             :class="{ active: selectedElement === 'star' }"
             @click="selectElement('star', 'star', 0)">
          <span class="element-icon">⭐</span>
          <span class="element-name">五角星</span>
          <span class="element-type">图形</span>
        </div>
        <div class="element-item"
             v-for="(_, index) in visibleImages"
             :key="`image-${index}`"
             :class="{ active: selectedElement === `image-${index}` }"
             @click="selectElement(`image-${index}`, 'image', index)">
          <span class="element-icon">🖼️</span>
          <span class="element-name">图片 {{ index + 1 }}</span>
          <span class="element-type">图片</span>
        </div>
      </div>

      <!-- 文字元素 -->
      <div v-show="activeTab === 'text'" class="element-category">
        <div class="element-item"
             v-for="(company, index) in companyList"
             :key="`company-${index}`"
             :class="{ active: selectedElement === `company-${index}` }"
             @click.stop="selectElement(`company-${index}`, 'company', index)">
          <span class="element-icon">📝</span>
          <span class="element-name" v-if="editingElement !== `company-${index}`" @dblclick.stop="startEdit(`company-${index}`, 'company', index, company.companyName)">
            {{ company.companyName || `公司名称 ${index + 1}` }}
          </span>
          <input
            v-else
            v-model="editingValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="element-edit-input"
            @click.stop
            ref="editInputRef"
          />
          <div class="element-actions" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit(`company-${index}`, 'company', index, company.companyName)" title="编辑">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('company', index)" title="清除">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('company', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(type, index) in stampTypeList"
             :key="`stampType-${index}`"
             :class="{ active: selectedElement === `stampType-${index}` }"
             @click.stop="selectElement(`stampType-${index}`, 'stampType', index)">
          <span class="element-icon">🏷️</span>
          <span class="element-name" v-if="editingElement !== `stampType-${index}`" @dblclick.stop="startEdit(`stampType-${index}`, 'stampType', index, type.stampType)">
            {{ type.stampType || `印章类型 ${index + 1}` }}
          </span>
          <input
            v-else
            v-model="editingValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="element-edit-input"
            @click.stop
            ref="editInputRef"
          />
          <div class="element-actions" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit(`stampType-${index}`, 'stampType', index, type.stampType)" title="编辑">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('stampType', index)" title="清除">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('stampType', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'code' }"
             @click.stop="selectElement('code', 'code', 0)">
          <span class="element-icon">🔢</span>
          <span class="element-name" v-if="editingElement !== 'code'" @dblclick.stop="startEdit('code', 'code', 0, stampCode.code || '')">
            {{ stampCode.code || '编码（未设置）' }}
          </span>
          <input
            v-else
            v-model="editingValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="element-edit-input"
            @click.stop
            ref="editInputRef"
          />
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit('code', 'code', 0, stampCode.code || '')" title="编辑">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('code', 0)" title="清除">🗑️</button>
          </div>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'taxNumber' }"
             @click.stop="selectElement('taxNumber', 'taxNumber', 0)">
          <span class="element-icon">💼</span>
          <span class="element-name" v-if="editingElement !== 'taxNumber'" @dblclick.stop="startEdit('taxNumber', 'taxNumber', 0, taxNumber.code || '')">
            {{ taxNumber.code || '税号（未设置）' }}
          </span>
          <input
            v-else
            v-model="editingValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="element-edit-input"
            @click.stop
            ref="editInputRef"
          />
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit('taxNumber', 'taxNumber', 0, taxNumber.code || '')" title="编辑">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('taxNumber', 0)" title="清除">🗑️</button>
          </div>
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
             v-for="(_, index) in innerCircleList"
             :key="`circle-${index}`"
             :class="{ active: selectedElement === `circle-${index}` }"
             @click="selectElement(`circle-${index}`, 'circle', index)">
          <span class="element-icon">⭕</span>
          <span class="element-name">内圈 {{ index + 1 }}</span>
        </div>
        <div class="element-item"
             v-for="(_, index) in visibleImages"
             :key="`image-figure-${index}`"
             :class="{ active: selectedElement === `image-${index}` }"
             @click="selectElement(`image-${index}`, 'image', index)">
          <span class="element-icon">🖼️</span>
          <span class="element-name">图片 {{ index + 1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { IDrawStampConfig } from '../../DrawStampTypes'
import { useStampStore } from '../../stores/stampStore'

interface Props {
  drawStampUtils?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'selectElement', elementId: string, elementType: string, index: number): void
  (e: 'updateConfig'): void
  (e: 'refresh'): void
}>()

const activeTab = ref<'all' | 'text' | 'figure'>('all')
const selectedElement = ref<string>('')

// 编辑相关状态
const editingElement = ref<string>('')
const editingElementType = ref<string>('')
const editingElementIndex = ref<number>(-1)
const editingValue = ref<string>('')
const editInputRef = ref<HTMLInputElement | null>(null)

const tabs = [
  { key: 'all' as const, label: '全部' },
  { key: 'text' as const, label: '文字' },
  { key: 'figure' as const, label: '图形' }
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
const imageList = computed(() => config.value.imageList || [])
const visibleImages = computed(() => (imageList.value || []).filter((image) => image && image.imageUrl))

const selectElement = (elementId: string, elementType: string, index: number) => {
  selectedElement.value = elementId
  emit('selectElement', elementId, elementType, index)
}

// 开始编辑
const startEdit = (elementId: string, elementType: string, index: number, currentValue: string) => {
  editingElement.value = elementId
  editingElementType.value = elementType
  editingElementIndex.value = index
  editingValue.value = currentValue || ''
  nextTick(() => {
    if (editInputRef.value) {
      editInputRef.value.focus()
      editInputRef.value.select()
    }
  })
}

// 保存编辑
const saveEdit = () => {
  if (editingElement.value && editingElementType.value !== '' && editingValue.value !== undefined) {
    const elementType = editingElementType.value
    const index = editingElementIndex.value
    
    stampStore.updateConfig((config) => {
      if (elementType === 'company' && config.companyList && config.companyList[index]) {
        config.companyList[index].companyName = editingValue.value
      } else if (elementType === 'stampType' && config.stampTypeList && config.stampTypeList[index]) {
        config.stampTypeList[index].stampType = editingValue.value
      } else if (elementType === 'code') {
        config.stampCode.code = editingValue.value
      } else if (elementType === 'taxNumber') {
        config.taxNumber.code = editingValue.value
      }
    })
    
    emit('updateConfig')
  }
  
  cancelEdit()
}

// 取消编辑
const cancelEdit = () => {
  editingElement.value = ''
  editingElementType.value = ''
  editingElementIndex.value = -1
  editingValue.value = ''
}

// 清除文字
const clearText = (elementType: string, index: number) => {
  stampStore.updateConfig((config) => {
    if (elementType === 'company' && config.companyList && config.companyList[index]) {
      config.companyList[index].companyName = ''
    } else if (elementType === 'stampType' && config.stampTypeList && config.stampTypeList[index]) {
      config.stampTypeList[index].stampType = ''
    } else if (elementType === 'code') {
      config.stampCode.code = ''
    } else if (elementType === 'taxNumber') {
      config.taxNumber.code = ''
    }
  })
  
  emit('updateConfig')
  emit('refresh')
}

// 删除元素
const deleteElement = (elementType: string, index: number) => {
  if (confirm('确定要删除这个元素吗？')) {
    stampStore.updateConfig((config) => {
      if (elementType === 'company' && config.companyList) {
        config.companyList.splice(index, 1)
        // 如果删除后列表为空，取消选中
        if (config.companyList.length === 0) {
          selectedElement.value = ''
        }
      } else if (elementType === 'stampType' && config.stampTypeList) {
        config.stampTypeList.splice(index, 1)
        // 如果删除后列表为空，取消选中
        if (config.stampTypeList.length === 0) {
          selectedElement.value = ''
        }
      } else if (elementType === 'code') {
        config.stampCode.code = ''
        if (selectedElement.value === 'code') {
          selectedElement.value = ''
        }
      } else if (elementType === 'taxNumber') {
        config.taxNumber.code = ''
        if (selectedElement.value === 'taxNumber') {
          selectedElement.value = ''
        }
      }
    })
    
    emit('updateConfig')
    emit('refresh')
  }
}
</script>

<style scoped>
.element-list-panel {
  width: 300px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 60vh;
  background-color: #f2f2f2;
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
  display: none;
}

.element-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.element-actions.show-always {
  opacity: 1;
}

.element-item:hover .element-actions {
  opacity: 1;
}

.action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.action-btn:hover {
  background: #e6f7ff;
}

.edit-btn:hover {
  background: #e6f7ff;
}

.clear-btn:hover {
  background: #fff7e6;
}

.delete-btn:hover {
  background: #fff1f0;
}

.element-edit-input {
  flex: 1;
  border: 1px solid #1890ff;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  outline: none;
  background: white;
}
</style>

