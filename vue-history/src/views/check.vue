<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-text class="mr-20px">检查项目</el-text>
            <el-segmented v-model="trigger" :options="options" />
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="8">
            <el-input v-model="keyWord" placeholder="请输入检查单号回车以查询" />
          </el-col>
        </el-row>
        <el-row class="mt-10px">
          <el-col :span="8">
            <el-form-item label="检查单号">
              <el-input placeholder="请输入检查单号" />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left: 6px"
            ><el-button type="primary">
              <el-icon><Search /></el-icon>
              <span>查询</span>
            </el-button></el-col
          >
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第二行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always">
        <el-row>
          <el-col style="text-align: center">暂无数据</el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="患者编号："></el-form-item>
            <el-form-item label="患者姓名："></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查项目："></el-form-item>
            <el-form-item label="检查备注："></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button class="mt-4" type="primary" style="width: 100%">
              <el-icon><Plus /></el-icon>
              <span>开始检测</span>
            </el-button>
          </el-col>
        </el-row> -->
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import http from '@/http'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const registrationFeeData = reactive([
  {
    id: '190486295932',
    name: '李四',
    checkItem: '不知道',
    remark: '哈哈哈哈哈',
  },
]) //科室数据
const rowLoadingMap = reactive({}) //是否处于加载状态
const trigger = ref<'乙肝五项' | '乙肝五项'>('乙肝五项')
const options = ['乙肝五项', '血常规', 'CT', 'X光']

//页面加载时挂载
// onMounted(() => {
//   getAnnouncementFetch()
// })
</script>

<style>
.mr-20px {
  margin-right: 20px;
}
.mt-10px {
  margin-top: 10px;
}
.mb-10px {
  margin-bottom: 10px;
}
.ml-10px {
  margin-left: 10px;
}
.text-center {
  text-align: center;
}
</style>
