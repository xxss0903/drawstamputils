import { ICompany } from "../DrawStampTypes"

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
        ctx.save()
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${company.fontFamily}`
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
      
        const characters = company.companyName.split('')
        const characterCount = characters.length
        const borderOffset = company.borderOffset * this.mmToPixel
      
        // 计算总角度和每个字符的角度
        const totalAngle = Math.PI * (0.5 + characterCount / (company.textDistributionFactor * 4))
        const anglePerChar = totalAngle / characterCount
      
        // 根据旋转方向设置起始角度和角度增量
        const direction = company.rotateDirection === 'clockwise' ? -1 : 1
        const startAngle = (company.startAngle ? company.startAngle : 0) + (company.rotateDirection === 'clockwise' ? 
          Math.PI - totalAngle / 2 : 
          Math.PI + (Math.PI - totalAngle) / 2)
      
        // 计算字符位置时考虑椭圆文字调整
        if (company.adjustEllipseText) {
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
            const x = centerX + Math.cos(angle) * (radiusX - fontSize - borderOffset)
            const y = centerY + Math.sin(angle) * (radiusY - fontSize - borderOffset)
      
            ctx.save()
            ctx.translate(x, y)
            // 根据旋转方向调整文字旋转角度
            ctx.rotate(angle + (company.rotateDirection === 'clockwise' ? -Math.PI/2 : Math.PI/2))
            ctx.scale(company.compression, 1)

            // 创建文字路径
            const path = new Path2D()
            path.rect(-fontSize/2, -fontSize, fontSize, fontSize)
            this.textPaths.push({
                text: char,
                path: path,
                type: 'company',
                bounds: {
                    x: x - fontSize/2,
                    y: y - fontSize,
                    width: fontSize,
                    height: fontSize
                }
            })

            ctx.fillText(char, 0, 0)
            ctx.restore()
          })
        } else {
          // 不调整椭圆文字时的正常绘制
          characters.forEach((char, index) => {
            const angle = startAngle + direction * anglePerChar * (index + 0.5)
            
            const x = centerX + Math.cos(angle) * (radiusX - fontSize - borderOffset)
            const y = centerY + Math.sin(angle) * (radiusY - fontSize - borderOffset)
      
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(angle + (company.rotateDirection === 'clockwise' ? -Math.PI/2 : Math.PI/2))
            ctx.scale(company.compression, 1)

            // 创建文字路径
            const path = new Path2D()
            path.rect(-fontSize/2, -fontSize, fontSize, fontSize)
            this.textPaths.push({
                text: char,
                path: path,
                type: 'company',
                bounds: {
                    x: x - fontSize/2,
                    y: y - fontSize,
                    width: fontSize,
                    height: fontSize
                }
            })

            ctx.fillText(char, 0, 0)
            ctx.restore()
          })
        }
      
        ctx.restore()
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
                company.compression
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
                company.compression
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
        compression: number
    ) {
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        // 计算可用宽度（减去左右边距）
        const availableWidth = rectWidth - 2 * textMargin
        const characters = text.split('')

        // 将文字按行分割（自动换行）
        const lines: string[] = []
        let currentLine = ''
        let currentLineWidth = 0

        for (const char of characters) {
            const metrics = ctx.measureText(char)
            const charWidth = metrics.width * compression

            if (currentLineWidth + charWidth > availableWidth && currentLine.length > 0) {
                // 当前行已满，开始新行
                lines.push(currentLine)
                currentLine = char
                currentLineWidth = charWidth
            } else {
                // 添加到当前行
                currentLine += char
                currentLineWidth += charWidth
            }
        }
        // 添加最后一行
        if (currentLine.length > 0) {
            lines.push(currentLine)
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
                const lineChars = line.split('')
                
                // 计算行的总宽度
                const lineCharWidths = lineChars.map(char => {
                    const metrics = ctx.measureText(char)
                    return metrics.width * compression
                })
                const lineTotalWidth = lineCharWidths.reduce((sum, w) => sum + w, 0)

                // 根据对齐方式计算起始X坐标
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
                    ctx.scale(compression, 1)

                    const metrics = ctx.measureText(char)
                    const path = new Path2D()
                    path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                    this.textPaths.push({
                        text: char,
                        path: path,
                        type: 'company',
                        bounds: {
                            x: x - metrics.width / 2,
                            y: charX - fontSize / 2,
                            width: metrics.width,
                            height: fontSize
                        }
                    })

                    ctx.fillText(char, 0, 0)
                    ctx.restore()
                })
            })
        } else {
            // 顶部、底部或中心位置，正常横向绘制
            lines.forEach((line, lineIndex) => {
                const lineY = startY + lineIndex * (fontSize * 1.2)
                const lineChars = line.split('')
                
                // 计算行的总宽度
                const lineCharWidths = lineChars.map(char => {
                    const metrics = ctx.measureText(char)
                    return metrics.width * compression
                })
                const lineTotalWidth = lineCharWidths.reduce((sum, w) => sum + w, 0)

                // 根据对齐方式计算起始X坐标
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
                    ctx.scale(compression, 1)

                    const metrics = ctx.measureText(char)
                    const path = new Path2D()
                    path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                    this.textPaths.push({
                        text: char,
                        path: path,
                        type: 'company',
                        bounds: {
                            x: charX - metrics.width / 2,
                            y: lineY - fontSize / 2,
                            width: metrics.width,
                            height: fontSize
                        }
                    })

                    ctx.fillText(char, 0, 0)
                    ctx.restore()
                })
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
        compression: number
    ) {
        const characters = text.split('')
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
                ctx.scale(compression, 1)

                // 创建文字路径
                const metrics = ctx.measureText(char)
                const path = new Path2D()
                path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                this.textPaths.push({
                    text: char,
                    path: path,
                    type: 'company',
                    bounds: {
                        x: x - metrics.width / 2,
                        y: charX - fontSize / 2,
                        width: metrics.width,
                        height: fontSize
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
                ctx.scale(compression, 1)
                ctx.textAlign = 'center'

                // 创建文字路径
                const metrics = ctx.measureText(char)
                const path = new Path2D()
                path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                this.textPaths.push({
                    text: char,
                    path: path,
                    type: 'company',
                    bounds: {
                        x: charX - metrics.width / 2,
                        y: y - fontSize / 2,
                        width: metrics.width,
                        height: fontSize
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
        compression: number
    ) {
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        // 计算可用高度（减去上下边距）
        const availableHeight = rectHeight - 2 * textMargin
        const characters = text.split('')

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
                const columnChars = column.split('')
                
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
                    ctx.scale(compression, 1)

                    const metrics = ctx.measureText(char)
                    const path = new Path2D()
                    path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                    this.textPaths.push({
                        text: char,
                        path: path,
                        type: 'company',
                        bounds: {
                            x: charY - metrics.width / 2,
                            y: y - fontSize / 2,
                            width: metrics.width,
                            height: fontSize
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
                const columnChars = column.split('')
                
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
                    ctx.scale(compression, 1)

                    const metrics = ctx.measureText(char)
                    const path = new Path2D()
                    path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                    this.textPaths.push({
                        text: char,
                        path: path,
                        type: 'company',
                        bounds: {
                            x: columnX - metrics.width / 2,
                            y: charY - fontSize / 2,
                            width: metrics.width,
                            height: fontSize
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
        compression: number
    ) {
        const characters = text.split('')
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
                ctx.scale(compression, 1)

                // 创建文字路径
                const metrics = ctx.measureText(char)
                const path = new Path2D()
                path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                this.textPaths.push({
                    text: char,
                    path: path,
                    type: 'company',
                    bounds: {
                        x: charY - metrics.width / 2,
                        y: y - fontSize / 2,
                        width: metrics.width,
                        height: fontSize
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
                ctx.scale(compression, 1)

                // 创建文字路径
                const metrics = ctx.measureText(char)
                const path = new Path2D()
                path.rect(-metrics.width / 2, -fontSize / 2, metrics.width, fontSize)
                this.textPaths.push({
                    text: char,
                    path: path,
                    type: 'company',
                    bounds: {
                        x: x - metrics.width / 2,
                        y: charY - fontSize / 2,
                        width: metrics.width,
                        height: fontSize
                    }
                })

                ctx.fillText(char, 0, 0)
                ctx.restore()
            })
        }
    }

}