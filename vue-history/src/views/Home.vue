<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col>
      <!-- 卡片数据展示 -->
      <el-card shadow="always">
        <el-row>
          <el-col :span="2">
            <el-avatar :size="64" :src="userObject.picture" />
          </el-col>
          <el-col :span="16">
            <el-row>
              <el-col>{{ timeText }}---{{ userObject.userName }} </el-col>
              <el-col class="mt-4px"
                >现在是：{{ timeObject.year }}年{{ timeObject.month + 1 }}月{{ timeObject.day }}日{{
                  timeObject.currentTime
                }}</el-col
              >
              <el-col class="mt-4px"><weather /></el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col>仓库地址</el-col>
              <el-col class="mt-4px"
                >前端：
                <el-tooltip class="box-item" effect="dark" content="前往前端仓库" placement="top">
                  <el-button type="primary" link @click="gitHub">
                    <i class="iconfont icon-github-fill" style="margin-right: 6px"></i>
                  </el-button>
                </el-tooltip>

                <a href=""></a
              ></el-col>
              <el-col class="mt-4px"
                >后端：
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="前往后端仓库"
                  placement="bottom"
                >
                  <el-button type="primary" link @click="gitee">
                    <i class="iconfont icon-gitee" style="margin-right: 6px"></i>
                  </el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="mt-10px">
    <el-col>
      <el-card shadow="always">
        <el-carousel indicator-position="outside" height="300px">
          <el-carousel-item v-for="(item, index) in photoList" :key="index">
            <h3 text="2xl" justify="center">
              <el-image :src="item" >
                <template #placeholder>
                  <div class="image-slot">Loading<span class="dot">...</span></div>
                </template>
              </el-image>
            </h3>
          </el-carousel-item>
        </el-carousel>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第二行 -->
  <el-row class="mt-10px" :gutter="20">
    <el-col :span="6">
      <el-card>
        <el-statistic title="今日就诊数" :value="outputValue" suffix="人" />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <el-statistic title="今日新增患者" :value="addHuanzValue" suffix="人" />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <el-statistic title="痊愈患者" :value="cureHuanzValue" suffix="人" />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <el-statistic title="医生规模" :value="doctorScaleValue" suffix="人" />
      </el-card>
    </el-col>
  </el-row>

  <!-- 分隔符 -->
  <el-divider />
  <!-- 第三行 -->
  <el-row class="mt-10px">
  <el-col>
    <el-card shadow="always">
      <el-tabs v-model="activeTab">
        <!-- 年报表 -->
        <el-tab-pane label="年报表统计" name="year">
          <div ref="yearChart" style="height: 400px; width: 100%"></div>
        </el-tab-pane>
        <!-- 月报表 -->
        <el-tab-pane label="月报表统计" name="month">
          <div ref="monthChart" style="height: 400px; width: 100%"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-col>
</el-row>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useTransition } from '@vueuse/core'
import Weather from '@/components/_weather.vue'
import { useUserStore } from '@/stores/user'
import http from '@/http'
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus'

// 标签页激活状态
const activeTab = ref('year')
const photoList = [
  'src/assets/image/p1.jpg',
  'src/assets/image/p2.jpg',
  'src/assets/image/p5.png',
  'src/assets/image/p4.jpg',
]
const userStore = useUserStore()
const userObject = ref({}) //用户对象
// 用于存储当前时间
const timeObject = ref({
  year: 0,
  month: 0,
  day: 0,
  hourse: 0,
  currentTime: '',
})
//计算早中晚
const timeText = ref('')
// 图表DOM引用
const yearChart = ref<HTMLElement | null>(null)
const monthChart = ref<HTMLElement | null>(null)

const yearlyData = reactive({
  years: [] as string[],
  visits: [] as Array<{year: string; value: number}>,
  newPatients: [] as Array<{year: string; value: number}>,
  recoveryRates: [] as Array<{year: string; value: number}>
})

const monthlyData = reactive({
  months: [] as string[],
  visits: [] as Array<{month: string; value: number}>,
  medicineUsage: {
    '阿莫西林': [] as Array<{month: string; value: number}>,
    '阿胶珠': [] as Array<{month: string; value: number}>
  },
  checkItems: {
    '血常规': [] as Array<{month: string; value: number}>,
    'X光': [] as Array<{month: string; value: number}>
  }
})

