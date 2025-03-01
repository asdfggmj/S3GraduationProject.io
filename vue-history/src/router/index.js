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
      path: '/home',
      name: 'index',
      meta: { title: '医疗一体站管理系统--主页', breadcrumb: '首页' },
      component: () => import('@/views/Index.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/Home.vue'),
          meta: { title: '医疗一体站管理系统--主页' }
        },
        {
          path: '/system',
          meta: { breadcrumb: '系统管理' },
          children: [
            {
              path: '/system/user',
              name: 'user',
              component: () => import('@/views/system/user.vue'),
              meta: { title: '医疗一体站管理系统--用户管理', breadcrumb: '用户管理' }
            },
            {
              path: '/system/role',
              name: 'role',
              component: () => import('@/views/system/role.vue'),
              meta: { title: '医疗一体站管理系统--角色管理', breadcrumb: '角色管理' }
            },
            {
              path: '/system/menu',
              name: 'menu',
              component: () => import('@/views/system/menu.vue'),
              meta: { title: '医疗一体站管理系统--菜单管理', breadcrumb: '菜单管理' }
            },
            {
              path: '/system/dept',
              name: 'ks',
              component: () => import('@/views/system/ks.vue'),
              meta: { title: '医疗一体站管理系统--科室管理', breadcrumb: '科室管理' }
            },
            {
              path: '/system/dict',
              name: 'dict',
              component: () => import('@/views/system/dict.vue'),
              meta: { title: '医疗一体站管理系统--字典管理', breadcrumb: '字典管理' }
            },
            {
              path: '/system/notice',
              name: 'tzgg',
              component: () => import('@/views/system/tzgg.vue'),
              meta: { title: '医疗一体站管理系统--通知公告', breadcrumb: '通知公告' }
            },
            {
              path: '/system/log_login',
              name: 'loginLog',
              component: () => import('@/views/system/loginLog.vue'),
              meta: { title: '医疗一体站管理系统--登录日志管理', breadcrumb: '登录日志管理' }
            },
            {
              path: '/system/log_opt',
              name: 'czlog',
              component: () => import('@/views/system/czlog.vue'),
              meta: { title: '医疗一体站管理系统--操作日志管理', breadcrumb: '操作日志管理' }
            },
            {
              path: '/system/ins_fee',
              name: 'jcfysz',
              component: () => import('@/views/system/jcfysz.vue'),
              meta: { title: '医疗一体站管理系统--检查费用设置', breadcrumb: '检查费用设置' }
            },
            {
              path: '/system/reg_fee',
              name: 'ghfysz',
              component: () => import('@/views/system/ghfysz.vue'),
              meta: { title: '医疗一体站管理系统--挂号费用设置', breadcrumb: '挂号费用设置' }
            }
          ]
        }

      ]
    }

  ],
})

// 路由前置守卫，登录验证
router.beforeEach(async (to) => {
  //使用cookie对象
  const cookie = useCookies()
  //从cookie中获取token
  const token = cookie.get('Authorization')

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
      //获取用户数据单元对象
      const userStore = useUserStore()
      //存至userStore中
      userStore.setUser(asyncUserData)
    })
  }
})
export default router
