<!-- 看病就诊 -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col>
      <el-card shadow="always" class="mb-10px">
        <el-row style="line-height: 50px">
          <el-col :span="8">
            <div class="flex gap-4 mb-4">
              <span>身份证号</span>
              <el-input
                v-model="idCode"
                style="width: 320px; margin-left: 20px"
                placeholder="请输入身份证号"
              />
            </div>
          </el-col>
          <el-col :span="8" style="margin-left: 40px">
            <el-button type="primary" @click="getPatientFetch">
              <el-icon><Search /></el-icon>
              <span>加载身份证号</span>
            </el-button>
            <el-button type="primary" @click="addPatientFetch">
              <el-icon><Search /></el-icon>
              <span>加载患者信息</span>
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第二行 -->
  <el-row>
    <el-col>
      <el-card shadow="always" class="mb-10px">
        <el-form :model="patientForm" label-width="auto">
          <el-row>
            <el-col :span="5">
              <el-form-item label="身份证号">
                <el-input v-model="patientForm.idCode" />
              </el-form-item>
              <el-form-item label="患者姓名">
                <el-input v-model="patientForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="5" class="ml-20px">
              <el-form-item label="患者电话">
                <el-input v-model="patientForm.phone" />
              </el-form-item>
              <el-form-item label="出生日期">
                <el-date-picker
                  v-model="patientForm.birthday"
                  type="date"
                  placeholder="出生日期"
                  format="YYYY-MM-DD"
                  date-format="MMM DD, YYYY"
                  time-format="HH:mm"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5" class="ml-20px">
              <el-form-item label="患者年龄">
                <el-input-number v-model="patientForm.age" :min="1" :max="200" />
              </el-form-item>
              <el-form-item label="患者性别">
                <el-radio-group v-model="patientForm.sex">
                  <el-radio value="0">男</el-radio>
                  <el-radio value="1">女</el-radio>
                  <el-radio value="2">未知</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="患者地址">
                <el-input
                  v-model="patientForm.address"
                  :rows="4"
                  type="textarea"
                  placeholder="患者地址"
                  resize="none"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第三行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="10">
            <el-radio-group v-model="selectedItemId">
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
          <el-col :span="5">
            <span class="mr-20px">挂号费：{{ getSelectedItemFee }}￥</span>
            <el-button type="danger">
              <el-icon><Pointer /></el-icon>
              <span>挂号收费</span>
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第四行 -->
  <el-row>
    <el-col>
      <el-card shadow="always" class="mb-10px">
        <el-row>
          <!-- 所属科室 -->
          <el-col :span="4" class="mr-20px">
            <el-form-item label="所属科室">
              <el-select
                v-model="selectedDeptId"
                @focus="getAllDeptDataFetch"
                placeholder="请选择所属科室"
                style="width: 240px"
              >
                <el-option
                  v-for="item in deptData"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 挂号类型 -->
          <el-col :span="4" class="mr-20px">
            <el-form-item label="挂号类型">
              <el-select
                v-model="querySelectedItemId"
                placeholder="请选择挂号类型"
                style="width: 240px"
              >
                <el-option
                  v-for="item in queryRegisteredItems"
                  :key="item.regItemId"
                  :label="item.regItemName"
                  :value="item.regItemId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 挂号时段 -->
          <el-col :span="4" class="mr-20px">
            <el-form-item label="挂号时段">
              <el-select
                v-model="selectedTimeDataId"
                @focus="getAllTimesDataFetch"
                placeholder="请选择挂号时段"
                style="width: 240px"
              >
                <el-option
                  v-for="item in timeData"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 挂号时间 -->
          <el-col :span="4" class="mr-20px">
            <el-form-item label="挂号时间">
              <el-date-picker
                v-model="queryRegTime"
                type="date"
                placeholder="挂号时间"
                format="YYYY-MM-DD"
                date-format="MMM DD, YYYY"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="getTodaySchedulingFetch()">
                <el-icon><Search /></el-icon>
                <span>搜索</span>
              </el-button>
              <el-button type="primary" @click="resetQuery">
                <el-icon><Refresh /></el-icon>
                <span>重置</span>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-table :data="registeredData" border>
              <el-table-column prop="deptId" label="部门编号" />
              <el-table-column prop="deptName" label="部门名称" />
              <el-table-column prop="currentNumber" label="当前号数" />
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
              :page-sizes="[3, 6, 10]"
              :current-page="pageNum"
              @size-change="sizeChange"
              @current-change="currentChange"
            />
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>

  <!-- 加载患者信息抽屉 -->
  <el-drawer
    v-model="loadPatientDrawerVisible"
    title="从数据库中添加患者信息"
    :before-close="handlePatientDrawerClose"
  >
    <el-card shadow="always">
      <el-row>
        <el-col>
          <el-table
            :data="patientData"
            border
            style="height: 500px; max-height: 500px"
            highlight-current-row
            :ref="patientData.patientId"
            row-key="idCard"
            @row-click="handleRowClick"
          >
            <el-table-column prop="name" label="名字" width="160" />
            <el-table-column prop="idCard" label="身份证" />
            <!-- 空数据时显示 -->
            <template #empty>
              <el-empty description="没有找到任何患者呢？！？" />
            </template>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页行 -->
      <el-row class="mt-10px">
        <el-col :span="24">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pageTotal"
            :pager-count="11"
            :page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :current-page="pageNum"
            @size-change="sizeChange"
            @current-change="currentChange"
            size="small"
          />
        </el-col>
      </el-row>
      <el-row class="mt-10px" style="text-align: right">
        <el-col>
          <el-button type="primary" @click="selectedPatientFetch">确定</el-button>
        </el-col>
      </el-row>
    </el-card>
  </el-drawer>
