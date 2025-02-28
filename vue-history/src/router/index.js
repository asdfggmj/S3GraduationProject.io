import { useCookies } from '@vueuse/integrations/useCookies'
import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import http from '@/http'

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

// 路由前置守卫，登录验证
router.beforeEach(async (to) => {
  //使用cookie对象
  const cookie = useCookies()
  //从cookie中获取token
  const token = cookie.get('token')

  //登录前进行的操作
  if (token == undefined && to.path != "/login") {
    ElMessage({
      message: '系统保护：请先登录后进行操作',
      type: 'error',
    })
    return '/login';
  }

  //登录后进行的操作
  if (token) {
    // await:必须等待数据结果结果返回再进行下一步请求    顶部配合async使用
    //根据用户编号获取用户对象，存储到pinia的用户数据单元
    await http.get('/user/getUser').then((asyncUserData) => {
      console.log(asyncUserData);

      //获取用户数据单元对象
      const userStore = useUserStore()
      //存至userStore中
      userStore.setUser(asyncUserData)
    })
  }
})
export default router
