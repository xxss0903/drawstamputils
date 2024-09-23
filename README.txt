SealMaker.js

简介

SealMaker.js 是一个使用 JavaScript 制作电子印章的工具。该项目使用 Vue 3 和 TypeScript 构建，并通过 Vite 进行开发和构建。

目录

- 安装
- 使用
- SealMaker.ts 使用说明
- 贡献
- 许可证

安装

首先，克隆仓库并安装依赖：

```bash
git clone https://github.com/xxss0903/drawstamputils.git
cd sealmaker.js
npm install
```

使用

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

SealMaker.ts 使用说明

SealMaker.ts 是该项目的核心文件之一，用于生成电子印章。以下是如何使用 SealMaker.ts 的示例：

导入 SealMaker

首先，在你的 Vue 组件或其他 TypeScript 文件中导入 SealMaker：

```typescript
import { SealMaker } from './SealMaker';
```

创建印章

使用 SealMaker 创建一个新的印章：

```typescript
const sealMaker = new SealMaker({
  text: '公司印章',
  fontSize: 24,
  color: 'red',
  borderColor: 'black',
  borderWidth: 2,
  diameter: 100
});

const sealCanvas = sealMaker.createSeal();
document.body.appendChild(sealCanvas);
```

配置选项

SealMaker 支持以下配置选项：

- text (string): 印章上的文字。
- fontSize (number): 文字的字体大小。
- color (string): 文字的颜色。
- borderColor (string): 印章边框的颜色。
- borderWidth (number): 印章边框的宽度。
- diameter (number): 印章的直径。

完整示例

以下是一个完整的示例，展示如何在 Vue 组件中使用 SealMaker：

```typescript
<template>
  <div id="app">
    <canvas ref="sealCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { SealMaker } from './SealMaker';

export default defineComponent({
  name: 'App',
  setup() {
    const sealCanvas = ref<HTMLCanvasElement | null>(null);

    onMounted(() => {
      if (sealCanvas.value) {
        const sealMaker = new SealMaker({
          text: '公司印章',
          fontSize: 24,
          color: 'red',
          borderColor: 'black',
          borderWidth: 2,
          diameter: 100
        });

        const seal = sealMaker.createSeal();
        sealCanvas.value.getContext('2d')?.drawImage(seal, 0, 0);
      }
    });

    return {
      sealCanvas
    };
  }
});
</script>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
```

贡献

欢迎贡献代码！请先 fork 本仓库，然后提交 pull request。

许可证

本项目使用 MIT 许可证。