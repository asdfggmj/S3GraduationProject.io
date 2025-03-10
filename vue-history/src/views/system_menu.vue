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
              @change="searchMenu"
              placeholder="请输入菜单名称"
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
        <el-table :data="menuData" row-key="menuId" border max-height="560"
        :tree-props="{children: 'childMenus',hasChildren:'hasChildren'}"
        default-expand-none
        stripe>
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

             <!-- 按钮组 -->
                <template #default="scope">
                  <el-button-group>
                    <el-button type="success" size="small" @click="editMenu(scope.row.menuId)">
                      <el-icon><Edit /></el-icon>
                      <span>编辑</span>
                    </el-button>
                    <el-button type="danger" size="small" @click="delMenu(scope.row.menuId)">
                      <el-icon><Delete /></el-icon>
                      <span>删除</span>
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>

        </el-table>
      </el-card>
    </el-col>
  </el-row>
<!-- 分页行 -->
<el-row class="mt-10px">
          <el-col :span="24">
            <el-pagination
              background
              layout="total,sizes,prev, pager, next,jumper"
              :total="pageTotal"
              :pager-count="11"
              :page-size="pageSize"
              :page-sizes="[10, 20, 50]"
              :current-page="pageNum"
              @size-change="sizeChange"
              @current-change="currentChange"
            />
          </el-col>
        </el-row>

   <!-- 添加菜单和编辑菜单抽屉 -->
   <el-drawer
    v-model="addOrEditDrawerModal"
    :title="addOrEditDrawerTitle"
    size="30%"
    :before-close="beforeChangeAddOrEditDrawer"
  >
    <el-row>
      <el-col :span="20">
        <el-form :model="menuObject" label-width="auto" style="max-width: 600px">
          <el-input v-model="menuObject.menuId" style="display: none;"/>
          <el-form-item label="上级菜单">
            <el-select id="parentSelect" v-model="menuObject.parentId" @click="getParentsMenu" placeholder="所属科室">
              <el-option
                v-for="item in parentMenuData"
                :key="item.menuId"
                :label="item.menuName"
                :value="item.menuId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称">
            <el-input v-model="menuObject.menuName" placeholder="请输入菜单名" />
          </el-form-item>
          <el-form-item label="路由地址">
            <el-input v-model="menuObject.path" placeholder="请输入路由地址" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="menuObject.status">
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-divider />
    <el-row class="text-center">
      <el-col>
        <el-button @click="handleSubmit" type="primary">提交</el-button>
        <el-button type="primary">取消</el-button>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script setup lang="ts">
import http from '@/http'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'

const addOrEditDrawerModal = ref(false) //添加或编辑角色抽屉
const addOrEditDrawerTitle = ref('') //添加或编辑角色抽屉标题
const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const rowLoadingMap = reactive({}) //是否处于加载状态
let menuData = ref([]) //菜单响应式数据
let parentMenuData = ref([]) //父菜单响应式数据

//角色对象，用于存储添加或修改的角色信息
const menuObject = reactive({
  menuId: '',
  parentId: '',
  parentIds: '',
  menuName: '',
  menuType: '',
  perCode:'',
  path:'',
  remark:'',
  status:0,
  createTime:'',
  updateTime:'',
  createBy:'',
  updateBy:''
})

//计算菜单类别名字
const getMenuTagType = computed(() => (tagTypeName) => {
  if (tagTypeName === 'M') return 'primary'
  if (tagTypeName === 'N') return 'success'
  if (tagTypeName === 'C') return 'warning'
  return 'danger'
})

//模糊查询
const searchMenu = (keyWordInput) => {
  keyWord.value = keyWordInput
  // ElMessage.info(keyWord.value)
  getMenus()
}


//添加菜单抽屉
const addMenu = () => {
  //清空菜单对象
  menuObject.parentId = ''
  menuObject.menuName = ''
  menuObject.menuType = ''
  menuObject.status=0
  menuObject.path = ''

  addOrEditDrawerTitle.value = '添加菜单'
  addOrEditDrawerModal.value = true
}

