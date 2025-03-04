<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col>
      <!-- 卡片数据展示 -->
      <el-card shadow="always">
        <el-row>
          <el-col :span="2">
            <el-avatar :size="64" :src="circleUrl" />
          </el-col>
          <el-col :span="16">
            <el-row>
              <el-col>下午好！用户名，现在是：dddd:yy:mm</el-col>
              <el-col class="mt-4px">您的职责：未知</el-col>
              <el-col class="mt-4px">今日天气晴朗，气温在15℃至25℃之间，东南风。</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col>仓库地址</el-col>
              <el-col class="mt-4px"
                >前端：
                <el-button type="primary" link @click="gitHub">
                  <i class="iconfont icon-github-fill" style="margin-right: 6px"></i>
                </el-button>
                <a href=""></a
              ></el-col>
              <el-col class="mt-4px"
                >后端：
                <el-button type="primary" link @click="gitHub">
                  <i class="iconfont icon-gitee" style="margin-right: 6px"></i> </el-button
              ></el-col>
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
  <el-row>
    <el-col :span="12">
      <p>我的排班</p>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTransition } from '@vueuse/core'

const gitHub = () => {
  window.open('https://github.com/asdfggmj/S3GraduationProject.io')
}
const gitee = () => {
  window.open('https://gitee.com/asdfggmj12/vueBackendRepository')
}

//头像地址
const circleUrl =
  'https://asdfggmj.oss-cn-hongkong.aliyuncs.com/images/27994340-a06d-49f3-882b-0cc28797e665.jpg'

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
