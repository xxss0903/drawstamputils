<template>
  <div class="element-list-panel">
    <div class="panel-header">
      <h3>{{ t('elementList.title') }}</h3>
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
    <input
      ref="svgFileInput"
      type="file"
      accept=".svg"
      style="display: none"
      @change="handleSvgFileChange"
    />
    <div class="panel-content">
      <!-- 全部元素 -->
      <div v-show="activeTab === 'all'" class="element-category">
        <div class="element-item"
             :class="{ active: selectedElement === 'basic-settings' }"
             @click.stop="selectElement('basic-settings', 'basic', 0)">
          <span class="element-icon">⚙️</span>
          <span class="element-name">{{ t('elementList.elements.basicSettings') }}</span>
        </div>
        <div class="element-item"
             v-for="(company, index) in companyList"
             :key="`company-${index}`"
             :class="{ active: selectedElement === `company-${index}` }"
             @click.stop="selectElement(`company-${index}`, 'company', index)">
          <span class="element-icon">📝</span>
          <span class="element-name" v-if="editingElement !== `company-${index}`" @dblclick.stop="startEdit(`company-${index}`, 'company', index, company.companyName)">
            {{ company.companyName || t('elementList.defaults.companyNameIndex', { index: index + 1 }) }}
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
<!--          <span class="element-type">{{ company.shape === 'rectangle' ? '矩形' : '椭圆' }}</span>-->
          <div class="element-actions" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit(`company-${index}`, 'company', index, company.companyName)" :title="t('elementList.buttons.edit')">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('company', index)" :title="t('elementList.buttons.clear')">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('company', index)" :title="t('elementList.buttons.delete')">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(type, index) in stampTypeList"
             :key="`stampType-${index}`"
             :class="{ active: selectedElement === `stampType-${index}` }"
             @click.stop="selectElement(`stampType-${index}`, 'stampType', index)">
          <span class="element-icon">🏷️</span>
          <span class="element-name" v-if="editingElement !== `stampType-${index}`" @dblclick.stop="startEdit(`stampType-${index}`, 'stampType', index, type.stampType)">
            {{ type.stampType || t('elementList.defaults.stampTypeIndex', { index: index + 1 }) }}
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
<!--          <span class="element-type">类型</span>-->
          <div class="element-actions" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit(`stampType-${index}`, 'stampType', index, type.stampType)" :title="t('elementList.buttons.edit')">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('stampType', index)" :title="t('elementList.buttons.clear')">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('stampType', index)" :title="t('elementList.buttons.delete')">❌</button>
          </div>
        </div>
        <div
          class="element-item"
          v-for="(code, index) in stampCodeList"
          :key="`code-${index}`"
          :class="{ active: selectedElement === `code-${index}` }"
          @click.stop="selectElement(`code-${index}`, 'code', index)"
        >
          <span class="element-icon">🔢</span>
          <span
            class="element-name"
            v-if="editingElement !== `code-${index}`"
            @dblclick.stop="startEdit(`code-${index}`, 'code', index, code.code || '')"
          >
            {{ code.code || t('elementList.elements.code') + ' ' + (index + 1) }}
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
            <button
              class="action-btn edit-btn"
              @click="startEdit(`code-${index}`, 'code', index, code.code || '')"
              :title="t('elementList.buttons.edit')"
            >✏️</button>
            <button
              class="action-btn clear-btn"
              @click="clearText('code', index)"
              :title="t('elementList.buttons.clear')"
            >🗑️</button>
            <button
              class="action-btn delete-btn"
              @click="deleteElement('code', index)"
              title="删除"
            >❌</button>
          </div>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'taxNumber' }"
             @click.stop="selectElement('taxNumber', 'taxNumber', 0)">
          <span class="element-icon">💼</span>
          <span class="element-name" v-if="editingElement !== 'taxNumber'" @dblclick.stop="startEdit('taxNumber', 'taxNumber', 0, taxNumber.code || '')">
            {{ taxNumber.code || t('elementList.elements.taxNumber') + '（' + t('elementList.status.notSet') + '）' }}
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
<!--          <span class="element-type">税号</span>-->
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn edit-btn" @click="startEdit('taxNumber', 'taxNumber', 0, taxNumber.code || '')" :title="t('elementList.buttons.edit')">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('taxNumber', 0)" :title="t('elementList.buttons.clear')">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('taxNumber', 0)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'star' }"
             @click.stop="selectElement('star', 'star', 0)">
          <span class="element-icon">⭐</span>
          <span class="element-name">{{ t('elementList.elements.star') }}</span>
          <span class="element-type">{{ drawStar.drawStar ? t('elementList.status.enabled') : t('elementList.status.disabled') }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('star', 0)" :title="t('elementList.buttons.delete')">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(_, index) in innerCircleList"
             :key="`circle-all-${index}`"
             :class="{ active: selectedElement === `circle-${index}` }"
             @click.stop="selectElement(`circle-${index}`, 'circle', index)">
          <span class="element-icon">⭕</span>
          <span class="element-name">{{ t('elementList.defaults.innerCircleIndex', { index: index + 1 }) }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('circle', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="imageInfo in visibleImages"
             :key="`image-${imageInfo.index}`"
             :class="{ active: selectedElement === `image-${imageInfo.index}` }"
             @click.stop="selectElement(`image-${imageInfo.index}`, 'image', imageInfo.index)">
          <span class="element-icon">🖼️</span>
          <span class="element-name">{{ t('elementList.defaults.imageIndex', { index: imageInfo.index + 1 }) }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('image', imageInfo.index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(line, index) in lineList"
             :key="line.id || `line-${index}`"
             :class="{ active: selectedElement === `line-${index}` }"
             @click.stop="selectElement(`line-${index}`, 'line', index)">
          <span class="element-icon">{{ line.type === 'vertical' ? '↕️' : '↔️' }}</span>
          <span class="element-name">{{ line.type === 'vertical' ? t('elementList.defaults.verticalLineIndex', { index: index + 1 }) : t('elementList.defaults.horizontalLineIndex', { index: index + 1 }) }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('line', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(svg, index) in svgList"
             :key="`svg-all-${svg.id || index}`"
             :class="{ active: selectedElement === `svg-${index}` }"
             @click.stop="selectElement(`svg-${index}`, 'svg', index)">
          <span class="element-icon">🧩</span>
          <span class="element-name">{{ svg.name || t('elementList.defaults.svgIndex', { index: index + 1 }) }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('svg', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'aging' }"
             @click.stop="selectElement('aging', 'aging', 0)">
          <span class="element-icon">🕰️</span>
          <span class="element-name">{{ t('elementList.elements.agingEffect') }}</span>
          <span class="element-type">{{ agingEffect.applyAging ? t('elementList.status.enabled') : t('elementList.status.disabled') }}</span>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'roughEdge' }"
             @click.stop="selectElement('roughEdge', 'roughEdge', 0)">
          <span class="element-icon">🌊</span>
          <span class="element-name">{{ t('elementList.elements.roughEdge') }}</span>
          <span class="element-type">{{ roughEdge.drawRoughEdge ? t('elementList.status.enabled') : t('elementList.status.disabled') }}</span>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'security' }"
             @click.stop="selectElement('security', 'security', 0)">
          <span class="element-icon">🔒</span>
          <span class="element-name">{{ t('elementList.elements.securityPattern') }}</span>
          <span class="element-type">{{ securityPattern.openSecurityPattern ? t('elementList.status.enabled') : t('elementList.status.disabled') }}</span>
        </div>
        <div class="line-action-buttons">
          <button class="add-line-button" @click="addCompanyItem">
            <span class="add-icon">➕</span>
            <span>{{ t('elementList.buttons.addCompany') }}</span>
          </button>
          <button class="add-line-button" @click="addStampTypeItem">
            <span class="add-icon">➕</span>
            <span>{{ t('elementList.buttons.addStampType') }}</span>
          </button>
          <button class="add-line-button" @click="addCodeItem">
            <span class="add-icon">➕</span>
            <span>{{ t('elementList.elements.code') }}</span>
          </button>
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
            {{ company.companyName || t('elementList.defaults.companyNameIndex', { index: index + 1 }) }}
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
            <button class="action-btn edit-btn" @click="startEdit(`company-${index}`, 'company', index, company.companyName)" :title="t('elementList.buttons.edit')">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('company', index)" :title="t('elementList.buttons.clear')">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('company', index)" :title="t('elementList.buttons.delete')">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(type, index) in stampTypeList"
             :key="`stampType-${index}`"
             :class="{ active: selectedElement === `stampType-${index}` }"
             @click.stop="selectElement(`stampType-${index}`, 'stampType', index)">
          <span class="element-icon">🏷️</span>
          <span class="element-name" v-if="editingElement !== `stampType-${index}`" @dblclick.stop="startEdit(`stampType-${index}`, 'stampType', index, type.stampType)">
            {{ type.stampType || t('elementList.defaults.stampTypeIndex', { index: index + 1 }) }}
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
            <button class="action-btn edit-btn" @click="startEdit(`stampType-${index}`, 'stampType', index, type.stampType)" :title="t('elementList.buttons.edit')">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('stampType', index)" :title="t('elementList.buttons.clear')">🗑️</button>
            <button class="action-btn delete-btn" @click="deleteElement('stampType', index)" :title="t('elementList.buttons.delete')">❌</button>
          </div>
        </div>
        <div
          class="element-item"
          v-for="(code, index) in stampCodeList"
          :key="`code-text-${index}`"
          :class="{ active: selectedElement === `code-${index}` }"
          @click.stop="selectElement(`code-${index}`, 'code', index)"
        >
          <span class="element-icon">🔢</span>
          <span
            class="element-name"
            v-if="editingElement !== `code-${index}`"
            @dblclick.stop="startEdit(`code-${index}`, 'code', index, code.code || '')"
          >
            {{ code.code || t('elementList.elements.code') + ' ' + (index + 1) }}
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
            <button
              class="action-btn edit-btn"
              @click="startEdit(`code-${index}`, 'code', index, code.code || '')"
              :title="t('elementList.buttons.edit')"
            >✏️</button>
            <button
              class="action-btn clear-btn"
              @click="clearText('code', index)"
              :title="t('elementList.buttons.clear')"
            >🗑️</button>
          </div>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'taxNumber' }"
             @click.stop="selectElement('taxNumber', 'taxNumber', 0)">
          <span class="element-icon">💼</span>
          <span class="element-name" v-if="editingElement !== 'taxNumber'" @dblclick.stop="startEdit('taxNumber', 'taxNumber', 0, taxNumber.code || '')">
            {{ taxNumber.code || t('elementList.elements.taxNumber') + '（' + t('elementList.status.notSet') + '）' }}
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
            <button class="action-btn edit-btn" @click="startEdit('taxNumber', 'taxNumber', 0, taxNumber.code || '')" :title="t('elementList.buttons.edit')">✏️</button>
            <button class="action-btn clear-btn" @click="clearText('taxNumber', 0)" :title="t('elementList.buttons.clear')">🗑️</button>
          </div>
        </div>
        <div class="line-action-buttons">
          <button class="add-line-button" @click="addCompanyItem">
            <span class="add-icon">➕</span>
            <span>{{ t('elementList.buttons.addCompany') }}</span>
          </button>
          <button class="add-line-button" @click="addStampTypeItem">
            <span class="add-icon">➕</span>
            <span>{{ t('elementList.buttons.addStampType') }}</span>
          </button>
        </div>
      </div>

      <!-- 图形元素 -->
      <div v-show="activeTab === 'figure'" class="element-category">
        <div class="element-item"
             :class="{ active: selectedElement === 'star' }"
             @click.stop="selectElement('star', 'star', 0)">
          <span class="element-icon">⭐</span>
          <span class="element-name">{{ t('elementList.elements.star') }}</span>
          <span class="element-type">{{ drawStar.drawStar ? t('elementList.status.enabled') : t('elementList.status.disabled') }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('star', 0)" :title="t('elementList.buttons.delete')">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(_, index) in innerCircleList"
             :key="`circle-${index}`"
             :class="{ active: selectedElement === `circle-${index}` }"
             @click.stop="selectElement(`circle-${index}`, 'circle', index)">
          <span class="element-icon">⭕</span>
          <span class="element-name">{{ t('elementList.defaults.innerCircleIndex', { index: index + 1 }) }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('circle', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="imageInfo in visibleImages"
             :key="`image-figure-${imageInfo.index}`"
             :class="{ active: selectedElement === `image-${imageInfo.index}` }"
             @click.stop="selectElement(`image-${imageInfo.index}`, 'image', imageInfo.index)">
          <span class="element-icon">🖼️</span>
          <span class="element-name">{{ t('elementList.defaults.imageIndex', { index: imageInfo.index + 1 }) }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('image', imageInfo.index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(line, index) in lineList"
             :key="`figure-line-${line.id || index}`"
             :class="{ active: selectedElement === `line-${index}` }"
             @click.stop="selectElement(`line-${index}`, 'line', index)">
          <span class="element-icon">{{ line.type === 'vertical' ? '↕️' : '↔️' }}</span>
          <span class="element-name">{{ line.type === 'vertical' ? t('elementList.defaults.verticalLineIndex', { index: index + 1 }) : t('elementList.defaults.horizontalLineIndex', { index: index + 1 }) }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('line', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="element-item"
             v-for="(svg, index) in svgList"
             :key="`figure-svg-${svg.id || index}`"
             :class="{ active: selectedElement === `svg-${index}` }"
             @click.stop="selectElement(`svg-${index}`, 'svg', index)">
          <span class="element-icon">🧩</span>
          <span class="element-name">{{ svg.name || t('elementList.defaults.svgIndex', { index: index + 1 }) }}</span>
          <div class="element-actions show-always" @click.stop>
            <button class="action-btn delete-btn" @click="deleteElement('svg', index)" title="删除">❌</button>
          </div>
        </div>
        <div class="line-action-buttons">
          <button class="add-line-button" @click="addLine('horizontal')">
            <span class="add-icon">➕</span>
            <span>{{ t('elementList.buttons.addHorizontalLine') }}</span>
          </button>
          <button class="add-line-button" @click="addLine('vertical')">
            <span class="add-icon">➕</span>
            <span>{{ t('elementList.buttons.addVerticalLine') }}</span>
          </button>
        </div>
        <button class="add-image-button" @click="addImage">
          <span class="add-icon">➕</span>
          <span>{{ t('elementList.buttons.addImage') }}</span>
        </button>
        <button class="add-image-button" @click="addInnerCircle">
          <span class="add-icon">➕</span>
          <span>{{ t('elementList.buttons.addInnerCircle') }}</span>
        </button>
        <button class="add-image-button" @click="triggerSvgUpload">
          <span class="add-icon">➕</span>
          <span>{{ t('elementList.buttons.uploadSvg') }}</span>
        </button>
      </div>

      <!-- 效果元素 -->
      <div v-show="activeTab === 'effect'" class="element-category">
        <div class="element-item"
             :class="{ active: selectedElement === 'aging' }"
             @click.stop="selectElement('aging', 'aging', 0)">
          <span class="element-icon">🕰️</span>
          <span class="element-name">{{ t('elementList.elements.agingEffect') }}</span>
          <span class="element-type">{{ agingEffect.applyAging ? t('elementList.status.enabled') : t('elementList.status.disabled') }}</span>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'roughEdge' }"
             @click.stop="selectElement('roughEdge', 'roughEdge', 0)">
          <span class="element-icon">🌊</span>
          <span class="element-name">{{ t('elementList.elements.roughEdge') }}</span>
          <span class="element-type">{{ roughEdge.drawRoughEdge ? t('elementList.status.enabled') : t('elementList.status.disabled') }}</span>
        </div>
        <div class="element-item"
             :class="{ active: selectedElement === 'security' }"
             @click.stop="selectElement('security', 'security', 0)">
          <span class="element-icon">🔒</span>
          <span class="element-name">{{ t('elementList.elements.securityPattern') }}</span>
          <span class="element-type">{{ securityPattern.openSecurityPattern ? t('elementList.status.enabled') : t('elementList.status.disabled') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { IDrawStampConfig, IDrawImage, ILineConfig, ISvgShape, ICompany, IStampType } from '../../DrawStampTypes'
import { useStampStore } from '../../stores/stampStore'

const { t } = useI18n()

interface Props {
  drawStampUtils?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'selectElement', elementId: string, elementType: string, index: number): void
  (e: 'updateConfig'): void
  (e: 'refresh'): void
}>()

const activeTab = ref<'all' | 'text' | 'figure' | 'effect'>('all')
const selectedElement = ref<string>('')

// 编辑相关状态
const editingElement = ref<string>('')
const editingElementType = ref<string>('')
const editingElementIndex = ref<number>(-1)
const editingValue = ref<string>('')
const editInputRef = ref<HTMLInputElement | null>(null)
const svgFileInput = ref<HTMLInputElement | null>(null)

const tabs = computed(() => [
  { key: 'all' as const, label: t('elementList.tabs.all') },
  { key: 'text' as const, label: t('elementList.tabs.text') },
  { key: 'figure' as const, label: t('elementList.tabs.figure') },
  { key: 'effect' as const, label: t('elementList.tabs.effect') }
])

const stampStore = useStampStore()

const config = computed(() => {
  if (stampStore.state.config) {
    return stampStore.state.config
  }
  return (props.drawStampUtils?.getDrawConfigs?.() || {}) as IDrawStampConfig
})

const companyList = computed(() => config.value.companyList || [])
const stampTypeList = computed(() => config.value.stampTypeList || [])
const stampCodeList = computed(() => {
  const cfg = config.value
  if (cfg.stampCodeList && cfg.stampCodeList.length > 0) return cfg.stampCodeList
  return cfg.stampCode ? [cfg.stampCode] : []
})
const stampCode = computed(() => config.value.stampCode || { code: '' })
const taxNumber = computed(() => config.value.taxNumber || { code: '' })
const drawStar = computed(() => config.value.drawStar || { drawStar: false })
const innerCircleList = computed(() => config.value.innerCircleList || [])
const lineList = computed(() => config.value.lineList || [])
const visibleImages = computed(() =>
  (config.value.imageList || [])
    .map((image, index) => ({ image, index }))
)
const svgList = computed(() => config.value.svgList || [])
const agingEffect = computed(() => config.value.agingEffect || { applyAging: false })
const roughEdge = computed(() => config.value.roughEdge || { drawRoughEdge: false })
const securityPattern = computed(() => config.value.securityPattern || { openSecurityPattern: false })

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
        if (!config.stampCodeList) {
          config.stampCodeList = []
          if (config.stampCode) {
            config.stampCodeList.push({ ...config.stampCode })
          }
        }
        if (config.stampCodeList[index]) {
          config.stampCodeList[index].code = editingValue.value
        }
        config.stampCode = config.stampCodeList[0] || config.stampCode
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
      if (config.stampCodeList && config.stampCodeList[index]) {
        config.stampCodeList[index].code = ''
      } else if (config.stampCode) {
        config.stampCode.code = ''
      }
    } else if (elementType === 'taxNumber') {
      config.taxNumber.code = ''
    }
  })

  emit('updateConfig')
  emit('refresh')
}

// 删除元素
const deleteElement = (elementType: string, index: number) => {
  if (confirm(t('elementList.confirm.deleteElement'))) {
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
        if (config.stampCodeList) {
          config.stampCodeList.splice(index, 1)
        }
        config.stampCode = (config.stampCodeList && config.stampCodeList[0]) || config.stampCode
        if (selectedElement.value === `code-${index}`) {
          selectedElement.value = ''
        }
      } else if (elementType === 'taxNumber') {
        config.taxNumber.code = ''
        if (selectedElement.value === 'taxNumber') {
          selectedElement.value = ''
        }
      } else if (elementType === 'star' && config.drawStar) {
        config.drawStar.drawStar = false
        if (selectedElement.value === 'star') {
          selectedElement.value = ''
        }
      } else if (elementType === 'image' && config.imageList) {
        config.imageList.splice(index, 1)
        if (config.imageList.length === 0) {
          selectedElement.value = ''
        }
      } else if (elementType === 'line' && config.lineList) {
        config.lineList.splice(index, 1)
        if (config.lineList.length === 0) {
          selectedElement.value = ''
        }
      } else if (elementType === 'svg' && config.svgList) {
        config.svgList.splice(index, 1)
        if (config.svgList.length === 0) {
          selectedElement.value = ''
        }
      } else if (elementType === 'circle' && config.innerCircleList) {
        config.innerCircleList.splice(index, 1)
        if (config.innerCircleList.length === 0) {
          selectedElement.value = ''
        }
      }
    })

    emit('updateConfig')
    emit('refresh')
  }
}

const generateLineId = () => `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`

const createLineConfig = (type: 'horizontal' | 'vertical', cfg: IDrawStampConfig): ILineConfig => ({
  id: generateLineId(),
  type,
  positionX: 0,
  positionY: 0,
  length: type === 'horizontal' ? cfg.width || 30 : cfg.height || 30,
  lineWidth: 0.5,
  color: cfg.primaryColor || '#d40000',
  style: 'solid',
  dashLength: 2,
  gapLength: 1,
  opacity: 1
})

const addLine = (type: 'horizontal' | 'vertical') => {
  stampStore.updateConfig((config) => {
    if (!config.lineList) {
      config.lineList = []
    }
    config.lineList.push(createLineConfig(type, config))
    const newIndex = config.lineList.length - 1
    nextTick(() => {
      selectElement(`line-${newIndex}`, 'line', newIndex)
    })
  })

  emit('updateConfig')
  emit('refresh')
}

const createCompanyConfig = (cfg: IDrawStampConfig): ICompany => {
  const list = cfg.companyList || []
  const last = list[list.length - 1]
  const currentShape = cfg.company?.shape || 'ellipse'

  if (currentShape === 'rectangle') {
    const usedPositions = new Set(list.map(c => c.rectangleTextPosition))
    const availablePositions: Array<'top' | 'bottom' | 'left' | 'right' | 'center'> = ['top', 'bottom', 'left', 'right', 'center']
    const nextPosition = availablePositions.find(pos => !usedPositions.has(pos)) || 'center'

    return {
      companyName: t('elementList.defaults.newCompanyName'),
      compression: 1,
      borderOffset: 1,
      textDistributionFactor: 3,
      fontFamily: last?.fontFamily || 'SimSun',
      fontHeight: last?.fontHeight || 4.2,
      fontWeight: last?.fontWeight || 'normal',
      shape: 'rectangle',
      adjustEllipseText: false,
      adjustEllipseTextFactor: 0.5,
      startAngle: 0,
      rotateDirection: 'counterclockwise',
      rectangleTextDirection: last?.rectangleTextDirection || 'horizontal',
      rectangleTextPosition: nextPosition,
      rectangleTextAlignment: last?.rectangleTextAlignment || 'center',
      rectangleVerticalAlignment: last?.rectangleVerticalAlignment || 'center',
      rectangleLineSpacing: last?.rectangleLineSpacing || 0,
      rectangleTextMargin: last?.rectangleTextMargin || 1,
      rectanglePositionX: last?.rectanglePositionX || 0,
      rectanglePositionY: last?.rectanglePositionY || 0
    }
  }

  const nextBorderOffset = last ? last.borderOffset + last.fontHeight : 1
  return {
    companyName: '新公司名称',
    compression: 1,
    borderOffset: nextBorderOffset,
    textDistributionFactor: 3,
    fontFamily: last?.fontFamily || 'SimSun',
    fontHeight: last?.fontHeight || 4.2,
    fontWeight: last?.fontWeight || 'normal',
    shape: 'ellipse',
    adjustEllipseText: false,
    adjustEllipseTextFactor: 0.5,
    startAngle: last?.startAngle || 0,
    rotateDirection: last?.rotateDirection || 'counterclockwise',
    rectangleTextDirection: 'horizontal',
    rectangleTextPosition: 'center',
    rectangleTextAlignment: 'center',
    rectangleVerticalAlignment: 'center',
    rectangleLineSpacing: 0,
    rectangleTextMargin: 1
  }
}

const createStampTypeConfig = (cfg: IDrawStampConfig): IStampType => {
  const list = cfg.stampTypeList || []
  const last = list[list.length - 1]
  let newPositionY = -3
  if (last) {
    newPositionY = last.positionY + last.fontHeight
  }
  return {
    stampType: t('elementList.defaults.newStampType'),
    fontHeight: last?.fontHeight || 4.0,
    fontFamily: last?.fontFamily || 'SimSun',
    compression: last?.compression ?? 0.75,
    letterSpacing: last?.letterSpacing ?? 0,
    positionY: newPositionY,
    positionX: last?.positionX ?? 0,
    fontWeight: last?.fontWeight || 'normal',
    lineSpacing: last?.lineSpacing ?? 2,
    fontWidth: last?.fontWidth ?? 3,
    orientation: last?.orientation || 'horizontal',
    color: last?.color || cfg.primaryColor,
    rotation: last?.rotation ?? 0
  }
}

const addCompanyItem = () => {
  stampStore.updateConfig((config) => {
    if (!config.companyList) {
      config.companyList = []
    }
    const newCompany = createCompanyConfig(config)
    config.companyList.push(newCompany)
    const newIndex = config.companyList.length - 1
    nextTick(() => {
      selectElement(`company-${newIndex}`, 'company', newIndex)
    })
  })

  emit('updateConfig')
  emit('refresh')
}

const addStampTypeItem = () => {
  stampStore.updateConfig((config) => {
    if (!config.stampTypeList) {
      config.stampTypeList = []
    }
    const newType = createStampTypeConfig(config)
    config.stampTypeList.push(newType)
    const newIndex = config.stampTypeList.length - 1
    nextTick(() => {
      selectElement(`stampType-${newIndex}`, 'stampType', newIndex)
    })
  })

  emit('updateConfig')
  emit('refresh')
}

const addCodeItem = () => {
  stampStore.updateConfig((config) => {
    if (!config.stampCodeList) {
      config.stampCodeList = []
      if (config.stampCode) {
        config.stampCodeList.push({ ...config.stampCode })
      }
    }
    const base = config.stampCodeList[config.stampCodeList.length - 1] || config.stampCode || {
      code: '',
      compression: 1,
      fontHeight: 1.2,
      fontFamily: 'Arial',
      borderOffset: 1,
      fontWidth: 1.2,
      textDistributionFactor: 50,
      fontWeight: 'normal',
      color: config.primaryColor || '#d40000'
    }
    config.stampCodeList.push({ ...base, code: '' })
    const newIndex = config.stampCodeList.length - 1
    nextTick(() => {
      selectElement(`code-${newIndex}`, 'code', newIndex)
    })
    config.stampCode = config.stampCodeList[0]
  })

  emit('updateConfig')
  emit('refresh')
}

// 添加图片
const addImage = () => {
  stampStore.updateConfig((config) => {
    if (!config.imageList) {
      config.imageList = []
    }
    if (config.imageList.length < 10) {
      config.imageList.push({
        imageUrl: '',
        imageWidth: 10,
        imageHeight: 10,
        positionX: 0,
        positionY: 0,
        keepAspectRatio: true,
        rotation: 0
      } as IDrawImage)
      // 自动选中新添加的图片
      const newIndex = config.imageList.length - 1
      nextTick(() => {
        selectElement(`image-${newIndex}`, 'image', newIndex)
      })
    }
  })

  emit('updateConfig')
  emit('refresh')
}

// 添加内圈圆
const addInnerCircle = () => {
  stampStore.updateConfig((config) => {
    if (!config.innerCircleList) {
      config.innerCircleList = []
    }
    config.innerCircleList.push({
      drawInnerCircle: true,
      innerCircleLineWidth: 0.5,
      innerCircleLineRadiusX: 16,
      innerCircleLineRadiusY: 12,
      lineStyle: 'solid',
      dashLength: 2,
      gapLength: 1
    })
    const newIndex = config.innerCircleList.length - 1
    nextTick(() => {
      selectElement(`circle-${newIndex}`, 'circle', newIndex)
    })
  })

  emit('updateConfig')
  emit('refresh')
}

const createSvgItem = (name: string, content: string, cfg: IDrawStampConfig): ISvgShape => ({
  id: crypto?.randomUUID ? crypto.randomUUID() : `svg-${Date.now()}`,
  name: name || `SVG ${cfg.svgList ? cfg.svgList.length + 1 : 1}`,
  svgContent: content,
  color: cfg.primaryColor || '#d40000',
  width: 12,
  height: 12,
  positionX: 0,
  positionY: 0,
  rotation: 0,
  scale: 1,
  keepAspectRatio: true,
  version: Date.now()
})

const addSvgFromContent = (name: string, content: string) => {
  stampStore.updateConfig((config) => {
    if (!config.svgList) {
      config.svgList = []
    }
    config.svgList.push(createSvgItem(name, content, config))
    const newIndex = config.svgList.length - 1
    nextTick(() => {
      selectElement(`svg-${newIndex}`, 'svg', newIndex)
    })
  })

  emit('updateConfig')
  emit('refresh')
}

const triggerSvgUpload = () => {
  svgFileInput.value?.click()
}

const handleSvgFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  try {
    const text = await file.text()
    addSvgFromContent(file.name.replace(/\.svg$/i, ''), text)
  } catch (error) {
    console.error(t('errors.readSvgFailed') + ':', error)
  } finally {
    input.value = ''
  }
}

// 暴露给父组件调用，方便从工具栏快速添加元素
defineExpose({
  addCompanyItem,
  addStampTypeItem,
  addCodeItem,
  addImage,
  addInnerCircle,
  addLine,
  triggerSvgUpload
})
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

.add-image-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  background: #f0f0f0;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #666;
}

.add-image-button:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

.line-action-buttons {
  display: flex;
  gap: 8px;
  margin: 8px 0;
  flex-direction: column;
}

.add-line-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: #f5f5f5;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #666;
}

.add-line-button:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

.add-icon {
  font-size: 16px;
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

