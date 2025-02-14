import { ITaxNumber } from "../DrawStampTypes"

export class DrawTaxNumberUtils {
    private mmToPixel = 10
    // 添加存储文字路径的数组
    private textPaths: Array<{
        text: string,
        path: Path2D,
        type: 'taxNumber',
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

    // 绘制税号
    drawTaxNumber(
        ctx: CanvasRenderingContext2D,
        taxNumber: ITaxNumber,
        centerX: number,
        centerY: number,
        primaryColor: string,
    ) {
        const fontSize = taxNumber.fontHeight * this.mmToPixel
        const totalWidth = taxNumber.totalWidth * this.mmToPixel
        const positionY = taxNumber.positionY * this.mmToPixel + 0.3
        const fontWeight = taxNumber.fontWeight || 'normal'
        const letterSpacing = taxNumber.letterSpacing * this.mmToPixel

        ctx.save()
        ctx.font = `${fontWeight} ${fontSize}px ${taxNumber.fontFamily}`
        ctx.fillStyle = primaryColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const characters = taxNumber.code.split('')
        const charCount = characters.length

        // 计算压缩后的总宽度
        const compressedTotalWidth = totalWidth * taxNumber.compression

        // 计算单个字符的宽度（考虑压缩）
        const charWidth = (compressedTotalWidth - (charCount - 1) * letterSpacing) / charCount

        // 计算整个文本的实际宽度
        const actualWidth = charCount * charWidth + (charCount - 1) * letterSpacing

        // 计算起始位置，确保文本居中
        const startX = centerX - actualWidth / 2 + charWidth / 2
        const adjustedCenterY = centerY + positionY

        // 绘制每个字符
        characters.forEach((char, index) => {
            const x = startX + index * (charWidth + letterSpacing)
            
            ctx.save()
            ctx.translate(x, adjustedCenterY)
            ctx.scale(taxNumber.compression, 1.35)
            ctx.fillText(char, 0, 0)

            // 存储字符路径
            this.textPaths.push({
                text: char,
                type: 'taxNumber',
                path: new Path2D(),
                bounds: {
                    x: x - (charWidth * taxNumber.compression) / 2,
                    y: adjustedCenterY - fontSize / 2,
                    width: Math.abs(charWidth * taxNumber.compression),
                    height: fontSize * 1.35
                }

            })

            ctx.restore()
        })

        ctx.restore()
    }
} 