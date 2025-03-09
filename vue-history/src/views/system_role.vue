<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addRole">
              <el-icon><Plus /></el-icon>
              <span>新增角色</span>
            </el-button>
            <el-button type="danger">
              <el-icon><Minus /></el-icon>
              <span>删除选中角色</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchRole"
              placeholder="请输入角色名"
              clearable
              size=""
            />
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第二行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always">
        <!-- 表格 -->
        <el-row class="mt-10px">
          <el-col>
            <el-table :data="roleData" style="width: 100%" max-height="500" row-key="roleId">
              <el-table-column fixed type="selection" width="55" />
              <el-table-column label="角色名称" prop="roleName" width="120" />
              <el-table-column label="权限编码" prop="roleCode" />
              <el-table-column label="显示顺序" prop="roleSort" width="120" />
              <el-table-column label="状态" prop="status">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.userStatus"
                    :before-change="
                      () =>
                        handleBeforeChange(
                          scope.row.userId,
                          scope.row.userStatus === 0 ? 1 : 0,
                          scope.row.userName,
                        )
                    "
                    :active-value="0"
                    :inactive-value="1"
                    active-text="正常"
                    inactive-text="禁用"
                    class="ml-2"
                    inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    :loading="rowLoadingMap[scope.row.roleId]"
                  />
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark" width="120" />
              <el-table-column label="创建时间" prop="createTime" width="200" />
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="240">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="success" size="small" @click="editRole(scope.row.roleId)">
                      <el-icon><Edit /></el-icon>
                      <span>编辑</span>
                    </el-button>
                    <el-button type="danger" size="small" @click="delRole(scope.row.roleId)">
                      <el-icon><Delete /></el-icon>
                      <span>删除</span>
                    </el-button>
                    <el-button type="primary" size="small">
                      <el-icon><Pointer /></el-icon>
                      <span>分配权限</span>
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
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
      </el-card>
    </el-col>
  </el-row>

  <!-- 添加角色和编辑角色抽屉 -->
  <el-drawer
    v-model="addOrEditDrawerModal"
    :title="addOrEditDrawerTitle"
    size="30%"
    :before-close="beforeChangeAddOrEditDrawer"
  >
    <el-row>
      <el-col :span="20">
        <el-form :model="roleObject" label-width="auto" style="max-width: 600px">
          <el-input v-model="roleObject.roleId" style="display: none;"/>
          <el-form-item label="角色名称">
            <el-input v-model="roleObject.roleName" placeholder="请输入角色名" />
          </el-form-item>
          <el-form-item label="权限编码">
            <el-input v-model="roleObject.roleCode" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="显示顺序">
            <el-input-number v-model="roleObject.roleSort" :min="18" :max="200" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="roleObject.status">
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
      <el-input v-model="roleObject.remark" type="textarea" />
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
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const addOrEditDrawerModal = ref(false) //添加或编辑角色抽屉
const addOrEditDrawerTitle = ref('') //添加或编辑角色抽屉标题
const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const roleData = reactive([]) //角色数据
const rowLoadingMap = reactive({}) //是否处于加载状态
let dialog = ref(false) //控制分配抽屉的显示隐藏

//角色对象，用于存储添加或修改的角色信息
const roleObject = reactive({
  roleId: '',
  roleName: '',
  roleCode: '',
  roleSort: '',
  status: 0,
  remark: '',
  createTime: '',
  delFlag:''
})

//模糊查询
const searchRole = (keyWordInput) => {
  keyWord.value = keyWordInput
  // ElMessage.info(keyWord.value)
  getRoleFetch()
}


//添加用户抽屉
const addRole = () => {
  //清空角色对象
  roleObject.roleId = ''
  roleObject.roleName = ''
  roleObject.roleCode = ''
  roleObject.roleSort = ''
  // roleObject.status = 0
  roleObject.remark = ''
  roleObject.createTime = ''
  roleObject.delFlag=''

  addOrEditDrawerTitle.value = '添加角色'
  addOrEditDrawerModal.value = true
}

