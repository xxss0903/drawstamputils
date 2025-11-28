<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3>{{ t('common.properties.title') }}</h3>
      <label class="show-all-toggle">
        <input type="checkbox" v-model="showAll" />
        <span>{{ t('common.properties.showAll') }}</span>
      </label>
    </div>
    <div class="panel-content">
      <EditorControls
        v-if="drawStampUtils"
        ref="editorControlsRef"
        :drawStampUtils="drawStampUtils"
        :selected-element-type="elementType"
        :selected-element-index="elementIndex"
        :show-all="showAll"
        @updateDrawStamp="handleUpdateDrawStamp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import EditorControls from '../../EditorControls.vue'
import { IDrawStampConfig } from '../../DrawStampTypes'

const { t } = useI18n()

interface Props {
  drawStampUtils: any
  selectedElement?: string
  elementType?: string
  elementIndex?: number
}

const props = defineProps<Props>()

// 控制是否显示全部设置面板，默认关闭
const showAll = ref(false)

const emit = defineEmits<{
  (e: 'updateDrawStamp', config: IDrawStampConfig, refreshSecurityPattern: boolean, refreshOld: boolean, refreshRoughEdge: boolean): void
}>()

const editorControlsRef = ref<InstanceType<typeof EditorControls> | null>(null)

const handleUpdateDrawStamp = (
  config: IDrawStampConfig,
  refreshSecurityPattern: boolean,
  refreshOld: boolean,
  refreshRoughEdge: boolean
) => {
  emit('updateDrawStamp', config, refreshSecurityPattern, refreshOld, refreshRoughEdge)
}

// 元素类型到设置组名称的映射
const elementTypeToGroupMap: Record<string, 'basic' | 'company' | 'stampType' | 'code' | 'taxNumber' | 'star' | 'innerCircle' | 'images' | 'svg' | 'aging' | 'roughEdge' | 'security' | 'lines'> = {
  'basic': 'basic',
  'company': 'company',
  'stampType': 'stampType',
  'code': 'code',
  'taxNumber': 'taxNumber',
  'star': 'star',
  'circle': 'innerCircle',
  'image': 'images',
  'svg': 'svg',
  'aging': 'aging',
  'roughEdge': 'roughEdge',
  'security': 'security',
  'line': 'lines'
}

// 元素类型变化时，EditorControls 会根据 selectedElementType 自动显示/隐藏对应的 control-group
// 这里不需要额外的处理逻辑

// 暴露方法供父组件调用
defineExpose({
  restoreDrawConfigs: () => {
    editorControlsRef.value?.restoreDrawConfigs()
  },
  scrollToCompanyText: (index: number) => {
    editorControlsRef.value?.scrollToCompanyText(index)
  },
  scrollToCode: () => {
    editorControlsRef.value?.scrollToCode()
  },
  scrollToStampType: (index: number) => {
    editorControlsRef.value?.scrollToStampType(index)
  },
  scrollToTaxNumber: () => {
    editorControlsRef.value?.scrollToTaxNumber()
  }
})
</script>

<style scoped>
.properties-panel {
  width: 330px;
  background: white;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 60vh;
  overflow: hidden;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.show-all-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  user-select: none;
}

.show-all-toggle input[type="checkbox"] {
  cursor: pointer;
}

.show-all-toggle span {
  cursor: pointer;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
}
</style>

