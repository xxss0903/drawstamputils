import { ICompany } from "../DrawStampTypes"
import { getArcSegments, isRtlText, segmentGraphemes, segmentWords } from "./textLayoutUtils"

export class DrawCompanyUtils {
    private mmToPixel = 10
    // 添加存储文字路径的数组
    private textPaths: Array<{
        text: string,
        path: Path2D,
        type: 'company',
        bounds: {
            x: number,
            y: number,
            width: number,
            height: number
        }
    }> = []

    constructor(mmToPixel: number) {
        this.mmToPixel = mmToPixel
        this.textPaths = []
    }

    // 添加获取文字路径的方法
    getTextPaths() {
        return this.textPaths
    }

    // 清除文字路径
    clearTextPaths() {
        this.textPaths = []
    }

    // 添加绘制公司列表的方法
    drawCompanyList(
        ctx: CanvasRenderingContext2D,
        companyList: ICompany[],
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        color: string
        ) {
            companyList.forEach((company) => {
                this.drawCompanyName(ctx, company, centerX, centerY, radiusX, radiusY, company.color || color)
            })
        }

            /**
     * 绘制公司名称
     * @param centerX 圆心x坐标
     * @param centerY 圆心y坐标
     * @param radiusX 椭圆长轴半径
     * @param radiusY 椭圆短轴半径
     * @param text 公司名称文本
     * @param fontSize 字体大小
     */
    drawCompanyName(
        ctx: CanvasRenderingContext2D,
        company: ICompany,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        color: string
      ) {
        this.clearTextPaths()
        
        // 根据印章形状选择绘制方式
        if (company.shape === 'rectangle' || company.shape === 'rhombus' || company.shape === 'organic' || company.shape === 'triangle') {
            this.drawRectangleText(ctx, company, centerX, centerY, radiusX, radiusY, color)
        } else {
            this.drawEllipseText(ctx, company, centerX, centerY, radiusX, radiusY, color)
        }
    }

