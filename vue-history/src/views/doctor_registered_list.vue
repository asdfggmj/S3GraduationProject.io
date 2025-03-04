<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addRegistrationFee">
              <el-icon><Plus /></el-icon>
              <span>新增</span>
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
              <el-table-column label="患者姓名" prop="regItemId" width="120" />
              <el-table-column label="挂号科室" prop="regItemName" width="180" />
              <el-table-column label="接诊医生" prop="regItemFee" />
              <el-table-column label="挂号费用" prop="status" />
              <el-table-column label="流水编号" prop="createTime" width="200" />
              <el-table-column label="状态" prop="createBy" width="200" />
              <el-table-column label="就诊日期" prop="updateTime" width="200" />
              <el-table-column label="挂号类型" prop="updateBy" width="200" />
              <el-table-column label="挂号时段" prop="updateBy" width="200" />
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="180">
                <template #default="scope">
                  <el-button-group>
                    <el-button
                      type="success"
                      size="small"
                      @click="editRegistrationFee(scope.row.userId)"
                    >
                      <i class="iconfont icon-shoufei" style="margin-right: 6px" />
                      <span>收费</span>
                    </el-button>
                    <el-button
                      type="danger"
                      size="small"
                      @click="delRegistrationFee(scope.row.userId)"
                    >
                      <i class="iconfont icon-tuifei" style="margin-right: 6px" />
                      <span>退费</span>
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
@import url('https://at.alicdn.com/t/c/font_4844128_ml5lxuth918.css');
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
