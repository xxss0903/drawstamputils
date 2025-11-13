<template>
  <div class="contact-us">
    <div class="page-container">
      <h1>联系我们</h1>
      <p class="intro">我们很乐意听到您的声音！如果您有任何问题、建议或反馈，请通过以下方式与我们联系。</p>

      <section>
        <h2>联系方式</h2>
        <div class="contact-info">
          <div class="contact-item">
            <h3>📧 邮箱</h3>
            <p>由于隐私保护，我们暂不提供公开邮箱。您可以通过以下方式联系我们：</p>
            <ul>
              <li>在 GitHub 上提交 Issue 或 Pull Request</li>
              <li>通过社交媒体平台联系我们</li>
            </ul>
          </div>

          <div class="contact-item">
            <h3>🐛 问题反馈</h3>
            <p>如果您在使用过程中遇到任何问题或发现 bug，欢迎在项目仓库中提交 Issue。</p>
          </div>

          <div class="contact-item">
            <h3>💡 功能建议</h3>
            <p>我们欢迎您的功能建议和改进意见。您的反馈对我们非常重要！</p>
          </div>

          <div class="contact-item">
            <h3>🤝 贡献代码</h3>
            <p>DrawStamp 是一个开源项目，我们欢迎社区贡献。如果您想参与开发，请查看项目的 GitHub 仓库。</p>
          </div>
        </div>
      </section>

      <section>
        <h2>常见问题</h2>
        <div class="faq">
          <div class="faq-item">
            <h3>Q: 使用 DrawStamp 制作的印章可以用于商业用途吗？</h3>
            <p>A: 可以，但请确保您有使用该印章的合法权利，并遵守相关法律法规。严禁用于任何非法用途。</p>
          </div>

          <div class="faq-item">
            <h3>Q: 我的印章数据会被上传到服务器吗？</h3>
            <p>A: 不会。所有处理都在您的浏览器本地完成，我们不会收集或存储您的印章数据。</p>
          </div>

          <div class="faq-item">
            <h3>Q: 这个工具是免费的吗？</h3>
            <p>A: 是的，DrawStamp 是完全免费使用的。</p>
          </div>

          <div class="faq-item">
            <h3>Q: 如何保存我制作的印章？</h3>
            <p>A: 点击"保存印章"按钮，印章会以 PNG 格式下载到您的设备。</p>
          </div>

          <div class="faq-item">
            <h3>Q: 支持哪些浏览器？</h3>
            <p>A: 支持所有现代浏览器，包括 Chrome、Firefox、Safari、Edge 等。</p>
          </div>
        </div>
      </section>

      <section>
        <h2>反馈表单</h2>
        <p>您也可以填写以下表单向我们发送反馈（注意：此表单为演示用途，实际提交功能需要后端支持）：</p>
        <div class="feedback-form">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">姓名（可选）</label>
              <input type="text" id="name" v-model="form.name" />
            </div>
            <div class="form-group">
              <label for="email">邮箱（可选）</label>
              <input type="email" id="email" v-model="form.email" />
            </div>
            <div class="form-group">
              <label for="subject">主题</label>
              <select id="subject" v-model="form.subject">
                <option value="question">问题咨询</option>
                <option value="bug">Bug 报告</option>
                <option value="suggestion">功能建议</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="form-group">
              <label for="message">消息内容</label>
              <textarea id="message" v-model="form.message" rows="5" required></textarea>
            </div>
            <button type="submit" class="submit-btn">发送反馈</button>
          </form>
          <div v-if="submitStatus" class="submit-status" :class="submitStatus">
            <p v-if="submitStatus === 'success'">感谢您的反馈！我们会认真考虑您的建议。</p>
            <p v-else-if="submitStatus === 'error'">提交失败，请稍后重试。</p>
          </div>
        </div>
      </section>

      <section>
        <h2>相关链接</h2>
        <ul class="links">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/about">关于我们</router-link></li>
          <li><router-link to="/privacy">隐私政策</router-link></li>
          <li><router-link to="/terms">服务条款</router-link></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: 'question',
  message: ''
})

const submitStatus = ref<'success' | 'error' | null>(null)

const handleSubmit = () => {
  // 这里只是演示，实际需要后端支持
  console.log('Form submitted:', form.value)
  submitStatus.value = 'success'
  setTimeout(() => {
    submitStatus.value = null
    form.value = {
      name: '',
      email: '',
      subject: 'question',
      message: ''
    }
  }, 3000)
}
</script>

<style scoped>
.contact-us {
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
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 3px solid #4caf50;
}

.intro {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.8;
  text-align: center;
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

.contact-info {
  display: grid;
  gap: 1.5rem;
}

.contact-item {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.contact-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.contact-item h3 {
  color: #343a40;
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.contact-item p {
  color: #555;
  line-height: 1.8;
  margin-bottom: 0.75rem;
}

/* 美化联系信息中的列表 */
.contact-item ul {
  margin-left: 0;
  margin-top: 0.75rem;
  margin-bottom: 0;
  padding-left: 0;
  list-style: none;
}

.contact-item li {
  color: #555;
  line-height: 1.8;
  margin-bottom: 0.5rem;
  padding-left: 1.75rem;
  position: relative;
  transition: color 0.2s ease;
}

.contact-item li::before {
  content: '→';
  position: absolute;
  left: 0;
  top: 0;
  color: #4caf50;
  font-weight: bold;
  font-size: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-item li:hover {
  color: #343a40;
}

.faq {
  display: grid;
  gap: 1.5rem;
}

.faq-item {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.faq-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateX(4px);
}

.faq-item h3 {
  color: #343a40;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.faq-item p {
  color: #555;
  line-height: 1.8;
  margin: 0;
}

.feedback-form {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.submit-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.submit-btn:hover {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-status {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
}

.submit-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.submit-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* 美化相关链接列表 */
.links {
  list-style: none;
  margin-left: 0;
  margin-bottom: 0;
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.links li {
  margin: 0;
  padding: 0;
}

.links li::before {
  display: none;
}

.links a {
  color: #4caf50;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.links a:hover {
  background: #e8f5e9;
  border-color: #4caf50;
  color: #45a049;
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.15);
}

@media (max-width: 768px) {
  .contact-us {
    padding: 1rem;
  }

  .page-container {
    padding: 1.5rem;
    border-radius: 8px;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  section {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }

  .contact-item {
    padding: 1.25rem;
  }

  .contact-item li {
    padding-left: 1.5rem;
    font-size: 0.95rem;
  }

  .faq-item {
    padding: 1.25rem;
  }

  .links {
    flex-direction: column;
  }

  .links a {
    width: 100%;
    text-align: center;
  }
}
</style>

