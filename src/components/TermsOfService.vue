<template>
  <div class="terms-of-service">
    <div class="page-container">
      <h1>服务条款</h1>
      <p class="last-updated">最后更新日期: {{ new Date().toLocaleDateString('zh-CN') }}</p>

      <section>
        <h2>1. 接受条款</h2>
        <p>欢迎使用DrawStamp（"服务"、"网站"）。通过访问和使用本网站，您同意遵守本服务条款。如果您不同意这些条款，请不要使用本服务。</p>
      </section>

      <section>
        <h2>2. 服务描述</h2>
        <p>DrawStamp是一个在线电子印章制作工具，允许用户创建和设计电子印章。本服务仅供合法用途使用。</p>
      </section>

      <section>
        <h2>3. 使用限制</h2>
        <p>您同意不会：</p>
        <ul>
          <li>将本服务用于任何非法目的或违反任何适用法律法规</li>
          <li>使用本服务创建用于欺诈、伪造或其他非法活动的印章</li>
          <li>尝试未经授权访问本服务的任何部分或相关系统</li>
          <li>干扰或破坏本服务的正常运行</li>
          <li>复制、修改、分发或创建本服务的衍生作品</li>
        </ul>
      </section>

      <section>
        <h2>4. 免责声明</h2>
        <p><strong>重要提示：</strong>本服务仅供学习和参考使用。严禁用于任何非法用途！</p>
        <ul>
          <li>使用本服务生成的任何图片请勿用于任何非法用途</li>
          <li>因违法使用本服务造成的任何法律责任和损失，需自行承担，与本服务无关</li>
          <li>使用本服务请遵守相关法律法规</li>
        </ul>
        <p>本服务按"现状"提供，不提供任何明示或暗示的保证。我们不保证服务将始终可用、无错误或安全。</p>
      </section>

      <section>
        <h2>5. 知识产权</h2>
        <p>本网站的所有内容，包括但不限于文本、图形、徽标、图标、图像、软件，均为我们的财产或已获得使用许可，受版权和其他知识产权法保护。</p>
        <p>您使用本服务创建的印章内容归您所有，但您授予我们使用这些内容来提供和改进服务的权利。</p>
      </section>

      <section>
        <h2>6. 用户内容</h2>
        <p>您对使用本服务创建的所有内容负责。您保证：</p>
        <ul>
          <li>您拥有或有权使用您创建的所有内容</li>
          <li>您的内容不侵犯任何第三方的权利</li>
          <li>您的内容不包含非法、有害或不当材料</li>
        </ul>
      </section>

      <section>
        <h2>7. 服务变更和终止</h2>
        <p>我们保留随时修改、暂停或终止服务的权利，恕不另行通知。我们不对因服务变更、暂停或终止而造成的任何损失承担责任。</p>
      </section>

      <section>
        <h2>8. 责任限制</h2>
        <p>在法律允许的最大范围内，我们不对因使用或无法使用本服务而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。</p>
      </section>

      <section>
        <h2>9. 赔偿</h2>
        <p>您同意赔偿并使我们免受因您违反本服务条款或使用本服务而产生的任何索赔、损失、责任和费用（包括律师费）。</p>
      </section>

      <section>
        <h2>10. 适用法律</h2>
        <p>本服务条款受适用法律管辖。任何争议应通过友好协商解决，协商不成的，应提交有管辖权的法院解决。</p>
      </section>

      <section>
        <h2>11. 条款修改</h2>
        <p>我们保留随时修改本服务条款的权利。修改后的条款将在本页面上发布，并更新"最后更新日期"。继续使用服务即表示您接受修改后的条款。</p>
      </section>

      <section>
        <h2>12. 联系我们</h2>
        <p>如果您对本服务条款有任何疑问，请通过我们的 <router-link to="/contact">联系我们</router-link> 页面与我们联系。</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.terms-of-service {
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
  .terms-of-service {
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

