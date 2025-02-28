<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    style="padding: 0"
  >
    <el-menu-item index="0">
      <img style="width: 100px" src="" alt="Element logo" />
    </el-menu-item>
    <!-- 头像地址 -->
    <el-menu-item index="1">
      <div class="block" @click="chatMyMessage">
        <el-avatar :size="50" :src="circleUrl" />
      </div>
    </el-menu-item>
  </el-menu>
  <!-- 个人信息抽屉 -->
  <el-drawer v-model="personalDrawer" :show-close="false" :size="400">
    <!-- 自定义头部 -->
    <template #header="{ close, titleId, titleClass }">
      <!-- 头像 -->
      <div :id="titleId" class="block" :class="titleClass" @click="chatMyMessage">
        <el-avatar :size="50" :src="circleUrl" />
      </div>
      <!-- 右侧切换账号 -->
      <el-tooltip class="box-item" effect="dark" content="切换账号" placement="bottom">
        <el-button round>
          <el-icon class="el--icon--left"><Switch /></el-icon>
        </el-button>
      </el-tooltip>

      <!-- 关闭抽屉 -->
      <el-tooltip class="box-item" effect="dark" content="关闭" placement="bottom">
        <el-button round @click="close">
          <el-icon class="el--icon--left"><Close /></el-icon>
        </el-button>
      </el-tooltip>
    </template>
    <!-- 分割线 -->
    <el-divider class="mb-20px" />
    <!-- 内容 -->
    <el-row>
      <el-col>
        <el-descriptions title="个人信息" border column="1">
          <el-descriptions-item label="性别">男</el-descriptions-item>
          <el-descriptions-item label="年龄">22</el-descriptions-item>
          <el-descriptions-item label="邮箱">xxx@163.com</el-descriptions-item>
          <el-descriptions-item label="手机号">16022222222</el-descriptions-item>
          <el-descriptions-item label="系统权限">开发者</el-descriptions-item>
          <el-descriptions-item label="所属部门">院长</el-descriptions-item>
        </el-descriptions>
        <!-- 分割线 -->
        <el-divider class="mt-20px mb-20px" />
        <p>
          <el-button round type="danger" @click="loginOut" style="width: 100%">修改密码</el-button>
        </p>
        <p class="mt-20px">
          <el-button round type="danger" @click="loginOut" style="width: 100%">退出</el-button>
        </p>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script setup lang="ts">
import router from '@/router'
import { Close, Switch } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const personalDrawer = ref(false) //个人信息抽屉控制变量
const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}

//退出登录点击事件
const loginOut = () => {
  ElMessage.success('登出事件')
  router.push('/login')
}

//头像点击事件:查看个人信息
const chatMyMessage = () => {
  personalDrawer.value = true
}

//头像地址
const circleUrl =
  'https://asdfggmj.oss-cn-hongkong.aliyuncs.com/images/27994340-a06d-49f3-882b-0cc28797e665.jpg'
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
.mt-20px {
  margin-top: 20px;
}
.mb-20px {
  margin-bottom: 20px;
}
</style>
