<div style="background-color: #fff1f0; padding: 15px; border-left: 4px solid #ff4d4f; margin-bottom: 20px;">
<h2 style="color: #ff4d4f; margin-top: 0;">⚠️ 安全警告</h2>
<p style="color: #cf1322; font-weight: bold;">
本项目仅供学习和参考！严禁用于任何非法用途！
</p>
<p style="color: #cf1322;">
1. 本项目开源代码仅用于技术学习和交流。<br>
2. 使用本项目生成的任何图片请勿用于任何非法用途。<br>
3. 因违法使用本项目造成的任何法律责任和损失，需自行承担，与本项目无关。<br>
4. 如果使用本项目请遵守相关法律法规。<br>
</p>
</div>

![npm](https://img.shields.io/npm/v/drawstamputils.svg)

## 简介 

DrawStampUtils.js 是一个使用 TypeScript 制作电子印章的工具。该项目Demo使用 Vue 3，源码使用TypeScript，并通过 Vite 进行开发和构建。

🔍 **在线预览**：[点击这里体验在线印章制作工具](https://drawstamp.com)

📦 **提取印章工具**：为了减少大小，提取印章功能已移至独立项目 [extractstamp](https://github.com/xxss0903/extractstamp)

---

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

![Stamp Example](public/stamp_withimage.png)
![Stamp Example](public/stamp_multiline.png)
![Stamp Example](public/seal.png)
![Stamp Designer](public/designer.png)
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


## 模板功能

DrawStampUtils 支持将当前印章的所有配置保存为模板文件，以及从模板文件中加载配置。
![Stamp Template](public/stamp_template.png)

### 保存模板

可以通过以下方式将当前印章的所有配置保存为 JSON 格式的模板文件：

```typescript
// 获取当前配置
const drawConfigs = drawStampUtils.getDrawConfigs()
// 将配置转换为 JSON 字符串
const jsonStr = JSON.stringify(drawConfigs, null, 2)
```

模板文件包含了印章的所有配置信息，包括：
- 印章基本设置（尺寸、颜色等）
- 公司名称列表
- 印章类型列表
- 内圈圆形列表
- 五角星/图片设置
- 防伪纹路设置
- 毛边效果设置
- 做旧效果设置
等所有可配置项。

### 加载模板

可以通过以下方式从模板文件中加载配置：

```typescript
// 读取模板文件内容，自定义一个readTemplateFile方法读取json数据
const jsonStr = await readTemplateFile() // 从文件中读取 JSON 字符串
const configs = JSON.parse(jsonStr)

// 设置新的配置
drawStampUtils.setDrawConfigs(configs)
```

加载模板后，所有配置项会立即更新，印章会根据新的配置重新绘制。

### 模板用途

模板功能可用于：
1. 保存常用的印章样式，方便重复使用
2. 在不同项目间共享印章配置
3. 备份当前的印章设置
4. 快速切换不同的印章样式


## 配置选项<br>
详细的配置请参考Demo文件[`DrawStampUtilsDemo.vue`](src/DrawStampUtilsDemo.vue)中的配置方法

DrawStampUtils 支持以下配置选项：

以下是 DrawStampUtils 支持的主要配置选项及其功能：

| 配置选项 | 功能描述           |
|---------|----------------|
| ISecurityPattern | 控制防伪纹路的相关参数    |
| - openSecurityPattern | 是否启用防伪纹路       |
| - securityPatternWidth | 设置防伪纹路的宽度      |
| - securityPatternLength | 设置防伪纹路的长度      |
| - securityPatternCount | 设置防伪纹路的数量      |
| - securityPatternAngleRange | 设置防伪纹路的角度范围    |
| ICompany | 控制印章公司相关的参数    |
| - companyName | 设置公司名称         |
| - compression | 控制公司名称的压缩比例    |
| - borderOffset | 设置边框偏移量        |
| - textDistributionFactor | 控制文字分布因子       |
| - fontFamily | 设置字体           |
| - fontHeight | 设置字体高度         |
| - adjustEllipseText | 是否调整椭圆文字间距     |
| - adjustEllipseTextFactor | 椭圆文字间距调整因子     |
| ICode | 控制印章编码相关的参数    |
| - code | 设置编码内容         |
| - compression | 控制编码的压缩比例      |
| - fontHeight | 设置编码字体大小       |
| - fontFamily | 设置编码字体         |
| - borderOffset | 设置编码边框偏移量      |
| - fontWidth | 设置编码字体宽度       |
| - textDistributionFactor | 控制编码文字分布因子     |
| ITaxNumber | 控制税号相关的参数      |
| - code | 设置税号内容         |
| - compression | 控制税号的压缩比例      |
| - fontHeight | 设置税号字体大小       |
| - fontFamily | 设置税号字体         |
| - fontWidth | 设置税号字体宽度       |
| - letterSpacing | 控制税号字符间距       |
| - positionY | 设置税号文字垂直位置     |
| - totalWidth | 设置税号文字总宽度      |
| IAgingEffectParams | 控制做旧效果的相关参数    |
| - x | 设置做旧效果的 x 轴位置  |
| - y | 设置做旧效果的 y 轴位置  |
| - noiseSize | 控制噪声大小         |
| - noise | 控制噪声强度         |
| - strongNoiseSize | 控制强噪声大小        |
| - strongNoise | 控制强噪声强度        |
| - fade | 控制淡化强度         |
| - seed | 设置随机种子         |
| IRoughEdge | 控制印章边缘毛边效果的相关参数 |
| - shouldDrawRoughEdge | 是否绘制毛边效果       |
| - roughEdgeWidth | 设置毛边宽度         |
| - roughEdgeHeight | 设置毛边高度         |
| - roughEdgeProbability | 控制毛边出现的概率      |
| - roughEdgeShift | 设置毛边偏移量        |
| - roughEdgePoints | 设置毛边点的数量       |
| IStampType | 控制印章类型文字的相关参数  |
| - stampType | 设置印章类型文字       |
| - fontHeight | 设置印章类型文字高度     |
| - compression | 设置印章类型文字压缩比例   |
| - letterSpacing | 设置印章类型文字字符间距   |
| - positionY | 设置印章类型文字位置     |
| - fontWidth | 设置印章类型文字宽度     |
| - lineSpacing | 设置印章类型文字行间距    |
| IDrawStar | 控制五角星/图片相关的参数  |
| - drawStar | 是否绘制五角星/图片     |
| - useImage | 是否使用图片代替五角星    |
| - imageUrl | 图片的URL         |
| - imageWidth | 图片宽度(mm)       |
| - imageHeight | 图片高度(mm)       |
| - keepAspectRatio | 是否保持图片原始宽高比    |
| - starDiameter | 五角星直径（使用五角星时有效） |
| - starPositionY | 五角星/图片的垂直位置    |
| companyList | 公司名称列表，支持多行公司名称 |
| - companyName | 设置公司名称         |
| - compression | 控制公司名称的压缩比例    |
| - borderOffset | 设置边框偏移量        |
| - textDistributionFactor | 控制文字分布因子       |
| - fontFamily | 设置字体           |
| - fontHeight | 设置字体高度         |
| - fontWeight | 设置字体粗细         |
| - adjustEllipseText | 是否调整椭圆文字间距     |
| - adjustEllipseTextFactor | 椭圆文字间距调整因子     |
| stampTypeList | 印章类型列表，支持多行印章类型 |
| - stampType | 设置印章类型文字       |
| - fontHeight | 设置字体高度         |
| - fontFamily | 设置字体           |
| - compression | 设置压缩比例         |
| - letterSpacing | 设置字符间距         |
| - positionY | 设置垂直位置         |
| - fontWidth | 设置字体宽度         |
| - fontWeight | 设置字体粗细         |
| - lineSpacing | 设置行间距          |
| innerCircleList | 内圈圆形列表，支持多个内圈圆形 |
| - drawInnerCircle | 是否绘制该内圈圆形      |
| - innerCircleLineWidth | 设置内圈圆形的线宽      |
| - innerCircleLineRadiusX | 设置内圈圆形的水平半径    |
| - innerCircleLineRadiusY | 设置内圈圆形的垂直半径    |


完整示例
DrawStampUtilsDemo.vue中的方法作为参考


贡献

欢迎贡献代码！请先 fork 本仓库，然后提交 pull request。

许可证

本项目使用 Apache 许可证。

## 星
[![Stargazers over time](https://starchart.cc/xxss0903/drawstamputils.svg?variant=adaptive)](https://starchart.cc/xxss0903/drawstamputils)


## 更新日志
### v0.2.2 (2024-11-20)
- 优化: 主题颜色，可以单独设置印章的主色

### v0.2.1 (2024-11-16)
- 新增: 内圈圆形的列表，可以动态添加和删除内圈圆形
- 新增：印章模板的保存和加载功能
- 优化：毛边效果，使其能够在印章边缘外部显示
- 优化：界面布局，使用 tab 样式组织功能模块

### v0.2.0 (2024-11-15)
- 新增: 公司名称的数组，可单独控制每行公司名称的样式
- 新增：印章类型的数组，可单独控制每行印章类型的样式
- 新增：图片绘制功能，可以选择图片替代五角星，支持设置宽高和保持宽高比

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