    /**
     * 绘制椭圆文字（原有逻辑）
     */
    private drawEllipseText(
        ctx: CanvasRenderingContext2D,
        company: ICompany,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        color: string
    ) {
        const fontSize = company.fontHeight * this.mmToPixel
        const fontWeight = company.fontWeight || 'normal'
        const fontStyle = company.fontStyle || 'normal'
        const stretchScale = company.textStretch ?? 1
        ctx.save()
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${company.fontFamily}`
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        const rtl = isRtlText(company.companyName)
        ctx.direction = rtl ? 'rtl' : 'ltr'

        const borderOffset = company.borderOffset * this.mmToPixel
        const segments = getArcSegments(company.companyName, rtl)
        const spaceUnits = rtl && segments.length > 1 ? 1 : 0
        const totalUnits =
          segments.reduce((sum, s) => sum + s.units, 0) + Math.max(0, segments.length - 1) * spaceUnits

        if (totalUnits <= 0) {
          ctx.restore()
          return
        }
        // 计算总角度和每个字符的角度
        const totalAngle = Math.PI * (0.5 + totalUnits / (company.textDistributionFactor * 4))
        const anglePerUnit = totalAngle / totalUnits
      
        // 根据旋转方向设置起始角度和角度增量
        const direction = company.rotateDirection === 'clockwise' ? -1 : 1
        const startAngle = (company.startAngle ? company.startAngle : 0) + (company.rotateDirection === 'clockwise' ? 
          Math.PI - totalAngle / 2 : 
          Math.PI + (Math.PI - totalAngle) / 2)

        if (rtl) {
          this.drawRtlWarpedEllipseText(
            ctx,
            company,
            centerX,
            centerY,
            radiusX,
            radiusY,
            borderOffset,
            fontSize,
            stretchScale,
            totalAngle,
            startAngle,
            direction,
            color
          )
          ctx.restore()
          return
        }
      
        // 计算字符位置时考虑椭圆文字调整
        if (company.adjustEllipseText) {
          const characters = segmentGraphemes(company.companyName)
          const characterCount = characters.length
          const anglePerChar = totalAngle / Math.max(1, characterCount)
          let halfCharCount = 0
          if(characterCount % 2 !== 0){
            halfCharCount = characterCount / 2
          }else{
            halfCharCount = (characterCount + 1) / 2
          }
      
          characters.forEach((char, index) => {
            // 计算当前字符的角度，包含椭圆调整
            const halfIndex = halfCharCount - index - 1
            const adjustmentFactor = Math.pow(halfIndex / halfCharCount, 2)
            const additionalAngle = adjustmentFactor * anglePerChar * company.adjustEllipseTextFactor
            const indexValue = index - halfCharCount
            const factor = indexValue / Math.abs(indexValue)
      
            let angle = startAngle + direction * anglePerChar * (index + 0.5)
            angle += additionalAngle * factor
      
            // 计算字符位置
            let x = centerX + Math.cos(angle) * (radiusX - fontSize - borderOffset)
            let y = centerY + Math.sin(angle) * (radiusY - fontSize - borderOffset)
      
            // 应用单个文字的偏移调整（如果存在）
            const charAdjustment = company.charAdjustments && company.charAdjustments[index]
            if (charAdjustment) {
              // 计算椭圆在该点的切线和法线方向
              const tangentAngle = Math.atan2(-radiusX * Math.sin(angle), radiusY * Math.cos(angle))
              const normalAngleForOffset = Math.atan2(radiusX * Math.sin(angle), radiusY * Math.cos(angle))
              
              // 将偏移量转换为像素
              const offsetXPx = (charAdjustment.offsetX || 0) * this.mmToPixel
              const offsetYPx = (charAdjustment.offsetY || 0) * this.mmToPixel
              
              // 沿法线方向（垂直于边界）和切线方向（沿边界）应用偏移
              // 法线方向：垂直于椭圆边界
              // 切线方向：沿椭圆边界
              x += Math.cos(normalAngleForOffset) * offsetXPx + Math.cos(tangentAngle) * offsetYPx
              y += Math.sin(normalAngleForOffset) * offsetXPx + Math.sin(tangentAngle) * offsetYPx
            }
      
            // 计算椭圆在该点的法线角度（垂直于椭圆边界）
            // 对于椭圆 x²/a² + y²/b² = 1，在参数角 t 处的法线角度为 atan2(a*sin(t), b*cos(t))
            let normalAngle = Math.atan2(radiusX * Math.sin(angle), radiusY * Math.cos(angle))
      
            // 根据分布因子和椭圆形状优化法线角度，特别是对于两边的文字
            // 计算文字在分布范围内的相对位置（从中心到边缘，0为中心，1为边缘）
            const centerAngle = startAngle + totalAngle / 2
            const angleFromCenter = Math.abs(angle - centerAngle)
            const relativePosition = Math.min(angleFromCenter / (totalAngle / 2), 1)
            
            // 计算椭圆扁度（椭圆越扁，调整越明显）
            const ellipseFlatness = Math.abs(radiusX - radiusY) / Math.max(radiusX, radiusY)
            
            // 根据分布因子、相对位置和椭圆扁度计算调整
            // 分布因子越小，文字越集中，需要更强的调整
            // 相对位置越大（越靠近边缘），需要更强的调整
            const distributionFactor = Math.max(0.1, company.textDistributionFactor)
            const positionWeight = Math.pow(relativePosition, 1.5) // 使用1.5次方，使边缘调整更明显
            const flatnessWeight = Math.pow(ellipseFlatness, 0.8) // 椭圆扁度的影响
            
            // 计算调整因子，分布因子越小，调整越大
            const adjustmentFactor2 = positionWeight * (1 / distributionFactor) * flatnessWeight
            
            // 调整法线角度，使两边的文字更垂直于边界
            // 最大调整角度根据椭圆扁度和分布因子动态计算
            const maxAdjustment = Math.min(Math.PI / 6, Math.PI / 4 * ellipseFlatness * (1 / distributionFactor)) // 最大30度，但根据情况动态调整
            const angleAdjustment = adjustmentFactor2 * maxAdjustment
            
            // 根据文字在左边还是右边决定调整方向
            // 对于顶部文字，左侧文字需要顺时针调整，右侧文字需要逆时针调整
            const sideFactor = (angle < centerAngle) ? -1 : 1
            normalAngle += angleAdjustment * sideFactor
            
            // 应用单个文字的旋转调整（如果存在）
            if (charAdjustment && charAdjustment.rotation !== undefined) {
              normalAngle += (charAdjustment.rotation * Math.PI / 180) // 度转弧度
            }
      
            ctx.save()
            ctx.translate(x, y)
            // 根据旋转方向调整文字旋转角度，使用优化后的法线角度
            ctx.rotate(normalAngle + (company.rotateDirection === 'clockwise' ? -Math.PI/2 : Math.PI/2))
            // compression 控制沿路径方向排布，stretchScale 单独拉伸高度
            ctx.scale(company.compression, stretchScale)

            // 创建文字路径
            const path = new Path2D()
            path.rect(-fontSize/2, -fontSize, fontSize, fontSize)
            const visualHeight = fontSize * stretchScale
            this.textPaths.push({
                text: char,
                path: path,
                type: 'company',
                bounds: {
                    x: x - fontSize/2,
                    y: y - visualHeight,
                    width: fontSize,
                    height: visualHeight
                }
            })

            ctx.fillText(char, 0, 0)
            ctx.restore()
          })
        } else {
          const orderedSegments = segments
          let accUnits = 0

          orderedSegments.forEach((seg, index) => {
            const segMid = accUnits + seg.units / 2
            const angle = startAngle + direction * anglePerUnit * segMid
            
            // 计算字符位置
            let x = centerX + Math.cos(angle) * (radiusX - fontSize - borderOffset)
            let y = centerY + Math.sin(angle) * (radiusY - fontSize - borderOffset)
      
            // 应用单个文字的偏移调整（如果存在）
            const charAdjustment = company.charAdjustments && company.charAdjustments[index]
            if (charAdjustment) {
              // 计算椭圆在该点的切线和法线方向
              const tangentAngle = Math.atan2(-radiusX * Math.sin(angle), radiusY * Math.cos(angle))
              const normalAngleForOffset = Math.atan2(radiusX * Math.sin(angle), radiusY * Math.cos(angle))
              
              // 将偏移量转换为像素
              const offsetXPx = (charAdjustment.offsetX || 0) * this.mmToPixel
              const offsetYPx = (charAdjustment.offsetY || 0) * this.mmToPixel
              
              // 沿法线方向（垂直于边界）和切线方向（沿边界）应用偏移
              // 法线方向：垂直于椭圆边界
              // 切线方向：沿椭圆边界
              x += Math.cos(normalAngleForOffset) * offsetXPx + Math.cos(tangentAngle) * offsetYPx
              y += Math.sin(normalAngleForOffset) * offsetXPx + Math.sin(tangentAngle) * offsetYPx
            }
      
            // 计算椭圆在该点的法线角度（垂直于椭圆边界）
            // 对于椭圆 x²/a² + y²/b² = 1，在参数角 t 处的法线角度为 atan2(a*sin(t), b*cos(t))
            let normalAngle = Math.atan2(radiusX * Math.sin(angle), radiusY * Math.cos(angle))
      
            // 根据分布因子和椭圆形状优化法线角度，特别是对于两边的文字
            // 计算文字在分布范围内的相对位置（从中心到边缘，0为中心，1为边缘）
            const centerAngle = startAngle + totalAngle / 2
            const angleFromCenter = Math.abs(angle - centerAngle)
            const relativePosition = Math.min(angleFromCenter / (totalAngle / 2), 1)
            
            // 计算椭圆扁度（椭圆越扁，调整越明显）
            const ellipseFlatness = Math.abs(radiusX - radiusY) / Math.max(radiusX, radiusY)
            
            // 根据分布因子、相对位置和椭圆扁度计算调整
            // 分布因子越小，文字越集中，需要更强的调整
            // 相对位置越大（越靠近边缘），需要更强的调整
            const distributionFactor = Math.max(0.1, company.textDistributionFactor)
            const positionWeight = Math.pow(relativePosition, 1.5) // 使用1.5次方，使边缘调整更明显
            const flatnessWeight = Math.pow(ellipseFlatness, 0.8) // 椭圆扁度的影响
            
            // 计算调整因子，分布因子越小，调整越大
            const adjustmentFactor = positionWeight * (1 / distributionFactor) * flatnessWeight
            
            // 调整法线角度，使两边的文字更垂直于边界
            // 最大调整角度根据椭圆扁度和分布因子动态计算
            const maxAdjustment = Math.min(Math.PI / 6, Math.PI / 4 * ellipseFlatness * (1 / distributionFactor)) // 最大30度，但根据情况动态调整
            const angleAdjustment = adjustmentFactor * maxAdjustment
            
            // 根据文字在左边还是右边决定调整方向
            // 对于顶部文字，左侧文字需要顺时针调整，右侧文字需要逆时针调整
            const sideFactor = (angle < centerAngle) ? -1 : 1
            normalAngle += angleAdjustment * sideFactor
            
            // 应用单个文字的旋转调整（如果存在）
            if (charAdjustment && charAdjustment.rotation !== undefined) {
              normalAngle += (charAdjustment.rotation * Math.PI / 180) // 度转弧度
            }
      
            ctx.save()
            ctx.translate(x, y)
            // 根据旋转方向调整文字旋转角度，使用优化后的法线角度
            ctx.rotate(normalAngle + (company.rotateDirection === 'clockwise' ? -Math.PI/2 : Math.PI/2))
            ctx.scale(company.compression, stretchScale)

            // 创建文字路径
            const metrics = ctx.measureText(seg.text)
            const boxWidth = fontSize
            const path = new Path2D()
            path.rect(-boxWidth / 2, -fontSize, boxWidth, fontSize)
            const visualHeight = fontSize * stretchScale
            this.textPaths.push({
                text: seg.text,
                path: path,
                type: 'company',
                bounds: {
                    x: x - boxWidth / 2,
                    y: y - visualHeight,
                    width: boxWidth,
                    height: visualHeight
                }
            })

            ctx.fillText(seg.text, 0, 0)
            ctx.restore()

            accUnits += seg.units + spaceUnits
          })
        }
      
        ctx.restore()
    }

    private drawRtlWarpedEllipseText(
        ctx: CanvasRenderingContext2D,
        company: ICompany,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        borderOffset: number,
        fontSize: number,
        stretchScale: number,
        totalAngle: number,
        startAngle: number,
        direction: number,
        color: string
    ) {
        const text = company.companyName
        const metrics = ctx.measureText(text)
        const measuredWidth = metrics.width
        if (!Number.isFinite(measuredWidth) || measuredWidth <= 0) return

        const ascent = metrics.actualBoundingBoxAscent || fontSize
        const descent = metrics.actualBoundingBoxDescent || fontSize * 0.25
        const padding = 4
        const srcW = Math.ceil(measuredWidth) + padding * 2
        const srcH = Math.ceil(ascent + descent) + padding * 2
        const baselineY = padding + ascent
        const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
        const supersampleBase = Math.min(3, Math.max(2, Math.round(dpr)))
        const supersample = company.compression > 2 ? Math.min(3, supersampleBase + 1) : supersampleBase

        const off = document.createElement('canvas')
        off.width = srcW * supersample
        off.height = srcH * supersample
        const offCtx = off.getContext('2d')
        if (!offCtx) return

        offCtx.setTransform(1, 0, 0, 1, 0, 0)
        offCtx.clearRect(0, 0, off.width, off.height)
        offCtx.setTransform(supersample, 0, 0, supersample, 0, 0)
        offCtx.font = ctx.font
        offCtx.fillStyle = color
        offCtx.textBaseline = 'alphabetic'
        offCtx.textAlign = 'right'
        offCtx.direction = 'rtl'
        offCtx.imageSmoothingEnabled = true
        ;(offCtx as any).imageSmoothingQuality = 'high'
        const textRight = srcW - padding
        offCtx.fillText(text, textRight, baselineY)

        const visualWidth = measuredWidth * company.compression
        const visualHeight = fontSize * stretchScale
        const midAngle = startAngle + direction * totalAngle * 0.5
        const midX = centerX + Math.cos(midAngle) * (radiusX - fontSize - borderOffset)
        const midY = centerY + Math.sin(midAngle) * (radiusY - fontSize - borderOffset)
        const path = new Path2D()
        path.rect(-visualWidth / 2, -fontSize, visualWidth, fontSize)
        this.textPaths.push({
            text,
            path,
            type: 'company',
            bounds: {
                x: midX - visualWidth / 2,
                y: midY - visualHeight,
                width: visualWidth,
                height: visualHeight
            }
        })

        ctx.imageSmoothingEnabled = true
        ;(ctx as any).imageSmoothingQuality = 'high'

        const stepVisual = Math.max(0.9, Math.min(2.2, 1.1 + (company.compression - 1) * 0.6))
        const stepSrcBase = stepVisual / Math.max(0.001, company.compression)
        const sliceCount = Math.ceil(measuredWidth / stepSrcBase)
        const overlapVisual = Math.max(1, Math.min(2, supersample * 0.8))
        const overlapSrc = overlapVisual / Math.max(0.001, company.compression)

        for (let i = 0; i < sliceCount; i++) {
            const offsetSrc = i * stepSrcBase
            if (offsetSrc >= measuredWidth) break
            const sliceSrcW = Math.min(stepSrcBase, measuredWidth - offsetSrc)
            const t = (offsetSrc + sliceSrcW / 2) / measuredWidth
            const angle = startAngle + direction * totalAngle * t
            const x = centerX + Math.cos(angle) * (radiusX - fontSize - borderOffset)
            const y = centerY + Math.sin(angle) * (radiusY - fontSize - borderOffset)
            const normalAngle = Math.atan2(radiusX * Math.sin(angle), radiusY * Math.cos(angle))

            const srcX = textRight - offsetSrc - sliceSrcW
            let sx = srcX - overlapSrc / 2
            let sw = sliceSrcW + overlapSrc
            if (sx < 0) {
                sw += sx
                sx = 0
            }
            if (sx + sw > srcW) {
                sw = srcW - sx
            }
            if (sw <= 0) continue

            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(normalAngle + (company.rotateDirection === 'clockwise' ? -Math.PI / 2 : Math.PI / 2))
            ctx.scale(company.compression, stretchScale)
            ctx.drawImage(
                off,
                sx * supersample,
                0,
                sw * supersample,
                srcH * supersample,
                -sliceSrcW / 2 - overlapSrc / 2,
                -baselineY,
                sw,
                srcH
            )
            ctx.restore()
        }
    }

    /**
     * 绘制矩形文字（横向或纵向）
     */
    private drawRectangleText(
        ctx: CanvasRenderingContext2D,
        company: ICompany,
        centerX: number,
        centerY: number,
        width: number,
        height: number,
        color: string
    ) {
        const fontSize = company.fontHeight * this.mmToPixel
        const fontWeight = company.fontWeight || 'normal'
        const fontStyle = company.fontStyle || 'normal'
        const textMargin = (company.rectangleTextMargin !== undefined ? company.rectangleTextMargin : company.borderOffset) * this.mmToPixel
        const textDirection = company.rectangleTextDirection || 'horizontal'
        const textPosition = company.rectangleTextPosition || 'center'
        const textAlignment = company.rectangleTextAlignment || 'center'
        const verticalAlignment = company.rectangleVerticalAlignment || 'center'
        const lineSpacing = (company.rectangleLineSpacing || 0) * this.mmToPixel
        const stretchScale = company.textStretch ?? 1
        
        // 应用位置偏移量（毫米转像素）
        const positionOffsetX = (company.rectanglePositionX || 0) * this.mmToPixel
        const positionOffsetY = (company.rectanglePositionY || 0) * this.mmToPixel
        const adjustedCenterX = centerX + positionOffsetX
        const adjustedCenterY = centerY + positionOffsetY

        ctx.save()
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${company.fontFamily}`
        ctx.fillStyle = color

        // 矩形尺寸（像素）
        const rectWidth = width * this.mmToPixel
        const rectHeight = height * this.mmToPixel

        if (textDirection === 'horizontal') {
            // 横向绘制
            this.drawHorizontalTextWithWrap(
                ctx,
                company.companyName,
                adjustedCenterX,
                adjustedCenterY,
                rectWidth,
                rectHeight,
                fontSize,
                textMargin,
                textPosition,
                textAlignment,
                company.compression,
                stretchScale
            )
        } else {
            // 纵向绘制
            this.drawVerticalTextWithWrap(
                ctx,
                company.companyName,
                adjustedCenterX,
                adjustedCenterY,
                rectWidth,
                rectHeight,
                fontSize,
                textMargin,
                textPosition,
                verticalAlignment,
                lineSpacing,
                company.compression,
                stretchScale
            )
        }

        ctx.restore()
    }

