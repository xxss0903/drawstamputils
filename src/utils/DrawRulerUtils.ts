import { IShowRuler } from "../DrawStampTypes";

export class DrawRulerUtils {
    private mmToPixel = 10

    constructor(mmToPixel: number) {
        this.mmToPixel = mmToPixel
    }   

    /**
     * 绘制标尺
     * @param rulerLength 标尺长度
     * @param rulerSize 标尺宽度
     * @param isHorizontal 是否为水平标尺
     */
    drawRuler(
        ctx: CanvasRenderingContext2D,
        ruler: IShowRuler,
        scale: number,
        rulerLength: number,
        rulerSize: number,
        isHorizontal: boolean
    ) {
        if (!ruler.showRuler) return;

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
        const maxMM = Math.ceil((rulerLength - rulerSize) * mmPerPixel / scale);

        for (let mm = 0; mm <= maxMM; mm++) {
            const pos = mm * step * scale + rulerSize;

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
     * 绘制全标尺
     */
    showCrossDashLine(ctx: CanvasRenderingContext2D, ruler: IShowRuler, scale: number, rulerWidth: number, rulerHeight: number, width: number, height: number) {
        if (!ruler.showDashLine) return;

        ctx.save();
        ctx.strokeStyle = '#bbbbbb'; // 浅灰色
        ctx.lineWidth = 1; // 保持线宽不变
        ctx.setLineDash([5, 5]); // 保持虚线样式不变

        const step = this.mmToPixel * 5; // 5mm的像素长度

        // 绘制垂直线
        for (let x = rulerWidth; x < width; x += step * scale) {
            ctx.beginPath();
            ctx.moveTo(x, rulerHeight);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // 绘制水平线
        for (let y = rulerHeight; y < height; y += step * scale) {
            ctx.beginPath();
            ctx.moveTo(rulerWidth, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.restore();
    }
}