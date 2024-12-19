import { IDrawStar } from "../DrawStampTypes";

export class DrawSvgUtils {

    private mmToPixel = 10

    constructor(mmToPixel: number) {
        this.mmToPixel = mmToPixel
    }

    /**
     * 绘制SVG内容
     */
    private async drawSVGContent(
        ctx: CanvasRenderingContext2D,
        svgContent: string,
        x: number,
        y: number,
        scale: number = 1
    ) {
        try {
            // 先绘制一个固定大小的矩形（10mm x 10mm）
            const rectSize = 10 * this.mmToPixel;
            // ctx.save();
            // ctx.translate(x, y);
            // ctx.scale(1, 1);
            // ctx.strokeStyle = 'blue';
            // ctx.lineWidth = 1;
            // ctx.strokeRect(10, 10, rectSize, rectSize);
            // ctx.restore();

            // 创建一个临时的 div 来解析 SVG 内容
            const div = document.createElement('div');
            div.innerHTML = svgContent;
            const svgElement = div.querySelector('svg');
            if (!svgElement) {
                throw new Error('Invalid SVG content');
            }

            // 确保 SVG 有宽高属性
            if (!svgElement.hasAttribute('width')) {
                svgElement.setAttribute('width', '100');
            }
            if (!svgElement.hasAttribute('height')) {
                svgElement.setAttribute('height', '100');
            }

            const svgWidth = parseFloat(svgElement.getAttribute('width') || '100');
            const svgHeight = parseFloat(svgElement.getAttribute('height') || '100');

            // 将 SVG 转换为 base64
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const base64Data = btoa(unescape(encodeURIComponent(svgString)));
            const base64Url = `data:image/svg+xml;base64,${base64Data}`;
            const tempImg = new Image();
            tempImg.src = base64Url;
            // 等待图片加载完成
            await new Promise((resolve, reject) => {
                tempImg.onload = resolve;
                tempImg.onerror = reject;
            });

            // 等待图片加载完成
            // await new Promise((resolve, reject) => {
            //     tempImg.onload = resolve;
            //     tempImg.onerror = reject;
            // });
            // const bitmap = await createImageBitmap(tempImg);
            // ctx.save();
            // ctx.drawImage(bitmap, -svgWidth / 2, -svgHeight / 2, svgWidth, svgHeight);
            // ctx.translate(x, y);
            // ctx.scale(1, 1);
            // ctx.strokeStyle = 'red';
            // ctx.lineWidth = 1;
            // ctx.strokeRect(110, 110, rectSize, rectSize);
            // ctx.restore();

            ctx.save();
            ctx.translate(x, y);
            ctx.scale(1, 1);
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 1;
            ctx.strokeRect(10, 10, rectSize, rectSize);
            ctx.restore();
            console.log("draw svg base64Url")
        } catch (error) {
            console.error('Error drawing SVG:', error);
        }
    }

    /**
     * 从文件加载并绘制SVG
     */
    async loadAndDrawSVG(
        ctx: CanvasRenderingContext2D,
        svgPath: string,
        x: number,
        y: number,
        scale: number = 1
    ) {
        try {
            const rectSize = 10 * this.mmToPixel;
            // ctx.save();
            // ctx.translate(x, y);
            // ctx.scale(1, 1);
            // ctx.strokeStyle = 'blue';
            // ctx.lineWidth = 1;
            // ctx.strokeRect(10, 10, rectSize, rectSize);
            // ctx.restore();
            // const response = await fetch(svgPath);
            // if (!response.ok) {
            //     throw new Error(`Failed to load SVG: ${response.statusText}`);
            // }
            // const svgContent = await response.text();
            // await this.drawSVGContent(ctx, svgContent, x, y, scale);
            console.log("draw test svg content", svgPath, x, y, scale)
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(1, 1);
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 1;
            ctx.strokeRect(10, 10, rectSize, rectSize);
            ctx.restore();
        } catch (error) {
            console.error('Error loading SVG:', error);
        }
    }

    /**
     * 绘制五角星或SVG图像
     */
    async drawStarShape(
        ctx: CanvasRenderingContext2D,
        starConfig: IDrawStar,
        centerX: number,
        centerY: number,
        color: string
    ) {
        try {
            if (starConfig.svgPath.startsWith('<svg')) {
                // 如果是SVG内容字符串
                await this.drawSVGContent(
                    ctx,
                    starConfig.svgPath,
                    centerX,
                    centerY + starConfig.starPositionY * this.mmToPixel,
                    starConfig.starDiameter * this.mmToPixel / 40
                );
            } else if (starConfig.svgPath.endsWith('.svg')) {
                // 如果是SVG文件路径
                await this.loadAndDrawSVG(
                    ctx,
                    starConfig.svgPath,
                    centerX,
                    centerY + starConfig.starPositionY * this.mmToPixel,
                    starConfig.starDiameter * this.mmToPixel / 40
                );
            } else {
                // 如果是SVG路径数据
                ctx.save();
                ctx.translate(
                    centerX,
                    centerY + starConfig.starPositionY * this.mmToPixel
                );
                ctx.scale(
                    starConfig.starDiameter * this.mmToPixel / 2,
                    starConfig.starDiameter * this.mmToPixel / 2
                );
                
                const path = new Path2D(starConfig.svgPath);
                ctx.fillStyle = color;
                ctx.fill(path);
                
                ctx.restore();
            }
        } catch (error) {
            console.error('Error in drawStarShape:', error);
        }
    }

}