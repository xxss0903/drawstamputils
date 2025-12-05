// 标尺宽度
import {
  ICode,
  IDrawImage,
  IDrawStampConfig,
  IDrawStar,
  ILineConfig,
  ISvgShape,
  IStampType,
  ITaxNumber
} from "./DrawStampTypes.ts";
import { drawBasicBorder, drawRectangleBorder, drawRhombusBorder, drawOrganicBorder, drawTriangleBorder } from "./utils/DrawBorderUtils.ts";
import { DrawCircleUtils } from "./utils/DrawCircleUtils.ts";
import { DrawCompanyUtils } from "./utils/DrawCompanyUtils.ts";
import { DrawRulerUtils } from "./utils/DrawRulerUtils.ts";
import { DrawSecurityPatternUtils } from "./utils/DrawSecurityPatternUtils.ts";
import { DrawSvgUtils } from "./utils/DrawSvgUtils.ts";
import { InitDrawStampConfigsUtils } from "./utils/InitDrawStampConfigsUtils.ts";
import { DrawImageCanvas } from "./utils/DrawImageCanvas.ts";
import { DrawCodeUtils } from './utils/DrawCodeUtils'
import { DrawStampTypeUtils } from './utils/DrawStampTypeUtils'
import { DrawTaxNumberUtils } from './utils/DrawTaxNumberUtils'
// 标尺宽度
const RULER_WIDTH = 8
// 标尺高度
const RULER_HEIGHT = 8

/**
 * 绘制印章工具类
 */
export class DrawStampUtils {
    // 缩放参数
    private scale: number = 1;
    private offsetX: number = 0;
    private offsetY: number = 0;

    // 毫米到像素的
    private mmToPixel: number
    // 主canvas的context
    private canvasCtx: CanvasRenderingContext2D
    // 离屏的canvas
    private offscreenCanvas: HTMLCanvasElement
    // 主canvas
    public canvas: HTMLCanvasElement
    // 印章偏移量
    private stampOffsetX: number = 0
    private stampOffsetY: number = 0
    // 总的印章绘制参数
    private drawStampConfigs: IDrawStampConfig
    // 添加图片缓存
    private imageCache: Map<string, ImageBitmap> = new Map();
    private svgBitmapCache: Map<string, ImageBitmap> = new Map();
    private pendingSvgLoads: Map<string, Promise<void>> = new Map();
    // 绘制内径圆的工具类
    private drawCircleUtils: DrawCircleUtils
    // 绘制svg的工具类
    private drawSvgUtils: DrawSvgUtils
    // 绘制公司的工具类
    public drawCompanyUtils: DrawCompanyUtils
    // 绘制标尺的工具类
    private drawRulerUtils: DrawRulerUtils
    // 绘制防伪纹路的工具类
    private drawSecurityPatternUtils: DrawSecurityPatternUtils
    // 初始化绘制印章配置的工具类
    private initDrawStampConfigsUtils: InitDrawStampConfigsUtils
    private imageCanvas: DrawImageCanvas;
    public drawCodeUtils: DrawCodeUtils
    public drawStampTypeUtils: DrawStampTypeUtils
    public drawTaxNumberUtils: DrawTaxNumberUtils
    private isDraggable: boolean = true;
    private isDragging: boolean = false;
    private dragStartPos: { x: number, y: number } = { x: 0, y: 0 };
    private stampPosition: { x: number, y: number } = { x: 0, y: 0 };

    /**
     * 构造函数
     * @param canvas 画布
     * @param mmToPixel 毫米到像素的转换比例
     */
    constructor(canvas: HTMLCanvasElement | null, mmToPixel: number) {
        if (!canvas) {
            throw new Error('Canvas is null')
        }
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            throw new Error('Failed to get canvas context')
        }
        this.initDrawStampConfigsUtils = new InitDrawStampConfigsUtils()
        this.drawStampConfigs = this.initDrawStampConfigsUtils.initDrawStampConfigs()
        this.canvasCtx = ctx
        this.mmToPixel = mmToPixel
        this.canvas = canvas
        // 创建离屏canvas
        this.offscreenCanvas = document.createElement('canvas')

