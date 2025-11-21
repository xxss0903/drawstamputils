<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.stampType.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <div v-for="(type, index) in stampTypeList" :key="index" class="stamp-type-item">
        <div class="stamp-type-header">
          <span>{{ t('stamp.stampType.line', { index: index + 1 }) }}</span>
          <div class="header-actions">
            <button class="small-button" @click.stop="copyStampType(index)">复制</button>
            <button class="small-button delete-button" @click.stop="removeStampType(index)">
              {{ t('stamp.stampType.delete') }}
            </button>
          </div>
        </div>
        <transition name="fade">
        <div v-show="isItemExpanded(index)" class="stamp-type-body">
        <label>
          {{ t('stamp.stampType.type') }}:
          <input
            type="text"
            :value="type.stampType"
            @input="updateStampType(index, 'stampType', ($event.target as HTMLInputElement).value)"
          />
        </label>
        <label>
          {{ t('stamp.stampType.fontSize') }}:
          <input
            type="number"
            :value="type.fontHeight"
            min="1"
            max="10"
            step="0.1"
            @input="updateStampType(index, 'fontHeight', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.stampType.font') }}:
          <div class="font-input-group">
            <input
              type="text"
              :value="type.fontFamily"
              list="stampTypeFontList"
              class="font-input"
              @input="updateStampType(index, 'fontFamily', ($event.target as HTMLInputElement).value)"
            />
            <datalist id="stampTypeFontList">
              <option v-for="font in systemFonts" :key="font" :value="font">
                {{ font }}
              </option>
            </datalist>
          </div>
        </label>
        <label>
          {{ t('stamp.stampType.fontWeight') }}:
          <select
            :value="type.fontWeight"
            @change="updateStampType(index, 'fontWeight', ($event.target as HTMLSelectElement).value)"
          >
            <option value="normal">正常</option>
            <option value="bold">粗体</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </label>
        <label>
          {{ t('stamp.stampType.compression') }}:
          <input
            type="range"
            :value="type.compression"
            min="0.1"
            max="1.5"
            step="0.05"
            @input="updateStampType(index, 'compression', parseNumber($event))"
          />
          <span>{{ type.compression.toFixed(2) }}</span>
        </label>
        <label>
          {{ t('stamp.stampType.letterSpacing') }}:
          <input
            type="range"
            :value="type.letterSpacing"
            min="-1"
            max="10"
            step="0.05"
            @input="updateStampType(index, 'letterSpacing', parseNumber($event))"
          />
          <span>{{ type.letterSpacing.toFixed(2) }}</span>
        </label>
        <label>
          水平位置 X (mm):
          <div class="range-container">
            <input
              type="range"
              :value="type.positionX || 0"
              min="-20"
              max="20"
              step="0.1"
              @input="updateStampType(index, 'positionX', parseNumber($event))"
            />
            <span>{{ (type.positionX || 0).toFixed(1) }}</span>
          </div>
        </label>
        <label>
          垂直位置 Y (mm):
          <div class="range-container">
            <input
              type="range"
              :value="type.positionY"
              min="-20"
              max="20"
              step="0.1"
              @input="updateStampType(index, 'positionY', parseNumber($event))"
            />
            <span>{{ type.positionY.toFixed(1) }}</span>
          </div>
        </label>
        <label>
          显示方向:
          <select
            :value="type.orientation || 'horizontal'"
            @change="updateStampType(index, 'orientation', ($event.target as HTMLSelectElement).value as 'horizontal' | 'vertical')"
          >
            <option value="horizontal">水平</option>
            <option value="vertical">竖直</option>
          </select>
        </label>
        </div>
        </transition>
      </div>
      <button class="add-button" @click="addStampType">
        {{ t('stamp.stampType.addNew') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, IStampType } from '../../../DrawStampTypes'

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

const stampTypeList = computed(() => props.config.stampTypeList || [])
const selectedIndex = computed(() => props.selectedIndex ?? -1)

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateStampType = <K extends keyof IStampType>(
  index: number,
  key: K,
  value: IStampType[K]
) => {
  emit('update-config', (config) => {
    const list = config.stampTypeList || []
    if (!list[index]) return
    list[index][key] = value
  })
}

const removeStampType = (index: number) => {
  emit('update-config', (config) => {
    config.stampTypeList?.splice(index, 1)
  })
}

const copyStampType = (index: number) => {
  emit('update-config', (config) => {
    if (!config.stampTypeList || !config.stampTypeList[index]) return
    const original = config.stampTypeList[index]
    const clone = { ...original, positionY: original.positionY + 2 }
    config.stampTypeList.splice(index + 1, 0, clone)
  })
}

const isItemExpanded = (index: number) => selectedIndex.value === index

const addStampType = () => {
  emit('update-config', (config) => {
    if (!config.stampTypeList) {
      config.stampTypeList = []
    }
    let newPositionY = -3
    if (config.stampTypeList.length > 0) {
      const lastStampType = config.stampTypeList[config.stampTypeList.length - 1]
      newPositionY = lastStampType.positionY + lastStampType.fontHeight
    }
    config.stampTypeList.push({
      stampType: '新印章类型',
      fontHeight: 4.0,
      fontFamily: 'SimSun',
      compression: 0.75,
      letterSpacing: 0,
      positionY: newPositionY,
      fontWeight: 'normal',
      lineSpacing: 2,
      fontWidth: 3,
      orientation: 'horizontal'
    })
  })
}
</script>

<style scoped>
.stamp-type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 6px;
}

.stamp-type-body {
  margin-top: 8px;
}

.range-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-container input[type='range'] {
  flex: 1;
}

.range-container span {
  min-width: 50px;
  text-align: right;
  font-size: 14px;
  color: #666;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>