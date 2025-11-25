<template>
  <div v-if="show" class="auth-dialog-overlay" @click.self="close">
    <div class="auth-dialog">
      <button class="close-btn" @click="close">&times;</button>
      
      <div class="auth-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          {{ t('auth.login') }}
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
        >
          {{ t('auth.register') }}
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label>{{ t('auth.email') }}</label>
          <input
            v-model="email"
            type="email"
            :placeholder="t('auth.emailPlaceholder')"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label>{{ t('auth.password') }}</label>
          <input
            v-model="password"
            type="password"
            :placeholder="t('auth.passwordPlaceholder')"
            required
            minlength="6"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading">{{ t('auth.loading') }}</span>
          <span v-else>{{ mode === 'login' ? t('auth.login') : t('auth.register') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../stores/userStore'
import { authApi } from '../utils/api'

const { t } = useI18n()
const userStore = useUserStore()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

watch(() => props.show, (newVal) => {
  if (newVal) {
    mode.value = 'login'
    email.value = ''
    password.value = ''
    error.value = ''
  }
})

const close = () => {
  emit('close')
}

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    let response
    if (mode.value === 'login') {
      response = await authApi.login(email.value, password.value)
    } else {
      response = await authApi.register(email.value, password.value)
    }

    if (response.success && response.data) {
      userStore.setAuth(response.data.token, response.data.user)
      emit('success')
      close()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.auth-dialog {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.auth-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #007bff;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
  font-weight: 500;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: #fee;
  color: #c33;
  border-radius: 4px;
  font-size: 0.9rem;
}

.submit-btn {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

