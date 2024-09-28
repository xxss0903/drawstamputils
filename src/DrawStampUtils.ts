declare var cv: any;
// 防伪纹路
export type ISecurityPattern = {  
  openSecurityPattern: boolean // 是否启用防伪纹路
  securityPatternWidth: number // 防伪纹路宽度
  securityPatternLength: number // 防伪纹路长度
  securityPatternCount: number // 防伪纹路数量
  securityPatternAngleRange: number // 防伪纹路角度范围
  securityPatternParams: Array<{ angle: number; lineAngle: number }> // 保存防伪纹路的参数数组
}

export type IRoughEdgeParams = {
  angle: number
  size: number
}
// 毛边效果
export type IRoughEdge = {
  drawRoughEdge: boolean // 是否绘制毛边效果
  roughEdgeWidth: number // 毛边宽度
  roughEdgeHeight: number // 毛边高度，按照边缘宽度的百分比
  roughEdgeShift: number // 偏移
  roughEdgeParams: IRoughEdgeParams[] // 新增：用于存储毛边参数
  roughEdgeProbability: number // 毛边概率
  roughEdgePoints: number // 毛边点数
}

// 绘制印章的公司
export type ICompany = {
  companyName: string // 公司名称
  compression: number // 公司名称压缩比例
  borderOffset: number // 边框偏移量
  textDistributionFactor: number // 文字分布因子
  fontFamily: string // 字体
  fontHeight: number // 字体高度
  fontWeight: string | number // 字体粗细
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
  fontWeight: string | number // 编码字体粗细
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
  fontWeight: string | number // 税号字体粗细
}

// 做旧效果参数
export type IAgingEffectParams = {
  x: number // x轴位置
  y: number // y轴位置
  noiseSize: number // 噪声大小
  noise: number // 噪声强度
  strongNoiseSize: number // 强噪声大小
  strongNoise: number // 强噪声强度
  fade: number // 淡化强度
  seed: number // 随机种子
}

// 做旧效果
export type IAgingEffect = {
  applyAging: boolean // 是否应用做旧效果
  agingIntensity: number // 做旧效果强度
  agingEffectParams: IAgingEffectParams[] // 保存做旧效果的参数数组
}

// 绘制五角星
export type IDrawStar = {
  svgPath: string // svg路径
  drawStar: boolean // 是否绘制五角星
  starDiameter: number // 五角星直径
  starPositionY: number // 五角星位置
  scaleToSmallStar: boolean // 是否缩放为小五角星
}

// 印章类型
export type IStampType = {
  stampType: string // 印章类型
  fontHeight: number // 字体高度  
  compression: number // 压缩比例
  letterSpacing: number // 字符间距
  positionY: number // 位置
  fontWidth: number // 字体宽度
  fontWeight: string | number // 字体粗细
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
  showRuler: boolean // 是否绘制标尺
  showFullRuler: boolean // 是否绘制全标尺  
}

// 绘制印章的参数
export type IDrawStampConfig = {
  roughEdge: IRoughEdge // 毛边效果
  agingEffect: IAgingEffect // 做旧效果
  ruler: IShowRuler // 是否绘制标尺
  drawStar: IDrawStar // 是否绘制五角星
  securityPattern: ISecurityPattern
  company: ICompany // 公司
  stampCode: ICode // 印章编码
  taxNumber: ITaxNumber // 税号
  stampType: IStampType // 印章类型
  width: number // 印章宽度
  height: number // 印章高度
  borderWidth: number // 印章边框宽度
  primaryColor: string // 印章主色
  refreshSecurityPattern: boolean // 是否刷新防伪纹路
  refreshOld: boolean // 是否刷新做旧效果
  shouldDrawRuler: boolean // 是否绘制标尺
  innerCircle: IInnerCircle // 内圈圆
  outThinCircle: IInnerCircle // 比外圈细的稍微内圈
  openManualAging: boolean // 是否开启手动做旧效果
}

// 标尺宽度
const RULER_WIDTH = 80
// 标尺高度
const RULER_HEIGHT = 80

