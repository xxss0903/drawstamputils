import { reactive, computed } from 'vue'

export interface User {
  id: string
  email: string
}

interface UserState {
  user: User | null
  token: string | null
  loading: boolean
}

const userState = reactive<UserState>({
  user: null,
  token: null,
  loading: false,
})

export function useUserStore() {
  // 从 localStorage 恢复登录状态
  const initAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      userState.token = savedToken
      try {
        userState.user = JSON.parse(savedUser)
      } catch (e) {
        console.error('Failed to parse saved user', e)
        clearAuth()
      }
    }
  }

  // 设置认证信息
  const setAuth = (token: string, user: User) => {
    userState.token = token
    userState.user = user
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
  }

  // 清除认证信息
  const clearAuth = () => {
    userState.token = null
    userState.user = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  // 设置加载状态
  const setLoading = (loading: boolean) => {
    userState.loading = loading
  }

  // 计算属性：是否已登录
  const isAuthenticated = computed(() => {
    return userState.token !== null && userState.user !== null
  })

  return {
    state: userState,
    user: computed(() => userState.user),
    token: computed(() => userState.token),
    loading: computed(() => userState.loading),
    isAuthenticated,
    initAuth,
    setAuth,
    clearAuth,
    setLoading,
  }
}

