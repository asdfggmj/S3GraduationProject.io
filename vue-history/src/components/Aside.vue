<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-row>
    <el-col :span="24">
      <el-scrollbar style="height: 90vh">
        <el-menu
          class="el-menu-vertical-demo"
          :expanded-keys="expandedKeys"
        >
          <!-- 首页 -->
          <el-menu-item index="/home" @click="navigateTo('/home')">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <!-- 循环遍历菜单 -->
          <el-sub-menu
            v-for="parentMenu in menuStore.menuData"
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
// 导入 Pinia Store
import { useMenuStore } from '@/stores/menuStore';
const menuStore = useMenuStore();

const router = useRouter() // 获取路由实例
const activeMenu = ref(router.currentRoute.value.path) // 绑定当前激活菜单
const expandedKeys = ref([]) // 控制展开的菜单项

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

    // 使用 menuStore.menuData
    const response = await http.get('/menu/getUserMenus')
    menuStore.menuData = response.data.data || []
    // 重置展开的菜单项
    expandedKeys.value = []
  } catch (error) {
    ElMessage.error('获取菜单失败: ' + error)
  }
}
</script>

<style scoped></style>
