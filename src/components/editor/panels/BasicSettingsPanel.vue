<template>
  <div class="control-group">
    <div class="group-header" @click="toggleExpanded">
      <h3>
        {{ t('stamp.basic.title') }}
        <span class="expand-icon" :class="{ expanded: expanded }">▼</span>
      </h3>
    </div>
    <div class="group-content" v-show="expanded">
      <label class="checkbox-label">
        <input type="checkbox" :checked="isCircleDetect" @change="onCircleDetectChange" />
        {{ t('stamp.basic.extractCircle') }}
      </label>
      <label>
        {{ t('stamp.basic.width') }}:
        <input type="number" :value="props.config.width" min="1" max="50" step="0.1" @input="onWidthInput" />
      </label>
      <label>
        {{ t('stamp.basic.height') }}:
        <input
          type="number"
          :value="props.config.height"
          min="1"
          max="50"
          step="0.1"
          @input="onHeightInput"
        />
      </label>
      <label>
        {{ t('stamp.basic.borderWidth') }}:
        <input
          type="number"
          step="0.1"
          :value="props.config.borderWidth"
          min="0"
          @input="onBorderWidthInput"
        />
      </label>
      <label>
        {{ t('stamp.basic.borderLineStyle') }}:
        <select :value="props.config.outBorder.lineStyle || 'solid'" @change="onBorderLineStyleChange">
          <option value="solid">{{ t('stamp.basic.lineStyle.solid') }}</option>
          <option value="dashed">{{ t('stamp.basic.lineStyle.dashed') }}</option>
          <option value="dotted">{{ t('stamp.basic.lineStyle.dotted') }}</option>
        </select>
      </label>
      <template v-if="(props.config.outBorder.lineStyle || 'solid') !== 'solid'">
        <label>
          {{ t('stamp.basic.dashLength') }}:
          <input
            type="number"
            :value="props.config.outBorder.dashLength ?? 2"
            min="0.1"
            max="20"
            step="0.1"
            @input="onBorderDashInput"
          />
        </label>
        <label>
          {{ t('stamp.basic.gapLength') }}:
          <input
            type="number"
            :value="props.config.outBorder.gapLength ?? 1"
            min="0.1"
            max="20"
            step="0.1"
            @input="onBorderGapInput"
          />
        </label>
      </template>
      <label>
        {{ t('stamp.basic.color') }}:
        <input type="color" :value="props.config.primaryColor" @input="onPrimaryColorInput" />
      </label>
      <label>
        {{ t('stamp.basic.shape') }}:
        <select :value="props.config.company.shape" @change="onCompanyShapeChange">
          <option value="ellipse">{{ t('stamp.basic.shapeOptions.ellipse') }}</option>
          <option value="rectangle">{{ t('stamp.basic.shapeOptions.rectangle') }}</option>
          <option value="rhombus">{{ t('stamp.basic.shapeOptions.rhombus') }}</option>
        </select>
      </label>
      <label class="checkbox-label">
        <input
          type="checkbox"
          :checked="props.config.outBorder.drawInnerCircle"
          @change="onDrawOutBorderChange"
        />
        {{ t('stamp.outBorder.enable') }}
      </label>
      <label v-if="props.config.outBorder.drawInnerCircle">
        {{ t('stamp.outBorder.lineWidth') }}:
        <input
          type="number"
          :value="props.config.outBorder.innerCircleLineWidth"
          min="0.1"
          max="5"
          step="0.1"
          @input="onOutBorderWidthInput"
        />
      </label>
      <label v-if="props.config.outBorder.drawInnerCircle" class="checkbox-label">
        <input
          type="checkbox"
          :checked="props.config.outBorder.fillBackground || false"
          @change="onFillBackgroundChange"
        />
        {{ t('stamp.outBorder.fillBackground') }}
      </label>
      <label v-if="props.config.outBorder.drawInnerCircle && (props.config.outBorder.fillBackground || false)">
        {{ t('stamp.outBorder.backgroundColor') }}:
        <input
          type="color"
          :value="props.config.outBorder.color || props.config.primaryColor"
          @input="onOutBorderColorInput"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

import type { IDrawStampConfig } from '../../../DrawStampTypes'

const props = defineProps<{
  expanded: boolean
  isCircleDetect: boolean
  config: IDrawStampConfig
}>()

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void
  (e: 'update:is-circle-detect', value: boolean): void
  (e: 'update-config', updater: (config: IDrawStampConfig) => void): void
}>()

const toggleExpanded = () => {
  emit('update:expanded', !props.expanded)
}

const onCircleDetectChange = (event: Event) => {
  emit('update:is-circle-detect', (event.target as HTMLInputElement).checked)
}

const onWidthInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.width = value
  })
}

const onHeightInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.height = value
  })
}

const onBorderWidthInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.borderWidth = value
  })
}

const onBorderLineStyleChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as 'solid' | 'dashed' | 'dotted'
  emit('update-config', (config) => {
    config.outBorder.lineStyle = value
  })
}

const onBorderDashInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.outBorder.dashLength = value
  })
}

const onBorderGapInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.outBorder.gapLength = value
  })
}

const onPrimaryColorInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update-config', (config) => {
    const previousColor = config.primaryColor
    config.primaryColor = value
    if (config.svgList && config.svgList.length > 0) {
      config.svgList.forEach((svg) => {
        if (!svg.color || svg.color === previousColor) {
          svg.color = value
        }
      })
    }
    if (config.company && (!config.company.color || config.company.color === previousColor)) {
      config.company.color = value
    }
    if (config.stampCode && (!config.stampCode.color || config.stampCode.color === previousColor)) {
      config.stampCode.color = value
    }
    if (config.companyList && config.companyList.length > 0) {
      config.companyList.forEach((company) => {
        if (!company.color || company.color === previousColor) {
          company.color = value
        }
      })
    }
    if (config.stampTypeList && config.stampTypeList.length > 0) {
      config.stampTypeList.forEach((type) => {
        if (!type.color || type.color === previousColor) {
          type.color = value
        }
      })
    }
    if (config.innerCircleList && config.innerCircleList.length > 0) {
      config.innerCircleList.forEach((circle) => {
        if (!circle.color || circle.color === previousColor) {
          circle.color = value
        }
      })
    }
  })
}

const onCompanyShapeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as 'ellipse' | 'rectangle' | 'rhombus'
  emit('update-config', (config) => {
    config.company.shape = value
    // 同时更新 companyList 中所有公司的形状，因为绘制逻辑检查的是 companyList
    if (config.companyList && config.companyList.length > 0) {
      config.companyList.forEach(company => {
        company.shape = value
      })
    }
    if (config.innerCircleList) {
      config.innerCircleList.forEach(circle => {
        circle.shape = value
      })
    }
  })
}

const onDrawOutBorderChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).checked
  emit('update-config', (config) => {
    config.outBorder.drawInnerCircle = value
  })
}

const onOutBorderWidthInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update-config', (config) => {
    config.outBorder.innerCircleLineWidth = value
  })
}

const onOutBorderColorInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update-config', (config) => {
    config.outBorder.color = value
  })
}

const onFillBackgroundChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).checked
  emit('update-config', (config) => {
    config.outBorder.fillBackground = value
    // 如果关闭背景填充，清除背景颜色
    if (!value) {
      config.outBorder.color = undefined
    } else if (!config.outBorder.color) {
      // 如果开启背景填充但没有设置颜色，使用主色
      config.outBorder.color = config.primaryColor
    }
  })
}
</script>

