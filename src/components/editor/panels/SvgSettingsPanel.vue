<template>
  <div class="control-group svg-settings-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>{{ t('stamp.svg.title') }}<span class="expand-icon" :class="{ expanded }">▼</span></h3>
    </div>
    <div class="group-content" v-show="expanded">
      <div class="upload-row">
        <input
          ref="svgFileInput"
          type="file"
          accept=".svg"
          style="display: none"
          @change="handleSvgUpload"
        />
        <button class="add-svg-button" @click.stop="triggerSvgUpload">{{ t('stamp.svg.uploadSvgFile') }}</button>
      </div>
      <div class="asset-row" v-if="builtinSvgAssets.length">
        <select v-model="selectedAssetKey">
          <option v-for="asset in builtinSvgAssets" :key="asset.key" :value="asset.key">
            {{ asset.name }}
          </option>
        </select>
        <button class="add-asset-button" @click="addSelectedAsset" :disabled="!selectedAssetKey">
          {{ t('stamp.svg.addBuiltinSvg') }}
        </button>
      </div>
      <p v-if="svgList.length === 0" class="empty-hint">
        {{ t('stamp.svg.emptyHint') }}
      </p>
      <div
        v-for="(item, index) in svgList"
        :key="item.id || `svg-${index}`"
        class="svg-item"
      >
        <div class="svg-header">
          <div class="header-left">
            <button
              class="expand-toggle-btn"
              @click.stop="toggleItem(index)"
              :title="isItemExpanded(index) ? t('stamp.common.collapse') : t('stamp.common.expand')"
            >
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ item.name || t('elementList.defaults.svgIndex', { index: index + 1 }) }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copySvg(index)">{{ t('stamp.common.copy') }}</button>
            <button class="action-btn delete-btn" @click.stop="removeSvg(index)">{{ t('stamp.common.delete') }}</button>
          </div>
        </div>
        <transition name="fade">
          <div v-show="isItemExpanded(index)" class="svg-body">
            <!-- 文本/选择类设置 -->
            <div class="settings-section">
              <div class="text-input-item">
                <div class="text-input-header">
                  <span class="text-input-label">{{ t('stamp.svg.name') }}:</span>
                </div>
                <input
                  type="text"
                  class="text-input-field"
                  :value="item.name"
                  @input="event => updateField(index, 'name', (event.target as HTMLInputElement).value)"
                />
              </div>
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.svg.color') }}:</span>
                <input
                  type="color"
                  :value="item.color || primaryColor"
                  @input="event => updateColor(index, (event.target as HTMLInputElement).value)"
                />
              </label>
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.svg.width') }}:</span>
                <input
                  type="number"
                  min="1"
                  max="200"
                  step="0.1"
                  :value="item.width"
                  @input="event => updateField(index, 'width', parseNumber(event))"
                />
              </label>
              <label class="inline-label">
                <span class="label-text">{{ t('stamp.svg.height') }}:</span>
                <input
                  type="number"
                  min="1"
                  max="200"
                  step="0.1"
                  :value="item.height"
                  :disabled="item.keepAspectRatio"
                  @input="event => updateField(index, 'height', parseNumber(event))"
                />
              </label>
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="item.keepAspectRatio"
                  @change="event => updateField(index, 'keepAspectRatio', (event.target as HTMLInputElement).checked)"
                />
                {{ t('stamp.svg.keepAspectRatio') }}
              </label>
            </div>

            <!-- 拖动条类设置 -->
            <div class="range-section">
              <div class="range-item">
                <div class="range-header">
                  <span class="range-label-text">{{ t('stamp.svg.horizontalPositionX') }}</span>
                  <span class="range-value-display">[ {{ (item.positionX || 0).toFixed(1) }} ]</span>
                </div>
                <div class="range-container">
                  <button type="button" class="range-btn" @click.stop="adjustPositionX(index, -0.2)">◀</button>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="0.2"
                    :value="item.positionX"
                    @input="event => updateField(index, 'positionX', parseNumber(event))"
                  />
                  <button type="button" class="range-btn" @click.stop="adjustPositionX(index, 0.2)">▶</button>
                </div>
              </div>
              <div class="range-item">
                <div class="range-header">
                  <span class="range-label-text">{{ t('stamp.svg.verticalPositionY') }}</span>
                  <span class="range-value-display">[ {{ (item.positionY || 0).toFixed(1) }} ]</span>
                </div>
                <div class="range-container">
                  <button type="button" class="range-btn" @click.stop="adjustPositionY(index, -0.2)">◀</button>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="0.2"
                    :value="item.positionY"
                    @input="event => updateField(index, 'positionY', parseNumber(event))"
                  />
                  <button type="button" class="range-btn" @click.stop="adjustPositionY(index, 0.2)">▶</button>
                </div>
              </div>
              <div class="range-item">
                <div class="range-header">
                  <span class="range-label-text">{{ t('stamp.svg.rotationAngle') }}</span>
                  <span class="range-value-display">[ {{ (item.rotation || 0).toFixed(1) }}° ]</span>
                </div>
                <div class="range-container">
                  <button type="button" class="range-btn" @click.stop="adjustRotation(index, -0.1)">◀</button>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="0.1"
                    :value="item.rotation"
                    @input="event => updateField(index, 'rotation', parseNumber(event))"
                  />
                  <button type="button" class="range-btn" @click.stop="adjustRotation(index, 0.1)">▶</button>
                </div>
              </div>
              <div class="range-item">
                <div class="range-header">
                  <span class="range-label-text">{{ t('stamp.svg.scale') }}</span>
                  <span class="range-value-display">[ {{ (item.scale || 1).toFixed(2) }} ]</span>
                </div>
                <div class="range-container">
                  <button type="button" class="range-btn" @click.stop="adjustScale(index, -0.01)">◀</button>
                  <input
                    type="range"
                    min="0.2"
                    max="3"
                    step="0.01"
                    :value="item.scale"
                    @input="event => updateField(index, 'scale', parseNumber(event))"
                  />
                  <button type="button" class="range-btn" @click.stop="adjustScale(index, 0.01)">▶</button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, ISvgShape } from '../../../DrawStampTypes'
