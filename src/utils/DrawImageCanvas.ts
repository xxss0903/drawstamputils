export class DrawImageCanvas {
    private imageCanvas: HTMLCanvasElement;
    private imageCtx: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        // 创建新的 canvas 用于图像绘制
        this.imageCanvas = document.createElement('canvas');
        this.imageCanvas.width = width;
        this.imageCanvas.height = height;
        
        const ctx = this.imageCanvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get image canvas context');
        }
        this.imageCtx = ctx;
    }

    /**
     * 绘制图像
     */
    async drawImage(
        svgContent: string,
        x: number,
        y: number,
        width: number,
        height: number
    ): Promise<HTMLCanvasElement> {
        // 清除之前的内容
        this.imageCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);

        // 创建一个临时的 div 来解析 SVG 内容
        const div = document.createElement('div');
        div.innerHTML = svgContent;
        const svgElement = div.querySelector('svg');
        
        if (!svgElement) {
            throw new Error('Invalid SVG content');
        }

        // 确保 SVG 有宽高属性
        if (!svgElement.hasAttribute('width')) {
            svgElement.setAttribute('width', width.toString());
        }
        if (!svgElement.hasAttribute('height')) {
            svgElement.setAttribute('height', height.toString());
        }

        // 将 SVG 转换为 base64
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const base64Data = btoa(unescape(encodeURIComponent(svgString)));
        const base64Url = `data:image/svg+xml;base64,${base64Data}`;

        // 创建图片并加载
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = base64Url;
        });

        // 绘制图片到图像 canvas
        this.imageCtx.drawImage(img, x, y, width, height);

        return this.imageCanvas;
    }

    /**
     * 获取图像 canvas
     */
    getCanvas(): HTMLCanvasElement {
        return this.imageCanvas;
    }

    /**
     * 清除图像 canvas
     */
    clear() {
        this.imageCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
    }
} 