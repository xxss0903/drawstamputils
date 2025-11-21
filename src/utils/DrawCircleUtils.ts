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
                this.drawCircle(ctx, centerX, centerY, borderColor, circle)
            }
        })
    }

    drawCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, borderColor: string, circle: IInnerCircle) {
        const innerCircleWidth = (circle.innerCircleLineRadiusX - circle.innerCircleLineWidth) / 2
        const innerCircleHeight = (circle.innerCircleLineRadiusY - circle.innerCircleLineWidth) / 2
        const lineStyle: LineStyle = circle.lineStyle || 'solid'
        const dashLength = circle.dashLength ?? 2
        const gapLength = circle.gapLength ?? 1
        this.drawEllipse(
            ctx,
            centerX,
            centerY,
            innerCircleWidth * this.mmToPixel,
            innerCircleHeight * this.mmToPixel,
            circle.innerCircleLineWidth * this.mmToPixel,
            borderColor,
            lineStyle,
            dashLength,
            gapLength
        )
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
}