import { getSvgAssets } from '../../../utils/svgAssets'

const { t } = useI18n()

interface Props {
  expanded?: boolean
  config: IDrawStampConfig
  selectedIndex?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const expanded = ref(props.expanded ?? true)

watch(
  () => props.expanded,
  (value) => {
    if (value !== undefined) {
      expanded.value = value
    }
  }
)

const toggleExpanded = () => {
  const next = !expanded.value
  expanded.value = next
  emit('update:expanded', next)
}

const svgFileInput = ref<HTMLInputElement | null>(null)
const triggerSvgUpload = () => {
  svgFileInput.value?.click()
}

const svgList = computed(() => props.config.svgList || [])
const primaryColor = computed(() => props.config.primaryColor || '#d40000')
const builtinSvgAssets = getSvgAssets()
const selectedAssetKey = ref(builtinSvgAssets[0]?.key || '')

const parseNumber = (event: Event) => {
  return Number((event.target as HTMLInputElement).value) || 0
}

const ensureSvgList = (config: IDrawStampConfig) => {
  if (!config.svgList) {
    config.svgList = []
  }
}

const handleSvgUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  try {
    const text = await file.text()
    addSvgItem(file.name.replace(/\.svg$/i, ''), text)
  } catch (error) {
    console.error('读取 SVG 文件失败:', error)
  } finally {
    input.value = ''
  }
}

const addSelectedAsset = () => {
  if (!selectedAssetKey.value) return
  const asset = builtinSvgAssets.find((item) => item.key === selectedAssetKey.value)
  if (!asset) return
  addSvgItem(asset.name, asset.content)
}

const createSvgItem = (name: string, content: string, config: IDrawStampConfig): ISvgShape => ({
  id: crypto?.randomUUID ? crypto.randomUUID() : `svg-${Date.now()}`,
  name: name || `SVG ${config.svgList.length + 1}`,
  svgContent: content,
  color: config.primaryColor || '#d40000',
  width: 12,
  height: 12,
  positionX: 0,
  positionY: 0,
  rotation: 0,
  scale: 1,
  keepAspectRatio: true,
  version: Date.now()
})

const addSvgItem = (name: string, content: string) => {
  emit('update-config', (config) => {
    ensureSvgList(config)
    config.svgList.push(createSvgItem(name, content, config))
  })
}

const updateField = (index: number, field: keyof ISvgShape, value: any) => {
  emit('update-config', (config) => {
    ensureSvgList(config)
    if (!config.svgList[index]) return
    ;(config.svgList[index] as any)[field] = value
    if (field === 'color' || field === 'svgContent') {
      config.svgList[index].version = Date.now()
    }
  })
}

const updateColor = (index: number, value: string) => {
  if (!value) return
  updateField(index, 'color', value)
}

const removeSvg = (index: number) => {
  emit('update-config', (config) => {
    ensureSvgList(config)
    config.svgList.splice(index, 1)
  })
}

const copySvg = (index: number) => {
  emit('update-config', (config) => {
    ensureSvgList(config)
    const original = config.svgList[index]
    if (!original) return
    const clone: ISvgShape = {
      ...original,
      id: crypto?.randomUUID ? crypto.randomUUID() : `svg-${Date.now()}`,
      name: `${original.name || 'SVG'} ${t('stamp.svg.copy')}`,
      positionX: (original.positionX || 0) + 1,
      positionY: (original.positionY || 0) + 1,
      version: Date.now()
    }
    config.svgList.splice(index + 1, 0, clone)
  })
}

