<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DrawStampUtilsDemo from './DrawStampUtilsDemo.vue'

const { locale } = useI18n()
const currentLanguage = ref(locale.value)

const switchLanguage = (lang: string) => {
  locale.value = lang
  currentLanguage.value = lang
}
</script>

<template>
  <div class="language-switch">
    <button @click="switchLanguage('zh')" :class="{ active: currentLanguage === 'zh' }">中文</button>
    <button @click="switchLanguage('en')" :class="{ active: currentLanguage === 'en' }">English</button>
  </div>
  <DrawStampUtilsDemo />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.language-switch {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.language-switch button {
  padding: 8px 16px;
  margin-left: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.language-switch button.active {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}
</style>
