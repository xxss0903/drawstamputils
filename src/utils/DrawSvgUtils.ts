import { IDrawStar } from "../DrawStampTypes";

export class DrawSvgUtils {

    private mmToPixel = 10

    constructor(mmToPixel: number) {
        this.mmToPixel = mmToPixel
    }

    /**
     * 绘制五角星
     * @param canvasCtx 画笔
     * @param x 圆心x坐标
     * @param y 圆心y坐标
     * @param r 半径
     */
    async drawStarShape(
        ctx: CanvasRenderingContext2D,
        starConfig: IDrawStar,
        centerX: number,
        centerY: number,
        color: string
    ) {
        const drawStarDia = starConfig.starDiameter / 2 * this.mmToPixel;
        console.log("drawStarShap 1e", centerX, centerY, drawStarDia, color)
        if (starConfig.svgPath.startsWith('<svg')) {
            this.drawSVGContent(ctx, starConfig.svgPath, centerX, centerY, 1, color);
        } else {
            this.drawSVGPath(ctx, starConfig.svgPath, centerX, centerY, drawStarDia, color);
        }
    }

    
    drawSVGContent(ctx: CanvasRenderingContext2D, svgContent: string, x: number, y: number, scale: number = 1, color: string) {
        // 创建一个临时的 SVG 元素
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.innerHTML = svgContent;
        const svgContentEle = svgElement.firstChild as SVGElement

        // 获取 SVG 的宽度和高度
        const svgWidth = parseFloat(svgContentEle.getAttribute('width') || '0');
        const svgHeight = parseFloat(svgContentEle.getAttribute('height') || '0');

        // 创建一个新的 Image 对象
        const img = new Image();

        // 将 SVG 转换为 data URL
        const svgBlob = new Blob([svgContent], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);

        // 当图片加载完成时在 canvas 上绘制它
        img.onload = () => {
            console.log("svg content img loaded", x, y, svgWidth, svgHeight, img);
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            ctx.drawImage(img, -svgWidth / 2, -svgHeight / 2, svgWidth, svgHeight);
            ctx.restore();

            // 清理 URL 对象
            URL.revokeObjectURL(url);
        };

        // 设置图片源为 SVG 的 data URL
        img.src = url;

        // 添加错误处理
        img.onerror = (error) => {
            console.error("加载SVG图像时出错:", error);
        };
    }

    
    private drawSVGPath(
        ctx: CanvasRenderingContext2D,
        svgPath: string,
        x: number,
        y: number,
        scale: number = 1,
        color: string
    ) {
        console.log("drawSVGPath", svgPath, x, y, scale, color)
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        // 创建 Path2D 对象
        const path = new Path2D(svgPath);
        // 填充路径
        ctx.fillStyle = color;
        ctx.fill(path);

        ctx.restore();
    }

}