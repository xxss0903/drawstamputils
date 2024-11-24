import { ICompany } from "../DrawStampTypes"

export class DrawCompanyUtils {
    private mmToPixel = 10

    constructor(mmToPixel: number) {
        this.mmToPixel = mmToPixel
    }

    // 添加绘制公司列表的方法
    drawCompanyList(
        ctx: CanvasRenderingContext2D,
        companyList: ICompany[],
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        color: string
        ) {
            companyList.forEach((company) => {
                this.drawCompanyName(ctx, company, centerX, centerY, radiusX, radiusY, company.color || color)
            })
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
    drawCompanyName(
        ctx: CanvasRenderingContext2D,
        company: ICompany,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        color: string
      ) {
        const fontSize = company.fontHeight * this.mmToPixel
        const fontWeight = company.fontWeight || 'normal'
        ctx.save()
        ctx.font = `${fontWeight} ${fontSize}px ${company.fontFamily}`
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
      
        const characters = company.companyName.split('')
        const characterCount = characters.length
        const borderOffset = company.borderOffset * this.mmToPixel
      
        // 计算总角度和每个字符的角度
        const totalAngle = Math.PI * (0.5 + characterCount / (company.textDistributionFactor * 4))
        const anglePerChar = totalAngle / characterCount
      
        // 根据旋转方向设置起始角度和角度增量
        const direction = company.rotateDirection === 'clockwise' ? -1 : 1
        const startAngle = (company.startAngle ? company.startAngle : 0) + (company.rotateDirection === 'clockwise' ? 
          Math.PI - totalAngle / 2 : 
          Math.PI + (Math.PI - totalAngle) / 2)
      
        // 计算字符位置时考虑椭圆文字调整
        if (company.adjustEllipseText) {
          const halfCharCount = (characterCount + 1) / 2
      
          characters.forEach((char, index) => {
            // 计算当前字符的角度，包含椭圆调整
            const halfIndex = halfCharCount - index - 1
            const adjustmentFactor = Math.pow(halfIndex / halfCharCount, 2)
            const additionalAngle = adjustmentFactor * anglePerChar * company.adjustEllipseTextFactor
            const indexValue = index - halfCharCount
            const factor = indexValue / Math.abs(indexValue)
      
            let angle = startAngle + direction * anglePerChar * (index + 0.5)
            angle += additionalAngle * factor
      
            // 计算字符位置
            const x = centerX + Math.cos(angle) * (radiusX - fontSize - borderOffset)
            const y = centerY + Math.sin(angle) * (radiusY - fontSize - borderOffset)
      
            ctx.save()
            ctx.translate(x, y)
            // 根据旋转方向调整文字旋转角度
            ctx.rotate(angle + (company.rotateDirection === 'clockwise' ? -Math.PI/2 : Math.PI/2))
            ctx.scale(company.compression, 1)
            ctx.fillText(char, 0, 0)
            ctx.restore()
          })
        } else {
          // 不调整椭圆文字时的正常绘制
          characters.forEach((char, index) => {
            const angle = startAngle + direction * anglePerChar * (index + 0.5)
            
            const x = centerX + Math.cos(angle) * (radiusX - fontSize - borderOffset)
            const y = centerY + Math.sin(angle) * (radiusY - fontSize - borderOffset)
      
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(angle + (company.rotateDirection === 'clockwise' ? -Math.PI/2 : Math.PI/2))
            ctx.scale(company.compression, 1)
            ctx.fillText(char, 0, 0)
            ctx.restore()
          })
        }
      
        ctx.restore()
      }

}