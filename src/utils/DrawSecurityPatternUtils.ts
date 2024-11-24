import { ISecurityPattern } from "../DrawStampTypes"

export class DrawSecurityPatternUtils {
    private mmToPixel = 10

    constructor(mmToPixel: number) {
        this.mmToPixel = mmToPixel
    }   

    drawSecurityPattern(
        ctx: CanvasRenderingContext2D,
        securityPattern: ISecurityPattern,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        forceRefresh: boolean
    ) {
        ctx.save()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = securityPattern.securityPatternWidth * this.mmToPixel
        ctx.globalCompositeOperation = 'destination-out'

        const angleRangeRad = (securityPattern.securityPatternAngleRange * Math.PI) / 180

        // 如果需要刷新或者参数数组为空,则重新生成参数
        if (forceRefresh || securityPattern.securityPatternParams.length === 0) {
            securityPattern.securityPatternParams = []
            for (let i = 0; i < securityPattern.securityPatternCount; i++) {
                const angle = Math.random() * Math.PI * 2
                const normalAngle = Math.atan2(radiusY * Math.cos(angle), radiusX * Math.sin(angle))
                const lineAngle = normalAngle + (Math.random() - 0.5) * angleRangeRad
                securityPattern.securityPatternParams.push({angle, lineAngle})
            }
        }

        // 使用保存的参数制纹路
        securityPattern.securityPatternParams.forEach(({angle, lineAngle}) => {
            const x = centerX + radiusX * Math.cos(angle)
            const y = centerY + radiusY * Math.sin(angle)

            const length = securityPattern.securityPatternLength * this.mmToPixel
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
}