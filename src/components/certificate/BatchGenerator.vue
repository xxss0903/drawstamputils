<template>
  <div class="batch-generator">
    <div class="generator-header">
      <h2>{{ t('certificate.batch.title') }}</h2>
    </div>

    <div class="generator-content">
      <!-- CSV上传区域 -->
      <div class="upload-section">
        <h3>{{ t('certificate.batch.uploadCsv') }}</h3>
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <input
            ref="fileInputRef"
            type="file"
            accept=".csv"
            @change="handleFileSelect"
            style="display: none"
          />
          <div v-if="!csvData" class="upload-placeholder">
            <p>{{ t('certificate.batch.uploadHint') }}</p>
            <p class="upload-hint-small">{{ t('certificate.batch.uploadHintSmall') }}</p>
          </div>
          <div v-else class="uploaded-info">
            <p>✓ {{ t('certificate.batch.fileLoaded') }}: {{ csvFileName }}</p>
            <p class="data-count">{{ t('certificate.batch.recordCount', { count: csvData.length }) }}</p>
          </div>
        </div>
      </div>

      <!-- 数据预览 -->
      <div v-if="csvData && csvData.length > 0" class="preview-section">
        <h3>{{ t('certificate.batch.dataPreview') }}</h3>
        <div class="preview-table-container">
          <table class="preview-table">
            <thead>
              <tr>
                <th v-for="header in csvHeaders" :key="header">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in previewRows" :key="index">
                <td v-for="header in csvHeaders" :key="header">
                  {{ row[header] || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="preview-pagination" v-if="csvData.length > 10">
          <button @click="previewPage = 0" :disabled="previewPage === 0">«</button>
          <button @click="previewPage--" :disabled="previewPage === 0">‹</button>
          <span>{{ t('certificate.batch.page', { current: previewPage + 1, total: Math.ceil(csvData.length / 10) }) }}</span>
          <button @click="previewPage++" :disabled="previewPage >= Math.ceil(csvData.length / 10) - 1">›</button>
          <button @click="previewPage = Math.ceil(csvData.length / 10) - 1" :disabled="previewPage >= Math.ceil(csvData.length / 10) - 1">»</button>
        </div>
      </div>

      <!-- 字段映射 -->
      <div v-if="csvData && template" class="mapping-section">
        <h3>{{ t('certificate.batch.fieldMapping') }}</h3>
        <div class="mapping-list">
          <div
            v-for="field in template.fields"
            :key="field.id"
            class="mapping-item"
          >
            <label class="mapping-label">{{ field.label }}:</label>
            <select
              v-model="fieldMapping[field.name]"
              class="mapping-select"
            >
              <option value="">{{ t('certificate.batch.notMapped') }}</option>
              <option v-for="header in csvHeaders" :key="header" :value="header">
                {{ header }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 生成选项 -->
      <div v-if="csvData && template" class="options-section">
        <h3>{{ t('certificate.batch.generationOptions') }}</h3>
        <div class="option-group">
          <label>
            {{ t('certificate.batch.outputFormat') }}:
            <select v-model="outputFormat">
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
            </select>
          </label>
        </div>
        <div class="option-group" v-if="outputFormat === 'jpg'">
          <label>
            {{ t('certificate.batch.quality') }}: {{ quality }}%
            <input
              type="range"
              v-model.number="quality"
              min="10"
              max="100"
              step="5"
            />
          </label>
        </div>
      </div>

      <!-- 生成按钮和进度 -->
      <div v-if="csvData && template" class="generate-section">
        <button
          class="btn-generate"
          @click="startGeneration"
          :disabled="isGenerating || !isMappingValid"
        >
          {{ isGenerating ? t('certificate.batch.generating') : t('certificate.batch.generate') }}
        </button>
        <div v-if="isGenerating" class="progress-bar">
          <div class="progress-fill" :style="{ width: `${generationProgress}%` }"></div>
          <span class="progress-text">{{ generationProgress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { DrawCertificateUtils } from '../../utils/DrawCertificateUtils'
import JSZip from 'jszip'
import type {
  ICertificateTemplate,
  ICertificateData
} from '../../CertificateTypes'

const { t } = useI18n()

const props = defineProps<{
  template: ICertificateTemplate | null
}>()

// CSV相关
const fileInputRef = ref<HTMLInputElement | null>(null)
const csvData = ref<Record<string, string>[]>([])
const csvHeaders = ref<string[]>([])
const csvFileName = ref('')
const previewPage = ref(0)

// 字段映射
const fieldMapping = ref<Record<string, string>>({})

// 生成选项
const outputFormat = ref<'png' | 'jpg'>('png')
const quality = ref(90)

// 生成状态
const isGenerating = ref(false)
const generationProgress = ref(0)

// 预览行
const previewRows = computed(() => {
  const start = previewPage.value * 10
  return csvData.value.slice(start, start + 10)
})

// 检查映射是否有效
const isMappingValid = computed(() => {
  if (!props.template) return false
  return props.template.fields.every(field => {
    if (field.required) {
      return fieldMapping.value[field.name] && fieldMapping.value[field.name] !== ''
    }
    return true
  })
})

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    parseCsvFile(input.files[0])
  }
}

// 处理拖放
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0]
    if (file.name.endsWith('.csv')) {
      parseCsvFile(file)
    }
  }
}

