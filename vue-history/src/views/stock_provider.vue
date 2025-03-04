<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addDict">
              <el-icon><Plus /></el-icon>
              <span>新增供应商</span>
            </el-button>
            <el-button type="danger">
              <el-icon><Minus /></el-icon>
              <span>删除选中</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchDict"
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
            <el-table :data="dictData" style="width: 100%" max-height="500" row-key="dictId">
              <el-table-column fixed type="selection" width="55" />
              <el-table-column label="供应商编号" prop="dictName" width="120" />
              <el-table-column label="供应商名称" prop="dictType" width="200" />
              <el-table-column label="联系人" prop="dictType" width="200" />
              <el-table-column label="联系人手机号码" prop="dictType" width="200" />
              <el-table-column label="联系人电话" prop="dictType" width="200" />
              <el-table-column label="银行账号" prop="dictType" width="200" />
              <el-table-column label="地址" prop="dictType" width="200" />
              <el-table-column label="状态" prop="status" width="100">
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
              <el-table-column label="创建人" prop="createBy" width="120" />
              <el-table-column label="最后一次修改时间" prop="updateTime" width="200" />
              <el-table-column label="修改人" prop="updateBy" width="120" />
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="160">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="success" size="small" @click="editDept(scope.row.userId)">
                      <el-icon><Edit /></el-icon>
                      <span>编辑</span>
                    </el-button>
                    <el-button type="danger" size="small" @click="delDept(scope.row.userId)">
                      <el-icon><Delete /></el-icon>
                      <span>删除</span>
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
import router from '@/router'
import { useDictTypeStore } from '@/stores/dictType'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const dictData = reactive([]) //科室数据
const rowLoadingMap = reactive({}) //是否处于加载状态
const dictTypeStore = useDictTypeStore() //使用字典类别的xx

//根据ID查看数据类别的数据
const checkDictData = (dictType) => {
  dictTypeStore.setDictType({ dictType: dictType })
  console.log(dictTypeStore.getDictType)
  ElMessage.success(dictType)
  router.push({ name: 'dictData' })
}

//模糊查询
const searchDict = (keyWordInput) => {
  keyWord.value = keyWordInput
  ElMessage.info(keyWord.value)
  // getUserData()
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getDictFetch()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getDictFetch()
}

//页面加载时挂载
onMounted(() => {
  getDictFetch()
})

const getDictFetch = () => {
  //获取字典数据
  http
    .get('/dict/type', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyWord: keyWord.value,
      },
    })
    .then((res) => {
      const list = Array.isArray(res.data.list) ? res.data.list : []
      dictData.splice(0, dictData.length, ...list)
      pageTotal.value = res.data?.total || 0
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
