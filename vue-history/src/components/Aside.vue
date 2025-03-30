<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-row>
    <el-col :span="24">
      <el-scrollbar style="height: 90vh">
        <el-menu class="el-menu-vertical-demo" :default-active="activeMenu">
          <!-- 首页 -->
          <el-menu-item index="/home" @click="navigateTo('/home')">
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
              :index="childrenMenu.path"
              @click="navigateTo(childrenMenu.path)"
            >
              {{ childrenMenu.menuName }}
            </el-menu-item>
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
import { useRouter } from 'vue-router'

const menuData = ref([]) // 菜单数据
const router = useRouter() // 获取路由实例
const activeMenu = ref(router.currentRoute.value.path) // 绑定当前激活菜单

const navigateTo = (path: string) => {
  if (router.currentRoute.value.path !== path) {
    router.push(path)
  }
}

// 监听路由变化，保持菜单高亮
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    activeMenu.value = newPath
  },
)

onMounted(() => {
  getMenus()
})

const getMenus = async () => {
  try {
    const userStore = useUserStore()
    const userData = userStore.getUser

    if (!userData) {
      ElMessage.error('用户不存在或未加载成功')
      return
    }

    if (menuData.value.length === 0) {
      const response = await http.get(`/menu/getUserMenus`)
      menuData.value = response.data.data || []
    }
  } catch (error) {
    ElMessage.error('获取菜单失败: ' + error)
  }
}
</script>

<style scoped></style>
