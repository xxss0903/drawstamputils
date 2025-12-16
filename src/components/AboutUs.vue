<template>
  <div class="about-us">
    <div class="page-container">
      <h1>{{ t('about.title') }}</h1>

      <section>
        <h2>{{ t('about.whatIs.title') }}</h2>
        <p>{{ t('about.whatIs.description') }}</p>
      </section>

      <section>
        <h2>{{ t('about.mission.title') }}</h2>
        <p>{{ t('about.mission.description') }}</p>
      </section>

      <section>
        <h2>{{ t('about.features.title') }}</h2>
        <ul>
          <li><strong>{{ t('about.features.items.customDesign') }}</strong></li>
          <li><strong>{{ t('about.features.items.templateSystem') }}</strong></li>
          <li><strong>{{ t('about.features.items.advancedEffects') }}</strong></li>
          <li><strong>{{ t('about.features.items.localProcessing') }}</strong></li>
          <li><strong>{{ t('about.features.items.multilingual') }}</strong></li>
        </ul>
      </section>

      <section>
        <h2>{{ t('about.technology.title') }}</h2>
        <p>{{ t('about.technology.description') }}</p>
        <ul>
          <li>{{ t('about.technology.items.vue') }}</li>
          <li>{{ t('about.technology.items.typescript') }}</li>
          <li>{{ t('about.technology.items.canvas') }}</li>
          <li>{{ t('about.technology.items.responsive') }}</li>
        </ul>
      </section>

      <section>
        <h2>{{ t('about.usage.title') }}</h2>
        <p>{{ t('about.usage.description') }}</p>
        <ol>
          <li>{{ t('about.usage.steps.step1') }}</li>
          <li>{{ t('about.usage.steps.step2') }}</li>
          <li>{{ t('about.usage.steps.step3') }}</li>
          <li>{{ t('about.usage.steps.step4') }}</li>
        </ol>
      </section>

      <section>
        <h2>{{ t('about.warning.title') }}</h2>
        <div class="warning-box">
          <p><strong>{{ t('about.warning.securityWarning') }}</strong></p>
          <p>{{ t('about.warning.notice') }}</p>
          <ul>
            <li>{{ t('about.warning.items.item1') }}</li>
            <li>{{ t('about.warning.items.item2') }}</li>
            <li>{{ t('about.warning.items.item3') }}</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>{{ t('about.openSource.title') }}</h2>
        <p>{{ t('about.openSource.description') }}</p>
      </section>

      <section>
        <h2>{{ t('about.contact.title') }}</h2>
        <p>{{ t('about.contact.description', { link: '' }) }} <router-link to="/contact">{{ t('about.contact.linkText') }}</router-link>。</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.about-us {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f2f2f2;
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

