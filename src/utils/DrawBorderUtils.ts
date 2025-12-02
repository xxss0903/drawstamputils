/**
 * 绘制椭圆边框
 */
export function drawBasicBorder(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    borderWidth: number,
    borderColor: string,
    lineStyle: 'solid' | 'dashed' | 'dotted' = 'solid',
    dashPx: number = 10,
    gapPx: number = 5
) {
    if (lineStyle === 'solid') {
        ctx.setLineDash([]);
    } else {
        ctx.setLineDash([Math.max(1, dashPx), Math.max(1, gapPx)]);
    }
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
    ctx.setLineDash([]);
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
    borderColor: string,
    lineStyle: 'solid' | 'dashed' | 'dotted' = 'solid',
    dashPx: number = 10,
    gapPx: number = 5,
    fillColor?: string
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

    // 如果提供了填充颜色，先填充背景
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    // 绘制边框
    if (lineStyle === 'solid') {
        ctx.setLineDash([]);
    } else {
        ctx.setLineDash([Math.max(1, dashPx), Math.max(1, gapPx)]);
    }
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
    ctx.setLineDash([]);
}

export function drawRhombusBorder(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    borderWidth: number,
    borderColor: string,
    lineStyle: 'solid' | 'dashed' | 'dotted' = 'solid',
    dashPx: number = 10,
    gapPx: number = 5
) {
    const adjustedWidth = Math.max(width - borderWidth, 0);
    const adjustedHeight = Math.max(height - borderWidth, 0);
    const halfWidth = adjustedWidth / 2;
    const halfHeight = adjustedHeight / 2;

    if (lineStyle === 'solid') {
        ctx.setLineDash([]);
    } else {
        ctx.setLineDash([Math.max(1, dashPx), Math.max(1, gapPx)]);
    }

    ctx.beginPath();
    ctx.moveTo(centerX, centerY - halfHeight);
    ctx.lineTo(centerX + halfWidth, centerY);
    ctx.lineTo(centerX, centerY + halfHeight);
    ctx.lineTo(centerX - halfWidth, centerY);
    ctx.closePath();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
    ctx.setLineDash([]);
}

