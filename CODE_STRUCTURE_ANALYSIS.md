# DrawStamp 代码结构分析

## 📋 目录结构

```
src/
├── DrawStampUtilsDemo.vue      # 主页面组件（印章制作工具入口）
├── DrawStampUtils.ts           # 核心绘制引擎（协调所有绘制模块）
├── DrawStampTypes.ts           # 类型定义文件
├── EditorControls.vue          # 编辑器控制面板组件
├── utils/                      # 绘制工具模块目录
│   ├── DrawBorderUtils.ts      # 边框绘制工具
│   ├── DrawCircleUtils.ts      # 圆形绘制工具
│   ├── DrawCodeUtils.ts        # 编码绘制工具
│   ├── DrawCompanyUtils.ts     # 公司名称绘制工具
│   ├── DrawImageCanvas.ts      # 图片绘制工具
│   ├── DrawRulerUtils.ts       # 标尺绘制工具
│   ├── DrawSecurityPatternUtils.ts  # 防伪纹路绘制工具
│   ├── DrawStampTypeUtils.ts   # 印章类型绘制工具
│   ├── DrawSvgUtils.ts         # SVG绘制工具
│   ├── DrawTaxNumberUtils.ts   # 税号绘制工具
│   ├── fontUtils.ts            # 字体工具
│   └── InitDrawStampConfigsUtils.ts  # 配置初始化工具
├── components/
│   ├── TemplateDialog.vue      # 模板弹窗组件
│   └── editor/                 # 编辑器子组件目录（当前为空）
└── assets/
    └── templates/              # 模板配置文件
```

## 🎯 核心模块分析

### 1. **核心绘制引擎**

#### `DrawStampUtils.ts` - 主绘制工具类
**职责**：
- 协调所有绘制模块
- 管理 Canvas 和离屏 Canvas
- 处理缩放、偏移、拖动等交互
- 提供统一的绘制接口

**主要属性**：
- `drawCompanyUtils` - 公司名称绘制工具（公开）
- `drawCodeUtils` - 编码绘制工具（公开）
- `drawStampTypeUtils` - 印章类型绘制工具（公开）
- `drawTaxNumberUtils` - 税号绘制工具（公开）
- `drawCircleUtils` - 圆形绘制工具（私有）
- `drawSvgUtils` - SVG绘制工具（私有）
- `drawRulerUtils` - 标尺绘制工具（私有）
- `drawSecurityPatternUtils` - 防伪纹路绘制工具（私有）
- `imageCanvas` - 图片绘制工具（私有）

**主要方法**：
- `refreshStamp()` - 刷新印章绘制
- `getDrawConfigs()` - 获取绘制配置
- `setDrawConfigs()` - 设置绘制配置
- `saveStampAsPNG()` - 保存为PNG
- `setDraggable()` - 设置拖动功能

### 2. **绘制工具模块（utils/）**

#### 文字绘制模块
- **`DrawCompanyUtils.ts`** - 绘制公司名称（椭圆/圆形文字）
  - 支持多行公司名称
  - 支持椭圆文字分布
  - 支持旋转方向控制
  - 提供 `getTextPaths()` 方法获取文字路径

- **`DrawCodeUtils.ts`** - 绘制印章编码
  - 底部编码文字绘制
  - 提供 `getTextPaths()` 方法

- **`DrawStampTypeUtils.ts`** - 绘制印章类型
  - 印章类型文字绘制（如"合同专用章"）
  - 支持多行显示
  - 提供 `getTextPaths()` 方法

- **`DrawTaxNumberUtils.ts`** - 绘制税号
  - 税号文字绘制
  - 提供 `getTextPaths()` 方法

#### 图形绘制模块
- **`DrawCircleUtils.ts`** - 绘制圆形/椭圆
  - 外圈圆
  - 内圈圆
  - 支持椭圆形状

- **`DrawBorderUtils.ts`** - 绘制边框
  - 外边框绘制

- **`DrawSvgUtils.ts`** - SVG绘制工具
  - 五角星绘制
  - 其他SVG图形

#### 效果模块
- **`DrawSecurityPatternUtils.ts`** - 防伪纹路
  - 随机防伪线条
  - 可配置数量、长度、宽度

- **`DrawImageCanvas.ts`** - 图片绘制
  - 支持自定义图片
  - 支持位置、大小调整

- **`DrawRulerUtils.ts`** - 标尺绘制
  - 辅助标尺显示
  - 网格线、十字线等

#### 工具模块
- **`fontUtils.ts`** - 字体工具
  - 获取系统字体列表
  - 字体相关工具函数

- **`InitDrawStampConfigsUtils.ts`** - 配置初始化
  - 初始化默认配置
  - 配置结构定义

### 3. **UI组件模块**

