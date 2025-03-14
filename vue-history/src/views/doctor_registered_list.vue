<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="5">
            <el-form-item label="患者名字">
              <el-input v-model="selectedRegName" placeholder="请选择患者名字" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="挂号时间">
              <el-date-picker v-model="selectedTime" type="date" placeholder="请选择患者挂号时间" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="挂号类型">
              <el-select v-model="selectedRegType" placeholder="请选择挂号类型">
                <el-option
                  v-for="item in regRegTypeDataMap"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="挂号时段">
              <el-select v-model="selectedRegTime" placeholder="请选择挂号时段">
                <el-option
                  v-for="item in regRegTimeDataMap"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between">
          <el-col :span="5">
            <el-form-item label="挂号状态">
              <el-select v-model="selectedRegStatus" placeholder="请选择挂号状态">
                <el-option
                  v-for="item in regStatusDataMap"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="所属部门">
              <el-select v-model="selectedDept" placeholder="请选择所属科室">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary">
              <el-icon><Search /></el-icon>
              <span>搜索</span>
            </el-button>
            <el-button type="primary">
              <el-icon><Refresh /></el-icon>
              <span>重置</span>
            </el-button>
          </el-col>
          <el-col :span="5"></el-col>
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
              border
              :data="regListData"
              style="width: 100%"
              max-height="500"
              row-key="regId"
            >
              <el-table-column label="挂号编号" prop="regId" width="220" />
              <el-table-column label="患者姓名" prop="patientName" width="120" />
              <el-table-column label="挂号科室" prop="deptName" width="180"> </el-table-column>
              <el-table-column label="接诊医生" prop="doctorName" width="120" />
              <el-table-column label="挂号费用(元)" prop="regItemAmount" width="120" />
              <el-table-column label="流水编号" prop="regNumber" width="100" />
              <el-table-column label="状态" prop="regStatus" width="100">
                <template #default="scope">
                  <span>{{ regStatusDataMap[scope.row.regStatus] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="就诊日期" prop="visitDate" width="200" />
              <el-table-column label="挂号类型" prop="schedulingType" width="120">
                <template #default="scope">
                  <span>{{ regRegTypeDataMap[scope.row.subsectionType] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="挂号时段" prop="subsectionType" width="120">
                <template #default="scope">
                  <span>{{ regRegTimeDataMap[scope.row.subsectionType] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="挂号员" prop="createBy" width="120" />
              <el-table-column label="创建时间" prop="createTime" width="200">
                <template #default="scope">
                  <span>{{ formatDate(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="100">
                <template #default="scope">
                  <el-button-group>
                    <el-button
                      type="success"
                      size="small"
                      @click="joinFee(scope.row.userId)"
                      v-show="scope.row.regStatus === '0'"
                    >
                      <i class="iconfont icon-shoufei" style="margin-right: 6px" />
                      <span>收费</span>
                    </el-button>
                    <el-button
                      type="danger"
                      size="small"
                      @click="backFee(scope.row.userId)"
                      v-show="scope.row.regStatus === '1'"
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
import { dayjs, ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const regListData = reactive([]) //挂号数据
const regStatusDataMap = ref([]) //状态字典map数据
const regRegTimeDataMap = ref([]) //挂号时段字典map数据
const regRegTypeDataMap = ref([]) //挂号类型字典map数据
const selectedRegStatus = ref('') //选中的挂号状态（查询用）
const selectedRegTime = ref('') //选中的挂号时段（查询用）
const selectedRegType = ref('') //选中的挂号类型（查询用）
const selectedTime = ref('') //选中的挂号时间（查询用）
const selectedDept = ref('') //选中的部门（查询用）
const selectedRegName = ref('') //选中的患者名称（查询用）

//页面加载时挂载
onMounted(() => {
  getRegListFetch()
  getRegStatusFetch()
  getRegTimeFetch()
  getRegTypeFetch()
})

//收费
const joinFee = (userId) => {
  console.log(userId)
}
//退费
const backFee = (userId) => {
  console.log(userId)
}

//获取挂号时段字典
const getRegTimeFetch = () => {
  http.get('/dictData/get/his_subsection_type').then((res) => {
    const regTimeData = res.data.data || []
    regRegTimeDataMap.value = regTimeData.reduce((map, item) => {
      map[Number(item.dictValue)] = item.dictLabel
      return map
    }, {})
  })
}
//获取挂号类型字典
const getRegTypeFetch = () => {
  http.get('/dictData/get/his_scheduling_type').then((res) => {
    const regTypeData = res.data.data || []
    regRegTypeDataMap.value = regTypeData.reduce((map, item) => {
      map[Number(item.dictValue)] = item.dictLabel
      return map
    }, {})
  })
}

//获取状态字典
const getRegStatusFetch = () => {
  http.get('/dictData/get/his_registration_status').then((res) => {
    const regData = res.data.data || []
    regStatusDataMap.value = regData.reduce((map, item) => {
      map[Number(item.dictValue)] = item.dictLabel
      return map
    }, {})
  })
}

//使用dayjs序列化时间
const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '--'
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getRegListFetch()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getRegListFetch()
}

//获取所有挂号信息
const getRegListFetch = () => {
  http
    .get('/regList/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        regStatus: selectedRegStatus.value,
        regTime: selectedRegTime.value,
        regType: selectedRegType.value,
        regDate: selectedTime.value,
        dept: selectedDept.value,
        regName: selectedRegName.value,
      },
    })
    .then((res) => {
      const list = Array.isArray(res.data.data.list) ? res.data.data.list : []
      regListData.splice(0, regListData.length, ...list)
      pageTotal.value = res.data.data?.total || 0
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