/**
 * 绘制印章工具类
 */
export class DrawStampUtils {
  // 缩放参数
  private scale: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;
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
    securityPatternAngleRange: 40,
    securityPatternParams: []
  }
  private company: ICompany = {
    companyName: '印章绘制有限责任公司',
    compression: 1,
    borderOffset: 1,
    textDistributionFactor: 20,
    fontFamily: 'SimSun',
    fontHeight: 4.2,
    fontWeight: 'normal'
  }
  private taxNumber: ITaxNumber = {
    code: '000000000000000000',
    compression: 0.7,
    fontHeight: 3.7,
    fontFamily: 'Arial',
    fontWidth: 1.3,
    letterSpacing: 8,
    positionY: 0,
    totalWidth: 26,
    fontWeight: 'normal',
  }
  private stampCode: ICode = {
    code: '1234567890',
    compression: 1,
    fontHeight: 1.2,
    fontFamily: 'Arial',
    borderOffset: 1,
    fontWidth: 1.2,
    textDistributionFactor: 50,
    fontWeight: 'normal',
  }
  private stampType: IStampType = {
    stampType: '发票专用章',
    fontHeight: 4.6,
    fontWidth: 3,
    compression: 0.75,
    letterSpacing: 0,
    positionY: -3,
    fontWeight: 'normal',
  }
  // 做旧效果
  private agingEffect: IAgingEffect = {
    applyAging: false,
    agingIntensity: 50,
    agingEffectParams: []
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
  // 毛边效果
  private roughEdge: IRoughEdge = {
    drawRoughEdge: true,
    roughEdgeWidth: 0.2,
    roughEdgeHeight: 5,
    roughEdgeParams: [],
    roughEdgeProbability: 0.3,
    roughEdgeShift: 0.5,
    roughEdgePoints: 360
  }
  // 总的印章绘制参数
  private drawStampConfigs: IDrawStampConfig = {
    roughEdge: this.roughEdge,
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
    outThinCircle: this.outThinCircle,
    openManualAging: false
  }
  private cvReady: boolean = false;

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
    this.initOpenCV();
  }

  
  private initOpenCV() {
    if (typeof cv !== 'undefined') {
      this.cvReady = true;
      console.log('OpenCV.js 已加载');
    } else {
      console.log('等待 OpenCV.js 加载...');
      document.addEventListener('opencv-ready', () => {
        this.cvReady = true;
        console.log('OpenCV.js 已加载');
      });
    }
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
  
    for(let i = 0; i < 10; i++) {
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
      if(this.drawStampConfigs.openManualAging && event.buttons === 1) {
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
      if(this.drawStampConfigs.openManualAging) {
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
          // 添加双击事件监听器来重置缩放
    // this.canvas.addEventListener('dblclick', (event: MouseEvent) => {
    //   this.resetZoom();
    // });
  }

  private zoomCanvas(mouseX: number, mouseY: number, zoom: number) {
    const oldScale = this.scale;
    this.scale *= zoom;
    this.scale = Math.max(0.1, Math.min(5, this.scale)); // 限制缩放范围

    // 调整偏移量以保持鼠标位置不变
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
    if(this.drawStampConfigs.openManualAging) {
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
  ctx.fillStyle = 'black';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const showPositionX = mmX / this.scale
  const showPositionY = mmY / this.scale
  ctx.fillText(`${showPositionX.toFixed(1)}mm, ${showPositionY.toFixed(1)}mm, scale: ${this.scale.toFixed(2)}`, RULER_WIDTH + 5, RULER_HEIGHT + 5);
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

  /**
   * 提取红色印章
   * @param img 
   * @returns 
   */
  extractRedStamp(img: any): any {
    if (this.cvReady) {
      const dstImg = this.extractRedStampWithColor(img, this.primaryColor)
      return dstImg
    } else {
      console.error('OpenCV.js 未加载');
      return null;
    }
  }

  extractStampWithColor(img: any, extractColor: string, setColor: string): any {
    if (this.cvReady) {
      const dstImg = this.extractStampWithColor(img, extractColor, setColor)
      return dstImg
    } else {
      console.error('OpenCV.js 未加载');
      return null;
    }
  }

  /**
   * 将十六进制颜色值转换为RGBA
   * @param hex 
   * @returns 
   */
  private hexToRgba(hex: string) {
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)
    let a = 255
    if (hex.length === 9) {
      a = parseInt(hex.slice(7, 9), 16)
    }
    return [r, g, b, a]
  }

  /**
   * 根据文件提取红色印章 
   * @param file 
   * @returns 
   */
  extractRedStampWithFile(file: File) {
  return new Promise((resolve, reject) => {
  const img = new Image();
    img.onload = () => {
      const dstImg = this.extractRedStampWithColor(img, this.primaryColor);
      resolve(dstImg);
    };
    img.onerror = (error) => {
      console.error('图片加载失败', error)
      reject(new Error('图片加载失败'));
    };
    img.src = URL.createObjectURL(file);
  });
  }

  /**
   * 提取指定颜色的印章
   * @param file 图片文件   
   * @param extractColor 提取的颜色
   * @param setColor 设置的颜色，比如提取红色设置红色那么能够进行对印章的填充
   * @returns 
   */
  extractStampWithFile(file: File, extractColor: string, setColor: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const dstImg = this.extractStampWithColorImpl(img, extractColor, setColor);
        resolve(dstImg);
      };
      img.onerror = (error) => {
        console.error('图片加载失败', error)
        reject(new Error('图片加载失败'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 提取红色印章
   * @param img 
   * @param color 
   * @returns 
   */
  private extractRedStampWithColor(img: any, color: string): any {
    if (this.cvReady) {
      // 获取图片的宽高
      const imgWidth = img.width;
      const imgHeight = img.height;
      console.log('图片宽度:', imgWidth, '图片高度:', imgHeight);
      let src = cv.imread(img)
      let dst = new cv.Mat()
      let mask = new cv.Mat()

        // 转换为HSV颜色空间
        cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB)
        cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV)

        // 定义红色的HSV范围
        let lowRedA = new cv.Mat(dst.rows, dst.cols, dst.type(), [0, 100, 100, 0])
        let highRedA = new cv.Mat(dst.rows, dst.cols, dst.type(), [10, 255, 255, 255])
        let lowRedB = new cv.Mat(dst.rows, dst.cols, dst.type(), [160, 100, 100, 0])
        let highRedB = new cv.Mat(dst.rows, dst.cols, dst.type(), [180, 255, 255, 255])

        // 创建掩码
        let maskA = new cv.Mat()
        let maskB = new cv.Mat()
        cv.inRange(dst, lowRedA, highRedA, maskA)
        cv.inRange(dst, lowRedB, highRedB, maskB)
        cv.add(maskA, maskB, mask)

        // 将十六进制颜色值转换为RGB
        const dstColor = this.hexToRgba(color)
        console.log('dstColor:', dstColor)
        // 创建纯红色图像
        let red = new cv.Mat(src.rows, src.cols, src.type(), dstColor)

        // 使用掩码将红色区域设置为纯红色
        red.copyTo(dst, mask)

        // 创建隐藏的canvas用来保存提取后的图片
        const hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = dst.cols;
        hiddenCanvas.height = dst.rows;
        cv.imshow(hiddenCanvas, dst);
        let dataURL = hiddenCanvas.toDataURL('image/png')
        let link = document.createElement('a')
        link.download = 'extracted_red_image.png'
        link.href = dataURL
        link.click()

        // 释放内存
        src.delete()
        dst.delete()
        mask.delete()
        maskA.delete()
        maskB.delete()
        lowRedA.delete()
        highRedA.delete()
        lowRedB.delete()
        highRedB.delete()
        red.delete()
      return dst;
    } else {
      console.error('OpenCV.js 未加载');
      return img;
    }
  }

  /**
   * 提取指定颜色的印章
   * @param img 要处理的图像
   * @param extractColor 要提取的颜色，十六进制格式，如 "#FF0000"
   * @param setColor 设置提取区域的新颜色，十六进制格式，如 "#0000FF"
   * @returns 处理后的图像
   * 
   * @example
   * // 提取红色印章并将其设置为蓝色
   * const img = document.getElementById('myImage');
   * const extractedImg = extractStampWithColor(img, "#FF0000", "#0000FF");
   * 
   * // 提取绿色印章并将其设置为黄色
   * const greenStamp = document.querySelector('.stamp-image');
   * const yellowStamp = extractStampWithColor(greenStamp, "#00FF00", "#FFFF00");
   */
  private extractStampWithColorImpl(img: any, extractColor: string = '#ff0000', setColor: string = '#ff0000'): any {
    if (this.cvReady) {
      // 获取图片的宽高
      const imgWidth = img.width;
      const imgHeight = img.height;
      console.log('图片宽度:', imgWidth, '图片高度:', imgHeight);
      let src = cv.imread(img)
      let dst = new cv.Mat()
      let mask = new cv.Mat()
  
      // 转换为HSV颜色空间
      cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB)
      cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV)
  
      // 将提取颜色转换为HSV
      const extractColorRGB = this.hexToRgba(extractColor)
      const extractColorHSV = cv.matFromArray(1, 1, cv.CV_8UC3, [extractColorRGB[0], extractColorRGB[1], extractColorRGB[2]])
      cv.cvtColor(extractColorHSV, extractColorHSV, cv.COLOR_RGB2HSV)
      const hsvValues = extractColorHSV.data32F
  
      // 定义提取颜色的HSV范围
      let lowColor, highColor;
      if (extractColor.toLowerCase() === '#ff0000') {
        // 红色的HSV范围
        lowColor = new cv.Mat(dst.rows, dst.cols, dst.type(), [0, 100, 100, 0]);
        highColor = new cv.Mat(dst.rows, dst.cols, dst.type(), [10, 255, 255, 255]);
      } else if (extractColor.toLowerCase() === '#00ff00') {
        // 绿色的HSV范围
        lowColor = new cv.Mat(dst.rows, dst.cols, dst.type(), [60, 100, 100, 0]);
        highColor = new cv.Mat(dst.rows, dst.cols, dst.type(), [80, 255, 255, 255]);
      } else if (extractColor.toLowerCase() === '#000000') {
        // 黑色的HSV范围
        lowColor = new cv.Mat(dst.rows, dst.cols, dst.type(), [0, 0, 0, 0]);
        highColor = new cv.Mat(dst.rows, dst.cols, dst.type(), [180, 255, 30, 255]);
      } else {
        // 其他颜色（包括随机颜色如#00ffff）使用动态计算的范围
        const hue = hsvValues[0];
        const hueRange = 10; // 色相范围，可以根据需要调整
        lowColor = new cv.Mat(dst.rows, dst.cols, dst.type(), [Math.max(0, hue - hueRange), 100, 100, 0]);
        highColor = new cv.Mat(dst.rows, dst.cols, dst.type(), [Math.min(180, hue + hueRange), 255, 255, 255]);
      }
  
      // 创建掩码
      cv.inRange(dst, lowColor, highColor, mask)
  
      // 将十六进制颜色值转换为RGBA
      const dstColor = this.hexToRgba(setColor)
      console.log('dstColor:', dstColor)
  
      // 创建带有 alpha 通道的目标图像
      let result = new cv.Mat(src.rows, src.cols, cv.CV_8UC4, [0, 0, 0, 0]);
  
      // 创建指定颜色的图像（带有 alpha 通道）
      let colorMat = new cv.Mat(src.rows, src.cols, cv.CV_8UC4, [...dstColor.slice(0, 3), 255]);
  
      // 使用掩码将提取的区域设置为指定颜色，非提取区域保持透明
      colorMat.copyTo(result, mask);
  
      // 创建隐藏的canvas用来保存提取后的图片
      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = result.cols;
      hiddenCanvas.height = result.rows;
      cv.imshow(hiddenCanvas, result);
      let dataURL = hiddenCanvas.toDataURL('image/png')
  
      // 释放内存
      src.delete()
      dst.delete()
      mask.delete()
      lowColor.delete()
      highColor.delete()
      extractColorHSV.delete()
      colorMat.delete()
      result.delete()
      return dataURL;
    } else {
      console.error('OpenCV.js 未加载');
      return img;
    }
  }

  private saveImage(cv: any, dst: any) {
    let canvas = document.createElement('canvas')
    canvas.width = dst.cols
    canvas.height = dst.rows
    cv.imshow(canvas, dst)

    let dataURL = canvas.toDataURL('image/png')

    let link = document.createElement('a')
    link.download = 'extracted_red_image.png'
    link.href = dataURL
    link.click()
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
    const fontWeight = stampType.fontWeight || 'normal'; // 新增字体粗细参数

    ctx.save()
    ctx.font = `${fontWeight} ${fontSize}px SimSun`
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
    if (forceRefresh ||  this.drawStampConfigs.securityPattern.securityPatternParams.length === 0) {
      this.drawStampConfigs.securityPattern.securityPatternParams = []
      for (let i = 0; i < this.securityPattern.securityPatternCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const normalAngle = Math.atan2(radiusY * Math.cos(angle), radiusX * Math.sin(angle))
        const lineAngle = normalAngle + (Math.random() - 0.5) * angleRangeRad
        this.drawStampConfigs.securityPattern.securityPatternParams.push({ angle, lineAngle })
      }
    }

    // 使用保存的参数绘制纹路
    this.drawStampConfigs.securityPattern.securityPatternParams.forEach(({ angle, lineAngle }) => {
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
    const fontWeight = company.fontWeight || 'normal'; // 新增字体粗细参数
    ctx.save()
    ctx.font = `${fontWeight} ${fontSize}px ${company.fontFamily}`;
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
    const fontWeight = code.fontWeight || 'normal'; // 新增字体粗细参数

    ctx.save()
    ctx.font = `${fontWeight} ${fontSize}px ${code.fontFamily}`;
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
    const fontWeight = taxNumber.fontWeight || 'normal'; // 新增字体粗细参数

    ctx.save()
    
    ctx.font = `${fontWeight} ${fontSize}px ${taxNumber.fontFamily}`;
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
    const outwardShift = borderWidth * this.drawStampConfigs.roughEdge.roughEdgeShift;
  
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
      this.drawStampConfigs.roughEdge.roughEdgeParams.push({ angle, size });
    }
  }

  // 使用保存的参数绘制毛边
  this.drawStampConfigs.roughEdge.roughEdgeParams.forEach(({ angle, size }) => {
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
        if (
          distanceFromCenter <= radius &&
          data[index] > 200 &&
          data[index + 1] < 50 &&
          data[index + 2] < 50
        ) {
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

     // 使用保存的参数应用做旧效果
  this.drawStampConfigs.agingEffect.agingEffectParams.forEach((param) => {
    const { x, y, noiseSize, noise, strongNoiseSize, strongNoise, fade, seed } = param
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
   * 绘制全尺寸标尺
   * @param width 画布宽度
   * @param height 画布高度
   */
  private drawFullRuler(ctx: CanvasRenderingContext2D, width: number, height: number) {
    if (!this.ruler.showFullRuler) return;

    ctx.save();
    ctx.strokeStyle = '#bbbbbb'; // 浅灰色
    ctx.lineWidth = 1; // 保持线宽不变
    ctx.setLineDash([5, 5]); // 保持虚线样式不变
  
    const step = this.mmToPixel * 5; // 5mm的像素长度
  
    // 绘制垂直线
    for (let x = RULER_WIDTH; x < width; x += step * this.scale) {
      ctx.beginPath();
      ctx.moveTo(x, RULER_HEIGHT);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  
    // 绘制水平线
    for (let y = RULER_HEIGHT; y < height; y += step * this.scale) {
      ctx.beginPath();
      ctx.moveTo(RULER_WIDTH, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  
    ctx.restore();
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
    if (!this.ruler.showRuler) return;

    const mmPerPixel = 1 / this.mmToPixel;
  
    ctx.save();
    ctx.fillStyle = 'lightgray';
    if (isHorizontal) {
      ctx.fillRect(0, 0, rulerLength, rulerSize);
    } else {
      ctx.fillRect(0, 0, rulerSize, rulerLength);
    }
  
    ctx.fillStyle = 'black';
    ctx.font = '10px Arial'; // 保持字体大小不变
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
  
    const step = this.mmToPixel; // 1mm的像素长度
    const maxMM = Math.ceil((rulerLength - rulerSize) * mmPerPixel / this.scale);
  
    for (let mm = 0; mm <= maxMM; mm++) {
      const pos = mm * step * this.scale + rulerSize;
  
      if (mm % 5 === 0) {
        ctx.beginPath();
        if (isHorizontal) {
          ctx.moveTo(pos, 0);
          ctx.lineTo(pos, rulerSize * 0.8);
        } else {
          ctx.moveTo(0, pos);
          ctx.lineTo(rulerSize * 0.8, pos);
        }
        ctx.lineWidth = 1; // 保持线宽不变
        ctx.stroke();
  
        ctx.save();
        if (isHorizontal) {
          ctx.fillText(mm.toString(), pos, rulerSize * 0.8);
        } else {
          ctx.translate(rulerSize * 0.8, pos);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(mm.toString(), 0, 0);
        }
        ctx.restore();
      } else {
        ctx.beginPath();
        if (isHorizontal) {
          ctx.moveTo(pos, 0);
          ctx.lineTo(pos, rulerSize * 0.6);
        } else {
          ctx.moveTo(0, pos);
          ctx.lineTo(rulerSize * 0.6, pos);
        }
        ctx.lineWidth = 0.5; // 保持线宽不变
        ctx.stroke();
      }
    }
  
    ctx.restore();
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
    // 清除整个画布
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 保存当前状态
    this.canvasCtx.save();

    // 应用缩放和平移
    this.canvasCtx.translate(this.offsetX, this.offsetY);
    this.canvasCtx.scale(this.scale, this.scale);

  // 计算画布中心点
  const x = this.canvas.width / 2 / this.scale;
  const y = this.canvas.height / 2 / this.scale;
  const mmToPixel = this.mmToPixel;
  const drawRadiusX = (this.drawStampConfigs.width - this.drawStampConfigs.borderWidth) / 2;
  const drawRadiusY = (this.drawStampConfigs.height - this.drawStampConfigs.borderWidth) / 2;
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
      this.drawStampConfigs.borderWidth * mmToPixel,
      this.drawStampConfigs.primaryColor,
      refreshSecurityPattern,
      refreshOld
    )

        // 恢复状态
        this.canvasCtx.restore();

         // 绘制标尺（如果需要）
    if (this.drawStampConfigs.shouldDrawRuler) {
      this.drawRuler(this.canvasCtx, this.canvas.width, RULER_HEIGHT, true);
      this.drawRuler(this.canvasCtx, this.canvas.height, RULER_HEIGHT, false);
      this.drawFullRuler(this.canvasCtx, this.canvas.width, this.canvas.height);
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

    if (this.drawStampConfigs.roughEdge.drawRoughEdge) {
      // 添加毛边效果
      this.addRoughEdge(offscreenCtx, centerX, centerY, radiusX, radiusY, borderWidth, refreshOld)
    }

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

    // if (this.drawStampConfigs.shouldDrawRuler) {
    //   // 绘制标尺
    //   this.drawRuler(ctx, this.canvas.width, RULER_HEIGHT, true)
    //   this.drawRuler(ctx, this.canvas.height, RULER_HEIGHT, false)
    //   // 将全尺寸标尺绘制到离屏canvas上
    //   this.drawFullRuler(ctx, this.canvas.width, this.canvas.height)
    // }
  }
}
