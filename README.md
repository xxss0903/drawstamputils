DrawStampUtils.js

<font color="red">本项目仅供学习参考，勿做违法用途，后果自负</font>


## 简介

DrawStampUtils.js 是一个使用 TypeScript 制作电子印章的工具。该项目Demo使用 Vue 3，源码使用TypeScript，并通过 Vite 进行开发和构建。<br>
[预览地址](https://xxss0903.github.io/drawstamputils/)

## 目录

- 安装
- 使用
- DrawStampUtils.ts 使用说明
- 贡献
- 许可证

## 安装

在已有项目使用`drawstamputils`，使用如下命令安装：  

```bash
npm install drawstamputils
```

如果要查看示例程序，可以如下方式：
```bash
git clone https://github.com/xxss0903/drawstamputils.git
cd drawstamputils
npm install
```

## 使用

开发

启动开发服务器：

```bash
npm run dev
```

构建

构建项目：

```bash
npm run build
```

预览

预览构建结果：

```bash
npm run preview
```
效果展示

以下是使用 DrawStampUtils.js 生成的电子印章示例：

![Stamp Example](public/seal.png)
![Stamp Designer](public/roughedge.png)
![Stamp Designer](public/designer.png)
![Stamp Designer](public/stamp_break.png)
DrawStampUtils.ts 使用说明

DrawStampUtils.ts 是该项目的核心文件之一，用于生成电子印章。以下是如何使用 DrawStampUtils.ts 的示例：
## 提取印章
提取印章放到了新的库:[extractstamp](https://github.com/xxss0903/extractstamp) <br>
效果更好，颜色提取更好<br>
![Stamp Designer](public/stamp_origin.png)
![Stamp Designer](public/stamp_extract.png)

```typescript
// 将imgFile替换为你的图片文件，#ff0000替换为你想要的目标颜色，#ff0000替换为你想要的目标颜色
drawStampUtils.extractStampWithFile(imgFile, '#ff0000', '#ff0000')
```

## 创建印章

使用 DrawStampUtils 创建一个新的印章：

```typescript
// 将canvasRef替换为你的canvas元素，MM_PER_PIXEL替换为你的毫米换算像素，根据需要修改
const drawStampUtils = new DrawStampUtils(canvasRef, MM_PER_PIXEL)
drawStampUtils.refreshStamp()
```

## 配置选项<br>
详细的配置请参考Demo文件[`DrawStampUtilsDemo.vue`](src/DrawStampUtilsDemo.vue)中的配置方法

DrawStampUtils 支持以下配置选项：

以下是 DrawStampUtils 支持的主要配置选项及其功能：

| 配置选项 | 功能描述 |
|---------|--------|
| ISecurityPattern | 控制防伪纹路的相关参数 |
| - openSecurityPattern | 是否启用防伪纹路 |
| - securityPatternWidth | 设置防伪纹路的宽度 |
| - securityPatternLength | 设置防伪纹路的长度 |
| - securityPatternCount | 设置防伪纹路的数量 |
| - securityPatternAngleRange | 设置防伪纹路的角度范围 |
| ICompany | 控制印章公司相关的参数 |
| - companyName | 设置公司名称 |
| - compression | 控制公司名称的压缩比例 |
| - borderOffset | 设置边框偏移量 |
| - textDistributionFactor | 控制文字分布因子 |
| - fontFamily | 设置字体 |
| - fontHeight | 设置字体高度 |
| - adjustEllipseText | 是否调整椭圆文字间距 |
| - adjustEllipseTextFactor | 椭圆文字间距调整因子 |
| ICode | 控制印章编码相关的参数 |
| - code | 设置编码内容 |
| - compression | 控制编码的压缩比例 |
| - fontHeight | 设置编码字体大小 |
| - fontFamily | 设置编码字体 |
| - borderOffset | 设置编码边框偏移量 |
| - fontWidth | 设置编码字体宽度 |
| - textDistributionFactor | 控制编码文字分布因子 |
| ITaxNumber | 控制税号相关的参数 |
| - code | 设置税号内容 |
| - compression | 控制税号的压缩比例 |
| - fontHeight | 设置税号字体大小 |
| - fontFamily | 设置税号字体 |
| - fontWidth | 设置税号字体宽度 |
| - letterSpacing | 控制税号字符间距 |
| - positionY | 设置税号文字垂直位置 |
| - totalWidth | 设置税号文字总宽度 |
| IAgingEffectParams | 控制做旧效果的相关参数 |
| - x | 设置做旧效果的 x 轴位置 |
| - y | 设置做旧效果的 y 轴位置 |
| - noiseSize | 控制噪声大小 |
| - noise | 控制噪声强度 |
| - strongNoiseSize | 控制强噪声大小 |
| - strongNoise | 控制强噪声强度 |
| - fade | 控制淡化强度 |
| - seed | 设置随机种子 |
| IRoughEdge | 控制印章边缘毛边效果的相关参数 |
| - shouldDrawRoughEdge | 是否绘制毛边效果 |
| - roughEdgeWidth | 设置毛边宽度 |
| - roughEdgeHeight | 设置毛边高度 |
| - roughEdgeProbability | 控制毛边出现的概率 |
| - roughEdgeShift | 设置毛边偏移量 |
| - roughEdgePoints | 设置毛边点的数量 |
| IStampType | 控制印章类型文字的相关参数 |
| - stampType | 设置印章类型文字 |
| - fontHeight | 设置印章类型文字高度 |
| - compression | 设置印章类型文字压缩比例 |
| - letterSpacing | 设置印章类型文字字符间距 |
| - positionY | 设置印章类型文字位置 |
| - fontWidth | 设置印章类型文字宽度 |
| - lineSpacing | 设置印章类型文字行间距 |


以下是毛边效果的详细配置参数：



## 支持作者

如果您觉得这个项目对您有帮助，欢迎给作者买杯咖啡！您的支持将激励我们继续改进和维护这个项目。

<div style="display: flex; justify-content: center;">
  <img src="public/alipay.png" alt="支付宝支付" style="width: 30%; margin-right: 10px;">
  <img src="public/wechatpay.png" alt="微信支付" style="width: 30%;">
</div>

感谢您的支持！

完整示例
DrawStampUtilsDemo.vue中的方法作为参考


贡献

欢迎贡献代码！请先 fork 本仓库，然后提交 pull request。

许可证

本项目使用 Apache 许可证。

## 星
[![Stargazers over time](https://starchart.cc/xxss0903/drawstamputils.svg?variant=adaptive)](https://starchart.cc/xxss0903/drawstamputils)


## 更新日志
### v0.1.0 (2024-09-27)
- 新增: 公司名称字体修改
- 移除：提取印章移到新的库 [extractstamp](https://github.com/xxss0903/extractstamp)

### v0.0.9 (2024-09-27)
- 新增: 印章类型文字行间距功能
- 新增: 公司名称椭圆时候的间距调整
- 新增: 印章类型文字行间距功能
- 新增: 提取印章，区分椭圆印章和圆形印章，并裁剪印章

### v0.0.8 (2024-09-27)
- 新增: 字体粗细功能
- 新增：印章边缘的毛边效果


### v0.0.6 (2024-09-27)
- 新增: 提取印章功能，将文字和印章混合的提取印章出来

### v0.0.5 (2024-09-26)
- 新增: 手动老化效果功能，印章老化透明效果
- 新增: 防伪纹路功能
- 优化: 印章渲染性能
- 修复: 某些字体渲染不正确的问题
