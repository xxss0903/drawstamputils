<template>
  <div class="control-group svg-settings-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>SVG 图形设置</h3>
      <span class="expand-icon" :class="{ expanded }">▼</span>
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
        <button class="add-svg-button" @click.stop="triggerSvgUpload">上传 SVG 文件</button>
      </div>
      <div class="asset-row" v-if="builtinSvgAssets.length">
        <select v-model="selectedAssetKey">
          <option v-for="asset in builtinSvgAssets" :key="asset.key" :value="asset.key">
            {{ asset.name }}
          </option>
        </select>
        <button class="add-asset-button" @click="addSelectedAsset" :disabled="!selectedAssetKey">
          添加内置 SVG
        </button>
      </div>
      <p v-if="svgList.length === 0" class="empty-hint">
        暂无 SVG 图形，请上传 SVG 文件。
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
              :title="isItemExpanded(index) ? '收起' : '展开'"
            >
              <span class="expand-icon" :class="{ expanded: isItemExpanded(index) }">▼</span>
            </button>
            <span>{{ item.name || `SVG ${index + 1}` }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="copySvg(index)">复制</button>
            <button class="action-btn delete-btn" @click.stop="removeSvg(index)">删除</button>
          </div>
        </div>
        <transition name="fade">
          <div v-show="isItemExpanded(index)" class="svg-body">
            <label>
              名称:
              <input
                type="text"
                :value="item.name"
                @input="event => updateField(index, 'name', (event.target as HTMLInputElement).value)"
              />
            </label>
            <label class="color-field">
              颜色:
              <div class="color-inputs">
                <input
                  type="color"
                  :value="item.color || '#d40000'"
                  @input="event => updateColor(index, (event.target as HTMLInputElement).value)"
                />
                <input
                  type="text"
                  :value="item.color || '#d40000'"
                  @input="event => updateColor(index, (event.target as HTMLInputElement).value)"
                />
              </div>
            </label>
            <label>
              宽度 (mm):
              <div class="range-container">
                <input
                  type="range"
                  min="1"
                  max="80"
                  step="0.5"
                  :value="item.width"
                  @input="event => updateField(index, 'width', parseNumber(event))"
                />
                <span>{{ (item.width || 0).toFixed(1) }}</span>
              </div>
            </label>
            <label>
              高度 (mm):
              <div class="range-container">
                <input
                  type="range"
                  min="1"
                  max="80"
                  step="0.5"
                  :value="item.height"
                  :disabled="item.keepAspectRatio"
                  @input="event => updateField(index, 'height', parseNumber(event))"
                />
                <span>{{ (item.height || 0).toFixed(1) }}</span>
              </div>
            </label>
            <label class="checkbox-field">
              <input
                type="checkbox"
                :checked="item.keepAspectRatio"
                @change="event => updateField(index, 'keepAspectRatio', (event.target as HTMLInputElement).checked)"
              />
              保持宽高比
            </label>
            <label>
              水平位置 X (mm):
              <div class="range-container">
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="0.2"
                  :value="item.positionX"
                  @input="event => updateField(index, 'positionX', parseNumber(event))"
                />
                <span>{{ (item.positionX || 0).toFixed(1) }}</span>
              </div>
            </label>
            <label>
              垂直位置 Y (mm):
              <div class="range-container">
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="0.2"
                  :value="item.positionY"
                  @input="event => updateField(index, 'positionY', parseNumber(event))"
                />
                <span>{{ (item.positionY || 0).toFixed(1) }}</span>
              </div>
            </label>
            <label>
              旋转角度 (°):
              <div class="range-container">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  :value="item.rotation"
                  @input="event => updateField(index, 'rotation', parseNumber(event))"
                />
                <span>{{ (item.rotation || 0).toFixed(0) }}</span>
              </div>
            </label>
            <label>
              缩放比例:
              <div class="range-container">
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.05"
                  :value="item.scale"
                  @input="event => updateField(index, 'scale', parseNumber(event))"
                />
                <span>{{ (item.scale || 1).toFixed(2) }}</span>
              </div>
            </label>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { IDrawStampConfig, ISvgShape } from '../../../DrawStampTypes'
import { getSvgAssets } from '../../../utils/svgAssets'

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
      name: `${original.name || 'SVG'} 副本`,
      positionX: (original.positionX || 0) + 1,
      positionY: (original.positionY || 0) + 1,
      version: Date.now()
    }
    config.svgList.splice(index + 1, 0, clone)
  })
}

const expandedItems = ref<Record<number, boolean>>({})

const isItemExpanded = (index: number) => {
  if (props.selectedIndex !== undefined && props.selectedIndex === index) {
    return true
  }
  return expandedItems.value[index] ?? false
}

const toggleItem = (index: number) => {
  expandedItems.value[index] = !isItemExpanded(index)
}

watch(
  () => props.selectedIndex,
  (value) => {
    if (value !== undefined && value >= 0) {
      expandedItems.value[value] = true
    }
  }
)
</script>

<style scoped>
.svg-settings-group label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
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
  margin-bottom: 8px;
}

.header-left span {
  font-weight: 600;
  color: #000;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.svg-body {
  margin-top: 10px;
}

.color-field .color-inputs {
  display: flex;
  gap: 8px;
}

.color-inputs input[type="text"] {
  flex: 1;
}

.checkbox-field {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: -4px;
}
</style>

