<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addUser">
              <el-icon><Plus /></el-icon>
              <span>新增用户</span>
            </el-button>
            <el-button type="success">
              <el-icon><Refresh /></el-icon>
              <span>重置选中用户账号</span>
            </el-button>
            <el-button type="danger">
              <el-icon><Minus /></el-icon>
              <span>删除选中用户</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchUser"
              placeholder="请输入关键字回车以查询"
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
            <el-table :data="userData" style="width: 100%" max-height="500" row-key="userId">
              <el-table-column fixed type="selection" width="55" />
              <el-table-column label="用户头像" property="picture">
                <template #default="scope">
                  <el-image style="width: 48px; height: 48px" :src="`${scope.row.picture}`" />
                </template>
              </el-table-column>
              <el-table-column label="用户姓名" prop="userName" width="120" />
              <el-table-column label="所属部门" prop="deptId" />
              <el-table-column label="手机号码" prop="phone" width="120" />
              <el-table-column label="性别" prop="sex">
                <template #default="scope">
                  <el-tag v-if="scope.row.sex === 0" type="primary">男</el-tag>
                  <el-tag v-if="scope.row.sex === 1" type="danger">女</el-tag>
                  <el-tag v-if="scope.row.sex === 2" type="info">未知</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="年龄" prop="age" />
              <el-table-column label="是否参与排班" prop="schedulingFlag" width="120">
                <template #default="scope">
                  <span>{{ scope.row.schedulingFlag === 0 ? '是' : '否' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="级别" prop="userRank" />
              <el-table-column label="教育背景" prop="background" />
              <el-table-column label="用户状态" prop="status">
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
                    :loading="rowLoadingMap[scope.row.userId]"
                  />
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="createTime" width="200" />
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="240">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="success" size="small" @click="editUser(scope.row.userId)">
                      <el-icon><Edit /></el-icon>
                      <span>编辑</span>
                    </el-button>
                    <el-button type="danger" size="small" @click="delUser(scope.row.userId)">
                      <el-icon><Delete /></el-icon>
                      <span>删除</span>
                    </el-button>
                    <el-button type="primary" size="small">
                      <el-icon><Pointer /></el-icon>
                      <span>分配角色</span>
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

  <!-- 添加用户和编辑用户抽屉 -->
  <el-drawer
    v-model="addOrEditDrawerModal"
    :title="addOrEditDrawerTitle"
    size="30%"
    :before-close="beforeChangeAddOrEditDrawer"
  >
    <el-row>
      <el-col :span="20">
        <el-form :model="userObject" label-width="auto" style="max-width: 600px">
          <el-form-item label="用户名">
            <el-input v-model="userObject.userName" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userObject.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userObject.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="所属部门">
            <el-select v-model="userObject.deptId" @click="getAllDept" placeholder="所属科室">
              <el-option
                v-for="item in deptData"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="级别">
            <el-select v-model="value" placeholder="用户级别">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="背景">
            <el-select v-model="value" placeholder="学历">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="userObject.age" :min="18" :max="200" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userObject.sex">
              <el-radio value="0">男</el-radio>
              <el-radio value="1">女</el-radio>
              <el-radio value="2">未知</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="userObject.status">
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否参与排班">
            <el-radio-group v-model="userObject.schedulingFlag">
              <el-radio value="0">是</el-radio>
              <el-radio value="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-divider />
    <el-row class="text-center">
      <el-col>
        <el-button type="primary">提交</el-button>
        <el-button type="primary">取消</el-button>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script setup lang="ts">
import http from '@/http'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const addOrEditDrawerModal = ref(false) //添加或编辑用户抽屉
const addOrEditDrawerTitle = ref('') //添加或编辑用户抽屉标题
const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const userData = reactive([]) //用户数据
const rowLoadingMap = reactive({}) //是否处于加载状态
const deptData = reactive([]) //科室数据

const userObject = reactive({
  userId: '',
  userName: '',
  email: '',
  deptId: '',
  phone: '',
  age: '',
  sex: '0',
  status: '0',
  userRank: '',
  schedulingFlag: '0',
}) //用户对象，用于存储添加或修改的用户信息

//获取科室数据
const getAllDept = () => {
  if (deptData.length === 0) {
    http.get('/dept/list').then((res) => {
      const list = Array.isArray(res.data.list) ? res.data.list : []
      deptData.splice(0, deptData.length, ...list)
    })
  }
}

//模糊查询
const searchUser = (keyWordInput) => {
  keyWord.value = keyWordInput
  ElMessage.info(keyWord.value)
  // getUserData()
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getUserData()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getUserData()
}

//添加用户
const addUser = () => {
  addOrEditDrawerTitle.value = '添加用户'
  addOrEditDrawerModal.value = true
}

//删除用户
const delUser = (userId) => {
  ElMessage.info(userId)
}

//编辑用户
const editUser = (userId) => {
  addOrEditDrawerTitle.value = '编辑用户'
  addOrEditDrawerModal.value = true
}

const beforeChangeAddOrEditDrawer = () => {
  ElMessageBox.confirm('你确定要关闭吗?所有数据将不会做任何保存', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      addOrEditDrawerModal.value = false
      deptData.splice(0, deptData.length)
    })
    .catch(() => {
      return
    })
}

//判断修改前逻辑，判断id是否相同，如果相同拦截并不让更改，否则放行
const beforeChange = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}
// 修改用户状态改变事件
const updateUserStatus = async (uid, userStatus, username) => {
  try {
    const response = await http.put(`/user/update/${uid}/${userStatus}`)
    if (response.data) {
      ElNotification({
        title: '修改成功!',
        message: `用户 ${username} 的状态已更新为 ${userStatus === 0 ? '正常' : '禁用'}`,
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
    //执行beforeChange和更改用户状态
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

// 页面加载时获取用户数据
onMounted(() => {
  getUserData()
})

// 获取用户数据
const getUserData = () => {
  http
    .get('/user/getAll', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyWord: keyWord.value,
      },
    })
    .then((res) => {
      const user = res.data
      if (user.list) {
        pageTotal.value = user.total
        pageNum.value = user.pageNum
        pageSize.value = user.pageSize
        userData.splice(0, userData.length, ...user.list)
      }
    })
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
