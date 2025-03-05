<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-row>
    <el-col :span="24">
      <el-scrollbar style="height: 90vh">
        <el-menu class="el-menu-vertical-demo" default-active="0">
          <!-- 首页 -->
          <el-menu-item index="0" @click="navigateTo('/home')">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <!-- 循环遍历菜单 -->
          <el-sub-menu
            v-for="parentMenu in menuData"
            :key="parentMenu.menuId"
            :index="String(parentMenu.menuId)"
          >
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>{{ parentMenu.menuName }}</span>
            </template>
            <!-- 子菜单循环遍历 -->
            <el-menu-item
              v-for="childrenMenu in parentMenu.childMenus"
              :key="childrenMenu.menuId"
              :index="`${parentMenu.menuId}-${childrenMenu.menuId}`"
              @click="navigateTo(childrenMenu.path)"
              >{{ childrenMenu.menuName }}</el-menu-item
            >
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import http from '@/http'
import { useUserStore } from '@/stores/user'
import { House, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const menuData = ref([]) //菜单数据
const router = useRouter() // 获取路由实例

const navigateTo = (path) => {
  router.push(path)
}

onMounted(() => {
  getMenus()
})

const getMenus = async () => {
  //获取用户信息
  const userStore = useUserStore()
  const userData = userStore.getUser

  //确保用户数据存在
  if (!userData) {
    ElMessage({
      message: '用户不存在或未加载成功',
      type: 'error',
      grouping: true,
    })
    return
  }
  //获取用户菜单
  http.get(`/menu/getUserMenus`).then((response) => {
    menuData.value = response.data
  })
}
</script>

<style scoped></style>
