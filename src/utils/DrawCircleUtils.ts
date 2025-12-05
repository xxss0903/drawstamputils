import { IInnerCircle, LineStyle } from "../DrawStampTypes"

export class DrawCircleUtils {
    private mmToPixel = 10

    constructor(mmToPixel: number) {
        this.mmToPixel = mmToPixel
    }


    /**
     * 绘制内圈列表
     * @param ctx
     * @param circleList
     * @param centerX
     * @param centerY
     * @param borderColor
     */
    drawCircleList(ctx: CanvasRenderingContext2D, circleList: IInnerCircle[], centerX: number, centerY: number, borderColor: string) {
        circleList.forEach((circle) => {
            if (circle.drawInnerCircle) {
                const circleColor = circle.color || borderColor
                this.drawCircle(ctx, centerX, centerY, circleColor, circle)
            }
        })
    }

    drawCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, borderColor: string, circle: IInnerCircle) {
        const innerCircleWidth = (circle.innerCircleLineRadiusX - circle.innerCircleLineWidth) / 2
        const innerCircleHeight = (circle.innerCircleLineRadiusY - circle.innerCircleLineWidth) / 2
        const lineStyle: LineStyle = circle.lineStyle || 'solid'
        const dashLength = circle.dashLength ?? 2
        const gapLength = circle.gapLength ?? 1
        const shape = circle.shape || 'ellipse'
        const offsetX = (circle.offsetX ?? 0) * this.mmToPixel
        const offsetY = (circle.offsetY ?? 0) * this.mmToPixel

        if (shape === 'rectangle') {
            this.drawRectangle(
                ctx,
                centerX + offsetX,
                centerY + offsetY,
                innerCircleWidth * 2 * this.mmToPixel,
                innerCircleHeight * 2 * this.mmToPixel,
                circle.innerCircleLineWidth * this.mmToPixel,
                borderColor,
                lineStyle,
                dashLength,
                gapLength
            )
        } else if (shape === 'rhombus') {
            this.drawRhombus(
                ctx,
                centerX + offsetX,
                centerY + offsetY,
                innerCircleWidth * 2 * this.mmToPixel,
                innerCircleHeight * 2 * this.mmToPixel,
                circle.innerCircleLineWidth * this.mmToPixel,
                borderColor,
                lineStyle,
                dashLength,
                gapLength
            )
        } else if (shape === 'triangle') {
            this.drawTriangle(
                ctx,
                centerX + offsetX,
                centerY + offsetY,
                innerCircleWidth * 2 * this.mmToPixel,
                innerCircleHeight * 2 * this.mmToPixel,
                circle.innerCircleLineWidth * this.mmToPixel,
                borderColor,
                lineStyle,
                dashLength,
                gapLength
            )
        } else {
            this.drawEllipse(
                ctx,
                centerX + offsetX,
                centerY + offsetY,
                innerCircleWidth * this.mmToPixel,
                innerCircleHeight * this.mmToPixel,
                circle.innerCircleLineWidth * this.mmToPixel,
                borderColor,
                lineStyle,
                dashLength,
                gapLength
            )
        }
    }

    drawEllipse(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        radiusX: number,
        radiusY: number,
        borderWidth: number,
        borderColor: string,
        lineStyle: LineStyle = 'solid',
        dashLength: number = 2,
        gapLength: number = 1
    ) {
        if (lineStyle === 'solid') {
            ctx.setLineDash([])
        } else {
            const dash = Math.max(0.2, dashLength) * this.mmToPixel
            const gap = Math.max(0.2, gapLength) * this.mmToPixel
            ctx.setLineDash([dash, gap])
        }
        ctx.beginPath()
        ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth
        ctx.stroke()
        ctx.setLineDash([])
    }

    private drawRectangle(
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        width: number,
        height: number,
        borderWidth: number,
        borderColor: string,
        lineStyle: LineStyle,
        dashLength: number,
        gapLength: number
    ) {
        if (lineStyle === 'solid') {
            ctx.setLineDash([])
        } else {
            const dash = Math.max(0.2, dashLength) * this.mmToPixel
            const gap = Math.max(0.2, gapLength) * this.mmToPixel
            ctx.setLineDash([dash, gap])
        }
        ctx.beginPath()
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth
        ctx.rect(
            centerX - width / 2,
            centerY - height / 2,
            width,
            height
        )
        ctx.stroke()
        ctx.setLineDash([])
    }

    private drawRhombus(
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        width: number,
        height: number,
        borderWidth: number,
        borderColor: string,
        lineStyle: LineStyle,
        dashLength: number,
        gapLength: number
    ) {
        const halfWidth = width / 2
        const halfHeight = height / 2
        if (lineStyle === 'solid') {
            ctx.setLineDash([])
        } else {
            const dash = Math.max(0.2, dashLength) * this.mmToPixel
            const gap = Math.max(0.2, gapLength) * this.mmToPixel
            ctx.setLineDash([dash, gap])
        }
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - halfHeight)
        ctx.lineTo(centerX + halfWidth, centerY)
        ctx.lineTo(centerX, centerY + halfHeight)
        ctx.lineTo(centerX - halfWidth, centerY)
        ctx.closePath()
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth
        ctx.stroke()
        ctx.setLineDash([])
    }

    private drawTriangle(
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        width: number,
        height: number,
        borderWidth: number,
        borderColor: string,
        lineStyle: LineStyle,
        dashLength: number,
        gapLength: number
    ) {
        // 让描边完全限制在给定的宽高范围内
        // 由于描边会向外扩展 borderWidth/2，所以需要额外减去 borderWidth
        const adjustedWidth = Math.max(width - borderWidth * 2, 0)
        const adjustedHeight = Math.max(height - borderWidth * 2, 0)
        const halfWidth = adjustedWidth / 2
        const halfHeight = adjustedHeight / 2
        if (lineStyle === 'solid') {
            ctx.setLineDash([])
        } else {
            const dash = Math.max(0.2, dashLength) * this.mmToPixel
            const gap = Math.max(0.2, gapLength) * this.mmToPixel
            ctx.setLineDash([dash, gap])
        }
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - halfHeight)
        ctx.lineTo(centerX + halfWidth, centerY + halfHeight)
        ctx.lineTo(centerX - halfWidth, centerY + halfHeight)
        ctx.closePath()
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth
        ctx.stroke()
        ctx.setLineDash([])
    }
}
