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
              path: 'user',
              name: 'user',
              component: () => import('@/views/system/user.vue'),
              meta: { title: '医疗一体站管理系统--用户管理', breadcrumb: '用户管理' }
            },
            {
              path: 'role',
              name: 'role',
              component: () => import('@/views/system/role.vue'),
              meta: { title: '医疗一体站管理系统--角色管理', breadcrumb: '角色管理' }
            },
            {
              path: 'menu',
              name: 'menu',
              component: () => import('@/views/system/menu.vue'),
              meta: { title: '医疗一体站管理系统--菜单管理', breadcrumb: '菜单管理' }
            },
            {
              path: 'dept',
              name: 'ks',
              component: () => import('@/views/system/ks.vue'),
              meta: { title: '医疗一体站管理系统--科室管理', breadcrumb: '科室管理' }
            },
            {
              path: 'dict',
              name: 'dict',
              component: () => import('@/views/system/dict.vue'),
              meta: { title: '医疗一体站管理系统--字典管理', breadcrumb: '字典管理' },
            },
            {
              path: 'dictData',
              name: 'dictData',
              component: () => import('@/views/system/dictData.vue'),
              meta: { title: '医疗一体站管理系统--字典管理--字典数据', breadcrumb: '字典管理-字典数据' }
            },
            {
              path: 'notice',
              name: 'tzgg',
              component: () => import('@/views/system/tzgg.vue'),
              meta: { title: '医疗一体站管理系统--通知公告', breadcrumb: '通知公告' }
            },
            {
              path: 'log_login',
              name: 'loginLog',
              component: () => import('@/views/system/loginLog.vue'),
              meta: { title: '医疗一体站管理系统--登录日志管理', breadcrumb: '登录日志管理' }
            },
            {
              path: 'log_opt',
              name: 'czlog',
              component: () => import('@/views/system/czlog.vue'),
              meta: { title: '医疗一体站管理系统--操作日志管理', breadcrumb: '操作日志管理' }
            },
            {
              path: 'ins_fee',
              name: 'jcfysz',
              component: () => import('@/views/system/jcfysz.vue'),
              meta: { title: '医疗一体站管理系统--检查费用设置', breadcrumb: '检查费用设置' }
            },
            {
              path: 'reg_fee',
              name: 'ghfysz',
              component: () => import('@/views/system/ghfysz.vue'),
              meta: { title: '医疗一体站管理系统--挂号费用设置', breadcrumb: '挂号费用设置' }
            }
          ]
        },
        {
          path: '/check',
          meta: { title: '医疗一体站管理系统--检查', breadcrumb: '检查管理' },
          children: [
            {
              path: 'docheck',
              name: 'docheck',
              component: () => import('@/views/history/check.vue'),
              meta: { title: '医疗一体站管理系统--新开检查', breadcrumb: '新开检查' }
            },
            {
              path: 'checkresult',
              name: 'checkresult',
              component: () => import('@/views/history/check_result.vue'),
              meta: { title: '医疗一体站管理系统--检查结果录入', breadcrumb: '检查结果录入' }
            },
            {
              path: 'checklist',
              name: 'checklist',
              component: () => import('@/views/history/check_result.vue'),
              meta: { title: '医疗一体站管理系统--检查结果查询', breadcrumb: '检查结果查询' }
            },
          ]
        },
        {
          path: '/doctor',
          meta: { title: '医疗一体站管理系统--看病就诊', breadcrumb: '看病就诊' },
          children: [
            {
              path: 'registered',
              name: 'registered',
              component: () => import('@/views/history/doctor_registered.vue'),
              meta: { title: '医疗一体站管理系统--门诊挂号', breadcrumb: '门诊挂号' }
            },
            {
              path: 'registeredlist',
              name: 'registeredlist',
              component: () => import('@/views/history/doctor_registered_list.vue'),
              meta: { title: '医疗一体站管理系统--挂号列表', breadcrumb: '挂号列表' }
            },
            {
              path: 'newcare',
              name: 'newcare',
              component: () => import('@/views/history/new_care.vue'),
              meta: { title: '医疗一体站管理系统--新开就诊', breadcrumb: '新开就诊' }
            },
            {
              path: 'carelist',
              name: 'carelist',
              component: () => import('@/views/history/check_result.vue'),
              meta: { title: '医疗一体站管理系统--就诊列表', breadcrumb: '就诊列表' }
            },
            {
              path: 'myscheduling',
              name: 'myscheduling',
              component: () => import('@/views/history/check_result.vue'),
              meta: { title: '医疗一体站管理系统--我的排班', breadcrumb: '我的排班' }
            },
            {
              path: 'scheduling',
              name: 'scheduling',
              component: () => import('@/views/history/check_result.vue'),
              meta: { title: '医疗一体站管理系统--医生排班', breadcrumb: '医生排班' }
            },
            {
              path: 'patient',
              name: 'patient',
              component: () => import('@/views/history/check_result.vue'),
              meta: { title: '医疗一体站管理系统--患者库', breadcrumb: '患者库' }
            },
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