</template>

<script setup lang="ts">
import http from '@/http'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

const queryRegTime = ref(null) //挂号时间
const queryTypeKeyword = ref(null) //搜索关键词
const selectedTimeDataId = ref(null) //选中的时段ID
const timeData = ref([]) //时段ID
const selectedDeptId = ref(null) //选中的科室ID
const deptData = ref([]) //科室数据
const querySelectedItemId = ref(null) //搜索选中的挂号类型
const queryRegisteredItems = ref([]) //搜索挂号数据类型
const selectedItemId = ref(1) //选中的挂号编号
const registeredItems = ref([])
const pageNum = ref(1) //当前页
const pageSize = ref(3) //每页显示的数据
const pageTotal = ref(0) //总个数
const idCode = ref('') //身份证号
const patientForm = ref({
  idCode: '',
  name: '',
  phone: '',
  age: 0,
  sex: '0',
  birthday: '',
  address: '',
}) //患者信息
const loadPatientDrawerVisible = ref(false) //加载患者信息抽屉显示控制
const patientData = ref([]) //加载的患者信息
const selectedPatientIdCode = ref('') //加载患者信息的选中身份证号
const selectedPatient = ref(null) // 选中的患者信息
const registeredData = ref([]) //当天挂号数据

//获取当天的所有排班信息
const getTodaySchedulingFetch = () => {
  console.log('选中的科室ID' + selectedDeptId.value)
  console.log('选中的挂号类型' + querySelectedItemId.value)
  console.log('选中的挂号时段' + selectedTimeDataId.value)
  console.log('选中的挂号时间' + queryRegTime.value)

  http
    .post('/doctors/getScheduleData', {
      deptId: selectedDeptId.value,
      regTypeId: querySelectedItemId.value,
      timePeriod: selectedTimeDataId.value,
      date: queryRegTime.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    })
    .then((res) => {
      registeredData.value = res.data.data?.list || [] // 防止 list 为空时报错
      pageNum.value = res.data.data?.pageNum || 1
      pageSize.value = res.data.data?.pageSize || 3
      pageTotal.value = res.data.data?.total || 0
      console.log(res.data.data)
    })
}

