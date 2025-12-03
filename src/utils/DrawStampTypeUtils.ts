import { IStampType } from "../DrawStampTypes"

export class DrawStampTypeUtils {
    private mmToPixel = 10
    // 添加存储文字路径的数组
    private textPaths: Array<{
        text: string,
        path: Path2D,
        type: 'stampType',
        bounds: {
            x: number,
            y: number,
            width: number,
            height: number
        }
    }> = []

    constructor(mmToPixel: number) {
        this.mmToPixel = mmToPixel
    }

    // 获取文字路径数组
    getTextPaths() {
        return this.textPaths
    }

    // 清除文字路径
    clearTextPaths() {
        this.textPaths = []
    }

    // 绘制印章类型列表
    drawStampTypeList(
        ctx: CanvasRenderingContext2D,
        stampTypeList: IStampType[],
        centerX: number,
        centerY: number,
        radiusX: number,
        primaryColor: string
    ) {
        ctx.save()
        stampTypeList.forEach((stampType) => {
            this.drawStampType(ctx, stampType, centerX, centerY, radiusX, primaryColor)
        })
        ctx.restore()
    }

    // 绘制单个印章类型
    private drawStampType(
        ctx: CanvasRenderingContext2D,
        stampType: IStampType,
        centerX: number,
        centerY: number,
        radiusX: number,
        primaryColor: string
    ) {
        const fontSize = stampType.fontHeight * this.mmToPixel
        const letterSpacingPx = stampType.letterSpacing * this.mmToPixel
        const positionY = stampType.positionY
        const offsetX = (stampType.positionX || 0) * this.mmToPixel
        const fontWeight = stampType.fontWeight || 'normal'
        const lineSpacingPx = stampType.lineSpacing * this.mmToPixel
        const orientation = stampType.orientation || 'horizontal'
        const rotationRad = ((stampType.rotation || 0) * Math.PI) / 180

        ctx.save()
        const fontStyle = stampType.fontStyle || 'normal'
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${stampType.fontFamily}`
        ctx.fillStyle = stampType.color || primaryColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 将印章类型文字按换行符分割成多行
        const lines = stampType.stampType.split('\n')
        const lineCount = lines.length

        if (orientation === 'vertical') {
            const baseY = centerY + radiusX * 0.5 + positionY * this.mmToPixel
            lines.forEach((line, lineIndex) => {
                const chars = line.split('')
                const totalHeight =
                    chars.length * fontSize + Math.max(0, chars.length - 1) * letterSpacingPx
                const columnOffset =
                    (lineIndex - (lineCount - 1) / 2) * (fontSize + lineSpacingPx)
                const columnX = centerX + offsetX + columnOffset
                const startY = baseY - totalHeight / 2

                chars.forEach((char, charIndex) => {
                    const charY = startY + charIndex * (fontSize + letterSpacingPx) + fontSize / 2
                    const relativeY = charY - baseY

                    ctx.save()
                    ctx.translate(columnX, baseY)
                    if (rotationRad !== 0) {
                        ctx.rotate(rotationRad)
                    }
                    ctx.scale(stampType.compression, 1)
                    ctx.fillText(char, 0, relativeY)
                    ctx.restore()

                    const charWidth = ctx.measureText(char).width * stampType.compression
                    this.textPaths.push({
                        text: char,
                        type: 'stampType',
                        path: new Path2D(),
                        bounds: {
                            x: columnX - charWidth / 2,
                            y: charY - fontSize / 2,
                            width: charWidth,
                            height: fontSize
                        }
                    })
                })
            })
        } else {
            lines.forEach((line, lineIndex) => {
                const chars = line.split('')
                const charWidths = chars.map((char) => ctx.measureText(char).width)
                const totalWidth =
                    charWidths.reduce((sum, width) => sum + width, 0) +
                    (chars.length - 1) * letterSpacingPx

                // 计算每行的垂直偏移，使用 lineSpacing
                const lineOffset = (lineIndex - (lineCount - 1) / 2) * (fontSize + lineSpacingPx)

                // 计算文字位置（在五角星正下方）
                const textY = centerY + radiusX * 0.5 + positionY * this.mmToPixel + lineOffset

                ctx.save()
                ctx.translate(centerX + offsetX, textY)
                if (rotationRad !== 0) {
                    ctx.rotate(rotationRad)
                }
                ctx.scale(stampType.compression, 1)

                let currentX = -totalWidth / 2 // 从文本的左边缘开始

                // 绘制每个字符并存储路径
                chars.forEach((char, index) => {
                    const charX = currentX + charWidths[index] / 2
                    ctx.fillText(char, charX, 0)

                    const charWidth = charWidths[index] * stampType.compression

                    this.textPaths.push({
                        text: char,
                        type: 'stampType',
                        path: new Path2D(),
                        bounds: {
                            x: centerX + offsetX + charX * stampType.compression - charWidth / 2,
                            y: textY - fontSize / 2,
                            width: charWidth,
                            height: fontSize
                        }
                    })

                    currentX += charWidths[index] + letterSpacingPx
                })

                ctx.restore()
            })
        }

        ctx.restore()
    }
} 