// 防伪纹路
export type ISecurityPattern = {
    openSecurityPattern: boolean // 是否启用防伪纹路
    securityPatternWidth: number // 防伪纹路宽度
    securityPatternLength: number // 防伪纹路长度
    securityPatternCount: number // 防伪纹路数量
    securityPatternAngleRange: number // 防伪纹路角度范围
    securityPatternParams: Array<{ angle: number; lineAngle: number }> // 保存防伪纹路的参数数组
}
// 毛边参数
export type IRoughEdgeParams = {
    angle: number //
    size: number //
    offset: number // 偏移量
    opacity: number // 透明度
}
// 毛边效果
export type IRoughEdge = {
    drawRoughEdge: boolean // 是否绘制毛边效果
    roughEdgeWidth: number // 毛边宽度
    roughEdgeHeight: number // 毛边高度，按照边缘宽度的百分比
    roughEdgeShift: number // 偏移
    roughEdgeParams: IRoughEdgeParams[] // 新增：用于存储毛边参数
    roughEdgeProbability: number // 毛边概率
    roughEdgePoints: number // 毛边点数
}

// 绘制印章的公司
export type ICompany = {
    companyName: string // 公司名称
    compression: number // 公司名称压缩比例
    borderOffset: number // 边框偏移量
    textDistributionFactor: number // 字分布因子
    fontFamily: string // 字体
    fontHeight: number // 字体高度
    fontWeight: string | number // 字体粗细
    fontStyle?: 'normal' | 'italic' // 字体样式（正常/倾斜）
    shape: 'ellipse' | 'rectangle' | 'rhombus' | 'organic' | 'triangle' // 印章形状
    adjustEllipseText: boolean // 是否调整椭圆
    adjustEllipseTextFactor: number // 调整椭圆的因子
    color?: string | undefined // 颜色
    startAngle: number // 文字开始角度（弧度）
    rotateDirection: 'clockwise' | 'counterclockwise' // 旋转方向（仅椭圆使用）
    // 矩形印章相关配置
    rectangleTextDirection: 'horizontal' | 'vertical' // 矩形文字方向：横向或纵向
    rectangleTextPosition: 'top' | 'bottom' | 'left' | 'right' | 'center' // 矩形文字位置
    rectangleTextAlignment: 'left' | 'center' | 'right' // 矩形文字对齐方式（横向时）
    rectangleVerticalAlignment: 'top' | 'center' | 'bottom' // 矩形文字对齐方式（纵向时）
    rectangleLineSpacing: number // 矩形文字行间距（纵向时）
    rectangleTextMargin: number // 矩形文字距离边框的边距（毫米）
    rectanglePositionX?: number // 矩形文字水平位置偏移量（毫米），正数向右，负数向左
    rectanglePositionY?: number // 矩形文字垂直位置偏移量（毫米），正数向下，负数向上
}

// 印章编码
export type ICode = {
    code: string // 编码
    compression: number // 编码压缩比例
    fontHeight: number // 编码字体大小
    fontFamily: string // 编码字体
    borderOffset: number // 编码边框偏移量
    fontWidth: number // 编码字体宽度
    textDistributionFactor: number // 文字分布因子
    fontWeight: string | number // 编码字体粗细
    color?: string // 颜色
}

export type ITaxNumber = {
    code: string // 税号
    compression: number // 税号压缩比例
    fontHeight: number // 税号字体大小
    fontFamily: string // 编码字体
    fontWidth: number // 编码字体宽度
    letterSpacing: number // 编码字符间距
    positionY: number // 编码文字位置
    totalWidth: number // 编码文字总宽度
    fontWeight: string | number // 税号字体粗细
    color?: string // 颜色
}

// 做旧效果参数
export type IAgingEffectParams = {
    x: number // x轴位置
    y: number // y轴位置
    noiseSize: number // 噪声大小
    noise: number // 噪声强度
    strongNoiseSize: number // 强噪声大小
    strongNoise: number // 强噪声强度
    fade: number // 淡化强度
    seed: number // 随机种子
}

// 做旧效果
export type IAgingEffect = {
    applyAging: boolean // 是否应用做旧效果
    agingIntensity: number // 做旧效果强度
    agingEffectParams: IAgingEffectParams[] // 保存做旧效果的参数数组
}

// 图片配置
export type IDrawImage = {
  imageUrl: string
  imageWidth: number
  imageHeight: number
  positionX: number
  positionY: number
  keepAspectRatio: boolean
  rotation?: number // 旋转角度（度），0-360
}

export type ISvgShape = {
  id: string
  name: string
  svgContent: string // 原始 SVG 文本
  color: string
  width: number // 目标宽度（毫米）
  height: number // 目标高度（毫米）
  positionX: number // 水平位置（毫米）
  positionY: number // 垂直位置（毫米）
  rotation: number // 旋转角度（度）
  scale: number // 缩放比例
  keepAspectRatio: boolean // 是否保持宽高比
  version: number // 用于缓存版本
}

