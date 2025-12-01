<template>
  <div class="contact-us">
    <div class="page-container">
      <h1>{{ t('contact.title') }}</h1>
      <p class="intro">{{ t('contact.intro') }}</p>

      <section>
        <h2>{{ t('contact.methods.title') }}</h2>
          <div class="contact-info">
          <div class="contact-item">
            <h3>{{ t('contact.methods.qqGroup.title') }}</h3>
            <p>{{ t('contact.methods.qqGroup.description') }}</p>
            <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=RheepCUCpXh6hT9CI-AAYtm0XATHVWQR&jump_from=webapi&authKey=V8c0e3oZG2Uku+JLVZA2bM7OaEUZaYHNVrO/bZojWoJVOlojVx/Gh6655XpfflRR"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="DrawStamp交流群" title="DrawStamp交流群"></a>
            <p class="qq-group-tip">{{ t('contact.methods.qqGroup.tip') }}</p>
          </div>

          <div class="contact-item">
            <h3>{{ t('contact.methods.email.title') }}</h3>
            <p>{{ t('contact.methods.email.description') }}</p>
            <a
              class="email-link"
              href="mailto:xxss0903@gmail.com?subject=DrawStamp反馈&body=请在此填写您的问题...">
              {{ t('contact.methods.email.sendEmail') }}
            </a>
            <p class="email-tip">{{ t('contact.methods.email.tip') }}</p>
          </div>

          <div class="contact-item">
            <h3>{{ t('contact.methods.bugReport.title') }}</h3>
            <p>{{ t('contact.methods.bugReport.description') }}</p>
          </div>

          <div class="contact-item">
            <h3>{{ t('contact.methods.suggestion.title') }}</h3>
            <p>{{ t('contact.methods.suggestion.description') }}</p>
          </div>

          <div class="contact-item">
            <h3>{{ t('contact.methods.contribute.title') }}</h3>
            <p>{{ t('contact.methods.contribute.description') }}</p>
          </div>
        </div>
      </section>

      <section>
        <h2>{{ t('contact.faq.title') }}</h2>
        <div class="faq">
          <div class="faq-item">
            <h3>Q: {{ t('contact.faq.questions.q1.question') }}</h3>
            <p>A: {{ t('contact.faq.questions.q1.answer') }}</p>
          </div>

          <div class="faq-item">
            <h3>Q: {{ t('contact.faq.questions.q2.question') }}</h3>
            <p>A: {{ t('contact.faq.questions.q2.answer') }}</p>
          </div>

          <div class="faq-item">
            <h3>Q: {{ t('contact.faq.questions.q3.question') }}</h3>
            <p>A: {{ t('contact.faq.questions.q3.answer') }}</p>
          </div>

          <div class="faq-item">
            <h3>Q: {{ t('contact.faq.questions.q4.question') }}</h3>
            <p>A: {{ t('contact.faq.questions.q4.answer') }}</p>
          </div>

          <div class="faq-item">
            <h3>Q: {{ t('contact.faq.questions.q5.question') }}</h3>
            <p>A: {{ t('contact.faq.questions.q5.answer') }}</p>
          </div>
        </div>
      </section>

      <section>
        <h2>{{ t('contact.form.title') }}</h2>
        <p>{{ t('contact.form.description') }}</p>
        <div class="feedback-form">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">{{ t('contact.form.name') }}</label>
              <input type="text" id="name" v-model="form.name" />
            </div>
            <div class="form-group">
              <label for="email">{{ t('contact.form.email') }}</label>
              <input type="email" id="email" v-model="form.email" />
            </div>
            <div class="form-group">
              <label for="subject">{{ t('contact.form.subject') }}</label>
              <select id="subject" v-model="form.subject">
                <option value="question">{{ t('contact.form.subjects.question') }}</option>
                <option value="bug">{{ t('contact.form.subjects.bug') }}</option>
                <option value="suggestion">{{ t('contact.form.subjects.suggestion') }}</option>
                <option value="other">{{ t('contact.form.subjects.other') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="message">{{ t('contact.form.message') }}</label>
              <textarea id="message" v-model="form.message" rows="5" required></textarea>
            </div>
            <button type="submit" class="submit-btn">{{ t('contact.form.submit') }}</button>
          </form>
          <div v-if="submitStatus" class="submit-status" :class="submitStatus">
            <p v-if="submitStatus === 'success'">{{ t('contact.form.status.success') }}</p>
            <p v-else-if="submitStatus === 'error'">{{ t('contact.form.status.error') }}</p>
          </div>
        </div>
      </section>

      <section>
        <h2>{{ t('contact.links.title') }}</h2>
        <ul class="links">
          <li><router-link to="/">{{ t('menu.home') }}</router-link></li>
          <li><router-link to="/about">{{ t('navigation.about') }}</router-link></li>
          <li><router-link to="/privacy">{{ t('navigation.footer.privacyPolicy') }}</router-link></li>
          <li><router-link to="/terms">{{ t('navigation.footer.termsOfService') }}</router-link></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const QQ_GROUP_NUMBER = '644574395'
const qqGroupUrl = `https://qm.qq.com/q/${QQ_GROUP_NUMBER}`

const form = ref({
  name: '',
  email: '',
  subject: 'question',
  message: ''
})

const submitStatus = ref<'success' | 'error' | null>(null)

const subjectLabels = computed(() => ({
  question: t('contact.form.subjects.question'),
  bug: t('contact.form.subjects.bug'),
  suggestion: t('contact.form.subjects.suggestion'),
  other: t('contact.form.subjects.other')
}))

const COMPANY_EMAIL = 'xxss0903@gmail.com'

const handleSubmit = () => {
  if (!form.value.message.trim()) {
    submitStatus.value = 'error'
    return
  }

  const subjectText = subjectLabels.value[form.value.subject] || t('contact.form.subjects.other')
  const subject = encodeURIComponent(`DrawStamp ${subjectText}`)
  const bodyLines = [
    `姓名：${form.value.name || '未填写'}`,
    `联系邮箱：${form.value.email || '未填写'}`,
    `主题：${subjectText}`,
    '',
    '反馈内容：',
    form.value.message
  ]
  const body = encodeURIComponent(bodyLines.join('\n'))

  try {
    window.location.href = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`
    submitStatus.value = 'success'
  } catch (error) {
    console.error('生成邮件链接失败', error)
    submitStatus.value = 'error'
  }
}
</script>

<style scoped>


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

.qq-group-link {
  display: inline-block;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
  margin-top: 0.5rem;
}

.qq-group-link:hover {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
  text-decoration: none;
  color: white;
}

.qq-group-tip {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
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

