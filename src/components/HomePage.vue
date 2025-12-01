<template>
  <div class="homepage">
    <div class="page-container">
      <!-- QQ群通知横幅 -->
      <div v-if="showQqNotification" class="qq-notification-banner">
        <div class="qq-notification-content">
          <span class="qq-notification-icon">💬</span>
          <span class="qq-notification-text">{{ t('homepage.qqNotification.text') }}</span>
          <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=RheepCUCpXh6hT9CI-AAYtm0XATHVWQR&jump_from=webapi&authKey=V8c0e3oZG2Uku+JLVZA2bM7OaEUZaYHNVrO/bZojWoJVOlojVx/Gh6655XpfflRR"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="DrawStamp交流群" title="DrawStamp交流群"></a>
          <!-- <a
            class="qq-notification-link"
            :href="qqGroupUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            {{ t('homepage.qqNotification.joinButton') }}
          </a> -->
        </div>
        <button class="qq-notification-close" @click="dismissQqNotification" title="关闭">×</button>
      </div>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">{{ t('homepage.hero.title') }}</h1>
          <p class="hero-subtitle">{{ t('homepage.hero.subtitle') }}</p>
        </div>
        <!-- 主内容区域：三栏布局（抽离为独立组件，可复用） -->
        <StampWorkspace />
      </section>

      <!-- Stamp Types Section -->
      <section class="stamp-types-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.stampTypes.title') }}</h2>
          <div class="stamp-types-grid">
            <button
              v-for="option in templateOptions"
              :key="option.key"
              class="stamp-type-item"
              @click="selectTemplate(option.templateName)"
            >
              {{ t(`homepage.stampTypes.types.${option.labelKey}`) }}
            </button>
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="why-choose-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.whyChoose.title') }}</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🎨</div>
              <h3>{{ t('homepage.whyChoose.features.allInOne.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.allInOne.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⏰</div>
              <h3>{{ t('homepage.whyChoose.features.available247.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.available247.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <h3>{{ t('homepage.whyChoose.features.multiDevice.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.multiDevice.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🌍</div>
              <h3>{{ t('homepage.whyChoose.features.global.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.global.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💰</div>
              <h3>{{ t('homepage.whyChoose.features.free.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.free.description') }}</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💾</div>
              <h3>{{ t('homepage.whyChoose.features.download.title') }}</h3>
              <p>{{ t('homepage.whyChoose.features.download.description') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.howItWorks.title') }}</h2>
          <div class="steps-container">
            <div class="step-item">
              <div class="step-number">1</div>
              <h3>{{ t('homepage.howItWorks.steps.step1.title') }}</h3>
              <p>{{ t('homepage.howItWorks.steps.step1.description') }}</p>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <h3>{{ t('homepage.howItWorks.steps.step2.title') }}</h3>
              <p>{{ t('homepage.howItWorks.steps.step2.description') }}</p>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <h3>{{ t('homepage.howItWorks.steps.step3.title') }}</h3>
              <p>{{ t('homepage.howItWorks.steps.step3.description') }}</p>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <h3>{{ t('homepage.howItWorks.steps.step4.title') }}</h3>
              <p>{{ t('homepage.howItWorks.steps.step4.description') }}</p>
            </div>
          </div>
          <div class="cta-section">
            <router-link to="/maker" class="cta-button-large">{{ t('homepage.howItWorks.cta') }}</router-link>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.features.title') }}</h2>
          <div class="features-list">
            <div class="feature-card">
              <h3>{{ t('homepage.features.items.logo.title') }}</h3>
              <p>{{ t('homepage.features.items.logo.description') }}</p>
            </div>
            <div class="feature-card">
              <h3>{{ t('homepage.features.items.template.title') }}</h3>
              <p>{{ t('homepage.features.items.template.description') }}</p>
            </div>
            <div class="feature-card">
              <h3>{{ t('homepage.features.items.formats.title') }}</h3>
              <p>{{ t('homepage.features.items.formats.description') }}</p>
            </div>
            <div class="feature-card">
              <h3>{{ t('homepage.features.items.documents.title') }}</h3>
              <p>{{ t('homepage.features.items.documents.description') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="item-container">
          <h2 class="section-title">{{ t('homepage.faq.title') }}</h2>
          <div class="faq-list">
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q1.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q1.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q2.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q2.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q3.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q3.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q4.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q4.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q5.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q5.answer') }}</p>
            </div>
            <div class="faq-item">
              <h3>{{ t('homepage.faq.questions.q6.question') }}</h3>
              <p>{{ t('homepage.faq.questions.q6.answer') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Warning Section -->
      <!--    <section class="warning-section">-->
      <!--      <div class="container">-->
      <!--        <div class="warning-box">-->
      <!--          <h3>⚠️ 重要提示</h3>-->
      <!--          <p>本工具仅供学习和参考使用！严禁用于任何非法用途！</p>-->
      <!--          <p>使用本工具生成的任何图片请勿用于任何非法用途。因违法使用本工具造成的任何法律责任和损失，需自行承担。请遵守相关法律法规，合法使用本工具。</p>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </section>-->
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { templateApi, type Template } from '../utils/api'
import StampWorkspace from './editor/StampWorkspace.vue'

const { t } = useI18n()
const router = useRouter()

const templateMap = ref<Record<string, Template>>({})

// QQ群相关
const QQ_NOTIFICATION_DISMISSED_KEY = 'qq_notification_dismissed'
const showQqNotification = ref(false)

// 检查是否已关闭通知（组件初始化时执行一次）
const dismissed = localStorage.getItem(QQ_NOTIFICATION_DISMISSED_KEY)
showQqNotification.value = !dismissed

// 关闭通知
const dismissQqNotification = () => {
  showQqNotification.value = false
  localStorage.setItem(QQ_NOTIFICATION_DISMISSED_KEY, 'true')
}
const templateOptions = [
  { key: 'circle', labelKey: 'circle', templateName: '原型印章' },
  { key: 'ellipse', labelKey: 'ellipse', templateName: '心形印章' },
  { key: 'rectangle', labelKey: 'rectangle', templateName: '矩形印章' },
  { key: 'signature', labelKey: 'signature', templateName: '指纹印章' },
  { key: 'date', labelKey: 'date', templateName: '检验日期' },
  { key: 'text', labelKey: 'text', templateName: '作废印章' },
  { key: 'chinese', labelKey: 'chinese', templateName: '受控印章' },
]

const preloadTemplates = async () => {
  if (Object.keys(templateMap.value).length > 0) {
    return
  }

  try {
    const response = await templateApi.getTemplates()
    if (response.success && response.data) {
      response.data.forEach(template => {
        templateMap.value[template.name] = template
      })
    }
  } catch (error) {
    console.error('Failed to preload templates', error)
  }
}

const selectTemplate = async (templateName: string) => {
  if (!templateName) {
    router.push('/maker')
    return
  }

  if (!templateMap.value[templateName]) {
    await preloadTemplates()
  }

  const templateMeta = templateMap.value[templateName]
  if (!templateMeta) {
    router.push('/maker')
    return
  }

  try {
    const detail = await templateApi.getTemplate(templateMeta.id)
    if (detail.success && detail.data?.content) {
      localStorage.setItem('stamp_config', detail.data.content)
    }
    router.push('/maker')
  } catch (error) {
    console.error('Failed to load template', templateName, error)
    alert(t('templateManage.loadError'))
  }
}
</script>

<style scoped>
.homepage {
  width: 100%;
  padding: 2rem;
}

/* QQ群通知横幅 */
.qq-notification-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.qq-notification-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.qq-notification-icon {
  font-size: 1.5rem;
}

.qq-notification-text {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
}

.qq-notification-link {
  background: white;
  color: #4caf50;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.qq-notification-link:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.qq-notification-close {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  transition: all 0.2s ease;
  margin-left: 1rem;
  opacity: 0.8;
}

.qq-notification-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .qq-notification-banner {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  .qq-notification-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
  }

  .qq-notification-link {
    width: 100%;
    text-align: center;
  }

  .qq-notification-close {
    align-self: flex-end;
    margin-left: 0;
  }
}

/* Hero Section */
.hero-section {
  color: white;
  padding-bottom: 2rem;
  text-align: center;
}

.hero-content {
  padding: 2rem 0;
    /* max-width: 800px; */
    margin: 0 auto 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

