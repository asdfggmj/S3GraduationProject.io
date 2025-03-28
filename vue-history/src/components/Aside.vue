<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-row>
    <el-col :span="24">
      <el-scrollbar style="height: 90vh">
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="activeMenu"
          @select="handleSelect"
          router
        >
          <!-- 首页 -->
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <!-- 循环遍历菜单 -->
          <el-sub-menu
            v-for="parentMenu in menuData"
            :key="parentMenu.menuId"
            :index="`${parentMenu.menuId}`"
          >
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>{{ parentMenu.menuName }}</span>
            </template>
            <!-- 子菜单循环遍历 -->
            <el-menu-item
              v-for="childrenMenu in parentMenu.childMenus"
              :key="childrenMenu.menuId"
              :index="`${childrenMenu.path}`"
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
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const menuData = ref([]) //菜单数据
const router = useRouter() // 获取路由实例
const route = useRoute()

// 读取 localStorage 里的菜单选中状态（如果没有就用当前路由）
const activeMenu = ref(localStorage.getItem('activeMenu') || route.path)

// 监听菜单点击事件
const handleSelect = (index) => {
  activeMenu.value = index
  localStorage.setItem('activeMenu', index) // 存储选中的菜单
  router.push(index) // 跳转到对应的路由
}

// 监听路由变化（防止手动输入 URL 时，菜单不同步）
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
    localStorage.setItem('activeMenu', newPath)
  },
)

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
  if (menuData.value.length === 0) {
    http.get(`/menu/getUserMenus`).then((response) => {
      menuData.value = response.data
    })
  }
}
</script>