// 点击某行时，记录选中的身份证号
const handleRowClick = (row) => {
  selectedPatientIdCode.value = ''
  selectedPatientIdCode.value = row.idCard
}

//根据身份证查询赋值患者信息
const selectedPatientFetch = () => {
  selectedPatient.value = []
  if (!selectedPatientIdCode.value) {
    ElMessage.warning('你还没有选择患者啊！')
    return
  }

  selectedPatient.value = patientData.value.find(
    (patient) => patient.idCard === selectedPatientIdCode.value,
  )

  if (!selectedPatient.value) {
    ElMessage.warning('未找到该患者信息!')
  } else {
    Object.assign(patientForm.value, {
      idCode: selectedPatient.value.idCard,
      name: selectedPatient.value.name,
      phone: selectedPatient.value.phone,
      birthday: selectedPatient.value.birthDay,
      sex: selectedPatient.value.sex,
      address: selectedPatient.value.address,
    })
    loadPatientDrawerVisible.value = false // 关闭弹窗
  }
}

//加载患者
const addPatientFetch = () => {
  loadPatientDrawerVisible.value = true
  if (patientData.value.length === 0) {
    http.get('/patient/list').then((res) => {
      patientData.value = res.data.list || [] // 确保是数组
    })
    console.log(patientData.value)
  }
}

const handlePatientDrawerClose = () => {
  ElMessageBox.confirm('你确定要关闭吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    loadPatientDrawerVisible.value = false
  })
}

//获取所有时段
const getAllTimesDataFetch = () => {
  if (timeData.value.length === 0) {
    queryTypeKeyword.value = 'his_subsection_type'
    http.get(`/dict/get/${queryTypeKeyword.value}`).then((res) => {
      timeData.value = res.data.data
    })
  }
}

//重置查询条件
const resetQuery = () => {
  selectedDeptId.value = null
  selectedItemId.value = 1
}

//获取所有科室
const getAllDeptDataFetch = () => {
  if (deptData.value.length === 0) {
    http.get('/dept/getAll').then((res) => {
      deptData.value = res.data
    })
  }
}

//计算选中的挂号费用
const getSelectedItemFee = computed(() => {
  const selectedItem = registeredItems.value.find((item) => item.regItemId === selectedItemId.value)
  return selectedItem ? selectedItem.regItemFee : 0
})

onMounted(() => {
  getRegItemFetch()
  getTodaySchedulingFetch()
})

//获取挂号类型
const getRegItemFetch = () => {
  http.get('/registeredItem/list').then((res) => {
    registeredItems.value = res.data.list
    queryRegisteredItems.value = res.data.list
  })
}

//根据身份者号获取患者信息
const getPatientFetch = () => {
  if (patientForm.value.idCode === '') {
    ElMessage.warning('身份证不可为空')
    return
  }
  http.get(`/patient/get/${idCode.value}`).then((res) => {
    if (res.data.data === null || res.data.data === '') {
      ElMessage.warning('未查询到该患者，请手动添加信息')
    } else {
      ElMessage.success(`查询到1个患者`)
      patientForm.value.idCode = res.data.data.idCard
      patientForm.value.phone = res.data.data.phone
      patientForm.value.sex = res.data.data.sex
      patientForm.value.name = res.data.data.name
      const birthDate = new Date(res.data.data.birthDay) // 将生日字符串转换为 Date 对象
      const currentYear = new Date().getFullYear() // 获取当前年份
      const birthYear = birthDate.getFullYear() // 获取出生年份
      patientForm.value.age = currentYear - birthYear // 计算年龄
      patientForm.value.birthday = res.data.data.birthDay
      patientForm.value.address = res.data.data.address
    }
  })
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  // getUserData()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  // getUserData()
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
.ml-20px {
  margin-left: 20px;
}
.text-center {
  text-align: center;
}
</style>
