// 标尺宽度
import {
  ICode,
  IDrawImage,
  IDrawStampConfig,
  IDrawStar,
  IStampType,
  ITaxNumber
} from "./DrawStampTypes.ts";
import { drawBasicBorder } from "./utils/DrawBorderUtils.ts";
import { DrawCircleUtils } from "./utils/DrawCircleUtils.ts";
import { DrawCompanyUtils } from "./utils/DrawCompanyUtils.ts";
import { DrawRulerUtils } from "./utils/DrawRulerUtils.ts";
import { DrawSecurityPatternUtils } from "./utils/DrawSecurityPatternUtils.ts";
import { DrawSvgUtils } from "./utils/DrawSvgUtils.ts";
import { InitDrawStampConfigsUtils } from "./utils/InitDrawStampConfigsUtils.ts";
import { DrawImageCanvas } from "./utils/DrawImageCanvas.ts";
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
    private canvas: HTMLCanvasElement
    // 印章偏移量
    private stampOffsetX: number = 0
    private stampOffsetY: number = 0
    // 总的印章绘制参数
    private drawStampConfigs: IDrawStampConfig
    // 添加图片缓存
    private imageCache: Map<string, ImageBitmap> = new Map();
    // 绘制内径圆的工具类
    private drawCircleUtils: DrawCircleUtils
    // 绘制svg的工具类
    private drawSvgUtils: DrawSvgUtils
    // 绘制公司的工具类
    private drawCompanyUtils: DrawCompanyUtils
    // 绘制标尺的工具类
    private drawRulerUtils: DrawRulerUtils
    // 绘制防伪纹路的工具类
    private drawSecurityPatternUtils: DrawSecurityPatternUtils
    // 初始化绘制印章配置的工具类
    private initDrawStampConfigsUtils: InitDrawStampConfigsUtils
    private imageCanvas: DrawImageCanvas;

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
        this.initDrawUtils()
        this.drawSvgUtils = new DrawSvgUtils(mmToPixel);
        this.imageCanvas = new DrawImageCanvas(canvas.width, canvas.height);
    }

    // 初始化绘制圆的工具类
    private initDrawUtils() {
        this.drawCircleUtils = new DrawCircleUtils(this.mmToPixel)
        this.drawSvgUtils = new DrawSvgUtils(this.mmToPixel)
        this.drawCompanyUtils = new DrawCompanyUtils(this.mmToPixel)
        this.drawRulerUtils = new DrawRulerUtils(this.mmToPixel, RULER_WIDTH * this.mmToPixel)
        this.drawSecurityPatternUtils = new DrawSecurityPatternUtils(this.mmToPixel)
    }


    private isDragging = false
    private dragStartX = 0
    private dragStartY = 0

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
        this.drawStampConfigs = drawConfigs
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
                this.onMouseMove(event)
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
        this.dragStartX = event.clientX - this.stampOffsetX * this.mmToPixel
        this.dragStartY = event.clientY - this.stampOffsetY * this.mmToPixel
    }

    private onMouseMove = (event: MouseEvent) => {
        if (this.drawStampConfigs.openManualAging) {
            return
        }
        
        if (this.isDragging) {
            const newOffsetX = (event.clientX - this.dragStartX) / this.mmToPixel
            const newOffsetY = (event.clientY - this.dragStartY) / this.mmToPixel
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

    private async drawSvgImage(ctx: CanvasRenderingContext2D, image: IDrawStar, centerX: number, centerY: number) {
        try {
            // 计算绘制尺寸
            const width = 200;
            const height = 200;
            
            // 使用图像 canvas 绘制
            const imageCanvas = await this.imageCanvas.drawImage(
                image.svgPath,
                centerX - width/2,
                centerY - height/2,
                width,
                height
            );

            // 将图像 canvas 的内容绘制到主 canvas
            ctx.drawImage(imageCanvas, 0, 0);

        } catch (error) {
            console.error("Error drawing SVG:", error);
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
        const x = centerX - width / 2 + imageConfig.positionX * this.mmToPixel;
        const y = centerY - height / 2 + imageConfig.positionY * this.mmToPixel;
        
        ctx.save();
        ctx.drawImage(img, x, y, width, height);
        ctx.restore();
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
     * 绘制椭圆
     * @param x 圆心x坐标
     * @param y 圆心y坐标
     * @param radiusX 半径x
     * @param radiusY 半径y
     * @param borderWidth 边框宽度
     * @param borderColor 边框颜色
     */
    private drawEllipse(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        radiusX: number,
        radiusY: number,
        borderWidth: number,
        borderColor: string
    ) {
        ctx.beginPath()
        ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth
        ctx.stroke()
    }

    /**
     * 绘制印章编码
     * @param centerX 圆心x坐标
     * @param centerY 圆心y坐标
     * @param radiusX 椭圆长轴半径
     * @param radiusY 椭圆短轴半径
     * @param text 编码文本
     * @param fontSize 字大小
     */
    private drawCode(
        ctx: CanvasRenderingContext2D,
        code: ICode,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number
    ) {
        const fontSize = code.fontHeight * this.mmToPixel
        const text = code.code
        const fontWeight = code.fontWeight || 'normal'; // 新增字体粗细参数

        ctx.save()
        ctx.font = `${fontWeight} ${fontSize}px ${code.fontFamily}`;
        ctx.fillStyle = this.drawStampConfigs.primaryColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const characters = text.split('')
        const characterCount = characters.length
        // 处理单个字符的情况
        if (characterCount === 1) {
            // 单个字符直接绘制在底部中心位置
            const x = centerX
            const y = centerY + radiusY - fontSize - code.borderOffset * this.mmToPixel

            ctx.save()
            ctx.translate(x, y)
            ctx.scale(code.compression, 1)
            ctx.fillText(text, 0, 0)
            ctx.restore()
        } else {
            // 多个字符时的弧形排列
            const totalAngle = Math.PI * ((1 + characterCount) / code.textDistributionFactor)
            const startAngle = Math.PI / 2 + totalAngle / 2
            const anglePerChar = totalAngle / (characterCount - 1)

            characters.forEach((char, index) => {
                const angle = startAngle - anglePerChar * index
                const x = centerX + Math.cos(angle) * (radiusX - fontSize / 2 - code.borderOffset * this.mmToPixel)
                const y = centerY + Math.sin(angle) * (radiusY - fontSize / 2 - code.borderOffset * this.mmToPixel)

                ctx.save()
                ctx.translate(x, y)
                ctx.rotate(angle - Math.PI / 2)
                ctx.scale(code.compression, 1)
                ctx.fillText(char, 0, 0)
                ctx.restore()
            })
        }

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

        // 如果需要刷新或者参数数组为空,则重新生成参数
        if (forceRefresh || this.drawStampConfigs.roughEdge.roughEdgeParams.length === 0) {
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
        console.log("addAgingEffect", "width", width, "height", height, "forceRefresh", this.drawStampConfigs.agingEffect.applyAging)
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
    saveStampAsPNG() {
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

            // 将的 canvas 转为 PNG 数据 URL
            const dataURL = saveCanvas.toDataURL('image/png')

            // 创建一个临时的 <a> 元素来触发下载
            const link = document.createElement('a')
            link.href = dataURL
            link.download = 'mystamp.png'
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
        const drawRadiusX = (this.drawStampConfigs.width - this.drawStampConfigs.outBorder.innerCircleLineWidth) / 2;
        const drawRadiusY = (this.drawStampConfigs.height - this.drawStampConfigs.outBorder.innerCircleLineWidth) / 2;
        const offsetX = this.stampOffsetX * this.mmToPixel;
        const offsetY = this.stampOffsetY * this.mmToPixel;
        const centerX = x + offsetX;
        const centerY = y + offsetY;

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
        if(this.drawStampConfigs.outBorder.drawInnerCircle) {
            // 在离屏 canvas 上绘制印章基本形状
            drawBasicBorder(offscreenCtx, centerX, centerY, radiusX, radiusY, this.drawStampConfigs.outBorder.innerCircleLineWidth * this.mmToPixel, borderColor);
        }
        // 创建裁剪区域，确保所有内容（文字、图片、五角星等）都被限制在印章的椭圆形状内
        offscreenCtx.save()
        offscreenCtx.beginPath()
        offscreenCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
        offscreenCtx.clip()
        // 绘制内圈列表
        if (this.drawStampConfigs.innerCircleList.length > 0) {
            this.drawCircleUtils.drawCircleList(offscreenCtx, this.drawStampConfigs.innerCircleList, centerX, centerY, borderColor)
        }
        // 如果没有图片，绘制五角星或SVG
        if (this.drawStampConfigs.drawStar.drawStar) {
            this.drawSvgUtils.drawStarShape(offscreenCtx, this.drawStampConfigs.drawStar, centerX, centerY, this.drawStampConfigs.primaryColor)
        }
        // 绘制图片列表
        if (this.drawStampConfigs.imageList && this.drawStampConfigs.imageList.length > 0) {
            this.drawImageList(offscreenCtx, this.drawStampConfigs.imageList, centerX, centerY)
        }
        // 绘制公司文字内容，边框的圆形文字
        this.drawCompanyUtils.drawCompanyList(offscreenCtx, this.drawStampConfigs.companyList, centerX, centerY, radiusX, radiusY, this.drawStampConfigs.primaryColor)
        // 绘制印章类型文字内容，边框的矩形文字
        this.drawStampTypeList(offscreenCtx, this.drawStampConfigs.stampTypeList, centerX, centerY, radiusX)
        // 绘制编码文字内容，边框的圆形文字
        this.drawCode(offscreenCtx, this.drawStampConfigs.stampCode, centerX, centerY, radiusX, radiusY)
        // 绘制税号文字内容，边框的圆形文字
        this.drawTaxNumber(offscreenCtx, this.drawStampConfigs.taxNumber, centerX, centerY)
        offscreenCtx.restore()
        // 将离屏 canvas 的内容绘制到主 canvas
        ctx.save()
        // 添加毛边效果
        if (this.drawStampConfigs.roughEdge.drawRoughEdge) {
            this.addRoughEdge(offscreenCtx, centerX, centerY, radiusX, radiusY, this.drawStampConfigs.outBorder.innerCircleLineWidth * this.mmToPixel, refreshRoughEdge)
        }
        if(this.drawStampConfigs.securityPattern.openSecurityPattern) {
            // 绘制防伪纹路
            this.drawSecurityPatternUtils.drawSecurityPattern(offscreenCtx, this.drawStampConfigs.securityPattern, centerX, centerY, radiusX, radiusY, refreshSecurityPattern)
        }

        // 设置合成模式，确保印章内容只在椭圆区域内显示
        ctx.globalCompositeOperation = 'source-over'
        ctx.drawImage(offscreenCanvas, 0, 0)
        ctx.restore()
        // 添加做旧效果
        if (this.drawStampConfigs.agingEffect.applyAging) {
            this.addAgingEffect(ctx, this.canvas.width, this.canvas.height, refreshOld)
        }
    }
}
