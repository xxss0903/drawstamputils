// 防伪纹路
export type ISecurityPattern = {
  openSecurityPattern: boolean // 是否启用防伪纹路
  securityPatternWidth: number // 防伪纹路宽度
  securityPatternLength: number // 防伪纹路长度
  securityPatternCount: number // 防伪纹路数量
  securityPatternAngleRange: number // 防伪纹路角度范围
}

// 绘制印章的公司
export type ICompany = {
  companyName: string // 公司名称
  compression: number // 公司名称压缩比例
  borderOffset: number // 边框偏移量
  textDistributionFactor: number // 文字分布因子
  fontFamily: string // 字体
  fontHeight: number // 字体高度
}

// 印章编码
export type ICode = {
  code: string // 编码
  compression: number // 编码压缩比例
  fontHeight: number // 编码字体大小
  fontFamily: string // 编码字体
  borderOffset: number // 编码边框偏移量
  fontWidth: number // 编码字体宽度
  textDistributionFactor: number // 文字分布因子
}

export type ITaxNumber = {
  code: string // 税号
  compression: number // 税号压缩比例
  fontHeight: number // 税号字体大小
  fontFamily: string // 编码字体
  fontWidth: number // 编码字体宽度
  letterSpacing: number // 编码字符间距
  positionY: number // 编码文字位置
  totalWidth: number // 编码文字总宽度
}

// 做旧效果参数
export type IAgingEffectParams = {
  x: number
  y: number
  noiseSize: number
  noise: number
  strongNoiseSize: number
  strongNoise: number
  fade: number
  seed: number
}

// 做旧效果
export type IAgingEffect = {
  applyAging: boolean
  agingIntensity: number
}

// 绘制五角星
export type IDrawStar = {
  svgPath: string
  drawStar: boolean
  starDiameter: number
  starPositionY: number
  scaleToSmallStar: boolean
}

// 印章类型
export type IStampType = {
  stampType: string
  fontHeight: number
  compression: number
  letterSpacing: number
  positionY: number
  fontWidth: number
}

// 内圈圆
export type IInnerCircle = {
  drawInnerCircle: boolean // 是否绘制内圈圆
  innerCircleLineWidth: number // 内圈圆线宽
  innerCircleLineRadiusX: number // x轴半径
  innerCircleLineRadiusY: number // y轴半径
}

// 是否绘制标尺
export type IShowRuler = {
  showRuler: boolean
  showFullRuler: boolean
}

// 绘制印章的参数
export type IDrawStampConfig = {
  agingEffect: IAgingEffect
  ruler: IShowRuler
  drawStar: IDrawStar
  securityPattern: ISecurityPattern
  company: ICompany
  stampCode: ICode
  taxNumber: ITaxNumber
  stampType: IStampType
  width: number
  height: number
  borderWidth: number
  primaryColor: string
  refreshSecurityPattern: boolean
  refreshOld: boolean
  shouldDrawRuler: boolean
  innerCircle: IInnerCircle
  outThinCircle: IInnerCircle
}

// 标尺宽度
const RULER_WIDTH = 80
// 标尺高度
const RULER_HEIGHT = 80

/**
 * 绘制印章工具类
 */
export class DrawStampUtils {
  // 主色
  private primaryColor: string = '#ff0000'
  // 毫米到像素的
  private mmToPixel: number
  // 主canvas的context
  private canvasCtx: CanvasRenderingContext2D
  // 离屏的canvas
  private offscreenCanvas: HTMLCanvasElement
  // 主canvas
  private canvas: HTMLCanvasElement
  private stampOffsetX: number = 0
  private stampOffsetY: number = 0
  private agingIntensity: number = 50
  private ruler: IShowRuler = {
    showRuler: true,
    showFullRuler: true
  }
  private drawStar: IDrawStar = {
    svgPath: 'M 0 -1 L 0.588 0.809 L -0.951 -0.309 L 0.951 -0.309 L -0.588 0.809 Z',
    drawStar: false,
    starDiameter: 14,
    starPositionY: 0,
    scaleToSmallStar: false
  }
  // 防伪纹路
  private securityPattern: ISecurityPattern = {
    openSecurityPattern: true,
    securityPatternWidth: 0.15,
    securityPatternLength: 3,
    securityPatternCount: 5,
    securityPatternAngleRange: 40
  }
  private company: ICompany = {
    companyName: '印章绘制有限责任公司',
    compression: 1,
    borderOffset: 1,
    textDistributionFactor: 20,
    fontFamily: 'SimSun',
    fontHeight: 4.2
  }
  private taxNumber: ITaxNumber = {
    code: '000000000000000000',
    compression: 0.7,
    fontHeight: 3.7,
    fontFamily: 'Arial',
    fontWidth: 1.3,
    letterSpacing: 8,
    positionY: 0,
    totalWidth: 26
  }
  private stampCode: ICode = {
    code: '1234567890',
    compression: 1,
    fontHeight: 1.2,
    fontFamily: 'Arial',
    borderOffset: 1,
    fontWidth: 1.2,
    textDistributionFactor: 50
  }
  private stampType: IStampType = {
    stampType: '发票专用章',
    fontHeight: 4.6,
    fontWidth: 3,
    compression: 0.75,
    letterSpacing: 0,
    positionY: -3
  }
  // 做旧效果
  private agingEffect: IAgingEffect = {
    applyAging: false,
    agingIntensity: 50
  }

