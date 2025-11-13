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
  background-color: #f2f2f2;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h1 {
  color: #343a40;
  margin-bottom: 2.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 3px solid #4caf50;
}

section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

section:last-of-type {
  border-bottom: none;
}

h2 {
  color: #343a40;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

h2::before {
  content: '';
  width: 4px;
  height: 24px;
  background: #4caf50;
  border-radius: 2px;
}

p {
  line-height: 1.8;
  color: #555;
  margin-bottom: 1rem;
  font-size: 1rem;
}

/* 美化无序列表 */
ul {
  margin-left: 0;
  margin-bottom: 1.5rem;
  padding-left: 0;
  list-style: none;
}

ul li {
  line-height: 1.8;
  color: #555;
  margin-bottom: 0.75rem;
  padding-left: 1.75rem;
  position: relative;
  font-size: 1rem;
  transition: color 0.2s ease;
}

ul li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  color: #4caf50;
  font-weight: bold;
  font-size: 1.1rem;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f5e9;
  border-radius: 50%;
  flex-shrink: 0;
}

ul li:hover {
  color: #343a40;
}

ul li strong {
  color: #343a40;
  font-weight: 600;
}

/* 美化有序列表 */
ol {
  margin-left: 0;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  counter-reset: step-counter;
  list-style: none;
}

ol li {
  line-height: 1.8;
  color: #555;
  margin-bottom: 1rem;
  padding-left: 2.5rem;
  position: relative;
  font-size: 1rem;
  counter-increment: step-counter;
  transition: color 0.2s ease;
}

ol li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

ol li:hover {
  color: #343a40;
}

.warning-box {
  background: linear-gradient(135deg, #fff1f0 0%, #ffeaea 100%);
  border-left: 4px solid #ff4d4f;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.1);
}

.warning-box p {
  color: #cf1322;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.warning-box p:first-child {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.warning-box ul {
  margin-top: 1rem;
  margin-bottom: 0;
}

.warning-box li {
  color: #cf1322;
  padding-left: 1.75rem;
}

.warning-box li::before {
  content: '⚠';
  background: #ffebee;
  color: #cf1322;
}

a {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  border-bottom: 1px solid transparent;
}

a:hover {
  color: #45a049;
  border-bottom-color: #45a049;
}

/* 功能列表特殊样式 */
section:nth-of-type(3) ul li,
section:nth-of-type(4) ul li {
  background: #f8f9fa;
  padding: 1rem 1rem 1rem 2.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

section:nth-of-type(3) ul li:hover,
section:nth-of-type(4) ul li:hover {
  background: #e8f5e9;
  border-color: #4caf50;
  transform: translateX(4px);
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}

section:nth-of-type(3) ul li::before,
section:nth-of-type(4) ul li::before {
  left: 0.75rem;
  top: 1rem;
}

@media (max-width: 768px) {
  .about-us {
    padding: 1rem;
  }

  .page-container {
    padding: 1.5rem;
    border-radius: 8px;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  section {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }

  ul li,
  ol li {
    padding-left: 1.5rem;
    font-size: 0.95rem;
  }

  ol li {
    padding-left: 2rem;
  }

  ol li::before {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.85rem;
  }

  section:nth-of-type(3) ul li,
  section:nth-of-type(4) ul li {
    padding: 0.75rem 0.75rem 0.75rem 2rem;
  }

  section:nth-of-type(3) ul li::before,
  section:nth-of-type(4) ul li::before {
    left: 0.5rem;
    top: 0.75rem;
  }
}
</style>

