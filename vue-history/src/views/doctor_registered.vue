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
                clearable
                v-model="idCard"
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
        <el-form :rules="rules" :model="hisPatient" ref="ruleFormRef" label-width="auto">
          <el-row>
            <el-col :span="5">
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="hisPatient.idCard" placeholder="输入或导入身份证" />
              </el-form-item>
              <el-form-item label="患者姓名" prop="name">
                <el-input v-model="hisPatient.name" placeholder="输入或导入名字" />
              </el-form-item>
            </el-col>
            <el-col :span="5" class="ml-20px">
              <el-form-item label="患者电话" prop="phone">
                <el-input v-model="hisPatient.phone" placeholder="输入或导入电话" />
              </el-form-item>
              <el-form-item label="出生日期" prop="birthDay">
                <el-date-picker
                  v-model="hisPatient.birthDay"
                  type="date"
                  placeholder="选择或导入出生日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5" class="ml-20px">
              <el-form-item label="患者年龄">
                <el-input-number v-model="hisPatient.age" disabled :min="1" :max="200" />
              </el-form-item>
              <el-form-item label="患者性别">
                <el-radio-group v-model="hisPatient.sex">
                  <el-radio value="0">男</el-radio>
                  <el-radio value="1">女</el-radio>
                  <el-radio value="2">未知</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="患者地址">
                <el-input
                  v-model="hisPatient.address"
                  :rows="4"
                  type="textarea"
                  placeholder="输入或导入患者地址"
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
            <el-radio-group v-model="hisRegistration.regItemId">
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
            <el-button type="danger" @click="joinFeeFetch">
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
        <el-form ref="queryFormRef" :model="queryForm" :rules="rules" label-width="auto">
          <el-row>
            <!-- 所属科室 -->
            <el-col :span="4" class="mr-20px">
              <el-form-item label="所属科室">
                <el-select
                  clearable
                  v-model="queryForm.selectedDeptId"
                  @focus="getAllDeptDataFetch"
                  @change="getTodaySchedulingFetch"
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
              <el-form-item label="挂号类型" prop="querySelectedItemId">
                <el-select
                  clearable
                  v-model="queryForm.querySelectedItemId"
                  placeholder="请选择挂号类型"
                  style="width: 240px"
                  @change="getTodaySchedulingFetch"
                >
                  <el-option
                    v-for="item in regTypeMap"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 挂号时段 -->
            <el-col :span="4" class="mr-20px">
              <el-form-item label="挂号时段" prop="selectedTimeDataId">
                <el-select
                  clearable
                  v-model="queryForm.selectedTimeDataId"
                  @focus="getAllTimesDataFetch"
                  @change="getTodaySchedulingFetch"
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
              <el-form-item label="挂号时间" prop="queryRegTime">
                <el-date-picker
                  clearable
                  v-model="queryForm.queryRegTime"
                  :disabled-date="disabledDate"
                  @change="getTodaySchedulingFetch"
                  type="date"
                  placeholder="挂号时间"
                >
                  <!-- <template #default="{ cell }">
                  <div class="cell" :class="{ current: cell.isCurrent, today: isToday(cell.text) }">
                    <span class="text">{{ cell.text }}</span>
                  </div>
                </template> -->
                </el-date-picker>
              </el-form-item>
            </el-col>

            <!-- 按钮组 -->
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
        </el-form>
        <!-- 表格行 -->
        <el-row>
          <el-col>
            <el-table
              :data="registeredData"
              border
              style="height: 260px; max-height: 300px"
              highlight-current-row
              @current-change="handleRowClickByDeptId"
              :ref="registeredData.deptId"
              row-key="deptId"
            >
              <el-table-column prop="deptId" label="部门编号" />
              <el-table-column prop="deptName" label="部门名称" />
              <el-table-column prop="currentNumber" label="当前已挂号数" />
              <template #empty>
                <el-empty description="当日没有数据" :image-size="100" />
              </template>
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
              :page-sizes="[5, 10, 20]"
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
      <!-- 按钮 -->
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
import {
  dayjs,
  ElMessage,
  ElMessageBox,
  ElNotification,
  FormInstance,
  FormRules,
} from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'