  // 内圈圆
  private innerCircle: IInnerCircle = {
    drawInnerCircle: true,
    innerCircleLineWidth: 0.5,
    innerCircleLineRadiusX: 16,
    innerCircleLineRadiusY: 12
  }
  // 比外圈细的稍微内圈
  private outThinCircle: IInnerCircle = {
    drawInnerCircle: true,
    innerCircleLineWidth: 0.2,
    innerCircleLineRadiusX: 36,
    innerCircleLineRadiusY: 27
  }
  // 总的印章绘制参数
  private drawStampConfigs: IDrawStampConfig = {
    ruler: this.ruler,
    drawStar: this.drawStar,
    securityPattern: this.securityPattern,
    company: this.company,
    stampCode: this.stampCode,
    width: 40,
    height: 30,
    stampType: this.stampType,
    primaryColor: this.primaryColor,
    borderWidth: 1,
    refreshSecurityPattern: false,
    refreshOld: false,
    taxNumber: this.taxNumber,
    agingEffect: this.agingEffect,
    shouldDrawRuler: true,
    innerCircle: this.innerCircle,
    outThinCircle: this.outThinCircle
  }

  private securityPatternParams: Array<{ angle: number; lineAngle: number }> = []

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
  }

  private isDragging = false
  private dragStartX = 0
  private dragStartY = 0

  // 获取绘制印章的配置
  getDrawConfigs() {
    return this.drawStampConfigs
  }

  // 设置绘制印章的配置，比如可以保存某些印章的配置，然后保存之后直接设置绘制，更加方便
  setDrawConfigs(drawConfigs: IDrawStampConfig) {
    this.drawStampConfigs = drawConfigs
  }

  private addCanvasListener() {
    this.canvas.addEventListener('mousemove', (event) => {
      this.onMouseMove(event)
    })
    this.canvas.addEventListener('mouseleave', (event) => {
      this.onMouseLeave(event)
    })
    this.canvas.addEventListener('mousedown', (event) => {
      this.onMouseDown(event)
    })
    this.canvas.addEventListener('mouseup', (event) => {
      this.onMouseUp()
    })
    this.canvas.addEventListener('click', (event) => {
      this.onCanvasClick(event)
    })
  }

  private onMouseUp = () => {
    this.isDragging = false
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
      const mmX = Math.round(((x - RULER_WIDTH) / this.mmToPixel) * 10) / 10
      const mmY = Math.round(((y - RULER_HEIGHT) / this.mmToPixel) * 10) / 10

      this.refreshStamp()
      this.highlightRulerPosition(this.canvasCtx, mmX, mmY)
      this.drawCrossLines(x, y)
    }
  }

  private highlightRulerPosition = (ctx: CanvasRenderingContext2D, mmX: number, mmY: number) => {
    const x = mmX * this.mmToPixel + RULER_WIDTH
    const y = mmY * this.mmToPixel + RULER_HEIGHT

    // 高亮水平标尺
    ctx.fillStyle = this.drawStampConfigs.primaryColor
    ctx.fillRect(RULER_WIDTH, y - 1, this.canvas.width - RULER_WIDTH, 2)

    // 高亮垂直标尺
    ctx.fillRect(x - 1, RULER_HEIGHT, 2, this.canvas.height - RULER_HEIGHT)

    // 显示坐标
    ctx.fillStyle = 'black'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(`${mmX.toFixed(1)}mm, ${mmY.toFixed(1)}mm`, RULER_WIDTH + 5, RULER_HEIGHT + 5)
  }

  private drawCrossLines = (x: number, y: number) => {
    const canvas = this.offscreenCanvas
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清除之前绘制的内容
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
    ctx.lineWidth = 1

    // 绘制水平线
    ctx.moveTo(RULER_WIDTH, y)
    ctx.lineTo(canvas.width, y)

    // 绘制垂直线
    ctx.moveTo(x, RULER_HEIGHT)
    ctx.lineTo(x, canvas.height)

    ctx.stroke()

    // 将离屏canvas的内容绘制到主canvas上
    const mainCanvas = this.canvas
    if (mainCanvas) {
      const mainCtx = mainCanvas.getContext('2d')
      if (mainCtx) {
        mainCtx.drawImage(canvas, 0, 0)
      }
    }
  }

  private setSecurityPattern(securityPattern: ISecurityPattern) {
    this.securityPattern = securityPattern
    // 刷新防伪纹路
    this.refreshSecurityPattern()
  }

  private refreshSecurityPattern() {
    this.securityPatternParams = []
  }

  /**
   * 解析SVG路径数据
   * @param svgPath SVG路径字符串
   * @returns 解析后的路径命令数组
   */
  private parseSVGPath(svgPath: string): Array<{ command: string; params: number[] }> {
    const commands: Array<{ command: string; params: number[] }> = [];
    const regex = /([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+)/g;
    let match;
    let currentCommand = '';
    let currentParams: number[] = [];
  
    while ((match = regex.exec(svgPath)) !== null) {
      if (match[1]) {
        // 如果匹配到命令
        if (currentCommand) {
          // 保存前一个命令
          commands.push({ command: currentCommand, params: currentParams });
          currentParams = [];
        }
        currentCommand = match[1];
      } else if (match[2]) {
        // 如果匹配到数字
        currentParams.push(parseFloat(match[2]));
      }
    }
  
    // 添加最后一个命令
    if (currentCommand) {
      commands.push({ command: currentCommand, params: currentParams });
    }
  
    return commands;
  }

  private scaleSVGPathTo10mm(svgPath: string): string {
    const pathData = this.parseSVGPath(svgPath);
    
    // 计算SVG的边界框
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let currentX = 0, currentY = 0;
  
    pathData.forEach(({ command, params }) => {
      switch (command) {
        case 'M':
        case 'L':
        case 'C':
        case 'S':
        case 'Q':
        case 'T':
          for (let i = 0; i < params.length; i += 2) {
            minX = Math.min(minX, params[i]);
            maxX = Math.max(maxX, params[i]);
            minY = Math.min(minY, params[i + 1]);
            maxY = Math.max(maxY, params[i + 1]);
          }
          break;
        case 'm':
        case 'l':
        case 'c':
        case 's':
        case 'q':
        case 't':
          for (let i = 0; i < params.length; i += 2) {
            currentX += params[i];
            currentY += params[i + 1];
            minX = Math.min(minX, currentX);
            maxX = Math.max(maxX, currentX);
            minY = Math.min(minY, currentY);
            maxY = Math.max(maxY, currentY);
          }
          break;
        case 'H':
          minX = Math.min(minX, params[0]);
          maxX = Math.max(maxX, params[0]);
          break;
        case 'h':
          currentX += params[0];
          minX = Math.min(minX, currentX);
          maxX = Math.max(maxX, currentX);
          break;
        case 'V':
          minY = Math.min(minY, params[0]);
          maxY = Math.max(maxY, params[0]);
          break;
        case 'v':
          currentY += params[0];
          minY = Math.min(minY, currentY);
          maxY = Math.max(maxY, currentY);
          break;
      }
    });
  
    // 计算原始SVG的宽度和高度
    const width = maxX - minX;
    const height = maxY - minY;
  
    // 计算缩放比例
    const scale = 5 / Math.max(width, height);
  
    // 缩放路径数据
    const scaledPathData = pathData.map(({ command, params }) => {
      const scaledParams = params.map(param => param * scale);
      return { command, params: scaledParams };
    });
  
    // 将缩放后的路径数据转换回字符串
    return this.convertPathDataToString(scaledPathData);
  }
  
  /**
   * 将解析后的路径数据转换为字符串
   * @param pathData 解析后的路径数据
   * @returns SVG路径字符串
   */
  private convertPathDataToString(pathData: Array<{ command: string; params: number[] }>): string {
    return pathData.map(({ command, params }) => {
      return command + params.map(p => p.toFixed(2)).join(' ');
    }).join(' ');
  }

  private drawSVGPath(
    ctx: CanvasRenderingContext2D,
    svgPath: string,
    x: number,
    y: number,
    scale: number = 1
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
  
    // 创建 Path2D 对象
    const path = new Path2D(svgPath);
  
    // 填充路径
    ctx.fillStyle = this.primaryColor;
    ctx.fill(path);
  
    // 如果需要描边，可以添加以下代码
    // ctx.strokeStyle = 'black';
    // ctx.lineWidth = 1;
    // ctx.stroke(path);
  
    ctx.restore();
  }

  /**
   * 根据解析的SVG路径数据绘制图形
   * @param ctx 画布上下文
   * @param path 解析后的SVG路径数据
   * @param x 绘制的x坐标
   * @param y 绘制的y坐标
   * @param scale 缩放比例
   */
  private drawSVGPath2(
    ctx: CanvasRenderingContext2D,
    path: Array<{ command: string; params: number[] }>,
    x: number,
    y: number,
    scale: number = 1
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
  
    let currentX = 0;
    let currentY = 0;
    let startX = 0;
    let startY = 0;
    let controlX = 0;
    let controlY = 0;
  
    path.forEach(({ command, params }) => {
      const paramCount = params.length;
      switch (command) {
        case 'M':
        case 'm':
          if (command === 'M') {
            currentX = params[0];
            currentY = params[1];
          } else {
            currentX += params[0];
            currentY += params[1];
          }
          ctx.moveTo(currentX, currentY);
          startX = currentX;
          startY = currentY;
          break;
        case 'L':
        case 'l':
          for (let i = 0; i < paramCount; i += 2) {
            if (command === 'L') {
              currentX = params[i];
              currentY = params[i + 1];
            } else {
              currentX += params[i];
              currentY += params[i + 1];
            }
            ctx.lineTo(currentX, currentY);
          }
          break;
        case 'H':
        case 'h':
          for (let i = 0; i < paramCount; i++) {
            if (command === 'H') {
              currentX = params[i];
            } else {
              currentX += params[i];
            }
            ctx.lineTo(currentX, currentY);
          }
          break;
        case 'V':
        case 'v':
          for (let i = 0; i < paramCount; i++) {
            if (command === 'V') {
              currentY = params[i];
            } else {
              currentY += params[i];
            }
            ctx.lineTo(currentX, currentY);
          }
          break;
        case 'C':
        case 'c':
          for (let i = 0; i < paramCount; i += 6) {
            const [cp1x, cp1y, cp2x, cp2y, x, y] = command === 'C'
              ? params.slice(i, i + 6)
              : params.slice(i, i + 6).map((p, index) => index % 2 === 0 ? p + currentX : p + currentY);
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            controlX = cp2x;
            controlY = cp2y;
            currentX = x;
            currentY = y;
          }
          break;
        case 'S':
        case 's':
          for (let i = 0; i < paramCount; i += 4) {
            let [cp2x, cp2y, x, y] = command === 'S'
              ? params.slice(i, i + 4)
              : params.slice(i, i + 4).map((p, index) => index % 2 === 0 ? p + currentX : p + currentY);
            const cp1x = currentX + (currentX - controlX);
            const cp1y = currentY + (currentY - controlY);
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            controlX = cp2x;
            controlY = cp2y;
            currentX = x;
            currentY = y;
          }
          break;
        case 'Q':
        case 'q':
          for (let i = 0; i < paramCount; i += 4) {
            const [cpx, cpy, x, y] = command === 'Q'
              ? params.slice(i, i + 4)
              : params.slice(i, i + 4).map((p, index) => index % 2 === 0 ? p + currentX : p + currentY);
            ctx.quadraticCurveTo(cpx, cpy, x, y);
            controlX = cpx;
            controlY = cpy;
            currentX = x;
            currentY = y;
          }
          break;
        case 'T':
        case 't':
          for (let i = 0; i < paramCount; i += 2) {
            const [x, y] = command === 'T'
              ? params.slice(i, i + 2)
              : [params[i] + currentX, params[i + 1] + currentY];
            const cpx = currentX + (currentX - controlX);
            const cpy = currentY + (currentY - controlY);
            ctx.quadraticCurveTo(cpx, cpy, x, y);
            controlX = cpx;
            controlY = cpy;
            currentX = x;
            currentY = y;
          }
          break;
          case 'A':
            case 'a':
              for (let i = 0; i < paramCount; i += 7) {
            const [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y] = command === 'A'
                  ? params.slice(i, i + 7)
                  : [...params.slice(i, i + 5), params[i + 5] + currentX, params[i + 6] + currentY];
            // 这里应该使用更复杂的弧线绘制逻辑，目前使用简化版本
            ctx.ellipse(x, y, rx, ry, xAxisRotation, 0, 2 * Math.PI);
                currentX = x;
                currentY = y;
              }
              break;
        case 'Z':
        case 'z':
          ctx.closePath();
          currentX = startX;
          currentY = startY;
          break;
      }
    });
  
    ctx.fillStyle = this.primaryColor;
    ctx.fill();
  
    ctx.restore();
  }

  /**
   * 绘制SVG路径数据
   * @param ctx Canvas上下文
   * @param svgData SVG路径数据
   * @param x 绘制中心的x坐标
   * @param y 绘制中心的y坐标
   * @param size 绘制大小
   */
  private drawSVGData(ctx: CanvasRenderingContext2D, svgData: string, x: number, y: number, size: number) {
    ctx.save();
    ctx.translate(x, y);
    
    const path = new Path2D(svgData);
    
    // 计算缩放比例
    const svgViewBox = [0, 0, 24, 24]; // 假设原始viewBox为24x24
    const scale = size / Math.max(svgViewBox[2], svgViewBox[3]);
    
    ctx.scale(scale, scale);
    
    // 将绘制原点移到中心
    ctx.translate(-svgViewBox[2] / 2, -svgViewBox[3] / 2);
    
    ctx.fillStyle = this.primaryColor;
    ctx.fill(path);
    
    ctx.strokeStyle = this.primaryColor;
    ctx.lineWidth = 1.5 / scale; // 保持线宽一致
    ctx.stroke(path);
    
    ctx.restore();
  }

  /**
   * 绘制五角星
   * @param canvasCtx 画笔
   * @param x 圆心x坐标
   * @param y 圆心y坐标
   * @param r 半径
   */
  private drawStarShape(ctx: CanvasRenderingContext2D, starSvgData: IDrawStar, x: number, y: number) {
    const drawStarDia = starSvgData.starDiameter / 2 * this.mmToPixel
    if(starSvgData.svgPath.startsWith('<svg')){
      this.drawSVGContent(ctx, starSvgData.svgPath, x, y, 1)
    }else{
      this.drawSVGPath(ctx, starSvgData.svgPath, x, y, drawStarDia)
    }
  }

  private drawSVGContent(ctx: CanvasRenderingContext2D, svgContent: string, x: number, y: number, scale: number = 1) {
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
    
    // 当图片加载完成时，在 canvas 上绘制它
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

    ctx.save()
    ctx.font = `${fontSize}px SimSun`
    ctx.fillStyle = this.primaryColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 计算文字位置（在五角星正下方）
    const textY = centerY + radiusX * 0.5 + positionY * this.mmToPixel

    ctx.save()
    ctx.translate(centerX, textY)

    const chars = stampType.stampType.split('')
    const charWidths = chars.map((char) => ctx.measureText(char).width)
    const totalWidth =
      charWidths.reduce((sum, width) => sum + width, 0) +
      (chars.length - 1) * letterSpacing * this.mmToPixel

    let currentX = -totalWidth / 2 // 从文本的左边缘开始

    ctx.scale(this.drawStampConfigs.stampType.compression, 1)
    chars.forEach((char, index) => {
      ctx.fillText(char, currentX + charWidths[index] / 2, 0) // 绘制在字符的中心
      currentX += charWidths[index] + letterSpacing * this.mmToPixel
    })

    ctx.restore()
  }

  /**
   * 绘制防伪纹路
   * @param centerX 圆心x坐标
   * @param centerY 圆心y坐标
   * @param radiusX 半径x
   * @param radiusY 半径y
   * @param securityPatternWidth 纹路宽度
   * @param securityPatternLength 纹路长度
   */
  private drawSecurityPattern(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    forceRefresh: boolean
  ) {
    if (!this.securityPattern.openSecurityPattern) return

    ctx.save()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = this.securityPattern.securityPatternWidth * this.mmToPixel
    ctx.globalCompositeOperation = 'destination-out'

    const angleRangeRad = (this.securityPattern.securityPatternAngleRange * Math.PI) / 180

    // 如果需要刷新或者参数数组为空,则重新生成参数
    if (forceRefresh || this.securityPatternParams.length === 0) {
      this.securityPatternParams = []
      for (let i = 0; i < this.securityPattern.securityPatternCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const normalAngle = Math.atan2(radiusY * Math.cos(angle), radiusX * Math.sin(angle))
        const lineAngle = normalAngle + (Math.random() - 0.5) * angleRangeRad
        this.securityPatternParams.push({ angle, lineAngle })
      }
    }

    // 使用保存的参数绘制纹路
    this.securityPatternParams.forEach(({ angle, lineAngle }) => {
      const x = centerX + radiusX * Math.cos(angle)
      const y = centerY + radiusY * Math.sin(angle)

      const length = this.securityPattern.securityPatternLength * this.mmToPixel
      const startX = x - (length / 2) * Math.cos(lineAngle)
      const startY = y - (length / 2) * Math.sin(lineAngle)
      const endX = x + (length / 2) * Math.cos(lineAngle)
      const endY = y + (length / 2) * Math.sin(lineAngle)

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
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
   * 绘制公司名称
   * @param centerX 圆心x坐标
   * @param centerY 圆心y坐标
   * @param radiusX 椭圆长轴半径
   * @param radiusY 椭圆短轴半径
   * @param text 公司名称文本
   * @param fontSize 字体大小
   */
  private drawCompanyName(
    ctx: CanvasRenderingContext2D,
    company: ICompany,
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number
  ) {
    const fontSize = company.fontHeight * this.mmToPixel
    ctx.save()
    ctx.font = `${fontSize}px ${company.fontFamily}`
    ctx.fillStyle = this.primaryColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'

    const characters = company.companyName.split('')
    const characterCount = characters.length
    const borderOffset = company.borderOffset * this.mmToPixel

    // 调整起始和结束角度，使文字均匀分布在椭圆上半部分
    const totalAngle = Math.PI * (1 + characterCount / company.textDistributionFactor)
    const startAngle = Math.PI + (Math.PI - totalAngle) / 2
    const anglePerChar = totalAngle / characterCount

    characters.forEach((char, index) => {
      const angle = startAngle + anglePerChar * (index + 0.5)
      const x = centerX + Math.cos(angle) * (radiusX - fontSize - borderOffset)
      const y = centerY + Math.sin(angle) * (radiusY - fontSize - borderOffset)

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle + Math.PI / 2)
      ctx.scale(company.compression, 1) // 应用压缩
      ctx.fillText(char, 0, 0)
      ctx.restore()
    })

    ctx.restore()
  }

  /**
   * 绘制印章编码
   * @param centerX 圆心x坐标
   * @param centerY 圆心y坐标
   * @param radiusX 椭圆长轴半径
   * @param radiusY 椭圆短轴半径
   * @param text 编码文本
   * @param fontSize 字体大小
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

    ctx.save()
    ctx.font = `${fontSize}px ${code.fontFamily}`
    ctx.fillStyle = this.primaryColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const characters = text.split('')
    const characterCount = characters.length

    // 动态调整总角度
    // const totalAngle = Math.PI * (characterCount / 20) * 0.5
    const totalAngle = Math.PI * ((1 + characterCount) / code.textDistributionFactor)
    const startAngle = Math.PI / 2 + totalAngle / 2
    const anglePerChar = totalAngle / (characterCount - 1)

    characters.forEach((char, index) => {
      const angle = startAngle - anglePerChar * index
      const x =
        centerX + Math.cos(angle) * (radiusX - fontSize / 2 - code.borderOffset * this.mmToPixel)
      const y =
        centerY + Math.sin(angle) * (radiusY - fontSize / 2 - code.borderOffset * this.mmToPixel)

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle - Math.PI / 2) // 逆时针旋转文字
      ctx.scale(code.compression, 1) // 应用压缩
      ctx.fillText(char, 0, 0)
      ctx.restore()
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

    ctx.save()
    ctx.font = `${fontSize}px ${taxNumber.fontFamily}`
    ctx.fillStyle = this.primaryColor
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

    // 计算起始位置，确保文字居中
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

    // // 绘制包含税号的矩形
    // const rectWidth = 26 * this.mmToPixel // 26mm 转换为像素
    // const rectHeight = fontSize * 1.2 // 矩形高度略大于字体大小
    // const rectX = centerX - rectWidth / 2
    // const rectY = adjustedCenterY - rectHeight / 2

    // ctx.save()
    // ctx.strokeStyle = this.primaryColor
    // ctx.lineWidth = 1
    // ctx.strokeRect(rectX, rectY, rectWidth, rectHeight)
    // ctx.restore()
  }

  private addAgingEffectForSave(ctx: CanvasRenderingContext2D, width: number, height: number) {
    if (!this.drawStampConfigs.agingEffect.applyAging) return
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // 使用保存的参数应用做旧效果
    this.agingEffectParams.forEach((param) => {
      const { x, y, noiseSize, noise, strongNoiseSize, strongNoise, fade, seed } = param
      const realX = x
      const realY = y
      const index = (realY * width + realX) * 4

      if (seed < 0.4) {
        this.addCircularNoise(data, width, realX, realY, noiseSize, noise)
      }

      if (seed < 0.05) {
        this.addCircularNoise(data, width, realX, realY, strongNoiseSize, strongNoise)
      }

      if (seed < 0.2) {
        data[index] = Math.min(255, data[index] + fade)
        data[index + 1] = Math.min(255, data[index + 1] + fade)
        data[index + 2] = Math.min(255, data[index + 2] + fade)
      }
    })

    ctx.putImageData(imageData, 0, 0)
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
    if (!this.drawStampConfigs.agingEffect.applyAging) return
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    const centerX = width / 2
    const centerY = height / 2
    const radius = (Math.max(width, height) / 2) * this.mmToPixel

    // 如果需要刷新或者参数数组为空,则重新生成参数
    if (forceRefresh || this.agingEffectParams.length === 0) {
      this.agingEffectParams = []
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4
          const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
          if (
            distanceFromCenter <= radius &&
            data[index] > 200 &&
            data[index + 1] < 50 &&
            data[index + 2] < 50
          ) {
            const intensityFactor = this.drawStampConfigs.agingEffect.agingIntensity / 100 // 可以根据需要调整
            const seed = Math.random()
            this.agingEffectParams.push({
              x,
              y,
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

    // 使用保存的参数应用做旧效果
    this.agingEffectParams.forEach((param) => {
      const { x, y, noiseSize, noise, strongNoiseSize, strongNoise, fade, seed } = param
      const index = (y * width + x) * 4

      if (seed < 0.4) {
        this.addCircularNoise(data, width, x, y, noiseSize, noise)
      }

      if (seed < 0.05) {
        this.addCircularNoise(data, width, x, y, strongNoiseSize, strongNoise)
      }

      if (seed < 0.2) {
        data[index] = Math.min(255, data[index] + fade)
        data[index + 1] = Math.min(255, data[index + 1] + fade)
        data[index + 2] = Math.min(255, data[index + 2] + fade)
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
    intensity: number
  ) {
    const radiusSquared = (size * size) / 4
    for (let dy = -size / 2; dy < size / 2; dy++) {
      for (let dx = -size / 2; dx < size / 2; dx++) {
        if (dx * dx + dy * dy <= radiusSquared) {
          const nx = Math.round(x + dx)
          const ny = Math.round(y + dy)
          const nIndex = (ny * width + nx) * 4
          if (nIndex >= 0 && nIndex < data.length) {
            data[nIndex] = Math.min(255, data[nIndex] + intensity)
            data[nIndex + 1] = Math.min(255, data[nIndex + 1] + intensity)
            data[nIndex + 2] = Math.min(255, data[nIndex + 2] + intensity)
          }
        }
      }
    }
  }

  /**
   * 绘制全尺寸标尺
   * @param width 画布宽度
   * @param height 画布高度
   */
  private drawFullRuler(ctx: CanvasRenderingContext2D, width: number, height: number) {
    if (!this.ruler.showFullRuler) return

    ctx.save()
    ctx.strokeStyle = '#bbbbbb' // 浅灰色
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5]) // 设置虚线样式

    // 绘制垂直线
    for (let x = RULER_WIDTH; x < width; x += 5 * this.mmToPixel) {
      ctx.beginPath()
      ctx.moveTo(x, RULER_HEIGHT)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // 绘制水平线
    for (let y = RULER_HEIGHT; y < height; y += 5 * this.mmToPixel) {
      ctx.beginPath()
      ctx.moveTo(RULER_WIDTH, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    ctx.restore()
  }

  /**
   * 绘制标尺
   * @param rulerLength 标尺长度
   * @param rulerSize 标尺宽度
   * @param isHorizontal 是否为水平标尺
   */
  private drawRuler(
    ctx: CanvasRenderingContext2D,
    rulerLength: number,
    rulerSize: number,
    isHorizontal: boolean
  ) {
    if (!this.ruler.showRuler) return

    const mmPerPixel = 1 / this.mmToPixel

    // 绘制标尺背景
    ctx.fillStyle = 'lightgray'
    if (isHorizontal) {
      ctx.fillRect(0, 0, rulerLength, rulerSize)
    } else {
      ctx.fillRect(0, 0, rulerSize, rulerLength)
    }

    // 绘制刻度和数字
    ctx.fillStyle = 'black'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    for (let i = 0; i <= rulerLength - rulerSize; i += this.mmToPixel / 10) {
      const pos = i + rulerSize
      const mm = Math.round(i * mmPerPixel * 10) / 10

      if (mm % 5 === 0) {
        // 5毫米刻度
        ctx.beginPath()
        if (isHorizontal) {
          ctx.moveTo(pos, 0)
          ctx.lineTo(pos, rulerSize * 0.8)
        } else {
          ctx.moveTo(0, pos)
          ctx.lineTo(rulerSize * 0.8, pos)
        }
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.save()
        if (isHorizontal) {
          ctx.fillText(mm.toString(), pos, rulerSize * 0.8)
        } else {
          ctx.translate(rulerSize * 0.8, pos)
          ctx.rotate(-Math.PI / 2)
          ctx.fillText(mm.toString(), 0, 0)
        }
        ctx.restore()
      } else if (mm % 1 === 0) {
        // 1毫米刻度
        ctx.beginPath()
        if (isHorizontal) {
          ctx.moveTo(pos, 0)
          ctx.lineTo(pos, rulerSize * 0.6)
        } else {
          ctx.moveTo(0, pos)
          ctx.lineTo(rulerSize * 0.6, pos)
        }
        ctx.lineWidth = 0.5
        ctx.stroke()
      } else {
        // 0.1毫米刻度
        ctx.beginPath()
        if (isHorizontal) {
          ctx.moveTo(pos, 0)
          ctx.lineTo(pos, rulerSize * 0.2)
        } else {
          ctx.moveTo(0, pos)
          ctx.lineTo(rulerSize * 0.2, pos)
        }
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }

  /**
   * 将印章保存为PNG图片
   * @param outputSize 输出图片的尺寸
   */
  saveStampAsPNG(outputSize: number = 512) {
    // 首先隐藏虚线
    this.drawStampConfigs.shouldDrawRuler = false
    this.refreshStamp()
    setTimeout(() => {
      // 创建一个新的 canvas 元素，大小为 outputSize x outputSize
      const saveCanvas = document.createElement('canvas')
      saveCanvas.width = outputSize
      saveCanvas.height = outputSize
      const saveCtx = saveCanvas.getContext('2d')
      if (!saveCtx) return

      // 清除画布，使背景透明
      saveCtx.clearRect(0, 0, outputSize, outputSize)

      // 计算原始 canvas 中印章的位置和大小
      const originalStampSize =
        (Math.max(this.drawStampConfigs.width, this.drawStampConfigs.height) + 2) * this.mmToPixel
      const sourceX =
        (this.canvas.width - originalStampSize) / 2 + this.stampOffsetX * this.mmToPixel
      const sourceY =
        (this.canvas.height - originalStampSize) / 2 + this.stampOffsetY * this.mmToPixel

      // 设置2%的边距
      const margin = outputSize * 0.01
      const drawSize = outputSize - 2 * margin

      // 将原始 canvas 中的印章部分绘制到新的 canvas 上，并调整大小
      saveCtx.drawImage(
        this.canvas,
        sourceX,
        sourceY,
        originalStampSize,
        originalStampSize,
        margin,
        margin,
        drawSize,
        drawSize
      )

      // 如果启用了做旧效果，在新的 canvas 上应用做旧效果
      if (this.drawStampConfigs.agingEffect.applyAging) {
        this.addAgingEffect(saveCtx, outputSize, outputSize, false)
      }

      // 将新的 canvas 转换为 PNG 数据 URL
      const dataURL = saveCanvas.toDataURL('image/png')

      // 创建一个临时的 <a> 元素来触发下载
      const link = document.createElement('a')
      link.href = dataURL
      link.download = '印章.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 首先隐藏虚线
      this.drawStampConfigs.shouldDrawRuler = true
      this.refreshStamp()
    }, 50)
  }

  // 刷新印章绘制
  refreshStamp(refreshSecurityPattern: boolean = false, refreshOld: boolean = false) {
    // 计算画布中心点
    const x = this.canvas.width / 2
    const y = this.canvas.height / 2
    const mmToPixel = this.mmToPixel
    const drawRadiusX = (this.drawStampConfigs.width - this.drawStampConfigs.borderWidth) / 2
    const drawRadiusY = (this.drawStampConfigs.height - this.drawStampConfigs.borderWidth) / 2
    const offsetX = this.stampOffsetX * this.mmToPixel
    const offsetY = this.stampOffsetY * this.mmToPixel
    const centerX = x + offsetX
    const centerY = y + offsetY

    this.drawStamp(
      this.canvasCtx,
      centerX,
      centerY,
      drawRadiusX * mmToPixel,
      drawRadiusY * mmToPixel,
      this.drawStampConfigs.borderWidth * mmToPixel,
      this.drawStampConfigs.primaryColor,
      refreshSecurityPattern,
      refreshOld
    )
  }

  private agingEffectParams: Array<{
    x: number
    y: number
    noiseSize: number
    noise: number
    strongNoiseSize: number
    strongNoise: number
    fade: number
    seed: number
  }> = []

  /**
   * 绘制印章
   * @param x 圆心x坐标
   * @param y 圆心y坐标
   * @param radiusX 半径x
   * @param radiusY 半径y
   * @param borderWidth 边框宽度
   * @param borderColor 边框颜色
   */
  drawStamp(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    borderWidth: number,
    borderColor: string,
    refreshSecurityPattern: boolean = false,
    refreshOld: boolean = false
  ) {
    // 清除整个画布
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 在离屏 canvas 上绘制椭圆边框
    const offscreenCanvas = this.offscreenCanvas
    offscreenCanvas.width = this.canvas.width
    offscreenCanvas.height = this.canvas.height
    const offscreenCtx = offscreenCanvas.getContext('2d')
    if (!offscreenCtx) return
    offscreenCtx.beginPath()
    offscreenCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
    offscreenCtx.strokeStyle = 'white' // 使用白色，稍后会变成红色
    offscreenCtx.lineWidth = borderWidth
    offscreenCtx.stroke()

    // // 设置填充颜色为白色
    offscreenCtx.fillStyle = 'white'

    // 设置画布背景
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制椭圆
    this.drawEllipse(offscreenCtx, centerX, centerY, radiusX, radiusY, borderWidth, borderColor)

    if (this.drawStampConfigs.innerCircle.drawInnerCircle) {
      const innerCircle = this.drawStampConfigs.innerCircle
      const innerCircleWidth =
        (innerCircle.innerCircleLineRadiusX - innerCircle.innerCircleLineWidth) / 2
      const innerCircleHeight =
        (innerCircle.innerCircleLineRadiusY - innerCircle.innerCircleLineWidth) / 2
      // 绘制内圈椭圆
      this.drawEllipse(
        offscreenCtx,
        centerX,
        centerY,
        innerCircleWidth * this.mmToPixel,
        innerCircleHeight * this.mmToPixel,
        innerCircle.innerCircleLineWidth * this.mmToPixel,
        this.drawStampConfigs.primaryColor
      )
    }

    // 内部细圈
    if (this.drawStampConfigs.outThinCircle.drawInnerCircle) {
      const outThinCircle = this.drawStampConfigs.outThinCircle
      const outThinCircleWidth =
        (outThinCircle.innerCircleLineRadiusX - outThinCircle.innerCircleLineWidth) / 2
      const outThinCircleHeight =
        (outThinCircle.innerCircleLineRadiusY - outThinCircle.innerCircleLineWidth) / 2
      // 绘制外部细圈椭圆
      this.drawEllipse(
        offscreenCtx,
        centerX,
        centerY,
        outThinCircleWidth * this.mmToPixel,
        outThinCircleHeight * this.mmToPixel,
        outThinCircle.innerCircleLineWidth * this.mmToPixel,
        this.drawStampConfigs.primaryColor
      )
    }

    // 在椭圆边框上绘制防伪纹路
    this.drawSecurityPattern(
      offscreenCtx!!,
      centerX,
      centerY,
      radiusX,
      radiusY,
      refreshSecurityPattern
    )

    // 绘制五角星
    if (this.drawStampConfigs.drawStar.drawStar) {
      this.drawStarShape(offscreenCtx, this.drawStampConfigs.drawStar, centerX, centerY)
    }

    // 绘制公司名称
    this.drawCompanyName(
      offscreenCtx,
      this.drawStampConfigs.company,
      centerX,
      centerY,
      radiusX,
      radiusY
    )

    // 绘制印章类型
    this.drawStampType(offscreenCtx, this.drawStampConfigs.stampType, centerX, centerY, radiusX)

    // 绘制印章编码
    this.drawCode(offscreenCtx, this.drawStampConfigs.stampCode, centerX, centerY, radiusX, radiusY)

    // 绘制纳税识别号
    this.drawTaxNumber(offscreenCtx, this.drawStampConfigs.taxNumber, centerX, centerY)

    // 将离屏 canvas 的内容作为蒙版应用到主 canvas
    ctx.save()
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = borderColor
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(offscreenCanvas, 0, 0)
    ctx.restore()

    // 在绘制完所有内容后，添加做旧效果
    this.addAgingEffect(ctx, this.canvas.width, this.canvas.height, refreshOld)

    if (this.drawStampConfigs.shouldDrawRuler) {
      // 绘制标尺
      this.drawRuler(ctx, this.canvas.width, RULER_HEIGHT, true)
      this.drawRuler(ctx, this.canvas.height, RULER_HEIGHT, false)
      // 将全尺寸标尺绘制到离屏canvas上
      this.drawFullRuler(ctx, this.canvas.width, this.canvas.height)
    }
  }
}