    /**
     * 绘制横向文字（带自动换行）
     */
    private drawHorizontalTextWithWrap(
        ctx: CanvasRenderingContext2D,
        text: string,
        centerX: number,
        centerY: number,
        rectWidth: number,
        rectHeight: number,
        fontSize: number,
        textMargin: number,
        position: 'top' | 'bottom' | 'left' | 'right' | 'center',
        alignment: 'left' | 'center' | 'right',
        compression: number,
        stretchScale: number
    ) {
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        const rtl = isRtlText(text)
        ctx.direction = rtl ? 'rtl' : 'ltr'

        // 计算可用宽度（减去左右边距）
        const availableWidth = rectWidth - 2 * textMargin
        const lines: string[] = []
        if (rtl) {
            const trimmed = text.trim()
            const words = segmentWords(text)
            const tokens = words.length > 0 ? words : (trimmed ? [trimmed] : [])
            let currentLine = ''

            for (const word of tokens) {
                const candidate = currentLine ? `${currentLine} ${word}` : word
                const candidateWidth = ctx.measureText(candidate).width * compression
                if (candidateWidth > availableWidth && currentLine) {
                    lines.push(currentLine)
                    currentLine = word
                } else {
                    currentLine = candidate
                }
            }

            if (currentLine) lines.push(currentLine)
        } else {
            const characters = segmentGraphemes(text)
            let currentLine = ''
            let currentLineWidth = 0

            for (const char of characters) {
                const metrics = ctx.measureText(char)
                const charWidth = metrics.width * compression

                if (currentLineWidth + charWidth > availableWidth && currentLine.length > 0) {
                    lines.push(currentLine)
                    currentLine = char
                    currentLineWidth = charWidth
                } else {
                    currentLine += char
                    currentLineWidth += charWidth
                }
            }

            if (currentLine.length > 0) {
                lines.push(currentLine)
            }
        }

        // 计算总高度
        const totalHeight = lines.length * fontSize + (lines.length - 1) * fontSize * 0.2 // 行间距为字体大小的20%

        // 根据位置计算起始Y坐标
        let startY = centerY
        if (position === 'top') {
            startY = centerY - rectHeight / 2 + textMargin + fontSize / 2
        } else if (position === 'bottom') {
            startY = centerY + rectHeight / 2 - textMargin - fontSize / 2 - totalHeight + fontSize
        } else if (position === 'center') {
            startY = centerY - totalHeight / 2 + fontSize / 2
        } else if (position === 'left' || position === 'right') {
            startY = centerY
        }

        // 如果是左右位置，需要旋转90度
        if (position === 'left' || position === 'right') {
            const x = position === 'left' 
                ? centerX - rectWidth / 2 + textMargin + fontSize / 2
                : centerX + rectWidth / 2 - textMargin - fontSize / 2

            lines.forEach((line, lineIndex) => {
                const lineY = startY + lineIndex * (fontSize * 1.2)
                if (rtl) {
                    const metrics = ctx.measureText(line)
                    const visualWidth = metrics.width * compression
                    const anchorX =
                        alignment === 'left'
                            ? centerX - rectWidth / 2 + textMargin
                            : alignment === 'right'
                              ? centerX + rectWidth / 2 - textMargin
                              : centerX
                    const axisCenter =
                        alignment === 'left'
                            ? anchorX + visualWidth / 2
                            : alignment === 'right'
                              ? anchorX - visualWidth / 2
                              : anchorX

                    ctx.save()
                    ctx.translate(x, anchorX)
                    ctx.rotate(position === 'left' ? -Math.PI / 2 : Math.PI / 2)
                    ctx.scale(compression, stretchScale)
                    ctx.textAlign = alignment
                    ctx.textBaseline = 'middle'

                    const path = new Path2D()
                    path.rect(-visualWidth / 2, -fontSize / 2, visualWidth, fontSize)
                    const visualHeight = fontSize * stretchScale
                    this.textPaths.push({
                        text: line,
                        path: path,
                        type: 'company',
                        bounds: {
                            x: x - visualWidth / 2,
                            y: axisCenter - visualHeight / 2,
                            width: visualWidth,
                            height: visualHeight
                        }
                    })

                    ctx.fillText(line, 0, 0)
                    ctx.restore()
                } else {
                    const lineChars = segmentGraphemes(line)
                    const lineCharWidths = lineChars.map(char => {
                        const metrics = ctx.measureText(char)
                        return metrics.width * compression
                    })
                    const lineTotalWidth = lineCharWidths.reduce((sum, w) => sum + w, 0)

                    let lineStartX = centerX
                    if (alignment === 'left') {
                        lineStartX = centerX - rectWidth / 2 + textMargin
                    } else if (alignment === 'right') {
                        lineStartX = centerX + rectWidth / 2 - textMargin - lineTotalWidth
                    } else {
                        lineStartX = centerX - lineTotalWidth / 2
                    }

                    lineChars.forEach((char, charIndex) => {
                        const charWidth = lineCharWidths[charIndex]
                        const charX = lineStartX + lineCharWidths.slice(0, charIndex).reduce((sum, w) => sum + w, 0) + charWidth / 2

                        ctx.save()
                        ctx.translate(x, charX)
                        ctx.rotate(position === 'left' ? -Math.PI / 2 : Math.PI / 2)
                        ctx.scale(compression, stretchScale)

                        const metrics = ctx.measureText(char)
                        const path = new Path2D()
                        path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                        const visualHeight = fontSize * stretchScale
                        this.textPaths.push({
                            text: char,
                            path: path,
                            type: 'company',
                            bounds: {
                                x: x - metrics.width / 2,
                                y: charX - visualHeight / 2,
                                width: metrics.width,
                                height: visualHeight
                            }
                        })

                        ctx.fillText(char, 0, 0)
                        ctx.restore()
                    })
                }
            })
        } else {
            // 顶部、底部或中心位置，正常横向绘制
            lines.forEach((line, lineIndex) => {
                const lineY = startY + lineIndex * (fontSize * 1.2)
                if (rtl) {
                    const metrics = ctx.measureText(line)
                    const visualWidth = metrics.width * compression
                    const anchorX =
                        alignment === 'left'
                            ? centerX - rectWidth / 2 + textMargin
                            : alignment === 'right'
                              ? centerX + rectWidth / 2 - textMargin
                              : centerX
                    const axisCenter =
                        alignment === 'left'
                            ? anchorX + visualWidth / 2
                            : alignment === 'right'
                              ? anchorX - visualWidth / 2
                              : anchorX

                    ctx.save()
                    ctx.translate(anchorX, lineY)
                    ctx.scale(compression, stretchScale)
                    ctx.textAlign = alignment
                    ctx.textBaseline = 'middle'

                    const path = new Path2D()
                    path.rect(-visualWidth / 2, -fontSize / 2, visualWidth, fontSize)
                    const visualHeight = fontSize * stretchScale
                    this.textPaths.push({
                        text: line,
                        path: path,
                        type: 'company',
                        bounds: {
                            x: axisCenter - visualWidth / 2,
                            y: lineY - visualHeight / 2,
                            width: visualWidth,
                            height: visualHeight
                        }
                    })

                    ctx.fillText(line, 0, 0)
                    ctx.restore()
                } else {
                    const lineChars = segmentGraphemes(line)
                    const lineCharWidths = lineChars.map(char => {
                        const metrics = ctx.measureText(char)
                        return metrics.width * compression
                    })
                    const lineTotalWidth = lineCharWidths.reduce((sum, w) => sum + w, 0)

                    let lineStartX = centerX
                    if (alignment === 'left') {
                        lineStartX = centerX - rectWidth / 2 + textMargin
                    } else if (alignment === 'right') {
                        lineStartX = centerX + rectWidth / 2 - textMargin - lineTotalWidth
                    } else {
                        lineStartX = centerX - lineTotalWidth / 2
                    }

                    lineChars.forEach((char, charIndex) => {
                        const charWidth = lineCharWidths[charIndex]
                        const charX = lineStartX + lineCharWidths.slice(0, charIndex).reduce((sum, w) => sum + w, 0) + charWidth / 2

                        ctx.save()
                        ctx.translate(charX, lineY)
                        ctx.scale(compression, stretchScale)

                        const metrics = ctx.measureText(char)
                        const path = new Path2D()
                        path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                        const visualHeight = fontSize * stretchScale
                        this.textPaths.push({
                            text: char,
                            path: path,
                            type: 'company',
                            bounds: {
                                x: charX - metrics.width / 2,
                                y: lineY - visualHeight / 2,
                                width: metrics.width,
                                height: visualHeight
                            }
                        })

                        ctx.fillText(char, 0, 0)
                        ctx.restore()
                    })
                }
            })
        }
    }

