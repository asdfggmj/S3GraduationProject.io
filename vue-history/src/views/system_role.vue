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
                    :loading="rowLoadingMap[scope.row.userId]"
                  />
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark" width="120" />
              <el-table-column label="创建时间" prop="createTime" width="200" />
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="240">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="success" size="small" @click="editRole(scope.row.userId)">
                      <el-icon><Edit /></el-icon>
                      <span>编辑</span>
                    </el-button>
                    <el-button type="danger" size="small" @click="delRole(scope.row.userId)">
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
</template>

<script setup lang="ts">
import http from '@/http'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const roleData = reactive([]) //科室数据
const rowLoadingMap = reactive({}) //是否处于加载状态

//模糊查询
const searchRole = (keyWordInput) => {
  keyWord.value = keyWordInput
  ElMessage.info(keyWord.value)
  // getUserData()
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

const getRoleFetch = () => {
  // 获取角色列表
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