// 解析CSV文件
const parseCsvFile = (file: File) => {
  csvFileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    parseCsvText(text)
  }
  reader.readAsText(file, 'UTF-8')
}

// 解析CSV文本
const parseCsvText = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim())
  if (lines.length === 0) return

  // 解析表头
  const headers = parseCsvLine(lines[0])
  csvHeaders.value = headers

  // 解析数据行
  const data: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    data.push(row)
  }

  csvData.value = data

  // 自动映射字段（如果字段名匹配）
  if (props.template) {
    props.template.fields.forEach(field => {
      const matchingHeader = headers.find(h => 
        h.toLowerCase() === field.name.toLowerCase() ||
        h.toLowerCase() === field.label.toLowerCase()
      )
      if (matchingHeader) {
        fieldMapping.value[field.name] = matchingHeader
      }
    })
  }
}

// 解析CSV行（简单实现，支持引号）
const parseCsvLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++ // 跳过下一个引号
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

// 开始生成
const startGeneration = async () => {
  if (!props.template || !csvData.value.length) return

  isGenerating.value = true
  generationProgress.value = 0

  try {
    const zip = new JSZip()
    const total = csvData.value.length

    for (let i = 0; i < total; i++) {
      const row = csvData.value[i]
      const data: ICertificateData = {}

      // 映射数据
      props.template.fields.forEach(field => {
        const mappedHeader = fieldMapping.value[field.name]
        if (mappedHeader && row[mappedHeader]) {
          data[field.name] = row[mappedHeader]
        }
      })

      // 生成证书
      const canvas = document.createElement('canvas')
      const drawUtils = new DrawCertificateUtils()
      drawUtils.setCanvas(canvas)

      await drawUtils.drawCertificate({
        template: props.template,
        data
      })

      // 导出为Blob
      const blob = await drawUtils.exportToBlob(outputFormat.value, quality.value / 100)
      
      // 添加到ZIP
      const fileName = `certificate_${i + 1}.${outputFormat.value}`
      zip.file(fileName, blob)

      // 更新进度
      generationProgress.value = Math.round(((i + 1) / total) * 100)
    }

    // 生成ZIP文件
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `certificates_${Date.now()}.zip`
    link.click()
    URL.revokeObjectURL(url)

    alert(t('certificate.batch.generationComplete', { count: total }))
  } catch (error) {
    console.error('Generation error:', error)
    alert(t('certificate.batch.generationError'))
  } finally {
    isGenerating.value = false
    generationProgress.value = 0
  }
}

// 监听模板变化，重置映射
watch(() => props.template, () => {
  fieldMapping.value = {}
}, { deep: true })
</script>

<style scoped>
.batch-generator {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.generator-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.generator-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.generator-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.upload-section,
.preview-section,
.mapping-section,
.options-section,
.generate-section {
  margin-bottom: 32px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.upload-section h3,
.preview-section h3,
.mapping-section h3,
.options-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9fafb;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.upload-placeholder p {
  margin: 8px 0;
  color: #6b7280;
}

.upload-hint-small {
  font-size: 12px;
  color: #9ca3af;
}

.uploaded-info {
  color: #059669;
}

.data-count {
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
}

.preview-table-container {
  max-height: 400px;
  overflow: auto;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.preview-table th,
.preview-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.preview-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
}

.preview-table tr:hover {
  background: #f9fafb;
}

.preview-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.preview-pagination button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  color: #374151;
  cursor: pointer;
}

.preview-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mapping-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mapping-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mapping-label {
  min-width: 120px;
  font-size: 14px;
  color: #374151;
}

.mapping-select {
  flex: 1;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.option-group {
  margin-bottom: 16px;
}

.option-group label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.option-group select {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.option-group input[type="range"] {
  width: 100%;
}

.btn-generate {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 6px;
  background: #3b82f6;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-generate:hover:not(:disabled) {
  background: #2563eb;
}

.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.progress-bar {
  margin-top: 16px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}
</style>

