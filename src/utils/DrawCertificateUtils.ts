import {
  ICertificateTemplate,
  ICertificateElement,
  ICertificateField,
  ICertificateData,
  ICertificateConfig,
  ISignatureData
} from '../CertificateTypes'

export class DrawCertificateUtils {
  private mmToPixel: number = 3.779527559 // 1mm = 3.779527559px (96 DPI)
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null

  constructor(mmToPixel?: number) {
    if (mmToPixel) {
      this.mmToPixel = mmToPixel
    }
  }

  /**
   * 设置画布
   */
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    if (!this.ctx) {
      throw new Error('无法获取Canvas上下文')
    }
  }

  /**
   * 设置毫米到像素的转换比例
   */
  setMmToPixel(mmToPixel: number) {
    this.mmToPixel = mmToPixel
  }

  /**
   * 毫米转像素
   */
  private mmToPx(mm: number): number {
    return mm * this.mmToPixel
  }

  /**
   * 绘制证书
   */
  async drawCertificate(config: ICertificateConfig): Promise<void> {
    if (!this.ctx || !this.canvas) {
      throw new Error('画布未初始化')
    }

    const { template, data } = config
    const width = this.mmToPx(template.width)
    const height = this.mmToPx(template.height)

    // 设置画布尺寸
    this.canvas.width = width
    this.canvas.height = height

    // 清空画布
    this.ctx.clearRect(0, 0, width, height)

    // 绘制背景
    await this.drawBackground(template)

    // 按zIndex排序元素
    const sortedElements = [...template.elements].sort((a, b) => {
      const zA = a.zIndex ?? 0
      const zB = b.zIndex ?? 0
      return zA - zB
    })

    // 绘制所有元素
    for (const element of sortedElements) {
      await this.drawElement(element, template, data)
    }
  }

  /**
   * 绘制背景
   */
  private async drawBackground(template: ICertificateTemplate): Promise<void> {
    if (!this.ctx || !this.canvas) return

    const width = this.mmToPx(template.width)
    const height = this.mmToPx(template.height)

    // 绘制背景色
    if (template.backgroundColor) {
      this.ctx.fillStyle = template.backgroundColor
      this.ctx.fillRect(0, 0, width, height)
    }

    // 绘制背景图片
    if (template.backgroundImage) {
      await this.drawImage(template.backgroundImage, 0, 0, width, height, true)
    }
  }

  /**
   * 绘制元素
   */
  private async drawElement(
    element: ICertificateElement,
    template: ICertificateTemplate,
    data: ICertificateData
  ): Promise<void> {
    if (!this.ctx) return

    this.ctx.save()

    // 应用透明度
    if (element.opacity !== undefined) {
      this.ctx.globalAlpha = element.opacity
    }

    // 应用旋转
    if (element.rotation) {
      const centerX = this.mmToPx(element.x + (element.width || 0) / 2)
      const centerY = this.mmToPx(element.y + (element.height || 0) / 2)
      this.ctx.translate(centerX, centerY)
      this.ctx.rotate((element.rotation * Math.PI) / 180)
      this.ctx.translate(-centerX, -centerY)
    }

    switch (element.type) {
      case 'text':
        await this.drawTextElement(element, template, data)
        break
      case 'image':
        await this.drawImageElement(element, data)
        break
      case 'line':
        this.drawLineElement(element)
        break
      case 'rectangle':
        this.drawRectangleElement(element)
        break
      case 'field':
        await this.drawFieldElement(element, template, data)
        break
    }

    this.ctx.restore()
  }

  /**
   * 绘制文本元素
   */
  private async drawTextElement(
    element: ICertificateElement,
    template: ICertificateTemplate,
    data: ICertificateData
  ): Promise<void> {
    if (!this.ctx || !element.text) return

    const x = this.mmToPx(element.x)
    const y = this.mmToPx(element.y)
    const fontSize = this.mmToPx(element.fontSize || 12)
    const fontFamily = element.fontFamily || 'Arial'
    const fontWeight = element.fontWeight || 'normal'
    const fontStyle = element.fontStyle || 'normal'
    const color = element.color || '#000000'
    const textAlign = element.textAlign || 'left'
    const lineHeight = element.lineHeight || 1.2

    // 设置字体
    this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
    this.ctx.fillStyle = color
    this.ctx.textAlign = textAlign as CanvasTextAlign
    this.ctx.textBaseline = 'top'

    // 处理多行文本
    const lines = element.text.split('\n')
    const lineHeightPx = fontSize * lineHeight

    lines.forEach((line, index) => {
      const lineY = y + index * lineHeightPx
      this.ctx!.fillText(line, x, lineY)
    })
  }

  /**
   * 绘制图片元素
   */
  private async drawImageElement(
    element: ICertificateElement,
    data: ICertificateData
  ): Promise<void> {
    if (!element.imageUrl && !element.imageData) return

    const x = this.mmToPx(element.x)
    const y = this.mmToPx(element.y)
    const width = element.width ? this.mmToPx(element.width) : undefined
    const height = element.height ? this.mmToPx(element.height) : undefined
    const keepAspectRatio = element.keepAspectRatio !== false

    const imageUrl = element.imageUrl || element.imageData
    if (imageUrl) {
      await this.drawImage(imageUrl, x, y, width, height, keepAspectRatio)
    }
  }

  /**
   * 绘制图片（通用方法）
   */
  private async drawImage(
    src: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    keepAspectRatio: boolean = true
  ): Promise<void> {
    if (!this.ctx) return

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        let drawWidth = width || img.width
        let drawHeight = height || img.height

        if (keepAspectRatio && width && !height) {
          drawHeight = (img.height / img.width) * drawWidth
        } else if (keepAspectRatio && height && !width) {
          drawWidth = (img.width / img.height) * drawHeight
        } else if (keepAspectRatio && width && height) {
          const imgRatio = img.width / img.height
          const drawRatio = drawWidth / drawHeight
          if (imgRatio > drawRatio) {
            drawHeight = drawWidth / imgRatio
          } else {
            drawWidth = drawHeight * imgRatio
          }
        }

        this.ctx!.drawImage(img, x, y, drawWidth, drawHeight)
        resolve()
      }

      img.onerror = reject
      img.src = src
    })
  }

  /**
   * 绘制线条元素
   */
  private drawLineElement(element: ICertificateElement): void {
    if (!this.ctx || !element.width || !element.height) return

    const x = this.mmToPx(element.x)
    const y = this.mmToPx(element.y)
    const width = this.mmToPx(element.width)
    const height = this.mmToPx(element.height)
    const lineWidth = this.mmToPx(element.lineWidth || 1)
    const lineColor = element.lineColor || '#000000'
    const lineStyle = element.lineStyle || 'solid'

    this.ctx.strokeStyle = lineColor
    this.ctx.lineWidth = lineWidth

    // 设置线条样式
    if (lineStyle === 'dashed') {
      this.ctx.setLineDash([5, 5])
    } else if (lineStyle === 'dotted') {
      this.ctx.setLineDash([2, 2])
    } else {
      this.ctx.setLineDash([])
    }

    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x + width, y + height)
    this.ctx.stroke()
    this.ctx.setLineDash([]) // 重置
  }

  /**
   * 绘制矩形元素
   */
  private drawRectangleElement(element: ICertificateElement): void {
    if (!this.ctx || !element.width || !element.height) return

    const x = this.mmToPx(element.x)
    const y = this.mmToPx(element.y)
    const width = this.mmToPx(element.width)
    const height = this.mmToPx(element.height)
    const borderRadius = element.borderRadius ? this.mmToPx(element.borderRadius) : 0

    // 填充
    if (element.fillColor) {
      this.ctx.fillStyle = element.fillColor
      if (borderRadius > 0) {
        this.drawRoundedRect(x, y, width, height, borderRadius)
        this.ctx.fill()
      } else {
        this.ctx.fillRect(x, y, width, height)
      }
    }

    // 描边
    if (element.strokeColor) {
      this.ctx.strokeStyle = element.strokeColor
      this.ctx.lineWidth = this.mmToPx(element.strokeWidth || 1)
      if (borderRadius > 0) {
        this.drawRoundedRect(x, y, width, height, borderRadius)
        this.ctx.stroke()
      } else {
        this.ctx.strokeRect(x, y, width, height)
      }
    }
  }

  /**
   * 绘制圆角矩形路径
   */
  private drawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    if (!this.ctx) return

    this.ctx.beginPath()
    this.ctx.moveTo(x + radius, y)
    this.ctx.lineTo(x + width - radius, y)
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    this.ctx.lineTo(x + width, y + height - radius)
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    this.ctx.lineTo(x + radius, y + height)
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    this.ctx.lineTo(x, y + radius)
    this.ctx.quadraticCurveTo(x, y, x + radius, y)
    this.ctx.closePath()
  }

  /**
   * 绘制字段元素
   */
  private async drawFieldElement(
    element: ICertificateElement,
    template: ICertificateTemplate,
    data: ICertificateData
  ): Promise<void> {
    if (!element.fieldId) return

    const field = template.fields.find(f => f.id === element.fieldId)
    if (!field) return

    const fieldValue = data[field.name]
    if (fieldValue === undefined || fieldValue === null) {
      // 使用默认值或占位符
      const displayValue = field.defaultValue || field.placeholder || ''
      if (displayValue) {
        await this.drawFieldValue(field, displayValue, data)
      }
      return
    }

    await this.drawFieldValue(field, String(fieldValue), data)
  }

  /**
   * 绘制字段值
   */
  private async drawFieldValue(
    field: ICertificateField,
    value: string,
    data: ICertificateData
  ): Promise<void> {
    if (!this.ctx) return

    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        this.drawTextField(field, value)
        break
      case 'image':
        await this.drawFieldImage(field, value)
        break
      case 'signature':
        await this.drawFieldSignature(field, value, data)
        break
    }
  }

  /**
   * 绘制文本字段
   */
  private drawTextField(field: ICertificateField, value: string): void {
    if (!this.ctx) return

    const x = this.mmToPx(field.x)
    const y = this.mmToPx(field.y)
    const width = field.width ? this.mmToPx(field.width) : undefined
    const fontSize = this.mmToPx(field.fontSize || 12)
    const fontFamily = field.fontFamily || 'Arial'
    const fontWeight = field.fontWeight || 'normal'
    const color = field.color || '#000000'
    const textAlign = field.textAlign || 'left'
    const verticalAlign = field.verticalAlign || 'top'

    // 设置字体
    this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    this.ctx.fillStyle = color
    this.ctx.textAlign = textAlign as CanvasTextAlign

    // 格式化值
    let formattedValue = value
    if (field.type === 'date' && field.format) {
      formattedValue = this.formatDate(value, field.format)
    }

    // 计算文本位置
    const metrics = this.ctx.measureText(formattedValue)
    let textX = x
    let textY = y

    // 水平对齐
    if (textAlign === 'center' && width) {
      textX = x + width / 2
    } else if (textAlign === 'right' && width) {
      textX = x + width
    }

    // 垂直对齐
    if (verticalAlign === 'middle') {
      textY = y + (field.height ? this.mmToPx(field.height) / 2 : fontSize / 2) - fontSize / 2
    } else if (verticalAlign === 'bottom') {
      textY = y + (field.height ? this.mmToPx(field.height) : fontSize) - fontSize
    }

    this.ctx.textBaseline = 'top'
    this.ctx.fillText(formattedValue, textX, textY)
  }

  /**
   * 绘制图片字段
   */
  private async drawFieldImage(field: ICertificateField, value: string): Promise<void> {
    const x = this.mmToPx(field.x)
    const y = this.mmToPx(field.y)
    const width = field.width ? this.mmToPx(field.width) : undefined
    const height = field.height ? this.mmToPx(field.height) : undefined

    await this.drawImage(value, x, y, width, height, true)
  }

  /**
   * 绘制签名字段
   */
  private async drawFieldSignature(
    field: ICertificateField,
    value: string,
    data: ICertificateData
  ): Promise<void> {
    // value 可能是签名数据的JSON字符串或Base64图片
    try {
      const signatureData: ISignatureData = JSON.parse(value)
      const imageUrl = signatureData.data
      const x = this.mmToPx(field.x)
      const y = this.mmToPx(field.y)
      const width = field.width ? this.mmToPx(field.width) : signatureData.width ? this.mmToPx(signatureData.width) : undefined
      const height = field.height ? this.mmToPx(field.height) : signatureData.height ? this.mmToPx(signatureData.height) : undefined

      await this.drawImage(imageUrl, x, y, width, height, true)
    } catch {
      // 如果不是JSON，直接作为图片URL处理
      await this.drawFieldImage(field, value)
    }
  }

  /**
   * 格式化日期
   */
  private formatDate(value: string, format: string): string {
    try {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return value
      }

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
    } catch {
      return value
    }
  }

  /**
   * 导出为图片
   */
  exportToImage(format: 'png' | 'jpg' = 'png', quality: number = 1): string {
    if (!this.canvas) {
      throw new Error('画布未初始化')
    }

    if (format === 'jpg') {
      return this.canvas.toDataURL('image/jpeg', quality)
    } else {
      return this.canvas.toDataURL('image/png')
    }
  }

  /**
   * 导出为Blob
   */
  exportToBlob(format: 'png' | 'jpg' = 'png', quality: number = 1): Promise<Blob> {
    if (!this.canvas) {
      throw new Error('画布未初始化')
    }

    return new Promise((resolve, reject) => {
      this.canvas!.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('导出失败'))
          }
        },
        format === 'jpg' ? 'image/jpeg' : 'image/png',
        quality
      )
    })
  }

  /**
   * 获取画布
   */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvas
  }

  /**
   * 获取毫米到像素的转换比例
   */
  getMmToPixel(): number {
    return this.mmToPixel
  }
}

