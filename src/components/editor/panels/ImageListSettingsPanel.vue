<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.images.title') }}
        <span class="expand-icon" :class="{ expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <div v-for="(image, index) in imageList" :key="index" class="image-item">
        <div class="image-header">
          <span>{{ t('stamp.images.image', { index: index + 1 }) }}</span>
          <button class="small-button delete-button" @click="removeImage(index)">删除</button>
        </div>
        <div class="image-preview" v-if="image.imageUrl">
          <img :src="image.imageUrl" :alt="t('stamp.common.preview')" />
        </div>
        <label>
          {{ t('stamp.images.select') }}:
          <input type="file" @change="(e) => handleImageUpload(e, index)" accept="image/*" />
        </label>
        <label>
          {{ t('stamp.images.width') }}:
          <input
            type="number"
            :value="image.imageWidth"
            min="1"
            max="100"
            step="0.5"
            @input="updateImage(index, 'imageWidth', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.images.height') }}:
          <input
            type="number"
            :value="image.imageHeight"
            min="1"
            max="100"
            step="0.5"
            @input="updateImage(index, 'imageHeight', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.images.positionX') }}:
          <input
            type="number"
            :value="image.positionX"
            min="-20"
            max="20"
            step="0.5"
            @input="updateImage(index, 'positionX', parseNumber($event))"
          />
        </label>
        <label>
          {{ t('stamp.images.positionY') }}:
          <input
            type="number"
            :value="image.positionY"
            min="-20"
            max="20"
            step="0.5"
            @input="updateImage(index, 'positionY', parseNumber($event))"
          />
        </label>
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="image.keepAspectRatio"
            @change="updateImage(index, 'keepAspectRatio', ($event.target as HTMLInputElement).checked)"
          />
          {{ t('stamp.images.keepRatio') }}
        </label>
      </div>
      <button class="add-button" @click="addImage">
        {{ t('stamp.common.addNew') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IDrawStampConfig, IDrawImage } from '../../../DrawStampTypes'

const { t } = useI18n()

const props = defineProps<{
  expanded: boolean
  config: IDrawStampConfig
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const imageList = computed(() => props.config.imageList || [])

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const parseNumber = (event: Event) => Number((event.target as HTMLInputElement).value)

const updateImage = <K extends keyof IDrawImage>(
  index: number,
  key: K,
  value: IDrawImage[K]
) => {
  emit('update-config', (config) => {
    const list = config.imageList || []
    if (!list[index]) return
    list[index][key] = value
  })
}

const removeImage = (index: number) => {
  emit('update-config', (config) => {
    config.imageList?.splice(index, 1)
  })
}

const addImage = () => {
  emit('update-config', (config) => {
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
        keepAspectRatio: true
      })
    }
  })
}

const handleImageUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        updateImage(index, 'imageUrl', e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
}
</script>