const queryTypeKeyword = ref('') //搜索关键词
const timeData = ref([]) //时段ID
const deptData = ref([]) //科室数据
const queryRegisteredItems = ref([]) //搜索挂号数据类型
const registeredItems = ref([])
const pageNum = ref(1) //当前页
const pageSize = ref(5) //每页显示的数据
const pageTotal = ref(0) //总个数
const idCard = ref('') //身份证号
const hisPatient = reactive({
  idCard: '',
  name: '',
  phone: '',
  age: 0,
  sex: '0',
  birthDay: '',
  address: '',
}) // 患者信息
const loadPatientDrawerVisible = ref(false) //加载患者信息抽屉显示控制
const patientData = ref([]) //加载的患者信息
const selectedPatientIdCode = ref('') //加载患者信息的选中身份证号
const selectedPatient = ref(null) // 选中的患者信息
const registeredData = ref([]) //当天挂号数据
const regTypeMap = ref([]) //挂号类型MAP
//挂号信息对象
const hisRegistration = reactive({
  deptId: '',
  regItemId: 1,
  regItemAmount: '',
  schedulingType: '',
  subsectionType: '',
})
const ruleFormRef = ref<FormInstance | null>(null)
const queryFormRef = ref(null) // 绑定表单的 ref
const queryForm = reactive({
  selectedDeptId: '',
  querySelectedItemId: '',
  selectedTimeDataId: '',
  queryRegTime: '',
})

//患者规则验证
const rules = reactive<FormRules>({
  // hisPatient 的表单验证规则
  idCard: [
    { required: true, message: '身份证号不能为空', trigger: 'blur' },
    {
      pattern: /^(^[1-9]\d{5}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)?$)$/,
      message: '身份证号码格式不正确',
      trigger: 'blur',
    },
  ],
  name: [{ required: true, message: '患者姓名不能为空', trigger: 'blur' }],
  phone: [
    { required: true, message: '电话不能为空', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的11位手机号码',
      trigger: 'blur',
    },
  ],

  // hisRegistration 的表单验证规则
  selectedDeptId: [{ required: true, message: '请选择所属科室', trigger: 'change' }],
  querySelectedItemId: [{ required: true, message: '请选择挂号类型', trigger: 'change' }],
  selectedTimeDataId: [{ required: true, message: '请选择挂号时段', trigger: 'change' }],
  queryRegTime: [{ required: true, message: '请选择挂号时间', trigger: 'change' }],
})
//挂号选项规则验证

//挂号收费点击事件
const joinFeeFetch = () => {
  if (!ruleFormRef.value || !queryFormRef.value) return

  // 同时校验两个表单
  Promise.all([ruleFormRef.value.validate(), queryFormRef.value.validate()])
    .then((results) => {
      const [ruleFormValid, queryFormValid] = results
      if (ruleFormValid && queryFormValid) {
        // 赋值挂号费、挂号类型、挂号时段
        hisRegistration.regItemAmount = getSelectedItemFee.value || 0
        hisRegistration.schedulingType = queryForm.querySelectedItemId
        hisRegistration.subsectionType = queryForm.selectedTimeDataId

        // 组装数据
        const requestData = {
          hisRegistration: { ...hisRegistration },
          hisPatient: { ...hisPatient },
        }

        // 发送请求
        http
          .post('/regList/add', requestData)
          .then((res) => {
            if (res.data.data) {
              ElNotification({
                title: '挂号成功！',
                message: `请通知患者前往缴费`,
                type: 'success',
                offset: 50,
                duration: 3000,
              })
              resetQueryForm()
              resetRegistration()
              resetPatient()
            }
          })
          .catch((error) => {
            ElNotification({
              title: '挂号失败！',
              message: `错误信息：${error.message || error}`,
              type: 'error',
              offset: 50,
              duration: 3000,
            })
          })
      } else {
        ElMessage.warning('请检查表单输入')
      }
    })
    .catch(() => {
      ElMessage.error('表单校验失败，请检查输入')
    })
}

//重置患者对象
const resetPatient = () => {
  Object.assign(hisPatient, {
    idCard: '',
    name: '',
    phone: '',
    age: 0,
    sex: '0',
    birthDay: '',
    address: '',
  })
}

//重置挂号对象
const resetRegistration = () => {
  Object.assign(hisRegistration, {
    deptId: '',
    regItemId: 1,
    regItemAmount: '',
    schedulingType: '',
    subsectionType: '',
  })
}

//重置挂号对象
const resetQueryForm = () => {
  Object.assign(queryForm, {
    selectedDeptId: '',
    querySelectedItemId: '',
    selectedTimeDataId: '',
    queryRegTime: '',
  })
}

// 禁用今天之前的日期
const disabledDate = (time) => {
  return dayjs(time).isBefore(dayjs().startOf('day'))
}
//使用dayjs序列化时间
const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : ''
}

