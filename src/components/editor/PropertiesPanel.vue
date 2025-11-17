<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3>属性设置</h3>
    </div>
    <div class="panel-content">
      <EditorControls
        v-if="drawStampUtils"
        ref="editorControlsRef"
        :drawStampUtils="drawStampUtils"
        @updateDrawStamp="handleUpdateDrawStamp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import EditorControls from '../../EditorControls.vue'
import { IDrawStampConfig } from '../../DrawStampTypes'

interface Props {
  drawStampUtils: any
  selectedElement?: string
  elementType?: string
  elementIndex?: number
}

const props = defineProps<Props>()

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
const elementTypeToGroupMap: Record<string, 'basic' | 'company' | 'stampType' | 'code' | 'taxNumber' | 'star' | 'innerCircle' | 'images'> = {
  'basic': 'basic',
  'company': 'company',
  'stampType': 'stampType',
  'code': 'code',
  'taxNumber': 'taxNumber',
  'star': 'star',
  'circle': 'innerCircle',
  'image': 'images'
}

// 监听元素选择变化，自动展开对应的设置组
watch(() => props.elementType, (newType) => {
  if (newType && editorControlsRef.value) {
    const groupName = elementTypeToGroupMap[newType]
    if (groupName) {
      nextTick(() => {
        editorControlsRef.value?.expandGroup(groupName)
      })
    }
  }
}, { immediate: true })

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
  width: 300px;
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
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
}
</style>