#### `DrawStampUtilsDemo.vue` - 主页面组件
**职责**：
- 页面布局和结构
- 协调 EditorControls 和 Canvas
- 处理模板加载
- 处理拖动功能
- 处理文字点击交互

**主要功能**：
- 法律提示弹窗
- Canvas 容器和工具栏
- 模板弹窗控制
- 文字路径检测和点击处理

#### `EditorControls.vue` - 编辑器控制面板
**职责**：
- 所有印章参数的UI控制
- 参数输入和编辑
- 参数变化监听
- 配置恢复和保存

**主要控制组**：
- 基本设置（尺寸、颜色、边框）
- 公司名称设置（多行支持）
- 印章类型设置（多行支持）
- 编码设置
- 税号设置
- 图片列表设置
- 五角星设置
- 防伪纹路设置
- 毛边效果设置
- 做旧效果设置
- 内圈圆形设置

#### `TemplateDialog.vue` - 模板弹窗组件
**职责**：
- 显示模板列表
- 模板选择和加载
- 模板保存和导入

### 4. **类型定义**

#### `DrawStampTypes.ts`
定义了所有配置类型：
- `IDrawStampConfig` - 主配置类型
- `ICompany` - 公司名称配置
- `ICode` - 编码配置
- `IStampType` - 印章类型配置
- `ITaxNumber` - 税号配置
- `IDrawStar` - 五角星配置
- `ISecurityPattern` - 防伪纹路配置
- `IRoughEdge` - 毛边效果配置
- `IAgingEffect` - 做旧效果配置
- `IDrawImage` - 图片配置
- `IInnerCircle` - 内圈圆配置

## 🔄 数据流和交互

### 绘制流程
```
EditorControls (用户输入)
    ↓
updateDrawStamp() 事件
    ↓
DrawStampUtils.setDrawConfigs()
    ↓
DrawStampUtils.refreshStamp()
    ↓
各个绘制工具模块执行绘制
    ↓
Canvas 显示结果
```

### 文字交互流程
```
Canvas 点击事件
    ↓
检测文字路径 (allTextPaths)
    ↓
根据文字类型 (company/code/stampType/taxNumber)
    ↓
EditorControls 滚动到对应设置组
```

## 📦 模块依赖关系

```
DrawStampUtilsDemo.vue
    ├── DrawStampUtils (核心引擎)
    ├── EditorControls.vue (控制面板)
    └── TemplateDialog.vue (模板弹窗)

DrawStampUtils
    ├── DrawCompanyUtils
    ├── DrawCodeUtils
    ├── DrawStampTypeUtils
    ├── DrawTaxNumberUtils
    ├── DrawCircleUtils
    ├── DrawSvgUtils
    ├── DrawRulerUtils
    ├── DrawSecurityPatternUtils
    ├── DrawImageCanvas
    └── InitDrawStampConfigsUtils

EditorControls.vue
    └── DrawStampUtils (通过 props 传入)
```

## 🎨 界面优化建议

基于当前模块结构，建议的界面优化方向：

### 1. **EditorControls 组件拆分**
可以将 EditorControls 拆分为更小的子组件：
- `BasicSettings.vue` - 基本设置
- `CompanySettings.vue` - 公司名称设置
- `StampTypeSettings.vue` - 印章类型设置
- `CodeSettings.vue` - 编码设置
- `TaxNumberSettings.vue` - 税号设置
- `ImageSettings.vue` - 图片设置
- `EffectSettings.vue` - 效果设置（防伪、做旧、毛边）
- `StarSettings.vue` - 五角星设置
- `CircleSettings.vue` - 圆形设置

### 2. **Canvas 交互增强**
- 文字点击高亮
- 拖拽调整位置
- 缩放控制
- 实时预览优化

### 3. **工具栏优化**
- 底部工具栏功能扩展
- 快捷操作按钮
- 撤销/重做功能

### 4. **模板管理**
- 模板分类
- 模板搜索
- 模板预览优化

## 🔍 关键文件说明

### 需要重点关注的模块：

1. **DrawStampUtils.ts** - 核心引擎，所有绘制逻辑的协调者
2. **EditorControls.vue** - UI控制面板，参数输入界面
3. **DrawStampUtilsDemo.vue** - 主页面，整体布局和交互
4. **utils/ 目录下的各个工具类** - 具体的绘制实现

### 公开接口的工具类（可用于界面交互）：
- `drawCompanyUtils` - 获取公司名称文字路径
- `drawCodeUtils` - 获取编码文字路径
- `drawStampTypeUtils` - 获取印章类型文字路径
- `drawTaxNumberUtils` - 获取税号文字路径

这些工具类都提供了 `getTextPaths()` 方法，用于获取文字路径信息，支持点击交互。

