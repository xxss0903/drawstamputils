export function drawBasicBorder(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusX: number, radiusY: number, borderWidth: number, borderColor: string) {
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
}

