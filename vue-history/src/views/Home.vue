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
  <!-- 分隔符 -->
  <el-divider />
  <!-- 第二行 -->
  <el-row :gutter="20">
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
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useTransition } from '@vueuse/core'
import Weather from '@/components/_weather.vue'
import { useUserStore } from '@/stores/user'
import { time } from 'echarts'

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

// 组件挂载
onMounted(() => {
  updateTime() // 初始化当前时间
  setInterval(updateTime, 1000) // 每秒更新时间
  userObject.value = userStore.getUser.data.data
  console.log(userObject.value)
})

// 组件卸载
onUnmounted(() => {
  clearInterval()
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
</script>

<style scoped>
@import url('https://at.alicdn.com/t/c/font_4844128_w3aqyqxebd8.css');
.mt-4px {
  margin-top: 4px;
}
</style>
