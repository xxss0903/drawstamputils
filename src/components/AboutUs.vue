<template>
  <div class="about-us">
    <div class="page-container">
      <h1>关于我们</h1>

      <section>
        <h2>什么是 DrawStamp？</h2>
        <p>DrawStamp 是一个专业的在线电子印章制作工具，旨在为用户提供简单、便捷的印章设计和制作服务。我们致力于通过先进的技术和友好的用户界面，让每个人都能轻松创建高质量的电子印章。</p>
      </section>

      <section>
        <h2>我们的使命</h2>
        <p>我们的使命是提供安全、可靠、易用的电子印章制作工具，同时确保用户了解并遵守相关法律法规。我们相信技术应该服务于合法和正当的目的。</p>
      </section>

      <section>
        <h2>主要功能</h2>
        <ul>
          <li><strong>自定义设计：</strong>支持多种印章样式和元素的自定义，包括公司名称、印章类型、编码、税号等</li>
          <li><strong>模板系统：</strong>提供多种预设模板，快速创建专业印章</li>
          <li><strong>高级效果：</strong>支持防伪纹路、做旧效果、毛边效果等多种视觉效果</li>
          <li><strong>本地处理：</strong>所有处理都在您的浏览器本地完成，保护您的隐私和数据安全</li>
          <li><strong>多语言支持：</strong>支持中文和英文界面</li>
        </ul>
      </section>

      <section>
        <h2>技术特点</h2>
        <p>DrawStamp 基于现代 Web 技术构建：</p>
        <ul>
          <li>使用 Vue 3 框架，提供流畅的用户体验</li>
          <li>TypeScript 开发，确保代码质量和可维护性</li>
          <li>Canvas API 实现高质量的印章渲染</li>
          <li>响应式设计，支持各种设备访问</li>
        </ul>
      </section>

      <section>
        <h2>使用说明</h2>
        <p>使用 DrawStamp 非常简单：</p>
        <ol>
          <li>在左侧控制面板中设置印章的基本参数（尺寸、颜色等）</li>
          <li>添加公司名称、印章类型、编码等信息</li>
          <li>根据需要调整字体、大小、位置等细节</li>
          <li>预览效果，满意后保存为 PNG 图片</li>
        </ol>
      </section>

      <section>
        <h2>重要提示</h2>
        <div class="warning-box">
          <p><strong>⚠️ 安全警告</strong></p>
          <p>本工具仅供学习和参考使用！严禁用于任何非法用途！</p>
          <ul>
            <li>使用本工具生成的任何图片请勿用于任何非法用途</li>
            <li>因违法使用本工具造成的任何法律责任和损失，需自行承担</li>
            <li>请遵守相关法律法规，合法使用本工具</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>开源项目</h2>
        <p>DrawStamp 是一个开源项目，欢迎贡献代码和建议。我们的目标是创建一个透明、可信赖的工具。</p>
      </section>

      <section>
        <h2>联系我们</h2>
        <p>如果您有任何问题、建议或反馈，请通过我们的 <router-link to="/contact">联系我们</router-link> 页面与我们取得联系。我们非常重视您的意见！</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about-us {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

section {
  margin-bottom: 2.5rem;
}

h2 {
  color: #444;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

p {
  line-height: 1.8;
  color: #555;
  margin-bottom: 1rem;
}

ul, ol {
  margin-left: 2rem;
  margin-bottom: 1rem;
}

li {
  line-height: 1.8;
  color: #555;
  margin-bottom: 0.5rem;
}

.warning-box {
  background-color: #fff1f0;
  border-left: 4px solid #ff4d4f;
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 4px;
}

.warning-box p {
  color: #cf1322;
  margin-bottom: 0.5rem;
}

.warning-box ul {
  margin-top: 1rem;
}

.warning-box li {
  color: #cf1322;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .about-us {
    padding: 1rem;
  }

  .container {
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>

