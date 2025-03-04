<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-text class="mr-20px">检查项目</el-text>
            <el-segmented v-model="trigger" :options="options" />
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="8">
            <el-input v-model="keyWord" placeholder="请输入检查单号回车以查询" />
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
              <el-table-column label="检查单号" prop="regItemId" width="120" />
              <el-table-column label="项目名称" prop="regItemName" width="180" />
              <el-table-column label="患者姓名" prop="regItemFee" />
              <el-table-column label="检查状态" prop="createTime" width="200" />
              <el-table-column label="检查结果" prop="createBy" width="200" />
              <el-table-column label="创建时间" prop="updateTime" width="200" />
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="160">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="success" size="small" @click="seeResult">
                      <el-icon><Edit /></el-icon>
                      <span>查看结果</span>
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

  <!-- 检查结果对话框 -->
  <el-dialog
    v-model="resultVisible"
    title="查看[患者名]的检查结果"
    width="500"
    :before-close="handleClose"
  >
    <el-row>
      <el-col>
        <el-form-item label="检查结果">
          <el-input v-model="textarea" style="width: 240px" :rows="2" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-upload
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture"
        >
          <el-button type="primary">Click to upload</el-button>
          <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
          </template>
        </el-upload>
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resultVisible = false">取消</el-button>
        <el-button type="primary" @click="resultVisible = false"> 确认录入 </el-button>
      </div>
    </template>
  </el-dialog>
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
const resultVisible = ref(false) //查看结果对话框控制显示

const trigger = ref<'乙肝五项' | '乙肝五项'>('乙肝五项')
const options = ['乙肝五项', '血常规', 'CT', 'X光']

//查看检查结果
const seeResult = () => {
  resultVisible.value = true
}

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
