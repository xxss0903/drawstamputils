import {IInnerCircle} from "../DrawStampTypes"

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
        this.drawEllipse(
            ctx,
            centerX,
            centerY,
            innerCircleWidth * this.mmToPixel,
            innerCircleHeight * this.mmToPixel,
            circle.innerCircleLineWidth * this.mmToPixel,
            borderColor
        )
    }

    drawEllipse(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        radiusX: number,
        radiusY: number,
        borderWidth: number,
        borderColor: string
    ) {
        ctx.beginPath()
        ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth
        ctx.stroke()
    }
}
