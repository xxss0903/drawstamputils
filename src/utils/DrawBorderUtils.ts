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
    gapPx: number = 5,
    fillColor?: string
) {
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);

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
    gapPx: number = 5,
    fillColor?: string
) {
    const adjustedWidth = Math.max(width - borderWidth, 0);
    const adjustedHeight = Math.max(height - borderWidth, 0);
    const halfWidth = adjustedWidth / 2;
    const halfHeight = adjustedHeight / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY - halfHeight);
    ctx.lineTo(centerX + halfWidth, centerY);
    ctx.lineTo(centerX, centerY + halfHeight);
    ctx.lineTo(centerX - halfWidth, centerY);
    ctx.closePath();

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

/**
 * 绘制不规则/有机形状边框
 * 使用噪声函数生成自然的、不规则的边缘
 */
export function drawOrganicBorder(
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
    fillColor?: string,
    irregularity: number = 0.15 // 不规则程度，0-1之间，值越大越不规则
) {
    const adjustedWidth = Math.max(width - borderWidth, 0);
    const adjustedHeight = Math.max(height - borderWidth, 0);
    const halfWidth = adjustedWidth / 2;
    const halfHeight = adjustedHeight / 2;

    // 生成不规则形状的点
    const points: number = 64 // 点的数量，越多越平滑但越不规则
    
    // 使用简化的噪声函数生成不规则边缘
    const noise = (angle: number) => {
        // 使用多个正弦波叠加来创建自然的噪声
        return (
            Math.sin(angle * 2) * 0.3 +
            Math.sin(angle * 3) * 0.2 +
            Math.sin(angle * 5) * 0.15 +
            Math.sin(angle * 7) * 0.1 +
            Math.sin(angle * 11) * 0.05
        ) * irregularity
    }

    // 生成路径点
    const pathPoints: { x: number; y: number }[] = []
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2
        const noiseValue = noise(angle * 2)
        
        // 基于椭圆形状，添加噪声
        const radiusX = halfWidth * (1 + noiseValue)
        const radiusY = halfHeight * (1 + noiseValue * 0.8) // 垂直方向稍微平滑一些
        
        const x = centerX + Math.cos(angle) * radiusX
        const y = centerY + Math.sin(angle) * radiusY
        
        pathPoints.push({ x, y })
    }

    // 使用二次贝塞尔曲线连接点，使边缘更平滑
    ctx.beginPath()
    if (pathPoints.length > 0) {
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y)
        
        for (let i = 0; i < pathPoints.length; i++) {
            const current = pathPoints[i]
            const next = pathPoints[(i + 1) % pathPoints.length]
            
            // 计算控制点（当前点和下一个点的中点）
            const cpX = (current.x + next.x) / 2
            const cpY = (current.y + next.y) / 2
            
            // 使用二次贝塞尔曲线
            ctx.quadraticCurveTo(current.x, current.y, cpX, cpY)
        }
        
        ctx.closePath()
    }

    // 如果提供了填充颜色，先填充背景
    if (fillColor) {
        ctx.fillStyle = fillColor
        ctx.fill()
    }

    // 绘制边框
    if (lineStyle === 'solid') {
        ctx.setLineDash([])
    } else {
        ctx.setLineDash([Math.max(1, dashPx), Math.max(1, gapPx)])
    }
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    ctx.stroke()
    ctx.setLineDash([])
}

/**
 * 绘制三角形边框
 */
export function drawTriangleBorder(
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
    // 由于描边会向外扩展 borderWidth/2，所以需要额外减去 borderWidth
    const adjustedWidth = Math.max(width - borderWidth * 2, 0);
    const adjustedHeight = Math.max(height - borderWidth * 2, 0);
    const halfWidth = adjustedWidth / 2;
    const halfHeight = adjustedHeight / 2;

    ctx.beginPath();
    // 绘制等边三角形，顶点在上方
    ctx.moveTo(centerX, centerY - halfHeight);
    ctx.lineTo(centerX + halfWidth, centerY + halfHeight);
    ctx.lineTo(centerX - halfWidth, centerY + halfHeight);
    ctx.closePath();

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

