<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-row>
    <el-col :span="24">
      <el-menu
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        default-active="1"
      >
        <el-menu-item index="1">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">用户管理</el-menu-item>
          <el-menu-item index="1-2">角色管理</el-menu-item>
          <el-menu-item index="1-3">菜单管理</el-menu-item>
          <el-menu-item index="1-4">科室管理</el-menu-item>
          <el-menu-item index="1-5">字典管理</el-menu-item>
          <el-menu-item index="1-6">检查费用设置</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>数据统计</span>
          </template>
          <el-menu-item index="1-1">收支统计</el-menu-item>
          <el-menu-item index="1-2">药品销售统计</el-menu-item>
          <el-menu-item index="1-3">检查项目统计</el-menu-item>
          <el-menu-item index="1-4">工作量统计</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>药品进销存</span>
          </template>
          <el-menu-item index="1-1">生产厂家维护</el-menu-item>
          <el-menu-item index="1-2">药品信息维护</el-menu-item>
          <el-menu-item index="1-3">供应商维护</el-menu-item>
          <el-menu-item index="1-4">采购入库列表</el-menu-item>
          <el-menu-item index="1-5">入库审核</el-menu-item>
          <el-menu-item index="1-6">库存查询</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>收费管理</span>
          </template>
          <el-menu-item index="1-1">处方收费</el-menu-item>
          <el-menu-item index="1-2">收费查询</el-menu-item>
          <el-menu-item index="1-3">处方退费</el-menu-item>
          <el-menu-item index="1-4">退费查询</el-menu-item>
          <el-menu-item index="1-5">处方发药</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="6">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>检查管理</span>
          </template>
          <el-menu-item index="1-1">新开检查</el-menu-item>
          <el-menu-item index="1-2">检查结果录入</el-menu-item>
          <el-menu-item index="1-3">检查结果查询</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="7">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>看病就诊</span>
          </template>
          <el-menu-item index="1-1">门诊挂号</el-menu-item>
          <el-menu-item index="1-2">挂号列表</el-menu-item>
          <el-menu-item index="1-3">新开就诊</el-menu-item>
          <el-menu-item index="1-4">我的排班</el-menu-item>
          <el-menu-item index="1-5">医生排班</el-menu-item>
          <el-menu-item index="1-6">患者库</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Document, House, Menu as IconMenu, Setting } from '@element-plus/icons-vue'

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
