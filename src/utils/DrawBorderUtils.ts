/**
 * 绘制椭圆边框
 */
export function drawBasicBorder(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusX: number, radiusY: number, borderWidth: number, borderColor: string) {
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
}

/**
 * 绘制矩形边框
 */
export function drawRectangleBorder(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    borderWidth: number,
    borderColor: string
) {
    ctx.beginPath();
    ctx.rect(
        centerX - width / 2,
        centerY - height / 2,
        width,
        height
    );
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
}

