<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addMenu">
              <el-icon><Plus /></el-icon>
              <span>新增目录</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchDept"
              placeholder="请输入关键字回车以查询"
              clearable
              size=""
            />
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <el-card shadow="always">
        <!-- 菜单行 -->
        <el-table :data="menuData" row-key="menuId" border max-height="560">
          <el-table-column prop="menuName" label="菜单名称" width="160" />
          <el-table-column prop="menuType" label="类型">
            <template #default="scope">
              <el-tag effect="dark" :type="getMenuTagType(scope.row.menuType)">
                {{ scope.row.menuType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="组件路径" width="200" />
          <el-table-column prop="perCode" label="权限标识" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.perCode === null">空的呢</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="菜单状态" width="120">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :before-change="
                  () =>
                    handleBeforeChange(scope.row.id, scope.row.status === 1 ? 0 : 1, scope.row.name)
                "
                :active-value="1"
                :inactive-value="0"
                active-text="正常"
                inactive-text="禁用"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                :loading="rowLoadingMap[scope.row.id]"
              />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="updateTime" label="最后一次修改时间" width="180" />
          <el-table-column prop="updateBy" label="最后一次修改人" width="180" />
          <el-table-column label="操作" width="220" fixed="right">
            <el-button-group>
              <el-button type="primary" size="small" :icon="Plus">添加</el-button>
              <el-button type="success" size="small" :icon="Edit">编辑</el-button>
              <el-button type="danger" size="small" :icon="Delete">删除</el-button>
            </el-button-group>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import http from '@/http'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'

const rowLoadingMap = reactive({}) //是否处于加载状态
let menuData = ref([]) //菜单响应式数据
const keyWord = ref('') //关键字

//计算菜单类别名字
const getMenuTagType = computed(() => (tagTypeName) => {
  if (tagTypeName === 'M') return 'primary'
  if (tagTypeName === 'N') return 'success'
  if (tagTypeName === 'C') return 'warning'
  return 'danger'
})

//按钮切换主逻辑方法
const handleBeforeChange = async (menuId, menuStatus, menuName) => {
  //将当前开关的动画状态开启
  rowLoadingMap[menuId] = true
  try {
    //执行beforeChange和更改用户状态
    await beforeChange()
    await updateMenuStatus(menuId, menuStatus, menuName)
    return true
  } catch (error) {
    console.error(error.message)
    return false // 阻止状态切换
  } finally {
    rowLoadingMap[menuId] = false
  }
}

// 修改菜单状态改变事件
const updateMenuStatus = async (menuId, menuStatus, menuName) => {
  try {
    const response = await http.put(`/menu/update/${menuId}/${menuStatus}`)
    if (response.data) {
      ElNotification({
        title: '修改成功!',
        message: `菜单 ${menuName} 的状态已更新为 ${menuStatus === 1 ? '启用' : '禁用'}`,
        type: 'success',
        offset: 50,
        duration: 3000,
      })
    } else {
      throw new Error('状态更新失败')
    }
  } catch (error) {
    console.error(error)
    ElNotification({
      title: '修改失败!',
      message: '状态更新时发生错误，请稍后重试.',
      type: 'error',
      offset: 50,
      duration: 3000,
    })
    throw error
  }
}

const beforeChange = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

//初始化钩子
onMounted(() => {
  getMenus()
})

//获取所有菜单信息
const getMenus = async () => {
  try {
    const response = await http.get('/menu/list')
    // menuData.value = response.data
    menuData.value = buildMenuTree(response.data) //处理为树形结构
  } catch (error) {
    console.error('获取菜单失败', error)
  }
}

// 递归构造树形菜单
const buildMenuTree = (menuList) => {
  const menuMap = new Map()
  const tree = []

  // 将数据存入 Map，方便查找
  menuList.forEach((item) => menuMap.set(item.menuId, { ...item, children: [] }))
  console.log(menuMap)

  // 构建树
  menuList.forEach((item) => {
    if (item.parentId !== 0) {
      const parent = menuMap.get(item.parentId)
      if (parent) {
        parent.children.push(menuMap.get(item.menuId))
      }
    } else {
      tree.push(menuMap.get(item.menuId))
    }
  })

  return tree
}
</script>

<style>
.mr-20px {
  margin-right: 20px;
}
.mt-10px {
  margin-top: 10px;
}
.mb-10px {
  margin-bottom: 10px;
}
.ml-10px {
  margin-left: 10px;
}
.text-center {
  text-align: center;
}
</style>
