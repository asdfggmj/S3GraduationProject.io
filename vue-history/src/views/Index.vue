<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- <div>
    <el-button type="danger" round @click="loginOut">退出</el-button>
  </div>  -->
  <el-container>
    <!-- 头部导航栏 -->
    <el-header>
      <Header />
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <Aside />
      </el-aside>
      <el-container>
        <!-- 主体内容 -->
        <el-main><Main /></el-main>
        <!-- 页脚内容 -->
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'
import Main from '@/components/Main.vue'
</script>
