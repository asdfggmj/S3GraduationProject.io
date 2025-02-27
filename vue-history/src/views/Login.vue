<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-row>
    <el-col :span="6">
      <el-form label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="loginData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginData.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-button type="primary" round @click="submitLogin">登录</el-button>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import router from '@/router'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

let loginData = ref({
  username: '',
  password: '',
})

const submitLogin = () => {
  ElMessage.success('登录事件:' + loginData.value.username + ' / ' + loginData.value.password)
  router.push('/index')
}
</script>
