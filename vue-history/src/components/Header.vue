<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    style="padding: 0"
  >
    <el-menu-item index="0" @click="router.push('/home')">
      <img style="width: 180px" src="../assets/image/menuLogo.png" alt="Element logo" />
    </el-menu-item>

    <!-- 面包屑导航 -->
    <el-menu-item index="1" @click="router.push('/home')" style="margin-left: 40px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
          <router-link v-if="item.path" :to="item.path">
            {{ item.label }}
          </router-link>
          <span v-else>{{ item.label }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-menu-item>

    <!-- 头像地址 -->
    <el-menu-item index="2">
      <div class="block" @click="chatMyMessage">
        <el-avatar :size="50" :src="userObject.picture" />
      </div>
    </el-menu-item>
  </el-menu>
  <!-- 个人信息抽屉 -->
  <el-drawer v-model="personalDrawer" :show-close="false" :size="400">
    <!-- 自定义头部 -->
    <template #header="{ close, titleId, titleClass }">
      <!-- 头像 -->
      <div :id="titleId" class="block" :class="titleClass" @click="chatMyMessage">
        <el-avatar :size="50" :src="userObject.picture" />
        <!-- <span style="margin-left: 16px">{{ userData.data.userName }}</span> -->
      </div>
      <!-- 右侧切换账号 -->
      <el-tooltip class="box-item" effect="dark" content="切换账号" placement="bottom">
        <el-button round @click="loginOut">
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
        <el-descriptions title="个人信息" border :column="1">
          <el-descriptions-item label="姓名">{{
            userData.data.data.userName
          }}</el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ userData.data.sex == 0 ? '男' : '女' }}
          </el-descriptions-item>
          <el-descriptions-item label="年龄">{{ userData.data.data.age }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userData.data.data.email }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ userData.data.data.phone }}</el-descriptions-item>
          <el-descriptions-item label="系统权限">{{
            userData.data.data.roleList
          }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{
            userData.data.data.deptId
          }}</el-descriptions-item>
        </el-descriptions>
        <!-- 分割线 -->
        <el-divider class="mt-20px mb-20px" />
        <p>
          <el-button round type="danger" @click="updatePwdDialog" style="width: 100%"
            >修改密码</el-button
          >
        </p>
        <p class="mt-20px">
          <el-button round type="danger" @click="loginOut" style="width: 100%">退出</el-button>
        </p>
      </el-col>
    </el-row>
  </el-drawer>

  <!-- 修改密码对话框 -->
  <el-dialog
    v-model="updatePwdDialogVisible"
    title="修改密码"
    width="500"
    :before-close="handleClose"
  >
    <el-card shadow="always">
      <el-row>
        <el-col>
          <el-form :data="updatePwdObject">
            <el-form-item label="原密码">
              <el-input placeholder="请输入原密码" v-model="updatePwdObject.oldPwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码" style="margin-top: 10px">
              <el-input placeholder="请输入新密码" v-model="updatePwdObject.newPwd"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="forgetPwd" type="danger" style="padding: 0 4px 0 4px"
          >忘记密码</el-button
        >
        <el-button @click="updatePwdDialogVisible = false" style="padding: 0 4px 0 4px"
          >取消</el-button
        >
        <el-button type="primary" @click="submitUpdatePwd" style="padding: 0 4px 0 4px">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { Close, Switch } from '@element-plus/icons-vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { all } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const updatePwdDialogVisible = ref(false) //控制修改密码对话框显示
const cookie = useCookies()
const personalDrawer = ref(false) //个人信息抽屉控制变量
const activeIndex = ref('1')
let userData = reactive({})
const route = useRoute()
const userStore = useUserStore()
const userObject = ref({}) //用户对象
const updatePwdObject = ref({
  oldPwd: '',
  newPwd: '',
})

//忘记密码
const forgetPwd = () => {
  ElMessage.success('忘记密码')
}

//提交修改密码
const submitUpdatePwd = () => {
  ElMessage.success('修改用户密码')
}

//修改用户密码
const updatePwdDialog = () => {
  updatePwdDialogVisible.value = true
}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭吗?保存的数据将会丢失')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

onMounted(() => {
  userObject.value = userStore.getUser.data.data
})

// 计算多级面包屑
const breadcrumbs = computed(() => {
  return route.matched
    .filter((r) => r.meta.breadcrumb) // 过滤出有 breadcrumb 的路由
    .map((r) => ({
      label: r.meta.breadcrumb,
      path: r.path !== route.path ? r.path : '', // 只有非当前页的才加链接
    }))
})

//退出登录点击事件
const loginOut = () => {
  ElMessageBox.confirm('你确定要退出此账号吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    router.push('/login')
    ElMessage.success('手动退出了系统')
    cookie.remove('Authorization')
    localStorage.removeItem('activeMenu')
  })
}

//头像点击事件:查看个人信息
const chatMyMessage = () => {
  const userStore = useUserStore()
  userData = userStore.getUser
  personalDrawer.value = true
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.el-menu--horizontal > .el-menu-item:nth-child(2) {
  margin-right: auto;
}
.mt-20px {
  margin-top: 20px;
}
.mb-20px {
  margin-bottom: 20px;
}
/* 新增样式 */
.block {
  display: flex;
  align-items: center;
}
</style>
