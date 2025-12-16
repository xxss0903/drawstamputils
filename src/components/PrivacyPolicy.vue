<template>
  <div class="privacy-policy">
    <div class="page-container">
      <h1>隐私政策</h1>
      <p class="last-updated">最后更新日期: {{ new Date().toLocaleDateString('zh-CN') }}</p>

      <section>
        <h2>1. 信息收集</h2>
        <p>DrawStamp（"我们"、"我们的"）致力于保护您的隐私。本隐私政策说明了我们如何收集、使用和保护您的个人信息。</p>
        <p>我们收集以下类型的信息：</p>
        <ul>
          <li><strong>使用数据：</strong>当您访问我们的网站时，我们可能会自动收集某些信息，包括您的IP地址、浏览器类型、访问时间和页面浏览记录。</li>
          <li><strong>本地存储：</strong>为了提供更好的用户体验，我们使用浏览器本地存储来保存您的印章模板和设置。这些数据仅存储在您的设备上，我们无法访问。</li>
        </ul>
      </section>

      <section>
        <h2>2. 信息使用</h2>
        <p>我们使用收集的信息用于以下目的：</p>
        <ul>
          <li>提供和改进我们的服务</li>
          <li>分析网站使用情况以优化用户体验</li>
          <li>确保网站安全和防止欺诈</li>
        </ul>
      </section>

      <section>
        <h2>3. 第三方服务</h2>
        <p>我们的网站可能使用以下第三方服务：</p>
        <ul>
          <li><strong>Google AdSense：</strong>用于显示广告。Google可能会使用cookies来个性化广告内容。您可以访问 <a href="https://policies.google.com/privacy" target="_blank">Google隐私政策</a> 了解更多信息。</li>
          <li><strong>分析工具：</strong>我们可能使用网站分析工具来了解用户如何使用我们的网站。</li>
        </ul>
      </section>

      <section>
        <h2>4. Cookies</h2>
        <p>我们使用cookies来改善您的浏览体验。您可以通过浏览器设置管理或删除cookies。请注意，禁用cookies可能会影响网站的某些功能。</p>
      </section>

      <section>
        <h2>5. 数据安全</h2>
        <p>我们采取合理的安全措施来保护您的个人信息。所有数据处理都在您的浏览器本地完成，我们不会将您的印章数据上传到服务器。</p>
      </section>

      <section>
        <h2>6. 您的权利</h2>
        <p>您有权：</p>
        <ul>
          <li>访问我们持有的关于您的个人信息</li>
          <li>要求更正不准确的信息</li>
          <li>要求删除您的个人信息</li>
          <li>选择退出某些数据收集活动</li>
        </ul>
      </section>

      <section>
        <h2>7. 儿童隐私</h2>
        <p>我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。</p>
      </section>

      <section>
        <h2>8. 隐私政策变更</h2>
        <p>我们可能会不时更新本隐私政策。任何变更都会在本页面上发布，并更新"最后更新日期"。我们建议您定期查看本隐私政策以了解最新信息。</p>
      </section>

      <section>
        <h2>9. 联系我们</h2>
        <p>如果您对本隐私政策有任何疑问或 concerns，请通过我们的 <router-link to="/contact">联系我们</router-link> 页面与我们联系。</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.privacy-policy {
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
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.last-updated {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
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

ul {
  margin-left: 2rem;
  margin-bottom: 1rem;
}

li {
  line-height: 1.8;
  color: #555;
  margin-bottom: 0.5rem;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .privacy-policy {
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

