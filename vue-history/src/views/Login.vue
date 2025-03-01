<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <el-row>
      <el-col>
        <el-card shadow="always" class="login-card">
          <p class="mb-20px text-center login-title">医疗一体管理系统登录</p>
          <el-form ref="ruleFormRef" :rules="rules" status-icon :model="loginData">
            <el-form-item prop="username">
              <el-input
                v-model="loginData.username"
                size="large"
                placeholder="手机号 | 邮箱"
                :prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginData.password"
                size="large"
                placeholder="请输入密码"
                :prefix-icon="User"
                show-password
              />
            </el-form-item>
            <el-form-item prop="validateCode">
              <el-input
                v-model="loginData.validateCode"
                size="large"
                placeholder="验证码"
                :prefix-icon="User"
              />
            </el-form-item>
            <div class="button-container">
              <el-button
                type="primary"
                size="large"
                round
                @click="submitLogin"
                class="login-button"
                :loading="isLoading"
              >
                登录
              </el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import http from '@/http'
import router from '@/router'
import { User } from '@element-plus/icons-vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const ruleFormRef = ref<FormInstance | null>(null)
const cookie = useCookies()
let isLoading = ref(false)
// 用户登录信息
const loginData = reactive({
  username: '',
  password: '',
  validateCode: '',
})

// 表单验证规则
const rules = reactive<FormRules>({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  validateCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
})

// 提交登录表单
const submitLogin = () => {
  if (!ruleFormRef.value) return // 确保 ruleFormRef 已经绑定
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      isLoading.value = true
      http
        .post('/auth/login', loginData)
        .then((response) => {
          const token = response.data
          if (response.data == '') {
            ElMessage.error('登录失败!')
            return
          }
          cookie.set('Authorization', token)
          ElMessage.success('登录成功!')
          router.push('/home')
        })
        .finally(() => {
          isLoading.value = false
        })
    }
  })
}
</script>

<style>
.mb-20px {
  margin-bottom: 20px;
}
.text-center {
  text-align: center;
}
.button-container {
  display: flex;
  justify-content: center;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #8526dd, #a0a5ae);
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 22px;
}

.login-button {
  width: 160px;
  background-color: #2575fc;
  border-color: #2575fc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #1a5bb8;
  border-color: #1a5bb8;
}
</style>