    /**
     * 绘制横向文字（旧方法，保留用于兼容）
     */
    private drawHorizontalText(
        ctx: CanvasRenderingContext2D,
        text: string,
        centerX: number,
        centerY: number,
        rectWidth: number,
        rectHeight: number,
        fontSize: number,
        borderOffset: number,
        position: 'top' | 'bottom' | 'left' | 'right' | 'center',
        alignment: 'left' | 'center' | 'right',
        compression: number,
        stretchScale: number = 1
    ) {
        const characters = segmentGraphemes(text)
        ctx.textBaseline = 'middle'

        // 计算文字总宽度
        const charWidths = characters.map(char => {
            const metrics = ctx.measureText(char)
            return metrics.width * compression
        })
        const totalWidth = charWidths.reduce((sum, width) => sum + width, 0)

        // 根据位置计算Y坐标
        let y = centerY
        if (position === 'top') {
            y = centerY - rectHeight / 2 + borderOffset + fontSize / 2
        } else if (position === 'bottom') {
            y = centerY + rectHeight / 2 - borderOffset - fontSize / 2
        } else if (position === 'left' || position === 'right') {
            y = centerY
        }

        // 根据对齐方式计算起始X坐标
        let startX = centerX
        if (alignment === 'left') {
            startX = centerX - rectWidth / 2 + borderOffset
        } else if (alignment === 'right') {
            startX = centerX + rectWidth / 2 - borderOffset - totalWidth
        } else {
            startX = centerX - totalWidth / 2
        }

        // 如果是左右位置，需要旋转90度
        if (position === 'left' || position === 'right') {
            const x = position === 'left' 
                ? centerX - rectWidth / 2 + borderOffset + fontSize / 2
                : centerX + rectWidth / 2 - borderOffset - fontSize / 2

            characters.forEach((char, index) => {
                const charWidth = charWidths[index]
                const charX = startX + charWidths.slice(0, index).reduce((sum, w) => sum + w, 0) + charWidth / 2

                ctx.save()
                ctx.translate(x, charX)
                ctx.rotate(position === 'left' ? -Math.PI / 2 : Math.PI / 2)
                ctx.scale(compression, stretchScale)

                // 创建文字路径
                const metrics = ctx.measureText(char)
                const path = new Path2D()
                path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                const visualHeight = fontSize * stretchScale
                this.textPaths.push({
                    text: char,
                    path: path,
                    type: 'company',
                    bounds: {
                        x: x - metrics.width / 2,
                        y: charX - visualHeight / 2,
                        width: metrics.width,
                        height: visualHeight
                    }
                })

                ctx.fillText(char, 0, 0)
                ctx.restore()
            })
        } else {
            // 顶部、底部或中心位置，正常横向绘制
            characters.forEach((char, index) => {
                const charWidth = charWidths[index]
                const charX = startX + charWidths.slice(0, index).reduce((sum, w) => sum + w, 0) + charWidth / 2

                ctx.save()
                ctx.translate(charX, y)
                ctx.scale(compression, stretchScale)
                ctx.textAlign = 'center'

                // 创建文字路径
                const metrics = ctx.measureText(char)
                const path = new Path2D()
                path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                const visualHeight = fontSize * stretchScale
                this.textPaths.push({
                    text: char,
                    path: path,
                    type: 'company',
                    bounds: {
                        x: charX - metrics.width / 2,
                        y: y - visualHeight / 2,
                        width: metrics.width,
                        height: visualHeight
                    }
                })

                ctx.fillText(char, 0, 0)
                ctx.restore()
            })
        }
    }

