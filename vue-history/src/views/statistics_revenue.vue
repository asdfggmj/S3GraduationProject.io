<!-- 收支统计 -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col>
      <!-- 卡片 -->
      <el-card shadow="hover">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="选择时间">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15" style="margin-left: 10px">
            <el-button>搜索</el-button>
            <el-button>重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第二行 -->
  <el-row style="margin-top: 10px">
    <el-col>
      <el-card shadow="hover">
        <el-row justify="space-evenly">
          <el-col :span="7">合计收入：999￥</el-col>
          <el-col :span="7">合计退费：999￥</el-col>
          <el-col :span="7">剩余收入：999￥</el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第三行 -->
  <el-row style="margin-top: 10px">
    <el-col>
      <el-card shadow="hover">
        <el-row>
          <el-col>
            <el-text>收入概况：</el-text>
          </el-col>
        </el-row>
        <el-row justify="space-evenly" style="margin-top: 10px">
          <el-col :span="6">现金：999￥</el-col>
          <el-col :span="6">微信：999￥</el-col>
          <el-col :span="6">支付宝：999￥</el-col>
          <el-col :span="6">其他银联：999￥</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col>
            <el-text>退费概况：</el-text>
          </el-col>
        </el-row>
        <el-row justify="space-evenly" style="margin-top: 10px">
          <el-col :span="6">现金：999￥</el-col>
          <el-col :span="6">微信：999￥</el-col>
          <el-col :span="6">支付宝：999￥</el-col>
          <el-col :span="6">其他银联：999￥</el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row style="margin-top: 20px" justify="space-evenly">
    <el-col :span="7">
      <PieChart :chartData="pieData1" title="收支概览" />
    </el-col>
    <el-col :span="7">
      <PieChart :chartData="pieData2" title="收入渠道" />
    </el-col>
    <el-col :span="7">
      <PieChart :chartData="pieData3" title="退款概览" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import PieChart from '@/components/pie_chart.vue'
import { onMounted, ref } from 'vue'

onMounted(() => {
  updateData
})

// 饼图 1 - 水果销量
const pieData1 = ref([
  { value: 40, name: '收费金额' },
  { value: 30, name: '退费金额' },
])

// 饼图 2 - 饮料销量
const pieData2 = ref([
  { value: 50, name: '现金' },
  { value: 25, name: '支付宝' },
  { value: 15, name: '微信' },
  { value: 10, name: '其他' },
])

// 饼图 3 - 零食销量
const pieData3 = ref([
  { value: 35, name: '现金' },
  { value: 30, name: '支付宝' },
  { value: 20, name: '微信' },
  { value: 15, name: '其他' },
])

// 更新数据（模拟）
const updateData = () => {
  pieData1.value = pieData1.value.map((item) => ({
    ...item,
    value: Math.floor(Math.random() * 100),
  }))

  pieData2.value = pieData2.value.map((item) => ({
    ...item,
    value: Math.floor(Math.random() * 100),
  }))

  pieData3.value = pieData3.value.map((item) => ({
    ...item,
    value: Math.floor(Math.random() * 100),
  }))
}
</script>
