import { ICode } from "../DrawStampTypes"

export class DrawCodeUtils {
    private mmToPixel = 10
    // 添加存储文字路径的数组
    private textPaths: Array<{
        text: string,
        type: 'code',
        path: Path2D,
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

    drawCode(
        ctx: CanvasRenderingContext2D,
        code: ICode,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        primaryColor: string
    ) {
        const fontSize = code.fontHeight * this.mmToPixel
        const text = code.code
        const fontWeight = code.fontWeight || 'normal'

        ctx.save()
        ctx.font = `${fontWeight} ${fontSize}px ${code.fontFamily}`
        ctx.fillStyle = primaryColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const characters = text.split('')
        const characterCount = characters.length

        // 处理单个字符的情况
        if (characterCount === 1) {
            // 单个字符直接绘制在底部中心位置
            const x = centerX
            const y = centerY + radiusY - fontSize - code.borderOffset * this.mmToPixel

            ctx.save()
            ctx.translate(x, y)
            ctx.scale(code.compression, 1)
            ctx.fillText(text, 0, 0)

            // 存储文字路径
            const metrics = ctx.measureText(text)
            this.textPaths.push({
                text,
                type: 'code',
                path: new Path2D(),
                bounds: {
                    x: x - (metrics.width * code.compression) / 2,
                    y: y - fontSize / 2,
                    width: metrics.width * code.compression,
                    height: fontSize
                }
            })

            ctx.restore()
        } else {
            // 多个字符时的弧形排列
            const totalAngle = Math.PI * ((1 + characterCount) / code.textDistributionFactor)
            const startAngle = Math.PI / 2 + totalAngle / 2
            const anglePerChar = totalAngle / (characterCount - 1)

            characters.forEach((char, index) => {
                const angle = startAngle - anglePerChar * index
                const x = centerX + Math.cos(angle) * (radiusX - fontSize / 2 - code.borderOffset * this.mmToPixel)
                const y = centerY + Math.sin(angle) * (radiusY - fontSize / 2 - code.borderOffset * this.mmToPixel)

                ctx.save()
                ctx.translate(x, y)
                ctx.rotate(angle - Math.PI / 2)
                ctx.scale(code.compression, 1)
                ctx.fillText(char, 0, 0)

                // 存储每个字符的路径
                const metrics = ctx.measureText(char)
                this.textPaths.push({
                    text: char,
                    type: 'code',
                    path: new Path2D(),
                    bounds: {
                        x: x - (metrics.width * code.compression) / 2,
                        y: y - fontSize / 2,
                        width: metrics.width * code.compression,
                        height: fontSize
                    }
                })

                ctx.restore()
            })
        }

        ctx.restore()
    }
} 