    /**
     * 绘制纵向文字（带自动换行）
     */
    private drawVerticalTextWithWrap(
        ctx: CanvasRenderingContext2D,
        text: string,
        centerX: number,
        centerY: number,
        rectWidth: number,
        rectHeight: number,
        fontSize: number,
        textMargin: number,
        position: 'top' | 'bottom' | 'left' | 'right' | 'center',
        alignment: 'top' | 'center' | 'bottom',
        lineSpacing: number,
        compression: number,
        stretchScale: number
    ) {
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        // 计算可用高度（减去上下边距）
        const availableHeight = rectHeight - 2 * textMargin
        const characters = segmentGraphemes(text)

        // 将文字按列分割（自动换行）
        const columns: string[] = []
        let currentColumn = ''
        let currentColumnHeight = 0
        const actualLineSpacing = lineSpacing || fontSize * 0.2

        for (const char of characters) {
            const charHeight = fontSize + actualLineSpacing

            if (currentColumnHeight + charHeight > availableHeight && currentColumn.length > 0) {
                // 当前列已满，开始新列
                columns.push(currentColumn)
                currentColumn = char
                currentColumnHeight = fontSize
            } else {
                // 添加到当前列
                currentColumn += char
                currentColumnHeight += charHeight
            }
        }
        // 添加最后一列
        if (currentColumn.length > 0) {
            columns.push(currentColumn)
        }

        // 计算总宽度
        const columnWidth = fontSize + fontSize * 0.2 // 列间距为字体大小的20%
        const totalWidth = columns.length * columnWidth

        // 根据位置计算起始X坐标
        let startX = centerX
        if (position === 'left') {
            startX = centerX - rectWidth / 2 + textMargin + fontSize / 2
        } else if (position === 'right') {
            startX = centerX + rectWidth / 2 - textMargin - fontSize / 2 - totalWidth + columnWidth
        } else if (position === 'center') {
            startX = centerX - totalWidth / 2 + columnWidth / 2
        } else if (position === 'top' || position === 'bottom') {
            startX = centerX
        }

        // 如果是上下位置，需要旋转90度
        if (position === 'top' || position === 'bottom') {
            const y = position === 'top'
                ? centerY - rectHeight / 2 + textMargin + fontSize / 2
                : centerY + rectHeight / 2 - textMargin - fontSize / 2

            columns.forEach((column, columnIndex) => {
                const columnX = startX + columnIndex * columnWidth
                const columnChars = segmentGraphemes(column)
                
                // 计算列的总高度
                const columnTotalHeight = columnChars.length * fontSize + (columnChars.length - 1) * actualLineSpacing

                // 根据对齐方式计算起始Y坐标
                let columnStartY = centerY
                if (alignment === 'top') {
                    columnStartY = centerY - rectHeight / 2 + textMargin + fontSize / 2
                } else if (alignment === 'bottom') {
                    columnStartY = centerY + rectHeight / 2 - textMargin - fontSize / 2 - columnTotalHeight + fontSize
                } else {
                    columnStartY = centerY - columnTotalHeight / 2 + fontSize / 2
                }

                columnChars.forEach((char, charIndex) => {
                    const charY = columnStartY + charIndex * (fontSize + actualLineSpacing)

                    ctx.save()
                    ctx.translate(charY, y)
                    ctx.rotate(position === 'top' ? Math.PI / 2 : -Math.PI / 2)
                    ctx.scale(compression, stretchScale)

                    const metrics = ctx.measureText(char)
                    const path = new Path2D()
                    path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                    const visualHeight = fontSize * stretchScale
                    this.textPaths.push({
                        text: char,
                        path: path,
                        type: 'company',
                        bounds: {
                            x: charY - metrics.width / 2,
                            y: y - visualHeight / 2,
                            width: metrics.width,
                            height: visualHeight
                        }
                    })

                    ctx.fillText(char, 0, 0)
                    ctx.restore()
                })
            })
        } else {
            // 左右位置，正常纵向绘制
            columns.forEach((column, columnIndex) => {
                const columnX = startX + columnIndex * columnWidth
                const columnChars = segmentGraphemes(column)
                
                // 计算列的总高度
                const columnTotalHeight = columnChars.length * fontSize + (columnChars.length - 1) * actualLineSpacing

                // 根据对齐方式计算起始Y坐标
                let columnStartY = centerY
                if (alignment === 'top') {
                    columnStartY = centerY - rectHeight / 2 + textMargin + fontSize / 2
                } else if (alignment === 'bottom') {
                    columnStartY = centerY + rectHeight / 2 - textMargin - fontSize / 2 - columnTotalHeight + fontSize
                } else {
                    columnStartY = centerY - columnTotalHeight / 2 + fontSize / 2
                }

                columnChars.forEach((char, charIndex) => {
                    const charY = columnStartY + charIndex * (fontSize + actualLineSpacing)

                    ctx.save()
                    ctx.translate(columnX, charY)
                    ctx.scale(compression, stretchScale)

                    const metrics = ctx.measureText(char)
                    const path = new Path2D()
                    path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                    const visualHeight = fontSize * stretchScale
                    this.textPaths.push({
                        text: char,
                        path: path,
                        type: 'company',
                        bounds: {
                            x: columnX - metrics.width / 2,
                            y: charY - visualHeight / 2,
                            width: metrics.width,
                            height: visualHeight
                        }
                    })

                    ctx.fillText(char, 0, 0)
                    ctx.restore()
                })
            })
        }
    }

