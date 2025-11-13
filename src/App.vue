<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { locale, t } = useI18n()
const route = useRoute()
const router = useRouter()
const currentLanguage = ref(locale.value)

const switchLanguage = (lang: string) => {
  locale.value = lang
  currentLanguage.value = lang
}

const isHomePage = computed(() => route.path === '/')
</script>

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">
          <span>DrawStamp</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/maker" class="nav-link">印章制作</router-link>
          <router-link to="/about" class="nav-link">关于我们</router-link>
          <router-link to="/contact" class="nav-link">联系我们</router-link>
        </div>
        <div class="nav-right">
          <div class="language-switch">
            <button @click="switchLanguage('zh')" :class="{ active: currentLanguage === 'zh' }">中文</button>
            <button @click="switchLanguage('en')" :class="{ active: currentLanguage === 'en' }">English</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>DrawStamp</h3>
          <p>专业的在线电子印章制作工具</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/maker">印章制作</router-link></li>
            <li><router-link to="/about">关于我们</router-link></li>
            <li><router-link to="/contact">联系我们</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>法律信息</h4>
          <ul>
            <li><router-link to="/privacy">隐私政策</router-link></li>
            <li><router-link to="/terms">服务条款</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>重要提示</h4>
          <p class="footer-warning">⚠️ 本工具仅供学习和参考使用！严禁用于任何非法用途！</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} DrawStamp. 保留所有权利。</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.logo:hover {
  color: #007bff;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  padding: 0.5rem 0;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #007bff;
}

.nav-right {
  display: flex;
  align-items: center;
}

.language-switch {
  display: flex;
  gap: 0.5rem;
}

.language-switch button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.language-switch button:hover {
  background: #f0f0f0;
}

.language-switch button.active {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.main-content {
  flex: 1;
}

.footer {
  background: #2c3e50;
  color: #ecf0f1;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  color: #fff;
}

.footer-section h4 {
  margin-bottom: 1rem;
  color: #ecf0f1;
  font-size: 1rem;
}

.footer-section p {
  line-height: 1.6;
  color: #bdc3c7;
  margin-bottom: 0.5rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #fff;
}

.footer-warning {
  font-size: 0.9rem;
  color: #e74c3c !important;
  font-weight: 500;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding: 1.5rem 2rem;
  text-align: center;
  color: #95a5a6;
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-links {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .footer-content {
    grid-template-columns: 1fr;
    padding: 2rem 1rem 1rem;
  }
}
</style>
