<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">最好的在线电子印章制作工具 - DrawStamp</h1>
        <p class="hero-subtitle">DrawStamp 是现代企业和个人使用的专业解决方案！我们的印章设计工具将帮助您为任何场合创建独特的印章产品！</p>
        <router-link to="/maker" class="cta-button">
          <span>开始制作印章</span>
        </router-link>
      </div>
    </section>

    <!-- Stamp Types Section -->
    <section class="stamp-types-section">
      <div class="container">
        <h2 class="section-title">支持多种印章类型</h2>
        <div class="stamp-types-grid">
          <div class="stamp-type-item">公司印章</div>
          <div class="stamp-type-item">合同专用章</div>
          <div class="stamp-type-item">财务专用章</div>
          <div class="stamp-type-item">发票专用章</div>
          <div class="stamp-type-item">银行印章</div>
          <div class="stamp-type-item">医疗印章</div>
          <div class="stamp-type-item">商务印章</div>
          <div class="stamp-type-item">公证印章</div>
          <div class="stamp-type-item">签名印章</div>
          <div class="stamp-type-item">日期印章</div>
          <div class="stamp-type-item">文字印章</div>
          <div class="stamp-type-item">圆形印章</div>
          <div class="stamp-type-item">方形印章</div>
          <div class="stamp-type-item">矩形印章</div>
          <div class="stamp-type-item">中文印章</div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-choose-section">
      <div class="container">
        <h2 class="section-title">为什么选择 DrawStamp？</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h3>所有印章类型一站式服务</h3>
            <p>支持各种类型的印章制作，满足不同需求</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⏰</div>
            <h3>24/7 随时制作</h3>
            <p>不受时间限制，随时随地创建您的印章</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <h3>多设备兼容</h3>
            <p>支持电脑、平板和手机，随时随地使用</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌍</div>
            <h3>全球可用</h3>
            <p>无论您在世界任何角落，都可以使用我们的服务</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💰</div>
            <h3>完全免费</h3>
            <p>无需设计师，无需等待，完全免费使用</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💾</div>
            <h3>随时下载</h3>
            <p>下载您的设计结果，可无限次使用</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="container">
        <h2 class="section-title">只需几个步骤，即可完成您的印章！</h2>
        <div class="steps-container">
          <div class="step-item">
            <div class="step-number">1</div>
            <h3>选择形状和尺寸</h3>
            <p>选择圆形、矩形或三角形，设置您需要的尺寸</p>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <h3>添加文本和内容</h3>
            <p>输入公司名称、印章类型、编码、税号等信息</p>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <h3>自定义设计</h3>
            <p>调整字体、颜色、大小、位置等细节参数</p>
          </div>
          <div class="step-item">
            <div class="step-number">4</div>
            <h3>下载使用</h3>
            <p>以 PNG 格式下载，可直接使用或添加到文档中</p>
          </div>
        </div>
        <div class="cta-section">
          <router-link to="/maker" class="cta-button-large">免费试用</router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">我们的印章制作工具让您能够快速：</h2>
        <div class="features-list">
          <div class="feature-card">
            <h3>创建带 Logo 的印章</h3>
            <p>支持上传自定义 Logo 或从图库中选择</p>
          </div>
          <div class="feature-card">
            <h3>选择模板快速制作</h3>
            <p>提供多种预设模板，只需输入数据即可</p>
          </div>
          <div class="feature-card">
            <h3>多种格式下载</h3>
            <p>支持 PNG、SVG 等格式，满足不同需求</p>
          </div>
          <div class="feature-card">
            <h3>添加到文档</h3>
            <p>可直接添加到 PDF 或 Word 文档中</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-list">
          <div class="faq-item">
            <h3>如何在线制作自己的印章？</h3>
            <p>访问 DrawStamp，使用我们的图形编辑器即可创建。直观的界面简单易用。创建完成后，您可以下载设计文件。</p>
          </div>
          <div class="faq-item">
            <h3>制作印章需要多长时间？</h3>
            <p>使用我们的在线工具，只需几分钟即可完成印章设计。整个过程简单快捷，无需等待。</p>
          </div>
          <div class="faq-item">
            <h3>可以自定义印章吗？</h3>
            <p>当然可以！您可以完全自定义印章的所有元素，包括文本、字体、颜色、大小、位置等。</p>
          </div>
          <div class="faq-item">
            <h3>支持哪些文件格式？</h3>
            <p>我们支持 PNG 格式下载，保证印章的清晰度和质量。所有处理都在本地完成，保护您的隐私。</p>
          </div>
          <div class="faq-item">
            <h3>可以在手机上使用吗？</h3>
            <p>可以！DrawStamp 支持所有智能设备，包括电脑、平板和手机，只要有网络连接即可使用。</p>
          </div>
          <div class="faq-item">
            <h3>使用是免费的吗？</h3>
            <p>是的，DrawStamp 完全免费使用。您可以随时创建、编辑和下载您的印章设计。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Warning Section -->
    <section class="warning-section">
      <div class="container">
        <div class="warning-box">
          <h3>⚠️ 重要提示</h3>
          <p>本工具仅供学习和参考使用！严禁用于任何非法用途！</p>
          <p>使用本工具生成的任何图片请勿用于任何非法用途。因违法使用本工具造成的任何法律责任和损失，需自行承担。请遵守相关法律法规，合法使用本工具。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.homepage {
  width: 100%;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.95;
}

.cta-button {
  display: inline-block;
  background: #fff;
  color: #667eea;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Section Title */
.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
}

/* Stamp Types Section */
.stamp-types-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.stamp-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.stamp-type-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  color: #555;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stamp-type-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Why Choose Section */
.why-choose-section {
  padding: 4rem 0;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-item {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: transform 0.2s;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
}

/* How It Works Section */
.how-it-works-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.step-item {
  text-align: center;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.step-number {
  width: 60px;
  height: 60px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.step-item h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.step-item p {
  color: #666;
  line-height: 1.6;
}

.cta-section {
  text-align: center;
}

.cta-button-large {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2rem;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.cta-button-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* Features Section */
.features-section {
  padding: 4rem 0;
  background: white;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* FAQ Section */
.faq-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.faq-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.faq-item p {
  color: #666;
  line-height: 1.6;
}

/* Warning Section */
.warning-section {
  padding: 3rem 0;
  background: #fff1f0;
}

.warning-box {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #ff4d4f;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-box h3 {
  color: #ff4d4f;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.warning-box p {
  color: #cf1322;
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .stamp-types-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .features-grid,
  .steps-container,
  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>

