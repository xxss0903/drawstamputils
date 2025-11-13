import { IInnerCircle } from "../DrawStampTypes"

export class DrawRectangleUtils {
    private mmToPixel = 10

    constructor(mmToPixel: number) {
        this.mmToPixel = mmToPixel
    }

    /**
     * 绘制矩形边框
     * @param ctx Canvas 上下文
     * @param centerX 中心X坐标
     * @param centerY 中心Y坐标
     * @param width 宽度（毫米）
     * @param height 高度（毫米）
     * @param borderWidth 边框宽度（毫米）
     * @param borderColor 边框颜色
     */
    drawRectangle(
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        width: number,
        height: number,
        borderWidth: number,
        borderColor: string
    ) {
        const pixelWidth = width * this.mmToPixel
        const pixelHeight = height * this.mmToPixel
        const pixelBorderWidth = borderWidth * this.mmToPixel

        ctx.beginPath()
        ctx.rect(
            centerX - pixelWidth / 2,
            centerY - pixelHeight / 2,
            pixelWidth,
            pixelHeight
        )
        ctx.strokeStyle = borderColor
        ctx.lineWidth = pixelBorderWidth
        ctx.stroke()
    }

    /**
     * 绘制矩形内框列表
     * @param ctx Canvas 上下文
     * @param rectangleList 矩形列表配置
     * @param centerX 中心X坐标
     * @param centerY 中心Y坐标
     * @param borderColor 边框颜色
     */
    drawRectangleList(
        ctx: CanvasRenderingContext2D,
        rectangleList: IInnerCircle[],
        centerX: number,
        centerY: number,
        borderColor: string
    ) {
        rectangleList.forEach((rect) => {
            if (rect.drawInnerCircle) {
                this.drawInnerRectangle(ctx, centerX, centerY, borderColor, rect)
            }
        })
    }

    /**
     * 绘制内矩形
     * @param ctx Canvas 上下文
     * @param centerX 中心X坐标
     * @param centerY 中心Y坐标
     * @param borderColor 边框颜色
     * @param rect 矩形配置
     */
    drawInnerRectangle(
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        borderColor: string,
        rect: IInnerCircle
    ) {
        const width = (rect.innerCircleLineRadiusX - rect.innerCircleLineWidth) / 2
        const height = (rect.innerCircleLineRadiusY - rect.innerCircleLineWidth) / 2

        this.drawRectangle(
            ctx,
            centerX,
            centerY,
            width * 2,
            height * 2,
            rect.innerCircleLineWidth,
            borderColor
        )
    }
}