//获取当天的所有排班信息
const getTodaySchedulingFetch = () => {
  http
    .get('/doctors/getScheduleData', {
      params: {
        deptId: queryForm.selectedDeptId,
        regTypeId: queryForm.querySelectedItemId,
        timePeriod: queryForm.selectedTimeDataId,
        date: formatDate(queryForm.queryRegTime),
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      },
    })
    .then((res) => {
      registeredData.value = res.data.data?.list || [] // 防止 list 为空时报错
      pageNum.value = res.data.data?.pageNum || 1
      pageSize.value = res.data.data?.pageSize || 3
      pageTotal.value = res.data.data?.total || 0
    })
}

// 点击某行时，记录选中的身份证号
const handleRowClick = (row) => {
  selectedPatientIdCode.value = ''
  selectedPatientIdCode.value = row.idCard
}
//点击某行时，记录选中的部门编号
const handleRowClickByDeptId = (row) => {
  //清空
  hisRegistration.deptId = ''
  //赋值
  hisRegistration.deptId = row.deptId
}

//根据身份证查询赋值患者信息
const selectedPatientFetch = () => {
  selectedPatient.value = null // 重置为 null，而不是空数组

  if (!selectedPatientIdCode.value) {
    ElMessage.warning('你还没有选择患者啊！')
    return
  }

  // 在 patientData 中查找身份证匹配的患者
  const foundPatient = patientData.value.find(
    (patient) => patient.idCard === selectedPatientIdCode.value,
  )

  if (!foundPatient) {
    ElMessage.warning('未找到该患者信息!')
    return
  }

  // 计算准确年龄
  const birthDate = new Date(foundPatient.birthDay) // 生日字符串转 Date 对象
  const now = new Date()
  let age = now.getFullYear() - birthDate.getFullYear()
  if (
    now.getMonth() < birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())
  ) {
    age-- // 还没过生日，减去 1 岁
  }

  // 赋值给 selectedPatient
  selectedPatient.value = foundPatient

  // 将患者信息填充到表单
  Object.assign(hisPatient, {
    idCard: foundPatient.idCard,
    name: foundPatient.name,
    phone: foundPatient.phone,
    birthDay: foundPatient.birthDay,
    sex: foundPatient.sex,
    address: foundPatient.address,
    age: age,
  })

  loadPatientDrawerVisible.value = false // 关闭弹窗
  patientData.value = []
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
    http.get(`/dictData/get/${queryTypeKeyword.value}`).then((res) => {
      timeData.value = res.data.data
    })
  }
}

//重置查询条件
const resetQuery = () => {
  queryForm.selectedDeptId = null
  //挂号时段和挂号类型
  queryForm.selectedTimeDataId = queryForm.querySelectedItemId = ''
  getTodaySchedulingFetch()
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
  const selectedItem = registeredItems.value.find(
    (item) => item.regItemId === hisRegistration.regItemId,
  )
  return selectedItem ? selectedItem.regItemFee : 0
})

onMounted(() => {
  getRegItemFetch()
  getTodaySchedulingFetch()
  queryForm.queryRegTime = formatDate(Date.now())
  getScheduleRegItemFetch()
})

//获取排班挂号类型
const getScheduleRegItemFetch = () => {
  http.get('/dictData/get/his_scheduling_type').then((res) => {
    regTypeMap.value = res.data.data
  })
}

//获取展示挂号类型
const getRegItemFetch = () => {
  http.get('/registeredItem/list').then((res) => {
    registeredItems.value = res.data.list
    queryRegisteredItems.value = res.data.list
  })
}

//根据身份者号获取患者信息
const getPatientFetch = () => {
  if (!idCard.value) {
    ElMessage.warning('身份证不可为空')
    return
  }

  http
    .get(`/patient/get/${idCard.value}`)
    .then((res) => {
      const patientData = res.data.data

      if (!patientData) {
        ElMessage.warning('未查询到该患者，请手动添加信息')
        return
      }

      ElMessage.success(`查询到 1 个患者`)

      // 计算准确年龄
      const birthDate = new Date(patientData.birthDay) // 生日字符串转 Date 对象
      const now = new Date()
      let age = now.getFullYear() - birthDate.getFullYear()
      if (
        now.getMonth() < birthDate.getMonth() ||
        (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())
      ) {
        age-- // 还没过生日，减去 1 岁
      }

      // 批量更新 hisPatient，确保 Vue 能正确响应变化
      Object.assign(hisPatient, {
        idCard: patientData.idCard,
        phone: patientData.phone,
        sex: patientData.sex,
        name: patientData.name,
        age: age,
        birthday: patientData.birthDay,
        address: patientData.address,
      })
    })
    .catch((error) => {
      ElMessage.error('查询失败，请稍后重试')
      console.error(error)
    })
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getTodaySchedulingFetch()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getTodaySchedulingFetch()
}
</script>

<style lang="css" scoped>
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