//添加角色
const addRoleSubmit = () => {
  // console.log("添加的数据"+roleObject)
  //后端发送添加角色请求
  http.post("/role/addRole",roleObject).then((res) => {
    if (res.data) {
      ElMessage.success('添加成功')
      addOrEditDrawerModal.value = false
    } else {
      ElMessage.error('添加失败')
    }
    getRoleFetch()
  })
}

//删除角色
const delRole = (roleId) => {
  ElMessageBox.confirm(
    "确定删除编号为"+roleId+"的角色？",
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(() => {
      //删除角色
      http.post("role/delRole?roleId="+roleId).then((res)=>{
        if(res.data){
          ElMessage.success('删除成功')
          getRoleFetch()
        } else {
      throw new Error('角色删除失败')
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

//修改角色抽屉
const editRole = (roleId) => {
  //userId=userId
  addOrEditDrawerTitle.value = '编辑角色'
  addOrEditDrawerModal.value = true
  //回调单个角色数据
  http.get("/role/getRole?rid="+roleId).then((res)=>{
   if(res.data){
      roleObject.roleId = roleId
      roleObject.roleName = res.data.roleName
      roleObject.roleCode = res.data.roleCode
      roleObject.roleSort = res.data.roleSort
      roleObject.status = res.data.status
      roleObject.remark = res.data.remark
      roleObject.createTime = res.data.createTime
    }
  }).catch((error)=>{
    // ElMessage.error('获取角色数据失败'+error)
  })
}

//修改角色
const updateRoleSubmit = () => {
  // console.log("修改的数据"+userObject)
  //后端发送修改角色请求
  http.post("/role/updRole",roleObject).then((res) => {
    if (res.data) {
      ElMessage.success('修改成功')
      addOrEditDrawerModal.value = false
      getRoleFetch()
    } else {
      ElMessage.error('操作有误,请重试!')
    }
    getRoleFetch()
  })
}

//判断当前抽屉的按钮操作是添加还是修改
const handleSubmit = () => {
  if (addOrEditDrawerTitle.value === "添加角色") {
    addRoleSubmit(); // 调用添加角色的方法
  } else if (addOrEditDrawerTitle.value === "编辑角色") {
    updateRoleSubmit(); // 调用修改角色的方法
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
      dialog.value=false
      //deptData.splice(0, deptData.length)
    })
    .catch(() => {
      return
    })
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getRoleFetch()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getRoleFetch()
}



//页面加载时挂载
onMounted(() => {
  getRoleFetch()
})

//判断修改角色状态前逻辑，判断角色id是否相同，如果相同拦截并不让更改，否则放行
const beforeChange = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

// 修改角色状态改变事件
const updateUserStatus = async (rid, roleStatus, roleName) => {
  try {
    const response = await http.put(`/role/update/${rid}/${roleName}`)
    if (response.data) {
      ElNotification({
        title: '修改成功!',
        message: `角色 ${roleName} 的状态已更新为 ${roleStatus === 0 ? '正常' : '禁用'}`,
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

//按钮切换主逻辑方法
const handleBeforeChange = async (uid, value, username) => {
  //将当前开关的动画状态开启
  rowLoadingMap[uid] = true
  try {
    //执行beforeChange和更改角色状态
    await beforeChange()
    await updateUserStatus(uid, value, username)
    return true
  } catch (error) {
    console.error(error.message)
    return false // 阻止状态切换
  } finally {
    rowLoadingMap[uid] = false
  }
}

// 获取角色列表
const getRoleFetch = () => {

  http
    .get('/role/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyWord: keyWord.value,
      },
    })
    .then((res) => {
      const list = Array.isArray(res.data.list) ? res.data.list : []
      roleData.splice(0, roleData.length, ...list)
      pageTotal.value = res.data?.total || 0
    })
}
</script>