export type LineType = 'horizontal' | 'vertical'
export type LineStyle = 'solid' | 'dashed' | 'dotted'

export type ILineConfig = {
    id: string
    type: LineType
    positionX: number
    positionY: number
    length: number
    lineWidth: number
    color: string
    style: LineStyle
    dashLength?: number
    gapLength?: number
    opacity?: number
}

// 绘制五角星
export type IDrawStar = {
    svgPath: string // svg路径
    drawStar: boolean // 是否绘制五角星
    useImage: boolean // 是否绘制五角星
    keepAspectRatio: boolean // 保持横宽比例
    imageWidth: number // 五角星直径
    imageHeight: number // 五角星直径
    starDiameter: number // 五角星直径
    starPositionY: number // 五角星垂直位置
    starPositionX?: number // 五角星水平位置
    scaleToSmallStar: boolean // 是否缩放为小五角星
    color?: string // 颜色
}

// 印章类型
export type IStampType = {
    stampType: string // 印章类型
    fontHeight: number // 字体高度
    fontFamily: string // 编码字体
    compression: number // 压缩比例
    letterSpacing: number // 字符间距
    positionX?: number // 水平位置
    positionY: number // 位置
    fontWidth: number // 字体宽度
    fontWeight: string | number // 字体粗细
    fontStyle?: 'normal' | 'italic' // 字体样式（正常/倾斜）
    lineSpacing: number // 新增：行间距
    color?: string // 颜色
    orientation?: 'horizontal' | 'vertical' // 文字方向
    rotation?: number // 旋转角度
}

// 内圈圆
export type IInnerCircle = {
    drawInnerCircle: boolean // 是否绘制内圈圆
    innerCircleLineWidth: number // 内圈圆线宽
    innerCircleLineRadiusX: number // x轴半径
    innerCircleLineRadiusY: number // y轴半径
    color?: string // 颜色
    lineStyle?: LineStyle // 线条样式
    dashLength?: number // 虚线长度
    gapLength?: number // 虚线间距
    shape?: 'ellipse' | 'rectangle' | 'rhombus' | 'triangle' // 形状
    offsetX?: number // 水平偏移 (mm)
    offsetY?: number // 垂直偏移 (mm)
    fillBackground?: boolean // 是否填充背景颜色
    fillColor?: string // 填充颜色
    // 有机/不规则形状相关配置（仅在 shape 为 organic 时使用）
    organicStyleId?: number // 有机形状样式编号（0-9）
}

// 是否绘制标尺
export type IShowRuler = {
    showSideRuler: boolean // 边缘的标尺
    showFullRuler: boolean // 是否绘全标尺
    showDashLine: boolean // 是否绘制内部的虚线
    showRuler: boolean // 是否绘制标尺
    showCurrentPositionText: boolean // 标尺的尺寸的数字文本
    showCrossLine: boolean // 标尺的红色横线
}

// 绘制印章的参数
export type IDrawStampConfig = {
    // 元信息（可选）：用于模板管理、筛选与展示
    title?: string // 印章标题 / 名称
    category?: string // 主分类，例如：书法印章、有机印章、公章、合同章等
    categories?: string[] // 多个分类，使用空格分隔后保存为数组

    roughEdge: IRoughEdge // 毛边效果
    agingEffect: IAgingEffect // 做旧效果
    ruler: IShowRuler // 是否绘制标尺
    drawStar: IDrawStar // 是否绘制五角星
    securityPattern: ISecurityPattern
    company: ICompany // 公司
    stampCode: ICode // 印章编码（兼容旧结构，通常与 stampCodeList[0] 同步）
    stampCodeList?: ICode[] // 印章编码列表，可配置多条编码
    taxNumber: ITaxNumber // 税号
    stampType: IStampType // 印章类型
    width: number // 印章宽度
    height: number // 印章高度
    borderWidth: number // 印章边框宽度
    primaryColor: string // 印章主色
    refreshSecurityPattern: boolean // 是否刷新防伪纹路
    refreshOld: boolean // 是否刷新做旧效果
    innerCircle: IInnerCircle // 内圈圆
    outThinCircle: IInnerCircle // 比外圈细的稍微内圈
    openManualAging: boolean // 是否开启手动做旧效果
    stampTypeList: IStampType[] // 印章类型列表
    companyList: ICompany[] // 新增：公司名称列表
    innerCircleList: IInnerCircle[] // 新增：内圈圆列表
    imageList: IDrawImage[] // 新增：图片列表配置
    svgList: ISvgShape[] // 新增：SVG 图形列表
    lineList: ILineConfig[] // 新增：线条列表
    scale: number // 缩放比例
    offsetX: number // x轴偏移量
    offsetY: number // y轴偏移量
    mmToPixel: number // 毫米到像素的转换比例
    outBorder: IInnerCircle // 外圈圆
    lockTriangleEquilateral?: boolean // 是否固定三角形为等边三角形
}