    /**
     * 绘制纵向文字（旧方法，保留用于兼容）
     */
    private drawVerticalText(
        ctx: CanvasRenderingContext2D,
        text: string,
        centerX: number,
        centerY: number,
        rectWidth: number,
        rectHeight: number,
        fontSize: number,
        borderOffset: number,
        position: 'top' | 'bottom' | 'left' | 'right' | 'center',
        alignment: 'top' | 'center' | 'bottom',
        lineSpacing: number,
        compression: number,
        stretchScale: number = 1
    ) {
        const characters = segmentGraphemes(text)
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        // 计算文字总高度
        const totalHeight = characters.length * fontSize + (characters.length - 1) * lineSpacing

        // 根据位置计算X坐标
        let x = centerX
        if (position === 'left') {
            x = centerX - rectWidth / 2 + borderOffset + fontSize / 2
        } else if (position === 'right') {
            x = centerX + rectWidth / 2 - borderOffset - fontSize / 2
        } else if (position === 'top' || position === 'bottom') {
            x = centerX
        }

        // 根据对齐方式计算起始Y坐标
        let startY = centerY
        if (alignment === 'top') {
            startY = centerY - rectHeight / 2 + borderOffset + fontSize / 2
        } else if (alignment === 'bottom') {
            startY = centerY + rectHeight / 2 - borderOffset - fontSize / 2 - totalHeight + fontSize
        } else {
            startY = centerY - totalHeight / 2 + fontSize / 2
        }

        // 如果是上下位置，需要旋转90度
        if (position === 'top' || position === 'bottom') {
            const y = position === 'top'
                ? centerY - rectHeight / 2 + borderOffset + fontSize / 2
                : centerY + rectHeight / 2 - borderOffset - fontSize / 2

            characters.forEach((char, index) => {
                const charY = startY + index * (fontSize + lineSpacing)

                ctx.save()
                ctx.translate(charY, y)
                ctx.rotate(position === 'top' ? Math.PI / 2 : -Math.PI / 2)
                ctx.scale(compression, stretchScale)

                // 创建文字路径
                const metrics = ctx.measureText(char)
                const path = new Path2D()
                path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                const visualHeight = fontSize * stretchScale
                this.textPaths.push({
                    text: char,
                    path: path,
                    type: 'company',
                    bounds: {
                        x: charY - metrics.width / 2,
                        y: y - visualHeight / 2,
                        width: metrics.width,
                        height: visualHeight
                    }
                })

                ctx.fillText(char, 0, 0)
                ctx.restore()
            })
        } else {
            // 左右位置，正常纵向绘制
            characters.forEach((char, index) => {
                const charY = startY + index * (fontSize + lineSpacing)

                ctx.save()
                ctx.translate(x, charY)
                ctx.scale(compression, stretchScale)

                // 创建文字路径
                const metrics = ctx.measureText(char)
                const path = new Path2D()
                path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                const visualHeight = fontSize * stretchScale
                this.textPaths.push({
                    text: char,
                    path: path,
                    type: 'company',
                    bounds: {
                        x: x - metrics.width / 2,
                        y: charY - visualHeight / 2,
                        width: metrics.width,
                        height: visualHeight
                    }
                })

                ctx.fillText(char, 0, 0)
                ctx.restore()
            })
        }
    }

}
