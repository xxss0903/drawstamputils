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
        const letterSpacing = stampType.letterSpacing
        const positionY = stampType.positionY
        const fontWeight = stampType.fontWeight || 'normal'
        const lineSpacing = stampType.lineSpacing * this.mmToPixel

        ctx.save()
        ctx.font = `${fontWeight} ${fontSize}px ${stampType.fontFamily}`
        ctx.fillStyle = primaryColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 将印章类型文字按换行符分割成多行
        const lines = stampType.stampType.split('\n')
        const lineCount = lines.length

        lines.forEach((line, lineIndex) => {
            const chars = line.split('')
            const charWidths = chars.map((char) => ctx.measureText(char).width)
            const totalWidth =
                charWidths.reduce((sum, width) => sum + width, 0) +
                (chars.length - 1) * letterSpacing * this.mmToPixel

            // 计算每行的垂直偏移，使用新的 lineSpacing
            const lineOffset = (lineIndex - (lineCount - 1) / 2) * (fontSize + lineSpacing)

            // 计算文字位置（在五角星正下方）
            const textY = centerY + radiusX * 0.5 + positionY * this.mmToPixel + lineOffset

            ctx.save()
            ctx.translate(centerX, textY)
            ctx.scale(stampType.compression, 1)

            let currentX = -totalWidth / 2 // 从文本的左边缘开始

            // 绘制每个字符并存储路径
            chars.forEach((char, index) => {
                const charX = currentX + charWidths[index] / 2
                ctx.fillText(char, charX, 0)

                // 存储每个字符的路径
                this.textPaths.push({
                    text: char,
                    type: 'stampType',
                    path: new Path2D(),
                    bounds: {
                        x: centerX + (charX * stampType.compression),
                        y: textY - fontSize / 2,
                        width: charWidths[index] * stampType.compression,
                        height: fontSize
                    }
                })

                currentX += charWidths[index] + letterSpacing * this.mmToPixel
            })

            ctx.restore()
        })

        ctx.restore()
    }
} 