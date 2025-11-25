import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import DrawStampUtilsDemo from '../DrawStampUtilsDemo.vue'
import PrivacyPolicy from '../components/PrivacyPolicy.vue'
import TermsOfService from '../components/TermsOfService.vue'
import AboutUs from '../components/AboutUs.vue'
import ContactUs from '../components/ContactUs.vue'
import TemplateManage from '../components/TemplateManage.vue'
import PublicTemplates from '../components/PublicTemplates.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'DrawStamp - 在线电子印章制作工具' }
  },
  {
    path: '/maker',
    name: 'Maker',
    component: DrawStampUtilsDemo,
    meta: { title: '印章制作工具 - DrawStamp' }
  },
  {
    path: '/templates',
    name: 'Templates',
    component: TemplateManage,
    meta: { title: '我的模板 - DrawStamp', requiresAuth: true }
  },
  {
    path: '/public-templates',
    name: 'PublicTemplates',
    component: PublicTemplates,
    meta: { title: '公共模板 - DrawStamp' }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyPolicy,
    meta: { title: '隐私政策 - DrawStamp' }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsOfService,
    meta: { title: '服务条款 - DrawStamp' }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutUs,
    meta: { title: '关于我们 - DrawStamp' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactUs,
    meta: { title: '联系我们 - DrawStamp' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 设置页面标题和路由守卫
router.beforeEach((to, from, next) => {
  const title = to.meta?.title || 'DrawStamp'
  document.title = typeof title === 'string' ? title : 'DrawStamp'
  
  // 检查是否需要认证
  if (to.meta?.requiresAuth) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      // 未登录，重定向到首页
      next({ path: '/', replace: true })
      return
    }
  }
  
  next()
})

export default router 