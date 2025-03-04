<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addRegistrationFee">
              <i class="iconfont icon-chakan" style="margin-right: 6px"></i>
              <span>查看档案</span>
            </el-button>
            <el-button type="primary">
              <i class="iconfont icon-chakan" style="margin-right: 6px"></i>
              <span>查看就诊病例</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchRegistrationFee"
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
            <el-table
              :data="registrationFeeData"
              style="width: 100%"
              max-height="500"
              row-key="dictId"
            >
              <el-table-column fixed type="selection" width="55" />
              <el-table-column label="姓名" prop="regItemId" width="120" />
              <el-table-column label="电话" prop="regItemName" width="180" />
              <el-table-column label="身份证号" prop="regItemFee" />
              <el-table-column label="出生日期" prop="createTime" width="200" />
              <el-table-column label="年龄" prop="createBy" width="200" />
              <el-table-column label="性别" prop="updateTime" width="200" />
              <el-table-column label="信息状态" prop="updateBy" width="200" />
              <el-table-column label="创建时间" prop="updateBy" width="200" />
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="160">
                <template #default="scope">
                  <el-button-group>
                    <el-button
                      type="success"
                      size="small"
                      @click="editRegistrationFee(scope.row.userId)"
                    >
                      <el-icon><Edit /></el-icon>
                      <span>编辑</span>
                    </el-button>
                    <el-button
                      type="danger"
                      size="small"
                      @click="delRegistrationFee(scope.row.userId)"
                    >
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
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const registrationFeeData = reactive([]) //科室数据
const rowLoadingMap = reactive({}) //是否处于加载状态

//模糊查询
const searchRegistrationFee = (keyWordInput) => {
  keyWord.value = keyWordInput
  ElMessage.info(keyWord.value)
  // getUserData()
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getAnnouncementFetch()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getAnnouncementFetch()
}

//页面加载时挂载
onMounted(() => {
  getAnnouncementFetch()
})

const getAnnouncementFetch = () => {
  //获取检查费用数据
  http
    .get('/registeredItem/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyWord: keyWord.value,
      },
    })
    .then((res) => {
      const list = Array.isArray(res.data.list) ? res.data.list : []
      registrationFeeData.splice(0, registrationFeeData.length, ...list)
      pageTotal.value = res.data?.total || 0
    })
}
</script>

<style>
@import url('https://at.alicdn.com/t/c/font_4844128_bktal3kxbw.css');
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
