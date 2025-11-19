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
    // 让描边完全限制在给定的宽高范围内
    const adjustedWidth = Math.max(width - borderWidth, 0);
    const adjustedHeight = Math.max(height - borderWidth, 0);
    const halfWidth = adjustedWidth / 2;
    const halfHeight = adjustedHeight / 2;

    ctx.beginPath();
    ctx.rect(
        centerX - halfWidth,
        centerY - halfHeight,
        adjustedWidth,
        adjustedHeight
    );
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
}

