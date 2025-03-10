<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <!-- 模糊查询 -->
          <el-form-item label="系统模块" style="font-size: 15px;">
      <el-input v-model="title"   placeholder="请输入系统模块"/>
    </el-form-item>
    <el-row>
      <el-col :span="12">
    <el-form-item label="创建时间" style="font-size: 15px;">
      <el-date-picker
        v-model="operTime"
        type="date"
        placeholder=""
        clearable
      />
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-button type="primary" :icon="Search" @click="searchLoginLog">
      搜索
      </el-button>
      <el-button type="plain" :icon="Refresh" >
      重置
      </el-button>
      </el-col>
      </el-row>
        </el-row>
        <el-col :span="12">
            <el-button type="primary" @click="addLoginLog">
              <el-icon><Plus /></el-icon>
              <span>删除</span>
            </el-button>
            <el-button type="danger">
              <el-icon><Minus /></el-icon>
              <span>清空</span>
            </el-button>
          </el-col>
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
            <el-table :data="operLogData" style="width: 100%" max-height="500" row-key="operId">
              <el-table-column fixed type="selection" width="55" />
              <el-table-column label="日志ID" prop="operId" width="120" />
              <el-table-column label="系统模块" prop="businessType" width="120" />
              <el-table-column label="操作类型" prop="operatorType" />
              <el-table-column label="请求方式" prop="requestMethod" width="200" />
              <el-table-column label="操作人员" prop="operName" width="200" />
              <el-table-column label="主机" prop="operIp" width="200" />
              <el-table-column label="操作地点" prop="operLocation" width="200" />
              <el-table-column label="操作状态" prop="status" width="200" />
              <el-table-column label="操作时间" prop="operTime" width="200" />

              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="240">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="danger" size="small" @click="delOperateLog(scope.row.userId)">
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
import { onMounted, reactive, ref } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import http from '@/http'
import { useCookies } from '@vueuse/integrations/useCookies';

//从cookie获取authorization
const cookie=useCookies();
const auhtorization=cookie.get('authorization')

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const operName = ref('')
const title = ref('')
const status = ref('')
const operatorType = ref('')
const operTime = ref('')

//操作日志数据
const operLogData = reactive([
  {
    operId:'',
    title:'',
    businessType:'',
    method:'',
    requestMethod:'',
    operatorType:'',
    operName:'',
    operUrl:'',
    operLocation:'',
    operParam:'',
    jsonResult:'',
    status:'',
    errorMsg:'',
    operTime:''
  }
])

//模糊查询
const searchLoginLog = () => {
   getLoginLoginData()
}

//添加操作日志
const addLoginLog = () => {

}

//删除操作日志
const delOperateLog = (userId) => {

}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getLoginLoginData()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getLoginLoginData()
}

// 页面加载时获取操作数据
onMounted(() => {
  getLoginLoginData()
})

// 获取操作日志记录数据
const getLoginLoginData = () => {
  http
    .get('/operLog/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        title: title.value,
        operName: operName.value,
        status: status.value,
        operatorType: operatorType.value,
        operTime: operTime.value
      },headers: { 'Authorization': 'Bearer' + auhtorization }
    })
    .then((res) => {
      const operLog = res.data.data
      if (operLog.list) {
        pageTotal.value = operLog.total
        pageNum.value = operLog.pageNum
        pageSize.value = operLog.pageSize
        operLogData.splice(0, operLogData.length, ...operLog.list)
      }
    })
  }
</script>
