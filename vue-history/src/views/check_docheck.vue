<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="hover" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-text class="mr-20px">检查项目</el-text>
            <el-radio-group v-model="checkedRegItem">
              <el-radio-button
                v-for="item in registeredItems"
                :key="item.regItemId"
                :label="item.regItemName"
                :value="item.regItemId"
              >
                {{ item.regItemName }}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="mt-10px">
          <el-col :span="8">
            <el-form-item label="检查单号">
              <el-input placeholder="请输入检查单号" />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left: 6px"
            ><el-button type="primary">
              <el-icon><Search /></el-icon>
              <span>查询</span>
            </el-button></el-col
          >
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第二行 -->
  <el-row class="mb-10px">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row>
          <el-col>
            <el-table
              :data="careOrderItemList"
              border
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <el-table-column label="序号" type="index" width="80" />
              <el-table-column label="详细ID" prop="itemId" width="240" />
              <el-table-column label="项目名称" prop="itemName" width="160" />
              <el-table-column label="数量" prop="num" width="120" />
              <el-table-column label="单价(元)" prop="price" width="160" />
              <el-table-column label="总价(元)" prop="amount" width="160" />
              <el-table-column label="备注" prop="remark" width="220" />
              <el-table-column label="状态" prop="dictLabel" />
            </el-table>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第三行 -->
  <el-row>
    <el-col>
      <el-card shadow="hover">
        <el-row>
          <el-col :span="6">
            <el-text>挂号单号：</el-text>
            <el-text type="danger">{{ checkedData.regId }}</el-text>
          </el-col>
          <el-col :span="6">
            <el-text>患者姓名：</el-text>
            <el-text type="danger">{{ checkedData.patientName }}</el-text>
          </el-col>
          <el-col :span="6">
            <el-text>检查项目：</el-text>
            <el-text type="danger">{{ checkedData.itemName }}</el-text>
          </el-col>
          <el-col :span="6">
            <el-text>检查备注：</el-text>
            <el-text type="danger">{{ checkedData.remark }}</el-text>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" class="mt-10px w-100max" @click="startRegItemFetch">
              <el-icon><Plus /></el-icon>
              <span>开始检查</span>
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import http from '@/http'
import { onMounted, reactive, ref } from 'vue'

const registeredItems = ref([]) //检查项目列表
const checkedRegItem = ref(1) //选中的检查项目
const checkItemList = ref([]) // 存储动态获取的检查项
const careOrderItemList = ref([]) //  所有已支付的检查项目
const checkedData = reactive({
  regId: '',
  patientName: '',
  itemName: '',
  remark: '',
})

//开始检查方法
const startRegItemFetch = () => {
  console.log(checkedRegItem.value)
}

//获取展示检查项目
const getRegItemFetch = () => {
  http.get('/registeredItem/list').then((res) => {
    registeredItems.value = res.data.list
  })
}

//单选改变事件
const handleCurrentChange = (value) => {
  checkedData.itemName = value.itemName
  checkedData.remark = value.remark
  checkedData.regId = value.patientId
  checkedData.patientName = value.patientName
}

//获取检查和用药项目数据
const getCheckItemFetchData = () => {
  http.get('/checkItem/getCheckIdAndName').then((res) => {
    const list = Array.isArray(res.data) ? res.data : []
    checkItemList.value = list.map((item) => ({
      label: item.checkItemName, // 确保后端返回的字段有 `name`
      value: item.checkItemId, // 确保后端返回的字段有 `id`
    }))
  })
}

//获取所有检查项目
const getCareOrderItemFetch = () => {
  http.get('/dictData/getCareOrderItem').then((res) => {
    careOrderItemList.value = res.data
  })
}

//页面加载时挂载
onMounted(() => {
  getCheckItemFetchData()
  getCareOrderItemFetch()
  getRegItemFetch()
})
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
.w-100max {
  width: 100%;
}
</style>