        if (this.canvas && this.offscreenCanvas) {
            this.offscreenCanvas.width = canvas.width
            this.offscreenCanvas.height = canvas.height
        }
        this.addCanvasListener()
        this.drawCircleUtils = new DrawCircleUtils(this.mmToPixel)
        this.drawSvgUtils = new DrawSvgUtils(this.mmToPixel)
        this.drawCompanyUtils = new DrawCompanyUtils(this.mmToPixel)
        this.drawRulerUtils = new DrawRulerUtils(this.mmToPixel, RULER_WIDTH * this.mmToPixel)
        this.drawSecurityPatternUtils = new DrawSecurityPatternUtils(this.mmToPixel)
        this.drawCodeUtils = new DrawCodeUtils(mmToPixel)
        this.drawSvgUtils = new DrawSvgUtils(mmToPixel);
        this.imageCanvas = new DrawImageCanvas(canvas.width, canvas.height);
        this.drawStampTypeUtils = new DrawStampTypeUtils(mmToPixel)
        this.drawTaxNumberUtils = new DrawTaxNumberUtils(mmToPixel)
    }

    // 获取绘制印章的配置
    getDrawConfigs() {
        return this.drawStampConfigs
    }

    /**
     * 手动做旧效果
     * @param x
     * @param y
     * @param intensity
     */
    addManualAgingEffect(x: number, y: number, intensityFactor: number) {
        console.log('手动做旧   1', x, y, this.drawStampConfigs.agingEffect.agingEffectParams)
        const radius = 1 * this.mmToPixel; // 直径3mm，半径1.5mm

        // 考虑印章偏移量
        const adjustedX = x - this.stampOffsetX * this.mmToPixel;
        const adjustedY = y - this.stampOffsetY * this.mmToPixel;

        for (let i = 0; i < 10; i++) {
            // 将点击的地方增加一个做旧数据到做旧的列表里面
            this.drawStampConfigs.agingEffect.agingEffectParams.push({
                x: adjustedX,
                y: adjustedY,
                noiseSize: Math.random() * 3 + 1,
                noise: Math.random() * 200 * intensityFactor,
                strongNoiseSize: Math.random() * 5 + 2,
                strongNoise: Math.random() * 250 * intensityFactor + 5,
                fade: Math.random() * 50 * intensityFactor,
                seed: Math.random()
            })
        }

        // 立即刷新画布以显示效果
        this.refreshStamp(false, false);

        // 绘制鼠标点击效果
        this.canvasCtx.save();
        this.canvasCtx.globalCompositeOperation = 'destination-out'; // 改变这里
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(x, y, radius, 0, Math.PI * 2, true);
        this.canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // 使用白色，但透明度降低
        this.canvasCtx.fill();
        this.canvasCtx.restore();
    }

    // 设置绘制印章的配置，比如可以保存某些印章的配置，然后保存之后直接设置绘制，更加方便
    setDrawConfigs(drawConfigs: IDrawStampConfig) {
        if (!drawConfigs.lineList) {
            drawConfigs.lineList = []
        }
        if (!drawConfigs.svgList) {
            drawConfigs.svgList = []
        }
        this.drawStampConfigs = drawConfigs
        // 同步偏移量
        this.stampOffsetX = drawConfigs.offsetX || 0
        this.stampOffsetY = drawConfigs.offsetY || 0
        this.resetSvgCache()
    }

    private addCanvasListener() {
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.drawStampConfigs.openManualAging && event.buttons === 1) {
                const rect = this.canvas.getBoundingClientRect()
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const agingIntensity = this.drawStampConfigs.agingEffect.agingIntensity / 100;
                this.addManualAgingEffect(x, y, agingIntensity);
            } else {
                // 始终调用 onMouseMove 以显示 crossline，即使不拖动
                if (this.isDraggable) {
                    this.onMouseMove(event)
                } else {
                    // 即使不拖动，也要显示 crossline
                    const rect = this.canvas.getBoundingClientRect()
                    const x = event.clientX - rect.left
                    const y = event.clientY - rect.top
                    const mmX = Math.round(((x - RULER_WIDTH * this.mmToPixel) / this.mmToPixel) * 10) / 10
                    const mmY = Math.round(((y - RULER_HEIGHT * this.mmToPixel) / this.mmToPixel) * 10) / 10

                    this.refreshStamp()
                    if (this.drawStampConfigs.ruler.showCurrentPositionText) {
                        this.drawRulerUtils.drawCurrentPositionText(this.canvasCtx, mmX, mmY, this.scale, RULER_WIDTH * this.mmToPixel, RULER_HEIGHT * this.mmToPixel)
                    }
                    if (this.drawStampConfigs.ruler.showCrossLine) {
                        this.drawRulerUtils.drawPositionCrossLines(this.offscreenCanvas, this.canvas, RULER_WIDTH * this.mmToPixel, RULER_HEIGHT * this.mmToPixel, x, y, this.drawStampConfigs.primaryColor)
                    }
                }
            }
        })
        this.canvas.addEventListener('mouseleave', (event) => {
            this.onMouseLeave(event)
        })
        this.canvas.addEventListener('mousedown', (event) => {
            this.onMouseDown(event)
            if (this.drawStampConfigs.openManualAging) {
                // 添加手动做旧效果
                const rect = this.canvas.getBoundingClientRect()
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                // 增加做旧效果的强度
                const agingIntensity = this.drawStampConfigs.agingEffect.agingIntensity / 100; // 将强度调整为原来的2倍
                this.addManualAgingEffect(x, y, agingIntensity);
            }
        })
        this.canvas.addEventListener('mouseup', (event) => {
            this.onMouseUp()
        })
        this.canvas.addEventListener('click', (event) => {
            this.onCanvasClick(event)
        })
        // 添加鼠标滚轮事件监听器
        this.canvas.addEventListener('wheel', (event: WheelEvent) => {
            if (event.ctrlKey) {
                event.preventDefault();
                const zoom = event.deltaY > 0 ? 0.9 : 1.1;
                this.zoomCanvas(event.offsetX, event.offsetY, zoom);
            }
        });
    }

    private zoomCanvas(mouseX: number, mouseY: number, zoom: number) {
        const oldScale = this.scale;
        this.scale *= zoom;
        this.scale = Math.max(0.1, Math.min(5, this.scale)); // 限制缩放范围

        // 调整偏量以保持鼠标位置不变
        this.offsetX = mouseX - (mouseX - this.offsetX) * (this.scale / oldScale);
        this.offsetY = mouseY - (mouseY - this.offsetY) * (this.scale / oldScale);

        this.refreshStamp();
    }

    private onMouseUp = () => {
        this.isDragging = false
        this.refreshStamp(false, false);
    }

    // 点击印章区域，比如五角星等位置然后进行相应的跳转之类的
    private onCanvasClick = (event: MouseEvent) => {
        const canvas = this.canvas
        if (!canvas) return
    }

    private onMouseLeave = (event: MouseEvent) => {
        this.isDragging = false
        this.refreshStamp()
    }

    private onMouseDown = (event: MouseEvent) => {
        this.isDragging = true
        this.dragStartPos = {
            x: event.clientX - this.stampOffsetX * this.mmToPixel,
            y: event.clientY - this.stampOffsetY * this.mmToPixel
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        if (this.drawStampConfigs.openManualAging) {
            return
        }

        if (this.isDragging) {
            const newOffsetX = (event.clientX - this.dragStartPos.x) / this.mmToPixel
            const newOffsetY = (event.clientY - this.dragStartPos.y) / this.mmToPixel
            this.stampOffsetX = Math.round(newOffsetX * 10) / 10 // 四舍五入到小数点后一位
            this.stampOffsetY = Math.round(newOffsetY * 10) / 10
            this.refreshStamp()
        } else {
            // 原有的鼠标移动逻辑
            const rect = this.canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            const mmX = Math.round(((x - RULER_WIDTH * this.mmToPixel) / this.mmToPixel) * 10) / 10
            const mmY = Math.round(((y - RULER_HEIGHT * this.mmToPixel) / this.mmToPixel) * 10) / 10

            this.refreshStamp()
            if (this.drawStampConfigs.ruler.showCurrentPositionText) {
                this.drawRulerUtils.drawCurrentPositionText(this.canvasCtx, mmX, mmY, this.scale, RULER_WIDTH * this.mmToPixel, RULER_HEIGHT * this.mmToPixel)
            }
            if (this.drawStampConfigs.ruler.showCrossLine) {
                this.drawRulerUtils.drawPositionCrossLines(this.offscreenCanvas, this.canvas, RULER_WIDTH * this.mmToPixel, RULER_HEIGHT * this.mmToPixel, x, y, this.drawStampConfigs.primaryColor)
            }
        }
    }

    // 添加绘制图片列表的方法
    private async drawImageList(
        ctx: CanvasRenderingContext2D,
        imageList: IDrawImage[],
        centerX: number,
        centerY: number
    ) {
        for (const image of imageList) {
            if (image.imageUrl) {
                // 检查缓存中是否已有该图片
                let img = this.imageCache.get(image.imageUrl);

                if (img) {
                    this.drawSingleImage(ctx, img, image, centerX, centerY);
                } else {
                    try {
                        // 创建一个新的图片对象
                        const tempImg = new Image();
                        tempImg.src = image.imageUrl;

                        // 等待图片加载完成
                        await new Promise((resolve, reject) => {
                            tempImg.onload = resolve;
                            tempImg.onerror = reject;
                        });

                        // 将图片转换为 ImageBitmap
                        const bitmap = await createImageBitmap(tempImg);

                        // 存入缓存
                        this.imageCache.set(image.imageUrl, bitmap);

                        // 绘制图片
                        this.drawSingleImage(ctx, bitmap, image, centerX, centerY);

                        requestAnimationFrame(() => {
                            this.refreshStamp();
                        });
                    } catch (error) {
                        console.error("Error loading or processing image:", error);
                    }
                }
            }
        }
    }

    // 添加绘制单个图片的方法
    private drawSingleImage(
        ctx: CanvasRenderingContext2D,
        img: ImageBitmap,
        imageConfig: IDrawImage,
        centerX: number,
        centerY: number
    ) {
        // 计算绘制尺寸
        let width = imageConfig.imageWidth * this.mmToPixel;
        let height = imageConfig.imageHeight * this.mmToPixel;

        if (imageConfig.keepAspectRatio) {
            // 如果需要保持宽高比，计算缩放比例
            const scale = Math.min(width / img.width, height / img.height);
            width = img.width * scale;
            height = img.height * scale;
        }

        // 计算绘制位置（考虑偏移）
        const x = centerX + imageConfig.positionX * this.mmToPixel;
        const y = centerY + imageConfig.positionY * this.mmToPixel;

        // 获取旋转角度（度转弧度）
        const rotation = (imageConfig.rotation || 0) * Math.PI / 180;

        ctx.save();
        
        // 如果有旋转角度，先平移再旋转
        if (rotation !== 0) {
            ctx.translate(x, y);
            ctx.rotate(rotation);
            // 旋转后，绘制位置需要相对于旋转中心（0,0）
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
        } else {
            // 没有旋转，直接绘制
            ctx.drawImage(img, x - width / 2, y - height / 2, width, height);
        }
        
        ctx.restore();
    }

    private resetSvgCache() {
        this.svgBitmapCache.clear()
        this.pendingSvgLoads.clear()
    }

    private getSvgCacheKey(svg: ISvgShape) {
        return `${svg.id}-${svg.version ?? 0}-${svg.color || ''}`
    }

    private async createSvgBitmap(svg: ISvgShape): Promise<ImageBitmap | null> {
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(svg.svgContent, 'image/svg+xml')
            const svgElement = doc.documentElement
            if (!svgElement) return null

            const color = svg.color || this.drawStampConfigs.primaryColor || '#d40000'
            const style = doc.createElement('style')
            style.textContent = `* { fill: ${color} !important; stroke: ${color} !important; }`
            svgElement.insertBefore(style, svgElement.firstChild)

            if (!svgElement.getAttribute('viewBox')) {
                const widthAttr = svgElement.getAttribute('width')
                const heightAttr = svgElement.getAttribute('height')
                if (widthAttr && heightAttr) {
                    const widthValue = parseFloat(widthAttr)
                    const heightValue = parseFloat(heightAttr)
                    if (!Number.isNaN(widthValue) && !Number.isNaN(heightValue) && widthValue > 0 && heightValue > 0) {
                        svgElement.setAttribute('viewBox', `0 0 ${widthValue} ${heightValue}`)
                    }
                }
            }

            if (svg.color) {
                this.applyColorToSvg(svgElement, svg.color)
            }

            if (!svgElement.getAttribute('width')) {
                svgElement.setAttribute('width', '100')
            }
            if (!svgElement.getAttribute('height')) {
                svgElement.setAttribute('height', '100')
            }

            const svgString = new XMLSerializer().serializeToString(svgElement)
            const blob = new Blob([svgString], { type: 'image/svg+xml' })
            const objectUrl = URL.createObjectURL(blob)
            try {
                const bitmap = await new Promise<ImageBitmap>((resolve, reject) => {
                    const img = new Image()
                    img.crossOrigin = 'anonymous'
                    img.onload = () => {
                        createImageBitmap(img).then(resolve).catch(reject)
                    }
                    img.onerror = (err) => reject(err)
                    img.src = objectUrl
                })
                return bitmap
            } finally {
                URL.revokeObjectURL(objectUrl)
            }
        } catch (error) {
            console.error('创建 SVG 位图失败:', error)
            return null
        }
    }

    private applyColorToSvg(element: Element, color: string) {
        const tagName = element.tagName.toLowerCase()
        const hasFill = element.hasAttribute('fill')
        const hasStroke = element.hasAttribute('stroke')

        if (!hasFill || tagName === 'svg' || tagName === 'g') {
            element.setAttribute('fill', color)
        }
        if (!hasStroke && tagName !== 'image') {
            element.setAttribute('stroke', color)
        }

        Array.from(element.children).forEach((child) => this.applyColorToSvg(child, color))
    }

    private scheduleSvgBitmapLoad(svg: ISvgShape) {
        if (!svg.svgContent) return
        const cacheKey = this.getSvgCacheKey(svg)
        if (this.pendingSvgLoads.has(cacheKey)) {
            return
        }
        const loadPromise = this.createSvgBitmap(svg)
            .then((bitmap) => {
                if (bitmap) {
                    this.svgBitmapCache.set(cacheKey, bitmap)
                }
            })
            .catch((error) => {
                console.error('加载 SVG 图片失败:', error)
            })
            .finally(() => {
                this.pendingSvgLoads.delete(cacheKey)
                this.refreshStamp()
            })
        this.pendingSvgLoads.set(cacheKey, loadPromise)
    }

    private drawSvgList(
        ctx: CanvasRenderingContext2D,
        svgList: ISvgShape[],
        centerX: number,
        centerY: number
    ) {
        if (!svgList || svgList.length === 0) {
            return
        }

        svgList.forEach((svg) => {
            if (!svg || !svg.svgContent) return
            const cacheKey = this.getSvgCacheKey(svg)
            const bitmap = this.svgBitmapCache.get(cacheKey)

            if (!bitmap) {
                this.scheduleSvgBitmapLoad(svg)
                return
            }

            const scale = svg.scale ?? 1
            const baseWidth = svg.width || 10
            const baseHeight = svg.height || svg.width || 10
            const targetWidth = Math.max(1, baseWidth * this.mmToPixel * scale)
            let targetHeight = Math.max(1, baseHeight * this.mmToPixel * scale)

            if (svg.keepAspectRatio && bitmap.width > 0 && bitmap.height > 0) {
                const aspectRatio = bitmap.height / bitmap.width
                targetHeight = targetWidth * aspectRatio
            }

            const posX = centerX + (svg.positionX || 0) * this.mmToPixel
            const posY = centerY + (svg.positionY || 0) * this.mmToPixel
            const rotation = ((svg.rotation || 0) * Math.PI) / 180

            ctx.save()
            ctx.translate(posX, posY)
            if (rotation !== 0) {
                ctx.rotate(rotation)
            }
            ctx.drawImage(bitmap, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight)
            ctx.restore()
        })
    }

    private drawLines(
        ctx: CanvasRenderingContext2D,
        lineList: ILineConfig[],
        centerX: number,
        centerY: number
    ) {
        if (!lineList || lineList.length === 0) return
        ctx.save()
        for (const line of lineList) {
            const color = line.color || this.drawStampConfigs.primaryColor
            const opacity = typeof line.opacity === 'number' ? line.opacity : 1
            const lineWidth = Math.max(0.1, line.lineWidth || 0.5) * this.mmToPixel
            const halfLength = Math.max(0, line.length || 0) * this.mmToPixel / 2
            const posX = centerX + (line.positionX || 0) * this.mmToPixel
            const posY = centerY + (line.positionY || 0) * this.mmToPixel

            ctx.globalAlpha = opacity
            ctx.strokeStyle = color
            ctx.lineWidth = lineWidth

            if (line.style === 'dashed') {
                const dash = Math.max(0.5, line.dashLength ?? 2) * this.mmToPixel
                const gap = Math.max(0.5, line.gapLength ?? 1) * this.mmToPixel
                ctx.setLineDash([dash, gap])
            } else if (line.style === 'dotted') {
                const dot = Math.max(0.3, line.dashLength ?? 1) * this.mmToPixel
                const gap = Math.max(0.5, line.gapLength ?? 1.5) * this.mmToPixel
                ctx.setLineDash([dot, gap])
            } else {
                ctx.setLineDash([])
            }

            ctx.beginPath()
            if (line.type === 'vertical') {
                ctx.moveTo(posX, posY - halfLength)
                ctx.lineTo(posX, posY + halfLength)
            } else {
                ctx.moveTo(posX - halfLength, posY)
                ctx.lineTo(posX + halfLength, posY)
            }
            ctx.stroke()
            ctx.setLineDash([])
        }
        ctx.restore()
    }

    // 修改 clearImageCache 方法
    public async clearImageCache() {
        // 关闭所有 ImageBitmap
        for (const bitmap of this.imageCache.values()) {
            bitmap.close();
        }
        this.imageCache.clear();
    }

    /**
     * 绘制印章类型文字
     * @param centerX 圆心x坐标
     * @param centerY 圆心y坐标
     * @param radius 半径
     * @param text 文字
     * @param fontSize 字体大小
     * @param letterSpacing 字符间距
     * @param positionY 文字位置
     * @param fillColor 填充颜色
     */
    private drawStampType(
        ctx: CanvasRenderingContext2D,
        stampType: IStampType,
        centerX: number,
        centerY: number,
        radiusX: number
    ) {
        const fontSize = stampType.fontHeight * this.mmToPixel
        const letterSpacing = stampType.letterSpacing
        const positionY = stampType.positionY
        const fontWeight = stampType.fontWeight || 'normal';
        const lineSpacing = stampType.lineSpacing * this.mmToPixel; // 新增：行间距

        ctx.save()
        ctx.font = `${fontWeight} ${fontSize}px ${stampType.fontFamily}`
        ctx.fillStyle = this.drawStampConfigs.primaryColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 将印章类型文字按换行符分割成多行
        const lines = stampType.stampType.split('\n');
        const lineCount = lines.length;

        lines.forEach((line, lineIndex) => {
            const chars = line.split('')
            const charWidths = chars.map((char) => ctx.measureText(char).width)
            const totalWidth =
                charWidths.reduce((sum, width) => sum + width, 0) +
                (chars.length - 1) * letterSpacing * this.mmToPixel

            // 计算每行的垂直偏移，使用新的 lineSpacing
            const lineOffset = (lineIndex - (lineCount - 1) / 2) * (fontSize + lineSpacing);

            // 计算文字位置（在五角星正下方）
            const textY = centerY + radiusX * 0.5 + positionY * this.mmToPixel + lineOffset

            ctx.save()
            ctx.translate(centerX, textY)

            let currentX = -totalWidth / 2 // 从文本的左边缘开始

            ctx.scale(stampType.compression, 1)
            chars.forEach((char, index) => {
                ctx.fillText(char, currentX + charWidths[index] / 2, 0) // 绘制在字符的中心
                currentX += charWidths[index] + letterSpacing * this.mmToPixel
            })

            ctx.restore()
        });

        ctx.restore()
    }

    private drawStampTypeList(
        ctx: CanvasRenderingContext2D,
        stampTypeList: IStampType[],
        centerX: number,
        centerY: number,
        radiusX: number
    ) {
        stampTypeList.forEach((stampType) => {
            this.drawStampType(ctx, stampType, centerX, centerY, radiusX)
        })
        ctx.restore()
    }

    /**
     * 绘制税号
     * @param ctx 画布上下文
     * @param centerX 圆心x坐标
     * @param centerY 圆心y坐标
     */
    private drawTaxNumber(
        ctx: CanvasRenderingContext2D,
        taxNumber: ITaxNumber,
        centerX: number,
        centerY: number
    ) {
        const fontSize = taxNumber.fontHeight * this.mmToPixel
        const totalWidth = taxNumber.totalWidth * this.mmToPixel
        const positionY = taxNumber.positionY * this.mmToPixel + 0.3
        const fontWeight = taxNumber.fontWeight || 'normal'; // 新增字体粗细参数

        ctx.save()

        ctx.font = `${fontWeight} ${fontSize}px ${taxNumber.fontFamily}`;
        ctx.fillStyle = this.drawStampConfigs.primaryColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const characters = taxNumber.code.split('')
        const charCount = characters.length
        const letterSpacing = this.drawStampConfigs.taxNumber.letterSpacing * this.mmToPixel

        // 计算压缩后的总宽度
        const compressedTotalWidth = totalWidth * this.drawStampConfigs.taxNumber.compression

        // 计算单个字符的宽度（考虑压缩）
        const charWidth = (compressedTotalWidth - (charCount - 1) * letterSpacing) / charCount

        // 计算整个文本的实际宽度
        const actualWidth = charCount * charWidth + (charCount - 1) * letterSpacing

        // 计算起始位置，确保文居中
        const startX = centerX - actualWidth / 2 + charWidth / 2
        const adjustedCenterY = centerY + positionY * this.mmToPixel

        characters.forEach((char, index) => {
            const x = startX + index * (charWidth + letterSpacing)
            ctx.save()
            ctx.translate(x, adjustedCenterY)
            ctx.scale(this.drawStampConfigs.taxNumber.compression, 1.35)
            ctx.fillText(char, 0, 0)
            ctx.restore()
        })
        ctx.restore()
    }

    /**
     * 添加毛边效果
     * @param ctx 画布上下文
     * @param centerX 圆心x坐标
     * @param centerY 圆心y坐标
     * @param radiusX 椭圆长轴半径
     * @param radiusY 椭圆短轴半径
     * @param borderWidth 边框宽度
     */
    private addRoughEdge(
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        borderWidth: number,
        forceRefresh: boolean = false
    ) {
        const roughness = borderWidth * this.drawStampConfigs.roughEdge.roughEdgeHeight * 0.01
        const points = this.drawStampConfigs.roughEdge.roughEdgePoints;
        const outwardShift = this.drawStampConfigs.roughEdge.roughEdgeShift;

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.globalCompositeOperation = 'destination-out';

        // 如果需要刷新或者参数数组为空或未定义,则重新生成参数
        if (forceRefresh || !this.drawStampConfigs.roughEdge.roughEdgeParams || this.drawStampConfigs.roughEdge.roughEdgeParams.length === 0) {
            this.drawStampConfigs.roughEdge.roughEdgeParams = [];
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const shouldDraw = Math.random() > this.drawStampConfigs.roughEdge.roughEdgeProbability; // 增加概率以获得更稀疏的效果
                const size = shouldDraw ? Math.random() * roughness * Math.random() + this.drawStampConfigs.roughEdge.roughEdgeWidth : 0; // 减小圆形大小
                this.drawStampConfigs.roughEdge.roughEdgeParams.push({angle, size, offset: outwardShift, opacity: 1});
            }
        }

        // 使用保存的参数绘制毛边
        this.drawStampConfigs.roughEdge.roughEdgeParams.forEach(({angle, size}) => {
            const x = centerX + Math.cos(angle) * (radiusX + outwardShift);
            const y = centerY + Math.sin(angle) * (radiusY + outwardShift);

            if (size > 0) {
                ctx.beginPath();
                ctx.arc(x, y, size * this.mmToPixel, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.restore();
    }

    /**
     * 添加做旧效果
     * @param width 画布宽度
     * @param height 画布高度
     * @param forceRefresh 是否强制刷新
     */
    private addAgingEffect(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        forceRefresh: boolean = false
    ) {
        // console.log("addAgingEffect", "width", width, "height", height, "forceRefresh", this.drawStampConfigs.agingEffect.applyAging)
        if (!this.drawStampConfigs.agingEffect.applyAging) return;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const centerX = width / (2 * this.scale) + this.stampOffsetX * this.mmToPixel / this.scale;
        const centerY = height / (2 * this.scale) + this.stampOffsetY * this.mmToPixel / this.scale;
        const radius = (Math.max(width, height) / 2) * this.mmToPixel / this.scale;

        // 如果需要刷新或者参数数组为空,则重新生成参数
        if (forceRefresh || this.drawStampConfigs.agingEffect.agingEffectParams.length === 0) {
            this.drawStampConfigs.agingEffect.agingEffectParams = []
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4
                    const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
                    if (distanceFromCenter <= radius) {
                        // 检查像素是否不是透明的（alpha 通道不为 0）
                        if (data[index + 3] > 0) {
                            const intensityFactor = this.drawStampConfigs.agingEffect.agingIntensity / 100
                            const seed = Math.random()
                            this.drawStampConfigs.agingEffect.agingEffectParams.push({
                                x: x - this.stampOffsetX * this.mmToPixel,
                                y: y - this.stampOffsetY * this.mmToPixel,
                                noiseSize: Math.random() * 3 + 1,
                                noise: Math.random() * 200 * intensityFactor,
                                strongNoiseSize: Math.random() * 5 + 2,
                                strongNoise: Math.random() * 250 * intensityFactor + 5,
                                fade: Math.random() * 50 * intensityFactor,
                                seed: seed
                            })
                        }
                    }
                }
            }
        }

        // 使用保存的参数应用做旧效果
        this.drawStampConfigs.agingEffect.agingEffectParams.forEach((param) => {
            const {x, y, noiseSize, noise, strongNoiseSize, strongNoise, fade, seed} = param
            const adjustedX = x + this.stampOffsetX * this.mmToPixel
            const adjustedY = y + this.stampOffsetY * this.mmToPixel
            const index = (Math.round(adjustedY) * width + Math.round(adjustedX)) * 4

            if (seed < 0.4) {
                this.addCircularNoise(data, width, adjustedX, adjustedY, noiseSize, noise, true)
            }

            if (seed < 0.05) {
                this.addCircularNoise(data, width, adjustedX, adjustedY, strongNoiseSize, strongNoise, true)
            }

            if (seed < 0.2) {
                data[index + 3] = Math.max(0, data[index + 3] - fade) // 修改这里，只改变透明度
            }
        })

        ctx.putImageData(imageData, 0, 0)
    }

    private addCircularNoise(
        data: Uint8ClampedArray,
        width: number,
        x: number,
        y: number,
        size: number,
        intensity: number,
        transparent: boolean = false
    ) {
        const radiusSquared = (size * size) / 4
        for (let dy = -size / 2; dy < size / 2; dy++) {
            for (let dx = -size / 2; dx < size / 2; dx++) {
                if (dx * dx + dy * dy <= radiusSquared) {
                    const nx = Math.round(x + dx)
                    const ny = Math.round(y + dy)
                    const nIndex = (ny * width + nx) * 4
                    if (nIndex >= 0 && nIndex < data.length) {
                        if (transparent) {
                            data[nIndex + 3] = Math.max(0, data[nIndex + 3] - intensity) // 只改变透明度
                        } else {
                            data[nIndex] = Math.min(255, data[nIndex] + intensity)
                            data[nIndex + 1] = Math.min(255, data[nIndex + 1] + intensity)
                            data[nIndex + 2] = Math.min(255, data[nIndex + 2] + intensity)
                        }
                    }
                }
            }
        }
    }

    /**
     * 将印章保存为PNG图片
     * @param outputSize 输出图片的尺寸
     */
    saveStampAsPNG(
        format: 'png' | 'jpeg' | 'svg' = 'png',
        quality: number = 0.92,
        targetWidth?: number,
        targetHeight?: number
    ) {
        // 图像与边框的间距
        let imagePadding = 1
        let maxStampSize = Math.max(this.drawStampConfigs.width, this.drawStampConfigs.height)
        let stampWidth = (this.drawStampConfigs.width + imagePadding*2) * this.mmToPixel
        let stampHeight = (this.drawStampConfigs.height + imagePadding*2) * this.mmToPixel
        // 输出图片的尺寸
        let outputSize = (maxStampSize + imagePadding) * this.mmToPixel
        // 首先隐藏虚线
        this.drawStampConfigs.ruler.showCrossLine = false
        this.drawStampConfigs.ruler.showRuler = false
        this.drawStampConfigs.ruler.showDashLine = false
        this.drawStampConfigs.ruler.showSideRuler = false
        this.drawStampConfigs.ruler.showFullRuler = false
        this.drawStampConfigs.ruler.showCurrentPositionText = false
        this.refreshStamp()
        setTimeout(() => {
            // 创建一个新的 canvas 元素，大小为 outputSize x outputSize
            const saveCanvas = document.createElement('canvas')
            saveCanvas.width = stampWidth
            saveCanvas.height = stampHeight
            const saveCtx = saveCanvas.getContext('2d')
            if (!saveCtx) return
            // 清除画布，使背景透明
            saveCtx.clearRect(0, 0, stampWidth, stampHeight)
            /*
+            image	绘制到画板的图像资源，可以是任何的 canvas 图像源 ( CanvasImageSource)，例如：HTMLImageElement，HTMLVideoElement，或者 HTMLCanvasElement
            dx	绘制图像时起点的 X 轴位置
            dy	绘制图像时起点的 Y 轴位置
            dWidth	在目标画布上绘制图像的宽度。 允许对绘制的图像进行缩放，如果不传递，绘制图像 如果不说明， 在绘制时图片宽度不会缩放
            dHeight	在目标画布上绘制图像的高度。 允许对绘制的图像进行缩放。 如果不说明， 在绘制时图片高度不会缩放
            sx	截取图像时指定起点的 X 坐标
            sy	截取图像时指定起点的 Y 坐标
            sWidth	图像截取的高度
            sHeight	图像截取的宽度
             */
            // 将原始 canvas 中的印章部分绘制到新的 canvas 上，并调整大小
            saveCtx.drawImage(
                this.canvas,
                RULER_WIDTH*this.mmToPixel + this.stampOffsetX * this.mmToPixel,
                RULER_HEIGHT*this.mmToPixel + this.stampOffsetY * this.mmToPixel,
                stampWidth,
                stampHeight,
                imagePadding * this.mmToPixel,
                imagePadding * this.mmToPixel,
                stampWidth,
                stampHeight
            )

            // 如果启用了做旧效果，在新的 canvas 上应用做旧效果
            if (this.drawStampConfigs.agingEffect.applyAging) {
                this.addAgingEffect(saveCtx, stampWidth, stampHeight, false)
            }

            // 如果需要自定义导出尺寸，创建缩放后的画布
            let outputCanvas = saveCanvas
            const exportWidth = targetWidth && targetWidth > 0 ? targetWidth : stampWidth
            const exportHeight = targetHeight && targetHeight > 0 ? targetHeight : stampHeight
            if (exportWidth !== stampWidth || exportHeight !== stampHeight) {
                const scaledCanvas = document.createElement('canvas')
                scaledCanvas.width = exportWidth
                scaledCanvas.height = exportHeight
                const scaledCtx = scaledCanvas.getContext('2d')
                if (scaledCtx) {
                    scaledCtx.drawImage(saveCanvas, 0, 0, exportWidth, exportHeight)
                    outputCanvas = scaledCanvas
                }
            }

            let dataURL: string
            let filename: string

            if (format === 'svg') {
                // 对于 SVG，将 PNG 数据嵌入到 SVG 中
                const pngDataURL = outputCanvas.toDataURL('image/png')
                const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${outputCanvas.width}" height="${outputCanvas.height}">
  <image href="${pngDataURL}" width="${outputCanvas.width}" height="${outputCanvas.height}"/>
</svg>`
                dataURL = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`
                filename = 'mystamp.svg'
            } else if (format === 'jpeg') {
                // JPEG 格式，需要白色背景
                const tempCanvas = document.createElement('canvas')
                tempCanvas.width = outputCanvas.width
                tempCanvas.height = outputCanvas.height
                const tempCtx = tempCanvas.getContext('2d')
                if (tempCtx) {
                    tempCtx.fillStyle = '#FFFFFF'
                    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
                    tempCtx.drawImage(outputCanvas, 0, 0, tempCanvas.width, tempCanvas.height)
                    dataURL = tempCanvas.toDataURL('image/jpeg', quality)
                } else {
                    dataURL = outputCanvas.toDataURL('image/jpeg', quality)
                }
                filename = 'mystamp.jpg'
            } else {
                // PNG 格式（默认）
                dataURL = outputCanvas.toDataURL('image/png')
                filename = 'mystamp.png'
            }

            // 创建一个临时的 <a> 元素来触发下载
            const link = document.createElement('a')
            link.href = dataURL
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // 恢复标尺
            this.drawStampConfigs.ruler.showCrossLine = true
            this.drawStampConfigs.ruler.showRuler = true
            this.drawStampConfigs.ruler.showDashLine = true
            this.drawStampConfigs.ruler.showSideRuler = true
            this.drawStampConfigs.ruler.showFullRuler = true
            this.drawStampConfigs.ruler.showCurrentPositionText = true
            this.refreshStamp()
        }, 50)
    }

    getExportBaseSize(padding: number = 1) {
        const width = (this.drawStampConfigs.width + padding * 2) * this.mmToPixel
        const height = (this.drawStampConfigs.height + padding * 2) * this.mmToPixel
        return { width, height }
    }

    /**
     * 获取印章图片的 base64 数据
     * @param format 图片格式
     * @param quality 图片质量（仅对 JPEG 有效）
     * @param targetWidth 目标宽度（可选）
     * @param targetHeight 目标高度（可选）
     * @returns Promise<string> base64 数据 URL
     */
    async getStampImageBase64(
        format: 'png' | 'jpeg' = 'png',
        quality: number = 0.92,
        targetWidth?: number,
        targetHeight?: number
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            // 图像与边框的间距
            let imagePadding = 1
            let maxStampSize = Math.max(this.drawStampConfigs.width, this.drawStampConfigs.height)
            let stampWidth = (this.drawStampConfigs.width + imagePadding*2) * this.mmToPixel
            let stampHeight = (this.drawStampConfigs.height + imagePadding*2) * this.mmToPixel

            // 首先隐藏标尺
            const originalShowCrossLine = this.drawStampConfigs.ruler.showCrossLine
            const originalShowRuler = this.drawStampConfigs.ruler.showRuler
            const originalShowDashLine = this.drawStampConfigs.ruler.showDashLine
            const originalShowSideRuler = this.drawStampConfigs.ruler.showSideRuler
            const originalShowFullRuler = this.drawStampConfigs.ruler.showFullRuler
            const originalShowCurrentPositionText = this.drawStampConfigs.ruler.showCurrentPositionText

            this.drawStampConfigs.ruler.showCrossLine = false
            this.drawStampConfigs.ruler.showRuler = false
            this.drawStampConfigs.ruler.showDashLine = false
            this.drawStampConfigs.ruler.showSideRuler = false
            this.drawStampConfigs.ruler.showFullRuler = false
            this.drawStampConfigs.ruler.showCurrentPositionText = false
            this.refreshStamp()

            setTimeout(() => {
                try {
                    // 创建一个新的 canvas 元素
                    const saveCanvas = document.createElement('canvas')
                    saveCanvas.width = stampWidth
                    saveCanvas.height = stampHeight
                    const saveCtx = saveCanvas.getContext('2d')
                    if (!saveCtx) {
                        reject(new Error('无法创建 canvas context'))
                        return
                    }

                    // 清除画布，使背景透明
                    saveCtx.clearRect(0, 0, stampWidth, stampHeight)

                    // 将原始 canvas 中的印章部分绘制到新的 canvas 上
                    saveCtx.drawImage(
                        this.canvas,
                        RULER_WIDTH*this.mmToPixel + this.stampOffsetX * this.mmToPixel,
                        RULER_HEIGHT*this.mmToPixel + this.stampOffsetY * this.mmToPixel,
                        stampWidth,
                        stampHeight,
                        imagePadding * this.mmToPixel,
                        imagePadding * this.mmToPixel,
                        stampWidth,
                        stampHeight
                    )

                    // 如果启用了做旧效果，在新的 canvas 上应用做旧效果
                    if (this.drawStampConfigs.agingEffect.applyAging) {
                        this.addAgingEffect(saveCtx, stampWidth, stampHeight, false)
                    }

                    // 如果需要自定义导出尺寸，创建缩放后的画布
                    let outputCanvas = saveCanvas
                    const exportWidth = targetWidth && targetWidth > 0 ? targetWidth : stampWidth
                    const exportHeight = targetHeight && targetHeight > 0 ? targetHeight : stampHeight
                    if (exportWidth !== stampWidth || exportHeight !== stampHeight) {
                        const scaledCanvas = document.createElement('canvas')
                        scaledCanvas.width = exportWidth
                        scaledCanvas.height = exportHeight
                        const scaledCtx = scaledCanvas.getContext('2d')
                        if (scaledCtx) {
                            scaledCtx.drawImage(saveCanvas, 0, 0, exportWidth, exportHeight)
                            outputCanvas = scaledCanvas
                        }
                    }

                    let dataURL: string

                    if (format === 'jpeg') {
                        // JPEG 格式，需要白色背景
                        const tempCanvas = document.createElement('canvas')
                        tempCanvas.width = outputCanvas.width
                        tempCanvas.height = outputCanvas.height
                        const tempCtx = tempCanvas.getContext('2d')
                        if (tempCtx) {
                            tempCtx.fillStyle = '#FFFFFF'
                            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
                            tempCtx.drawImage(outputCanvas, 0, 0, tempCanvas.width, tempCanvas.height)
                            dataURL = tempCanvas.toDataURL('image/jpeg', quality)
                        } else {
                            dataURL = outputCanvas.toDataURL('image/jpeg', quality)
                        }
                    } else {
                        // PNG 格式（默认）
                        dataURL = outputCanvas.toDataURL('image/png')
                    }

                    // 恢复标尺设置
                    this.drawStampConfigs.ruler.showCrossLine = originalShowCrossLine
                    this.drawStampConfigs.ruler.showRuler = originalShowRuler
                    this.drawStampConfigs.ruler.showDashLine = originalShowDashLine
                    this.drawStampConfigs.ruler.showSideRuler = originalShowSideRuler
                    this.drawStampConfigs.ruler.showFullRuler = originalShowFullRuler
                    this.drawStampConfigs.ruler.showCurrentPositionText = originalShowCurrentPositionText
                    this.refreshStamp()

                    resolve(dataURL)
                } catch (error) {
                    // 恢复标尺设置
                    this.drawStampConfigs.ruler.showCrossLine = originalShowCrossLine
                    this.drawStampConfigs.ruler.showRuler = originalShowRuler
                    this.drawStampConfigs.ruler.showDashLine = originalShowDashLine
                    this.drawStampConfigs.ruler.showSideRuler = originalShowSideRuler
                    this.drawStampConfigs.ruler.showFullRuler = originalShowFullRuler
                    this.drawStampConfigs.ruler.showCurrentPositionText = originalShowCurrentPositionText
                    this.refreshStamp()

                    reject(error)
                }
            }, 50)
        })
    }

    /**
     * 刷新印章绘制
     * @param refreshSecurityPattern 是否刷新防伪纹路
     * @param refreshOld 是否刷新做旧效果
     * @param refreshRoughEdge 是否刷新毛边效果
     */
    refreshStamp(refreshSecurityPattern: boolean = false, refreshOld: boolean = false, refreshRoughEdge: boolean = false) {
        // 清除整个画布
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 保存当前状态
        this.canvasCtx.save();

        // 应用缩放和平移
        this.canvasCtx.translate(this.offsetX, this.offsetY);
        this.canvasCtx.scale(this.scale, this.scale);


        // 设置起始点为距离左边和上边 5mm 的位置
        const startX = (this.drawStampConfigs.width / 2) * 10 + RULER_WIDTH * this.mmToPixel;
        const startY = (this.drawStampConfigs.height / 2) * 10 + RULER_HEIGHT * this.mmToPixel;
        const x = startX / this.scale;
        const y = startY / this.scale;

        const mmToPixel = this.mmToPixel;
        const borderLineWidth = this.drawStampConfigs.outBorder.drawInnerCircle
            ? this.drawStampConfigs.outBorder.innerCircleLineWidth
            : 0;
        const drawRadiusX = (this.drawStampConfigs.width - borderLineWidth) / 2;
        const drawRadiusY = (this.drawStampConfigs.height - borderLineWidth) / 2;
        // 优先使用配置中的 offsetX/offsetY，其次使用内部拖动偏移量
        const effectiveOffsetX = (this.drawStampConfigs.offsetX ?? this.stampOffsetX) * this.mmToPixel;
        const effectiveOffsetY = (this.drawStampConfigs.offsetY ?? this.stampOffsetY) * this.mmToPixel;
        const centerX = x + effectiveOffsetX;
        const centerY = y + effectiveOffsetY;

        this.drawStamp(
            this.canvasCtx,
            centerX,
            centerY,
            drawRadiusX * mmToPixel,
            drawRadiusY * mmToPixel,
            this.drawStampConfigs.primaryColor,
            refreshSecurityPattern,
            refreshOld,
            refreshRoughEdge
        )
        // 恢复状态
        this.canvasCtx.restore();
        // 绘制标尺（如果需要）
        if (this.drawStampConfigs.ruler.showRuler) {
            if(this.drawStampConfigs.ruler.showSideRuler){
                this.drawRulerUtils.drawRuler(this.canvasCtx, this.drawStampConfigs.ruler, this.scale, this.canvas.width, RULER_HEIGHT * this.mmToPixel, true);
                this.drawRulerUtils.drawRuler(this.canvasCtx, this.drawStampConfigs.ruler, this.scale, this.canvas.height, RULER_HEIGHT * this.mmToPixel, false);
            }
            if(this.drawStampConfigs.ruler.showDashLine) {
                this.drawRulerUtils.showCrossDashLine(this.canvasCtx, this.drawStampConfigs.ruler, this.scale, RULER_HEIGHT, RULER_HEIGHT, this.canvas.width, this.canvas.height);
            }
        }
    }

    /**
     * 重置缩放比例为100%
     */
    resetZoom() {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.refreshStamp();
    }

    /**
     * 绘制印章
     * @param x 圆心x坐标
     * @param y 圆心y坐标
     * @param radiusX 半径x
     * @param radiusY 半径y
     * @param borderWidth 边框宽度
     * @param borderColor 边框颜色
     * @param refreshSecurityPattern 是否刷新防伪纹路
     * @param refreshOld 是否刷新做旧效果
     * @param refreshRoughEdge 是否刷新毛边效果
     */
    drawStamp(
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        borderColor: string,
        refreshSecurityPattern: boolean = false,
        refreshOld: boolean = false,
        refreshRoughEdge: boolean = false
    ) {
        // 清除整个画布
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // 在离屏 canvas 上绘制
        const offscreenCanvas = this.offscreenCanvas
        offscreenCanvas.width = this.canvas.width
        offscreenCanvas.height = this.canvas.height
        const offscreenCtx = offscreenCanvas.getContext('2d')
        if (!offscreenCtx) return
        // 创建一个临时的 canvas 用于存储原始图片
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.canvas.width
        tempCanvas.height = this.canvas.height
        const tempCtx = tempCanvas.getContext('2d')
        if (!tempCtx) return
        // 检查是否有矩形印章
        const hasRectangleStamp =
            this.drawStampConfigs.companyList.some(company => company.shape === 'rectangle') ||
            this.drawStampConfigs.company?.shape === 'rectangle'
        const hasRhombusStamp =
            this.drawStampConfigs.companyList.some(company => company.shape === 'rhombus') ||
            this.drawStampConfigs.company?.shape === 'rhombus'
        const hasOrganicStamp =
            this.drawStampConfigs.companyList.some(company => company.shape === 'organic') ||
            this.drawStampConfigs.company?.shape === 'organic'
        const hasTriangleStamp =
            this.drawStampConfigs.companyList.some(company => company.shape === 'triangle') ||
            this.drawStampConfigs.company?.shape === 'triangle'
        const stampShape = hasOrganicStamp ? 'organic' : hasTriangleStamp ? 'triangle' : hasRhombusStamp ? 'rhombus' : hasRectangleStamp ? 'rectangle' : 'ellipse'
        const isEllipseShape = stampShape === 'ellipse'
        
        // 矩形印章的尺寸（使用 width 和 height）
        const rectWidth = this.drawStampConfigs.width * this.mmToPixel
        const rectHeight = this.drawStampConfigs.height * this.mmToPixel

        const outBorderStyle = this.drawStampConfigs.outBorder.lineStyle || 'solid'
        const outBorderDash = (this.drawStampConfigs.outBorder.dashLength ?? 2) * this.mmToPixel
        const outBorderGap = (this.drawStampConfigs.outBorder.gapLength ?? 1) * this.mmToPixel

        if (this.drawStampConfigs.outBorder.drawInnerCircle) {
            // 在离屏 canvas 上绘制印章基本形状
            if (stampShape === 'rectangle') {
                // 绘制矩形边框（如果 outBorder 启用了背景填充且有 color 属性，则填充背景）
                const fillBackground = this.drawStampConfigs.outBorder.fillBackground || false
                const fillColor = fillBackground ? (this.drawStampConfigs.outBorder.color || undefined) : undefined
                drawRectangleBorder(
                    offscreenCtx,
                    centerX,
                    centerY,
                    rectWidth,
                    rectHeight,
                    this.drawStampConfigs.outBorder.innerCircleLineWidth * this.mmToPixel,
                    borderColor,
                    outBorderStyle,
                    outBorderDash,
                    outBorderGap,
                    fillColor
                )
            } else if (stampShape === 'rhombus') {
                // 绘制菱形边框（如果 outBorder 启用了背景填充且有 color 属性，则填充背景）
                const fillBackground = this.drawStampConfigs.outBorder.fillBackground || false
                const fillColor = fillBackground ? (this.drawStampConfigs.outBorder.color || undefined) : undefined
                drawRhombusBorder(
                    offscreenCtx,
                    centerX,
                    centerY,
                    rectWidth,
                    rectHeight,
                    this.drawStampConfigs.outBorder.innerCircleLineWidth * this.mmToPixel,
                    borderColor,
                    outBorderStyle,
                    outBorderDash,
                    outBorderGap,
                    fillColor
                )
            } else if (stampShape === 'organic') {
                // 绘制不规则/有机形状边框（如果 outBorder 启用了背景填充且有 color 属性，则填充背景）
                const fillBackground = this.drawStampConfigs.outBorder.fillBackground || false
                const fillColor = fillBackground ? (this.drawStampConfigs.outBorder.color || undefined) : undefined
                const styleId = this.drawStampConfigs.outBorder.organicStyleId ?? 0
                const irregularityLevels = [0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2, 0.22, 0.24]
                const irregularity = irregularityLevels[styleId % irregularityLevels.length]
                drawOrganicBorder(
                    offscreenCtx,
                    centerX,
                    centerY,
                    rectWidth,
                    rectHeight,
                    this.drawStampConfigs.outBorder.innerCircleLineWidth * this.mmToPixel,
                    borderColor,
                    outBorderStyle,
                    outBorderDash,
                    outBorderGap,
                    fillColor,
                    irregularity
                )
            } else if (stampShape === 'triangle') {
                // 绘制三角形边框（如果 outBorder 启用了背景填充且有 color 属性，则填充背景）
                const fillBackground = this.drawStampConfigs.outBorder.fillBackground || false
                const fillColor = fillBackground ? (this.drawStampConfigs.outBorder.color || undefined) : undefined
                drawTriangleBorder(
                    offscreenCtx,
                    centerX,
                    centerY,
                    rectWidth,
                    rectHeight,
                    this.drawStampConfigs.outBorder.innerCircleLineWidth * this.mmToPixel,
                    borderColor,
                    outBorderStyle,
                    outBorderDash,
                    outBorderGap,
                    fillColor
                )
            } else {
                // 绘制椭圆边框（如果 outBorder 启用了背景填充且有 color 属性，则填充背景）
                const fillBackground = this.drawStampConfigs.outBorder.fillBackground || false
                const fillColor = fillBackground ? (this.drawStampConfigs.outBorder.color || undefined) : undefined
                drawBasicBorder(
                    offscreenCtx,
                    centerX,
                    centerY,
                    radiusX,
                    radiusY,
                    this.drawStampConfigs.outBorder.innerCircleLineWidth * this.mmToPixel,
                    borderColor,
                    outBorderStyle,
                    outBorderDash,
                    outBorderGap,
                    fillColor
                );
            }
        }
        
        // 创建裁剪区域，确保所有内容（文字、图片、五角星等）都被限制在印章形状内
        offscreenCtx.save()
        offscreenCtx.beginPath()
        if (stampShape === 'rectangle') {
            // 矩形裁剪区域
            offscreenCtx.rect(
                centerX - rectWidth / 2,
                centerY - rectHeight / 2,
                rectWidth,
                rectHeight
            )
        } else if (stampShape === 'rhombus') {
            offscreenCtx.moveTo(centerX, centerY - rectHeight / 2)
            offscreenCtx.lineTo(centerX + rectWidth / 2, centerY)
            offscreenCtx.lineTo(centerX, centerY + rectHeight / 2)
            offscreenCtx.lineTo(centerX - rectWidth / 2, centerY)
            offscreenCtx.closePath()
        } else if (stampShape === 'organic') {
            // 不规则形状裁剪区域（使用与绘制相同的算法）
            const halfWidth = rectWidth / 2
            const halfHeight = rectHeight / 2
            const points = 64
            const irregularity = 0.15
            
            const noise = (angle: number) => {
                return (
                    Math.sin(angle * 2) * 0.3 +
                    Math.sin(angle * 3) * 0.2 +
                    Math.sin(angle * 5) * 0.15 +
                    Math.sin(angle * 7) * 0.1 +
                    Math.sin(angle * 11) * 0.05
                ) * irregularity
            }
            
            const pathPoints: { x: number; y: number }[] = []
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2
                const noiseValue = noise(angle * 2)
                const radiusX = halfWidth * (1 + noiseValue)
                const radiusY = halfHeight * (1 + noiseValue * 0.8)
                const x = centerX + Math.cos(angle) * radiusX
                const y = centerY + Math.sin(angle) * radiusY
                pathPoints.push({ x, y })
            }
            
            if (pathPoints.length > 0) {
                offscreenCtx.moveTo(pathPoints[0].x, pathPoints[0].y)
                for (let i = 0; i < pathPoints.length; i++) {
                    const current = pathPoints[i]
                    const next = pathPoints[(i + 1) % pathPoints.length]
                    const cpX = (current.x + next.x) / 2
                    const cpY = (current.y + next.y) / 2
                    offscreenCtx.quadraticCurveTo(current.x, current.y, cpX, cpY)
                }
                offscreenCtx.closePath()
            }
        } else if (stampShape === 'triangle') {
            // 三角形裁剪区域
            const halfWidth = rectWidth / 2
            const halfHeight = rectHeight / 2
            offscreenCtx.moveTo(centerX, centerY - halfHeight)
            offscreenCtx.lineTo(centerX + halfWidth, centerY + halfHeight)
            offscreenCtx.lineTo(centerX - halfWidth, centerY + halfHeight)
            offscreenCtx.closePath()
        } else {
            // 椭圆裁剪区域
            offscreenCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
        }
        offscreenCtx.clip()
        // 绘制内圈列表
        if (this.drawStampConfigs.innerCircleList.length > 0) {
            this.drawCircleUtils.drawCircleList(offscreenCtx, this.drawStampConfigs.innerCircleList, centerX, centerY, borderColor)
        }
        // 如果没有图片，绘制五角星或SVG
        if (this.drawStampConfigs.drawStar.drawStar) {
            this.drawSvgUtils.drawStarShape(offscreenCtx, this.drawStampConfigs.drawStar, centerX, centerY, this.drawStampConfigs.primaryColor)
        }
        if (this.drawStampConfigs.svgList && this.drawStampConfigs.svgList.length > 0) {
            this.drawSvgList(offscreenCtx, this.drawStampConfigs.svgList, centerX, centerY)
        }
        // 绘制图片列表
        if (this.drawStampConfigs.imageList && this.drawStampConfigs.imageList.length > 0) {
            this.drawImageList(offscreenCtx, this.drawStampConfigs.imageList, centerX, centerY)
        }
        // 绘制公司文字内容（支持椭圆和矩形）
        // 对于矩形印章，传递宽度和高度；对于椭圆印章，传递半径
        if (stampShape === 'rectangle' || stampShape === 'rhombus' || stampShape === 'triangle') {
            this.drawCompanyUtils.drawCompanyList(
                offscreenCtx,
                this.drawStampConfigs.companyList,
                centerX,
                centerY,
                this.drawStampConfigs.width,
                this.drawStampConfigs.height,
                this.drawStampConfigs.primaryColor
            )
        } else {
            this.drawCompanyUtils.drawCompanyList(
                offscreenCtx,
                this.drawStampConfigs.companyList,
                centerX,
                centerY,
                radiusX,
                radiusY,
                this.drawStampConfigs.primaryColor
            )
        }
        this.drawStampTypeUtils.drawStampTypeList(offscreenCtx, this.drawStampConfigs.stampTypeList, centerX, centerY, radiusX, this.drawStampConfigs.primaryColor)
        // 绘制编码文字内容，边框的圆形文字（支持多条编码）
        const stampCodes: ICode[] = (this.drawStampConfigs.stampCodeList && this.drawStampConfigs.stampCodeList.length > 0)
            ? this.drawStampConfigs.stampCodeList
            : this.drawStampConfigs.stampCode
                ? [this.drawStampConfigs.stampCode]
                : []

        for (const code of stampCodes) {
            const codeColor = code.color || this.drawStampConfigs.primaryColor
            this.drawCodeUtils.drawCode(offscreenCtx, code, centerX, centerY, radiusX, radiusY, codeColor)
        }
        // 绘制税号文字内容，边框的圆形文字
        this.drawTaxNumberUtils.drawTaxNumber(offscreenCtx, this.drawStampConfigs.taxNumber, centerX, centerY, this.drawStampConfigs.primaryColor)
    // 绘制自定义线条
    if (this.drawStampConfigs.lineList && this.drawStampConfigs.lineList.length > 0) {
        this.drawLines(offscreenCtx, this.drawStampConfigs.lineList, centerX, centerY)
    }
        offscreenCtx.restore()
        // 将离屏 canvas 的内容绘制到主 canvas
        ctx.save()
        // 添加毛边效果

        if (isEllipseShape && this.drawStampConfigs.roughEdge.drawRoughEdge) {
            this.addRoughEdge(
                offscreenCtx,
                centerX,
                centerY,
                radiusX,
                radiusY,
                this.drawStampConfigs.outBorder.innerCircleLineWidth * this.mmToPixel,
                refreshRoughEdge
            );
        }
        if (isEllipseShape && this.drawStampConfigs.securityPattern.openSecurityPattern) {
            this.drawSecurityPatternUtils.drawSecurityPattern(
                offscreenCtx,
                this.drawStampConfigs.securityPattern,
                centerX,
                centerY,
                radiusX,
                radiusY,
                refreshSecurityPattern
            );
        }

        // 设置合成模式，确保印章内容只在椭圆区域内显示
        ctx.globalCompositeOperation = 'source-over'
        ctx.drawImage(offscreenCanvas, 0, 0)
        ctx.restore()
        // 添加做旧效果
        if (isEllipseShape && this.drawStampConfigs.agingEffect.applyAging) {
            this.addAgingEffect(ctx, this.canvas.width, this.canvas.height, refreshOld)
        }
    }

    // 设置是否可拖动
    public setDraggable(draggable: boolean): void {
        this.isDraggable = draggable;
    }
}
