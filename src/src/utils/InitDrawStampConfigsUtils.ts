import { IAgingEffect, ICode, ICompany, IDrawImage, IDrawStampConfig, IDrawStar, IInnerCircle, IRoughEdge, ISecurityPattern, IShowRuler, IStampType, ITaxNumber } from "../DrawStampTypes";

export class InitDrawStampConfigsUtils {

    // 默认主色
    private primaryColor: string = 'blue'

    private ruler: IShowRuler = {
        showRuler: true,
        showFullRuler: true,
        showCrossLine: true,
        showDashLine: true,
        showSideRuler: true,
        showCurrentPositionText: true
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
        textDistributionFactor: 5,
        fontFamily: 'SimSun',
        fontHeight: 4.2,
        fontWeight: 'normal',
        shape: 'ellipse',
        adjustEllipseText: false,
        adjustEllipseTextFactor: 0.5,
        startAngle: 0,
        rotateDirection: "counterclockwise"
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
        stampType: '印章类型',
        fontHeight: 4.6,
        fontFamily: 'Arial',
        fontWidth: 3,
        compression: 0.75,
        letterSpacing: 0,
        positionY: -3,
        fontWeight: 'normal',
        lineSpacing: 2 // 新增：行间距
    }
    // 做旧效果
    private agingEffect: IAgingEffect = {
        applyAging: false,
        agingIntensity: 50,
        agingEffectParams: []
    }
    // 外圈圆
    private outBorder: IInnerCircle = {
        drawInnerCircle: true,
        innerCircleLineWidth: 1,
        innerCircleLineRadiusX: 20,
        innerCircleLineRadiusY: 15
    }
    // 内圈圆
    private innerCircle: IInnerCircle = {
        drawInnerCircle: true,
        innerCircleLineWidth: 0.5,
        innerCircleLineRadiusX: 16,
        innerCircleLineRadiusY: 12
    }
    // 比外圈细的稍微内
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
        roughEdgeShift: 8,
        roughEdgePoints: 360
    }
    // 印章类型列表，用于多行的文字显示，且可以设置每行的高度和文字宽度，默认添加一个发票专用章类型
    private stampTypeList: IStampType[] = [
        {
            stampType: '印章类型',
            fontHeight: 4.6,
            fontFamily: 'Arial',
            fontWidth: 3,
            compression: 0.75,
            letterSpacing: 0,
            positionY: -3,
            fontWeight: 'normal',
            lineSpacing: 2 // 新增：行间距
        }
    ]
    // 添加公司列表属性
    private companyList: ICompany[] = [
        {
            companyName: '绘制印章有限责任公司',
            compression: 1,
            borderOffset: 1,
            textDistributionFactor: 3, // 将默认值从20改为10
            fontFamily: 'SimSun',
            fontHeight: 4.2,
            fontWeight: 'normal',
            shape: 'ellipse',
            adjustEllipseText: true,
            adjustEllipseTextFactor: 0.5,
            startAngle: 0,
            rotateDirection: "counterclockwise"
        }
    ]
    // 内圈圆列表
    private innerCircleList: IInnerCircle[] = [];
    // 图片列表
    private imageList: IDrawImage[] = [];
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
        innerCircle: this.innerCircle,
        outThinCircle: this.outThinCircle,
        openManualAging: false,
        stampTypeList: this.stampTypeList,
        companyList: this.companyList,
        innerCircleList: this.innerCircleList,
        imageList: this.imageList,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        mmToPixel: 0,
        outBorder: this.outBorder
    }


    initDrawStampConfigs() {
        return this.drawStampConfigs
    }
}