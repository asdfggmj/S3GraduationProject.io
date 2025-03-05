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
      component: () => import('@/views/Login.vue'),
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
              component: () => import('@/views/system_user.vue'),
              meta: { title: '医疗一体站管理系统--用户管理', breadcrumb: '用户管理' }
            },
            {
              path: 'role',
              name: 'role',
              component: () => import('@/views/system_role.vue'),
              meta: { title: '医疗一体站管理系统--角色管理', breadcrumb: '角色管理' }
            },
            {
              path: 'menu',
              name: 'menu',
              component: () => import('@/views/system_menu.vue'),
              meta: { title: '医疗一体站管理系统--菜单管理', breadcrumb: '菜单管理' }
            },
            {
              path: 'dept',
              name: 'ks',
              component: () => import('@/views/system_dept.vue'),
              meta: { title: '医疗一体站管理系统--科室管理', breadcrumb: '科室管理' }
            },
            {
              path: 'dict',
              name: 'dict',
              component: () => import('@/views/system_dict.vue'),
              meta: { title: '医疗一体站管理系统--字典管理', breadcrumb: '字典管理' },
            },
            {
              path: 'dictData',
              name: 'dictData',
              component: () => import('@/views/system_dict_data.vue'),
              meta: { title: '医疗一体站管理系统--字典管理--字典数据', breadcrumb: '字典管理-字典数据' }
            },
            {
              path: 'notice',
              name: 'tzgg',
              component: () => import('@/views/system_notice.vue'),
              meta: { title: '医疗一体站管理系统--通知公告', breadcrumb: '通知公告' }
            },
            {
              path: 'log_login',
              name: 'loginLog',
              component: () => import('@/views/system_loginLog.vue'),
              meta: { title: '医疗一体站管理系统--登录日志管理', breadcrumb: '登录日志管理' }
            },
            {
              path: 'log_opt',
              name: 'czlog',
              component: () => import('@/views/system_log_opt.vue'),
              meta: { title: '医疗一体站管理系统--操作日志管理', breadcrumb: '操作日志管理' }
            },
            {
              path: 'ins_fee',
              name: 'jcfysz',
              component: () => import('@/views/system_ins_fee.vue'),
              meta: { title: '医疗一体站管理系统--检查费用设置', breadcrumb: '检查费用设置' }
            },
            {
              path: 'reg_fee',
              name: 'ghfysz',
              component: () => import('@/views/system_reg_fee.vue'),
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
              component: () => import('@/views/check.vue'),
              meta: { title: '医疗一体站管理系统--新开检查', breadcrumb: '新开检查' }
            },
            {
              path: 'checkresult',
              name: 'checkresult',
              component: () => import('@/views/check_result.vue'),
              meta: { title: '医疗一体站管理系统--检查结果录入', breadcrumb: '检查结果录入' }
            },
            {
              path: 'checklist',
              name: 'checklist',
              component: () => import('@/views/check_list.vue'),
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
              component: () => import('@/views/doctor_registered.vue'),
              meta: { title: '医疗一体站管理系统--门诊挂号', breadcrumb: '门诊挂号' }
            },
            {
              path: 'registeredlist',
              name: 'registeredlist',
              component: () => import('@/views/doctor_registered_list.vue'),
              meta: { title: '医疗一体站管理系统--挂号列表', breadcrumb: '挂号列表' }
            },
            {
              path: 'newcare',
              name: 'newcare',
              component: () => import('@/views/doctor_newcare.vue'),
              meta: { title: '医疗一体站管理系统--新开就诊', breadcrumb: '新开就诊' }
            },
            {
              path: 'carelist',
              name: 'carelist',
              component: () => import('@/views/check_result.vue'),
              meta: { title: '医疗一体站管理系统--就诊列表', breadcrumb: '就诊列表' }
            },
            {
              path: 'myscheduling',
              name: 'myscheduling',
              component: () => import('@/views/doctor_myscheduling.vue'),
              meta: { title: '医疗一体站管理系统--我的排班', breadcrumb: '我的排班' }
            },
            {
              path: 'scheduling',
              name: 'scheduling',
              component: () => import('@/views/doctor_scheduling.vue'),
              meta: { title: '医疗一体站管理系统--医生排班', breadcrumb: '医生排班' }
            },
            {
              path: 'patient',
              name: 'patient',
              component: () => import('@/views/history_patient.vue'),
              meta: { title: '医疗一体站管理系统--患者库', breadcrumb: '患者库' }
            },
          ]
        },
        // 药品进销存
        {
          path: '/stock',
          meta: { title: '医疗一体站管理系统--药品进销存', breadcrumb: '药品进销存' },
          children: [
            {
              path: 'producter',
              name: 'producter',
              component: () => import('@/views/stock_producter.vue'),
              meta: { title: '医疗一体站管理系统--生产厂家维护', breadcrumb: '生产厂家维护' }
            },
            {
              path: 'medicinal',
              name: 'medicinal',
              component: () => import('@/views/stock_medicinal.vue'),
              meta: { title: '医疗一体站管理系统--药品信息维护', breadcrumb: '药品信息维护' }
            },
            {
              path: 'provider',
              name: 'provider',
              component: () => import('@/views/stock_provider.vue'),
              meta: { title: '医疗一体站管理系统--供应商维护', breadcrumb: '供应商维护' }
            },
            {
              path: 'purchase',
              name: 'purchase',
              component: () => import('@/views/stock_purchase.vue'),
              meta: { title: '医疗一体站管理系统--采购入库', breadcrumb: '采购入库' }
            },
            {
              path: 'examine',
              name: 'examine',
              component: () => import('@/views/stock_examine.vue'),
              meta: { title: '医疗一体站管理系统--入库审核', breadcrumb: '入库审核' }
            },
            {
              path: 'inventory',
              name: 'inventory',
              component: () => import('@/views/stock_inventory.vue'),
              meta: { title: '医疗一体站管理系统--库存查询', breadcrumb: '库存查询' }
            },
          ]
        },
        //收费管理
        {
          path: '/charge',
          meta: { title: '医疗一体站管理系统--收费管理', breadcrumb: '收费管理' },
          children: [
            {
              path: 'docharge',
              name: 'docharge',
              component: () => import('@/views/charge_docharge.vue'),
              meta: { title: '医疗一体站管理系统--处方收费', breadcrumb: '处方收费' }
            },
            {
              path: 'chargelist',
              name: 'chargelist',
              component: () => import('@/views/charge_chargelist.vue'),
              meta: { title: '医疗一体站管理系统--收费列表', breadcrumb: '收费列表' }
            },
            {
              path: 'backfee',
              name: 'backfee',
              component: () => import('@/views/charge_backfee.vue'),
              meta: { title: '医疗一体站管理系统--处方退费', breadcrumb: '处方退费' }
            },
            {
              path: 'backfeelist',
              name: 'backfeelist',
              component: () => import('@/views/charge_backfeelist.vue'),
              meta: { title: '医疗一体站管理系统--退费查询', breadcrumb: '退费查询' }
            },
            {
              path: 'dispensing',
              name: 'dispensing',
              component: () => import('@/views/charge_dispensing.vue'),
              meta: { title: '医疗一体站管理系统--处方发药', breadcrumb: '处方发药' }
            },
          ]
        },
        // 数据统计
        {
          path: '/statistics',
          meta: { title: '医疗一体站管理系统--数据统计', breadcrumb: '数据统计' },
          children: [
            {
              path: 'revenue',
              name: 'revenue',
              component: () => import('@/views/statistics_revenue.vue'),
              meta: { title: '医疗一体站管理系统--收支统计', breadcrumb: '收支统计' }
            },
            {
              path: 'sales',
              name: 'sales',
              component: () => import('@/views/statistics_sales.vue'),
              meta: { title: '医疗一体站管理系统--药品销售统计', breadcrumb: '药品销售统计' }
            },
            {
              path: 'check',
              name: 'check',
              component: () => import('@/views/statistics_check.vue'),
              meta: { title: '医疗一体站管理系统--检查项目统计', breadcrumb: '检查项目统计' }
            },
            {
              path: 'yearmonth',
              name: 'yearmonth',
              component: () => import('@/views/statistics_yearmonth.vue'),
              meta: { title: '医疗一体站管理系统--年月报表统计', breadcrumb: '年月报表统计' }
            },
            {
              path: 'workload',
              name: 'workload',
              component: () => import('@/views/statistics_workload.vue'),
              meta: { title: '医疗一体站管理系统--工作量统计', breadcrumb: '工作量统计' }
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