const expandedItems = ref<Record<number, boolean>>({})

const isItemExpanded = (index: number) => {
  return expandedItems.value[index] ?? false
}

const toggleItem = (index: number) => {
  const current = expandedItems.value[index]
  if (current) {
    expandedItems.value = {}
  } else {
    expandedItems.value = { [index]: true }
  }
}

watch(
  () => props.selectedIndex,
  (value) => {
    if (value !== undefined && value >= 0) {
      expandedItems.value = { [value]: true }
    } else {
      expandedItems.value = {}
    }
  }
)

const adjustPositionX = (index: number, delta: number) => {
  emit('update-config', (config) => {
    ensureSvgList(config)
    if (!config.svgList[index]) return
    const currentValue = config.svgList[index].positionX || 0
    const newValue = Math.max(-50, Math.min(50, currentValue + delta))
    config.svgList[index].positionX = newValue
    config.svgList[index].version = Date.now()
  })
}

const adjustPositionY = (index: number, delta: number) => {
  emit('update-config', (config) => {
    ensureSvgList(config)
    if (!config.svgList[index]) return
    const currentValue = config.svgList[index].positionY || 0
    const newValue = Math.max(-50, Math.min(50, currentValue + delta))
    config.svgList[index].positionY = newValue
    config.svgList[index].version = Date.now()
  })
}

const adjustRotation = (index: number, delta: number) => {
  emit('update-config', (config) => {
    ensureSvgList(config)
    if (!config.svgList[index]) return
    const currentValue = config.svgList[index].rotation || 0
    const newValue = Math.max(-180, Math.min(180, currentValue + delta))
    config.svgList[index].rotation = newValue
    config.svgList[index].version = Date.now()
  })
}

const adjustScale = (index: number, delta: number) => {
  emit('update-config', (config) => {
    ensureSvgList(config)
    if (!config.svgList[index]) return
    const currentValue = config.svgList[index].scale || 1
    const newValue = Math.max(0.2, Math.min(3, currentValue + delta))
    config.svgList[index].scale = newValue
    config.svgList[index].version = Date.now()
  })
}
</script>

<style scoped>
.svg-body {
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 文本/选择类设置区域 */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 拖动条类设置区域 */
.range-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.svg-settings-group label {
  display: flex;
  flex-direction: row;
  font-size: 13px;
  color: #374151;
  gap: 4px;
  margin-bottom: 0;
}

.inline-label {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.inline-label .label-text {
  min-width: 100px;
  flex-shrink: 0;
  font-size: 13px;
  color: #374151;
}

.inline-label input[type="number"],
.inline-label input[type="color"],
.inline-label select {
  flex: 1;
  width: 0;
  min-width: 0;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.inline-label input[type="number"]:focus,
.inline-label select:focus {
  border-color: #3b82f6;
  outline: none;
}

.inline-label input[type="color"] {
  width: 40px;
  height: 28px;
  padding: 2px;
  cursor: pointer;
}

.checkbox-label {
  flex-direction: row !important;
  align-items: center;
  cursor: pointer;
  gap: 6px;
}

.checkbox-label input[type='checkbox'] {
  margin: 0;
  cursor: pointer;
}

/* 文本输入项样式（两行显示） */
.text-input-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.text-input-header {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.text-input-label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.text-input-field {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.text-input-field:focus {
  border-color: #3b82f6;
  outline: none;
}

/* 拖动条项样式 */
.range-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.range-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.range-label-text {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.range-value-display {
  font-size: 12px;
  color: #6b7280;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.upload-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.asset-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.asset-row select {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
}

.add-asset-button {
  padding: 6px 12px;
  border: 1px solid #dcdcdc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-asset-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-svg-button {
  padding: 8px 16px;
  border: 1px solid #dcdcdc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-svg-button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.empty-hint {
  font-size: 13px;
  color: #888;
  margin: 12px 0;
}

.svg-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fff;
}

.svg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, #fafafa, #f5f5f5);
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.2s;
  gap: 12px;
}

.action-btn {
  padding: 4px 10px;
  border: 1px solid #dcdcdc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.delete-btn {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.delete-btn:hover {
  background: #fff1f0;
}

.range-container {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.range-btn {
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background-color: #f9fafb;
  color: #6b7280;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  line-height: 1;
}

.range-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.range-btn:active {
  background-color: #e5e7eb;
}

.range-container input[type="range"] {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
}

.range-container input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.range-container input[type="range"]::-webkit-slider-thumb:hover {
  background: #2563eb;
}

.range-container input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease;
}

.range-container input[type="range"]::-moz-range-thumb:hover {
  background: #2563eb;
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
</style>

