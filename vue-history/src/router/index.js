import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
      meta: { title: '医疗一体站管理系统--登录' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { title: '医疗一体站管理系统--登录' }
    },
    {
      path: '/index',
      name: 'index',
      meta: { title: '医疗一体站管理系统--主页' },
      component: () => import('../views/Index.vue')
    }

  ],
})

export default router