//添加菜单
const addMenuSubmit = () => {
  // console.log("添加的数据"+roleObject)
  //后端发送添加菜单请求
  http.post("/menu/addMenu",menuObject).then((res) => {
    if (res.data) {
      ElMessage.success('添加成功')
      addOrEditDrawerModal.value = false
    } else {
      ElMessage.error('添加失败')
    }
    getMenus()
  })
}

//删除菜单
const delMenu = (menuId) => {
  ElMessageBox.confirm(
    "确定删除编号为"+menuId+"的菜单？",
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(() => {
      //删除菜单
      http.post("menu/delMenu?menuId="+menuId).then((res)=>{
        if(res.data){
          ElMessage.success('删除成功')
          getMenus()
        } else {
      throw new Error('菜单删除失败')
    }
      })
    })
    // .catch(() => {
    //   ElMessage({
    //     type: 'info',
    //     message: 'Delete canceled',
    //   })
    // })
}

//修改菜单抽屉
const editMenu = (menuId:string) => {
  //userId=userId
  addOrEditDrawerTitle.value = '编辑菜单'
  addOrEditDrawerModal.value = true
  //回调单个菜单数据
  http.get("/menu/getMenu?menuId="+menuId).then((res)=>{
   if(res.data){
      menuObject.menuId = menuId
      menuObject.parentId = res.data.parentId
      menuObject.menuName = res.data.menuName
      menuObject.menuType = res.data.menuType
      menuObject.status = res.data.status
      menuObject.path = res.data.path
      menuObject.remark = res.data.remark
      menuObject.createTime = res.data.createTime
      menuObject.updateTime = res.data.updateTime
      menuObject.createBy = res.data.createBy
      menuObject.updateBy = res.data.updateBy
    }
  }).catch((error)=>{
    // ElMessage.error('获取菜单数据失败'+error)
  })
}

//修改菜单
const updateMenuSubmit = () => {
  // console.log("修改的数据"+userObject)
  //后端发送修改菜单请求
  http.post("/menu/updMenu",menuObject).then((res) => {
    if (res.data) {
      ElMessage.success('修改成功')
      addOrEditDrawerModal.value = false
      getMenus()
    } else {
      ElMessage.error('操作有误,请重试!')
    }
    getMenus()
  })
}

//判断当前抽屉的按钮操作是添加还是修改
const handleSubmit = () => {
  if (addOrEditDrawerTitle.value === "添加菜单") {
    addMenuSubmit(); // 调用添加菜单的方法
  } else if (addOrEditDrawerTitle.value === "编辑菜单") {
    updateMenuSubmit(); // 调用修改菜单的方法
  }
};

//关闭抽屉前提示用户是否关闭
const beforeChangeAddOrEditDrawer = () => {
  ElMessageBox.confirm('你确定要关闭吗?所有数据将不会做任何保存', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      addOrEditDrawerModal.value = false
      //deptData.splice(0, deptData.length)
    })
    .catch(() => {
      return
    })
}

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
  menuId = menuId.parseInt(menuId);
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

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getMenus()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getMenus()
}


//判断修改菜单状态前逻辑，判断菜单id是否相同，如果相同拦截并不让更改，否则放行
const beforeChange = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

//获取父菜单
const getParentsMenu = async () => {
  try {
    const response = await http.get('/menu/getParentMenus')
    parentMenuData.value = response.data
  } catch (error) {
    console.error('获取父菜单失败', error)
  }
}

//初始化钩子
onMounted(() => {
  getMenus()
})

//获取所有菜单信息
const getMenus = async () => {
  try {
    const response = await http.get('/menu/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyWord: keyWord.value,
      },
    })
    // menuData.value = response.data
    menuData.value = buildMenuTree(response.data.data.list) //处理为树形结构
    pageTotal.value = response.data.total?.total || 0
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
