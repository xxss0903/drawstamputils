<template>
  <div class="control-group stamp-code-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.code.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <div v-for="(code, index) in codeList" :key="index" class="code-item">
        <div class="code-header">
          <div class="header-left">
            <button
              class="expand-toggle-btn"
              @click.stop="toggleItem(index)"
              :title="isItemExpanded(index) ? '收起' : '展开'"
            >
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ t('stamp.common.line', { index: index + 1 }) }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copyCode(index)">
              复制
            </button>
            <button class="small-button delete-button" @click.stop="removeCode(index)">
              {{ t('stamp.common.delete') }}
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="code-body">
      <label>
        {{ t('stamp.code.code') }}:
        <input
          type="text"
          :value="code.code"
          @input="updateCode(index, 'code', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <!-- 顶部文字工具栏：字体 / 字号 / 粗体 / 颜色 -->
      <div class="text-toolbar">
        <select
          :value="code.fontFamily"
          class="toolbar-font-select"
          @change="updateCode(index, 'fontFamily', ($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="font in systemFonts"
            :key="font"
            :value="font"
            :style="{ fontFamily: font }"
          >
            {{ getFontDisplayName(font) }}
          </option>
        </select>
        <input
          type="number"
          class="toolbar-font-size"
          :value="code.fontHeight"
          min="1"
          max="10"
          step="0.1"
          @input="updateCode(index, 'fontHeight', parseNumber($event))"
        />
      </div>
      <div class="text-toolbar">
        <button
          type="button"
          class="toolbar-bold-btn"
          :class="{ active: code.fontWeight === 'bold' || code.fontWeight === 700 }"
          @click="toggleBold(index)"
        >
          B
        </button>
        <label class="toolbar-color-wrapper">
          <span class="toolbar-color-swatch" :style="{ backgroundColor: code.color || primaryColor }"></span>
          <input
            type="color"
            class="toolbar-color-input"
            :value="code.color || primaryColor"
            @input="onColorInput(index, $event)"
          />
        </label>
      </div>
      <label>
        <span>{{ t('stamp.common.compression', { value: code.compression.toFixed(2) }) }}</span>
        <input
          type="range"
          :value="code.compression"
          min="0.0"
          max="3"
          step="0.01"
          @input="updateCode(index, 'compression', parseNumber($event))"
        />
      </label>
      <label>
        <span>{{ t('stamp.common.distribution', { value: code.textDistributionFactor.toFixed(1) }) }}</span>
        <input
          type="range"
          :value="code.textDistributionFactor"
          min="0"
          max="100"
          step="0.5"
          @input="updateCode(index, 'textDistributionFactor', parseNumber($event))"
        />
      </label>
      <label>
        {{ t('stamp.code.margin') }}:
        <input
          type="number"
          :value="code.borderOffset"
          min="-10"
          max="20"
          step="0.01"
          @input="updateCode(index, 'borderOffset', parseNumber($event))"
        />
      </label>
        </div>
        </transition>
      </div>
      <button class="add-button" @click="addCode">{{ t('stamp.common.addNew') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, ICode } from '../../../DrawStampTypes'
import { getFontDisplayName } from '../../../utils/fontUtils'

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
  systemFonts: string[]
  selectedIndex?: number
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const primaryColor = computed(() => props.config.primaryColor || '#d40000')
const selectedIndex = computed(() => props.selectedIndex ?? -1)

const codeList = computed(() => {
  const cfg = props.config
  if (cfg.stampCodeList && cfg.stampCodeList.length > 0) return cfg.stampCodeList
  return cfg.stampCode ? [cfg.stampCode] : []
})

// 跟踪每个编码项的展开状态
const expandedItems = ref<Record<number, boolean>>({})

// 当选中索引变化时，自动只展开当前选中项，收起其他项
watch(
  selectedIndex,
  (newIndex) => {
    if (newIndex >= 0) {
      Object.keys(expandedItems.value).forEach((key) => {
        expandedItems.value[Number(key)] = false
      })
      expandedItems.value[newIndex] = true
    }
  },
  { immediate: true }
)

const toggleItem = (index: number) => {
  if (expandedItems.value[index]) {
    expandedItems.value[index] = false
  } else {
    Object.keys(expandedItems.value).forEach((key) => {
      expandedItems.value[Number(key)] = false
    })
    expandedItems.value[index] = true
  }
}

const isItemExpanded = (index: number) => {
  if (selectedIndex.value === index) {
    return true
  }
  return expandedItems.value[index] ?? false
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateCode = <K extends keyof ICode>(
  index: number,
  key: K,
  value: ICode[K]
) => {
  emit('update-config', (config) => {
    if (!config.stampCodeList) {
      config.stampCodeList = []
      if (config.stampCode) {
        config.stampCodeList.push({ ...config.stampCode })
      }
    }
    const list = config.stampCodeList
    if (!list[index]) return
    list[index][key] = value
    // 同步第一条到单个 stampCode，兼容旧逻辑
    config.stampCode = list[0]
  })
}

const onColorInput = (index: number, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  updateCode(index, 'color', value)
}

const toggleBold = (index: number) => {
  emit('update-config', (config) => {
    if (!config.stampCodeList) {
      config.stampCodeList = []
      if (config.stampCode) {
        config.stampCodeList.push({ ...config.stampCode })
      }
    }
    const list = config.stampCodeList
    if (!list[index]) return
    const current = list[index].fontWeight
    if (current === 'bold' || current === 700) {
      list[index].fontWeight = 'normal'
    } else {
      list[index].fontWeight = 'bold'
    }
    config.stampCode = list[0]
  })
}

const removeCode = (index: number) => {
  emit('update-config', (config) => {
    if (!config.stampCodeList) {
      // 如果还没有列表结构，则尝试从单个 stampCode 删除
      if (index === 0 && config.stampCode) {
        config.stampCode = {
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
      }
      return
    }
    config.stampCodeList.splice(index, 1)
    // 同步第一条到单个 stampCode，兼容旧逻辑
    config.stampCode = config.stampCodeList[0] || {
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
  })
}

const copyCode = (index: number) => {
  emit('update-config', (config) => {
    if (!config.stampCodeList) {
      config.stampCodeList = []
      if (config.stampCode) {
        config.stampCodeList.push({ ...config.stampCode })
      }
    }
    const list = config.stampCodeList
    if (!list[index]) return
    const original = list[index]
    const clone: ICode = {
      ...original,
      code: original.code
    }
    list.splice(index + 1, 0, clone)
    config.stampCode = list[0]
  })
}
const addCode = () => {
  emit('update-config', (config) => {
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
    config.stampCode = config.stampCodeList[0]
  })
}
</script>

<style scoped>
.code-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fff;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.2s;
  gap: 12px;
}

.code-header:hover {
  background: linear-gradient(to bottom, #f5f5f5, #f0f0f0);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}

.action-btn {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
  font-size: 12px;
  white-space: nowrap;
}

.action-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
  background: #e6f7ff;
}

.delete-btn:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
  background: #fff1f0;
}

.code-body {
  padding: 12px 12px 4px;
}

.expand-toggle-btn {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
  min-width: 24px;
  height: 24px;
}

.expand-toggle-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
  background: #e6f7ff;
}

.expand-icon {
  font-size: 10px;
  transition: transform 0.2s;
  display: inline-block;
  line-height: 1;
}

.expand-icon.expanded {
  transform: rotate(0deg);
}

.expand-icon:not(.expanded) {
  transform: rotate(-90deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}

.toolbar-font-select {
  min-width: 120px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 13px;
}

.toolbar-font-size {
  width: 60px;
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 13px;
}

.toolbar-bold-btn {
  width: 28px;
  height: 26px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
}

.toolbar-bold-btn.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.toolbar-color-wrapper {
  position: relative;
  width: 32px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  overflow: hidden;
  cursor: pointer;
}

.toolbar-color-swatch {
  width: 100%;
  height: 100%;
  display: block;
}

.toolbar-color-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}




</style>
