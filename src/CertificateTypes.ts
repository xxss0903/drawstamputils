// 证书/奖状模板类型定义

// 可变字段类型
export type FieldType = 'text' | 'date' | 'image' | 'signature' | 'number'

// 字段对齐方式
export type TextAlign = 'left' | 'center' | 'right' | 'justify'

// 字段垂直对齐
export type VerticalAlign = 'top' | 'middle' | 'bottom'

// 证书字段配置
export type ICertificateField = {
  id: string // 字段唯一标识
  type: FieldType // 字段类型
  name: string // 字段名称（用于CSV列名）
  label: string // 显示标签
  x: number // X坐标（毫米）
  y: number // Y坐标（毫米）
  width?: number // 宽度（毫米，可选）
  height?: number // 高度（毫米，可选）
  fontSize?: number // 字体大小（毫米）
  fontFamily?: string // 字体
  fontWeight?: string | number // 字体粗细
  color?: string // 文字颜色
  textAlign?: TextAlign // 文本对齐
  verticalAlign?: VerticalAlign // 垂直对齐
  placeholder?: string // 占位符文本
  defaultValue?: string // 默认值
  required?: boolean // 是否必填
  format?: string // 格式化规则（如日期格式）
}

// 证书元素类型
export type ElementType = 'text' | 'image' | 'line' | 'rectangle' | 'field'

// 证书元素
export type ICertificateElement = {
  id: string // 元素唯一标识
  type: ElementType // 元素类型
  x: number // X坐标（毫米）
  y: number // Y坐标（毫米）
  width?: number // 宽度（毫米）
  height?: number // 高度（毫米）
  rotation?: number // 旋转角度（度）
  opacity?: number // 透明度（0-1）
  zIndex?: number // 层级
  // 文本元素属性
  text?: string // 文本内容
  fontSize?: number // 字体大小
  fontFamily?: string // 字体
  fontWeight?: string | number // 字体粗细
  fontStyle?: 'normal' | 'italic' // 字体样式
  color?: string // 文字颜色
  textAlign?: TextAlign // 文本对齐
  lineHeight?: number // 行高
  // 图片元素属性
  imageUrl?: string // 图片URL
  imageData?: string // 图片Base64数据
  keepAspectRatio?: boolean // 保持宽高比
  // 线条元素属性
  lineWidth?: number // 线条宽度
  lineColor?: string // 线条颜色
  lineStyle?: 'solid' | 'dashed' | 'dotted' // 线条样式
  // 矩形元素属性
  fillColor?: string // 填充颜色
  strokeColor?: string // 描边颜色
  strokeWidth?: number // 描边宽度
  borderRadius?: number // 圆角半径
  // 字段引用
  fieldId?: string // 关联的字段ID
}

// 证书模板配置
export type ICertificateTemplate = {
  id?: string // 模板ID
  title: string // 模板标题
  description?: string // 模板描述
  category?: string // 模板分类
  width: number // 模板宽度（毫米）
  height: number // 模板高度（毫米）
  backgroundColor?: string // 背景颜色
  backgroundImage?: string // 背景图片URL
  elements: ICertificateElement[] // 元素列表
  fields: ICertificateField[] // 可变字段列表
  mmToPixel?: number // 毫米到像素的转换比例
  version?: number // 模板版本
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}

// 单张证书数据
export type ICertificateData = {
  [fieldName: string]: string | number | File | string // 字段名 -> 字段值
}

// 证书生成配置
export type ICertificateConfig = {
  template: ICertificateTemplate // 模板
  data: ICertificateData // 数据
  outputFormat?: 'png' | 'jpg' | 'pdf' // 输出格式
  quality?: number // 图片质量（0-1）
  scale?: number // 缩放比例
}

// 批量生成配置
export type IBatchGenerateConfig = {
  template: ICertificateTemplate // 模板
  dataList: ICertificateData[] // 数据列表
  outputFormat?: 'png' | 'jpg' | 'pdf' // 输出格式
  quality?: number // 图片质量
  scale?: number // 缩放比例
  zipFileName?: string // ZIP文件名
}

// 签名数据
export type ISignatureData = {
  type: 'image' | 'canvas' // 签名类型
  data: string // Base64数据或图片URL
  width?: number // 签名宽度
  height?: number // 签名高度
}