const initYearChart = () => {
  if (!yearChart.value) return
  const chart = echarts.init(yearChart.value!)
  const option = {
    title: { text: '年度医疗数据统计' },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['就诊人数', '新增患者', '痊愈率']
    },
    xAxis: {
      type: 'category',
      data: yearlyData.years
    },
    // 重点修复：正确配置双Y轴
    yAxis: [
      {
        type: 'value',
        name: '数量',
        axisLabel: {
          formatter: '{value} 人'
        }
      },
      {
        type: 'value',
        name: '痊愈率',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '就诊人数',
        type: 'line',
        smooth: true,
        data: yearlyData.visits.map(item => item.value),
        yAxisIndex: 0,
        xAxisIndex: 0 // 明确关联到第一个xAxis
      },
      {
        name: '新增患者',
        type: 'line',
        smooth: true,
        data: yearlyData.newPatients.map(item => item.value),
        yAxisIndex: 0,
        xAxisIndex: 0 // 明确关联到第一个xAxis
      },
      {
        name: '痊愈率',
        type: 'line',
        smooth: true,
        data: yearlyData.recoveryRates.map(item => item.value * 100),
        yAxisIndex: 1,
        xAxisIndex: 0 // 明确关联到第一个xAxis
      }
    ]
  }
  chart.setOption(option)
}
// 定义图表实例引用
let yearChartInstance: echarts.ECharts | null = null;
let monthChartInstance: echarts.ECharts | null = null;
// 月度图表配置
const initMonthChart = () => {
  if (!monthChart.value || monthlyData.months.length === 0) {
    console.log('月度图表初始化终止：数据为空', monthlyData.months);
    return;
  }

  monthChartInstance?.dispose();
  monthChartInstance = echarts.init(monthChart.value);

  const option = {
    title: { text: '月度医疗数据统计' },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['就诊高峰', '阿莫西林', '阿胶珠', '血常规', 'X光']
    },
    xAxis: {
      type: 'category',
      data: monthlyData.months // 确保数据为月份数组，如['2023-01', '2023-02']
    },
    yAxis: {
      type: 'value',
      name: '数量'
    },
    series: [
      {
        name: '就诊高峰',
        data: monthlyData.visits.map(item => item.value),
        type: 'line',
        smooth: true
      },
      {
        name: '阿莫西林',
        data: monthlyData.medicineUsage.阿莫西林.map(item => item.value),
        type: 'line'
      },
      {
        name: '阿胶珠',
        data: monthlyData.medicineUsage.阿胶珠.map(item => item.value),
        type: 'line'
      },
      {
        name: '血常规',
        data: monthlyData.checkItems.血常规.map(item => item.value),
        type: 'line'
      },
      {
        name: 'X光',
        data: monthlyData.checkItems.X光.map(item => item.value),
        type: 'line'
      }
    ]
  }
  monthChartInstance.setOption(option)
}

// 监听标签页切换
watch(activeTab, (newVal) => {
  nextTick(() => {
    if (newVal === 'year') initYearChart()
    else initMonthChart()
  })
})

// 更新当前时间的函数
const updateTime = () => {
  const now = new Date()
  timeObject.value.year = now.getFullYear() //获取年份
  timeObject.value.month = now.getMonth() //获取月份
  timeObject.value.day = now.getDate() //获取日期
  timeObject.value.hourse = now.getHours() //获取小时
  if (timeObject.value.hourse >= 0 && timeObject.value.hourse < 6) {
    timeText.value = '凌晨了,忙碌的同时要合理的休息哦,'
  } else if (timeObject.value.hourse >= 6 && timeObject.value.hourse < 10) {
    timeText.value = '早上好！来一份元气早餐吧 '
  } else if (timeObject.value.hourse >= 10 && timeObject.value.hourse < 14) {
    timeText.value = '中午好！要记得吃饭哦~ '
  } else if (timeObject.value.hourse >= 14 && timeObject.value.hourse < 20) {
    timeText.value = '下午好！要记得吃饭哦~ '
  } else {
    timeText.value = '晚上好！身体重要,要注意休息才行呢'
  }

  timeObject.value.currentTime = now.toLocaleTimeString() // 获取当前时间并转化为本地时间字符串
}
let intervalId
// 组件挂载
onMounted(() => {
  get()
  //初始化默认图表
  initYearChart()
  updateTime() // 初始化当前时间
  intervalId= setInterval(updateTime, 1000) // 每秒更新时间
})

// 组件卸载
onUnmounted(() => {
  clearInterval(intervalId)
})
//前端地址
const gitHub = () => {
  window.open('https://github.com/asdfggmj/S3GraduationProject.io')
}
//后端地址
const gitee = () => {
  window.open('https://gitee.com/asdfggmj12/history-back')
}

//今日就诊数
const medicalVisits = ref(0)
const outputValue = useTransition(medicalVisits, {
  //动画时间
  duration: 1000,
})
medicalVisits.value = 1105
//新增患者
const addHuanz = ref(0)
const addHuanzValue = useTransition(addHuanz, {
  //动画时间
  duration: 1000,
})
addHuanz.value = 66
//痊愈患者
const cureHuanz = ref(0)
const cureHuanzValue = useTransition(cureHuanz, {
  //动画时间
  duration: 1000,
})
cureHuanz.value = 1120
//医生规模
const doctorScale = ref(0)
const doctorScaleValue = useTransition(doctorScale, {
  //动画时间
  duration: 1000,
})
doctorScale.value = 49

//获取统计数据
const get = async () => {
  try {
    const response = await http.get('statistics/getStatisticsCount')
    if (response?.data?.code === 200) {
      const resData = response.data.data

      // 基础数据
      medicalVisits.value = resData.visitNum ?? 0
      addHuanz.value = resData.newPatientNum ?? 0
      cureHuanz.value = resData.recoveredPatientsNum ?? 0
      doctorScale.value = resData.doctorNum ?? 0

      // 处理年度数据
      yearlyData.years = resData.years || []
      yearlyData.visits = resData.visits || []
      yearlyData.newPatients = resData.newPatients || []
      yearlyData.recoveryRates = resData.recoveryRates || []

      // 处理月度数据
      monthlyData.months = resData.months || []
      monthlyData.visits = resData.monthlyVisits || []
      monthlyData.medicineUsage = {
        '阿莫西林': resData.medicineUsage?.['阿莫西林'] || [],
        '阿胶珠': resData.medicineUsage?.['阿胶珠'] || []
      }
      monthlyData.checkItems = {
        '血常规': resData.checkItems?.['血常规'] || [],
        'X光': resData.checkItems?.['X光'] || []
      }

       // 确保数据填充后渲染
      nextTick(() => {
        initYearChart();
        initMonthChart();
      });
    }
  } catch (error) {
    console.error('数据加载失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  }
}
</script>

<style scoped>
@import url('https://at.alicdn.com/t/c/font_4844128_w3aqyqxebd8.css');
.mt-4px {
  margin-top: 4px;
}
.mt-10px {
  margin-top: 10px;
}
</style>
