import { ICode } from "../DrawStampTypes"
import { getArcSegments, isRtlText } from "./textLayoutUtils"

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
        color: string
    ) {
        const fontSize = code.fontHeight * this.mmToPixel
        const text = code.code
        const fontWeight = code.fontWeight || 'normal'
        const stretchScale = code.textStretch ?? 1

        ctx.save()
        ctx.font = `${fontWeight} ${fontSize}px ${code.fontFamily}`
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const rtl = isRtlText(text)
        ctx.direction = rtl ? 'rtl' : 'ltr'

        const segments = getArcSegments(text, rtl)
        const spaceUnits = rtl && segments.length > 1 ? 1 : 0
        const totalUnits =
          segments.reduce((sum, s) => sum + s.units, 0) + Math.max(0, segments.length - 1) * spaceUnits

        // 处理单个字符的情况
        if (totalUnits <= 1) {
            // 单个字符直接绘制在底部中心位置
            const x = centerX
            const y = centerY + radiusY - fontSize - code.borderOffset * this.mmToPixel

            ctx.save()
            ctx.translate(x, y)
            // compression 继续只控制排布密度，stretchScale 单独拉伸高度
            ctx.scale(code.compression, stretchScale)
            ctx.fillText(text, 0, 0)

            // 存储文字路径（高度按拉伸后计入）
            const metrics = ctx.measureText(text)
            const visualWidth = metrics.width * code.compression
            const visualHeight = fontSize * stretchScale
            this.textPaths.push({
                text,
                type: 'code',
                path: new Path2D(),
                bounds: {
                    x: x - visualWidth / 2,
                    y: y - visualHeight / 2,
                    width: visualWidth,
                    height: visualHeight
                }
            })

            ctx.restore()
        } else {
            // 多个字符时的弧形排列
            const totalAngle = Math.PI * ((1 + totalUnits) / code.textDistributionFactor)
            const startAngle = Math.PI / 2 + totalAngle / 2
            const anglePerUnit = totalAngle / totalUnits

            const orderedSegments = rtl ? [...segments].reverse() : segments
            let accUnits = 0

            orderedSegments.forEach((seg) => {
                const segMid = accUnits + seg.units / 2
                const angle = startAngle - anglePerUnit * segMid
                const x = centerX + Math.cos(angle) * (radiusX - fontSize / 2 - code.borderOffset * this.mmToPixel)
                const y = centerY + Math.sin(angle) * (radiusY - fontSize / 2 - code.borderOffset * this.mmToPixel)

                ctx.save()
                ctx.translate(x, y)
                ctx.rotate(angle - Math.PI / 2)
                ctx.scale(code.compression, stretchScale)
                ctx.fillText(seg.text, 0, 0)

                // 存储每个字符的路径
                const metrics = ctx.measureText(seg.text)
                const visualWidth = metrics.width * code.compression
                const visualHeight = fontSize * stretchScale
                this.textPaths.push({
                    text: seg.text,
                    type: 'code',
                    path: new Path2D(),
                    bounds: {
                        x: x - visualWidth / 2,
                        y: y - visualHeight / 2,
                        width: visualWidth,
                        height: visualHeight
                    }
                })

                ctx.restore()

                accUnits += seg.units + spaceUnits
            })
        }

        ctx.restore()
    }
} 
