<template>
  <el-row>
    <!-- 左侧 -->
    <el-col :span="8">
      <el-card shadow="always" class="mb-10px mr-10px">
        <el-row>
          <el-col>
            <el-form :model="patientData" label-width="auto">
              <el-form-item label="患者姓名">
                <!-- <el-input v-model="patientData.name" placeholder="请输入患者姓名" disabled ></el-input> -->
                <el-input v-model="patientData.name" disabled placeholder="请输入患者姓名">
                  <template #append>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="点击选择患者"
                      placement="bottom-start"
                    >
                      <el-button @click="selectionPatientFetch">
                        <el-icon><Avatar /></el-icon>
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model="patientData.idCard" placeholder="请输入身份证号" disabled />
              </el-form-item>
              <el-form-item label="患者电话">
                <el-input v-model="patientData.phone" placeholder="请输入患者电话" disabled />
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="patientData.sex">
                  <el-radio value="0">男</el-radio>
                  <el-radio value="1">女</el-radio>
                  <el-radio value="2">未知</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="出生日期">
                <el-date-picker
                  v-model="patientData.birthDay"
                  type="date"
                  placeholder="出生日期"
                  format="YYYY-MM-DD"
                />
              </el-form-item>
              <el-form-item label="患者年龄">
                <el-input-number v-model="patientData.age" :min="1" :max="200" />
              </el-form-item>
              <el-form-item label="地址信息">
                <el-input
                  v-model="patientData.address"
                  :rows="4"
                  type="textarea"
                  placeholder="患者地址"
                  resize="none"
                />
              </el-form-item>
              <el-form-item label="过敏史">
                <el-input
                  v-model="patientData.allergyInfo"
                  :rows="4"
                  type="textarea"
                  placeholder="患者过敏史"
                  resize="none"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-tabs type="border-card">
              <el-tab-pane label="患者档案">
                <el-table></el-table>
              </el-tab-pane>
              <el-tab-pane label="历史病例">
                <el-table></el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="16">
      <el-row>
        <!-- 右上 -->
        <el-col>
          <el-card shadow="always" class="mb-10px">
            <el-row justify="space-between">
              <el-col :span="12">
                <el-text
                  >挂号单ID：<el-text type="danger">{{ patientData.regId }}</el-text></el-text
                ><br />
                <el-text
                  >病例编号：<el-text type="danger">{{ careHistoryData.chId }}</el-text></el-text
                >
              </el-col>
              <el-col :span="12" style="text-align: right">
                <el-button type="primary" @click="saveCareHistory">
                  <i class="iconfont icon-baocun" style="margin-right: 6px"></i>
                  <span>保存病例</span>
                </el-button>
                <el-button type="danger">
                  <i class="iconfont icon-shouye" style="margin-right: 6px"></i>
                  <span>就诊完成</span>
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <!-- 右下 -->
        <el-col>
          <el-card shadow="always" class="mb-10px">
            <el-tabs type="border-card">
              <!-- 病例 -->
              <el-tab-pane label="病例">
                <el-form :inline="true" :model="careHistoryData" label-width="auto">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="发病日期">
                        <el-date-picker
                          v-model="careHistoryData.careDate"
                          type="datetime"
                          placeholder="请选择发病日期"
                          format="YYYY/MM/DD HH:mm:ss"
                          value-format="YYYY-MM-DD HH:mm:ss"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="接诊类型">
                        <el-select
                          class="min-width-120px"
                          v-model="careHistoryData.receiveType"
                          placeholder="请选择"
                          @click="getReceiveType"
                        >
                          <el-option
                            v-for="item in receiveType"
                            :key="item.dictValue"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="是否传染">
                        <el-select
                          class="min-width-120px"
                          v-model="careHistoryData.isContagious"
                          placeholder="请选择"
                          @click="getContagious"
                        >
                          <el-option
                            v-for="item in contagious"
                            :key="item.dictValue"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-form :model="careHistoryData" label-width="auto">
                  <el-form-item label="主诉">
                    <el-input
                      v-model="careHistoryData.caseTitle"
                      :rows="4"
                      type="textarea"
                      placeholder="请输入主诉"
                      resize="none"
                      maxlength="200"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item label="断诊信息">
                    <el-input
                      v-model="careHistoryData.caseResult"
                      :rows="4"
                      type="textarea"
                      placeholder="请输入断诊信息"
                      resize="none"
                      maxlength="200"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item label="医生建议">
                    <el-input
                      v-model="careHistoryData.doctorTips"
                      :rows="4"
                      type="textarea"
                      placeholder="请输入医生建议"
                      resize="none"
                      maxlength="200"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input
                      v-model="careHistoryData.remark"
                      :rows="4"
                      type="textarea"
                      placeholder="请输入备注"
                      resize="none"
                      maxlength="200"
                      show-word-limit
                    />
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <!-- 处方 -->
              <el-tab-pane label="处方">
                <el-button type="success" @click="addMedicationPrescription">
                  <el-icon><Plus /></el-icon>
                  <span>添加用药处方</span>
                </el-button>
                <el-button type="success" @click="addExaminePrescription">
                  <el-icon><Plus /></el-icon>
                  <span>添加检查处方</span>
                </el-button>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <!-- 挂号患者对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="选择挂号患者"
    center
    style="min-width: 400px; max-width: 1200px"
  >
    <el-tabs v-model="activeName" type="card" stretch @tab-click="handleTabClick">
      <el-tab-pane label="待就诊列表" name="first">
        <el-table :data="regListData" border style="width: 100%">
          <el-table-column label="患者姓名" prop="name" width="100" />
          <el-table-column label="身份证号" prop="idCard" width="200" />
          <el-table-column label="挂号类型" prop="schedulingType" width="100">
            <template #default="scope">
              {{ schedulingTypeMap[scope.row.schedulingType] }}
            </template>
          </el-table-column>
          <el-table-column label="过敏史" prop="allergyInfo" width="120">
            <template #default="scope">
              {{ scope.row.allergyInfo || '无' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-button
                type="success"
                size="small"
                @click="chooseSelectedPatient(scope.row.regId)"
              >
                <el-icon><Select /></el-icon>
                <span>选择</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="就诊中列表" name="second">
        <el-table :data="regListData" border style="width: 100%">
          <el-table-column label="患者姓名" prop="name" width="100" />
          <el-table-column label="身份证号" prop="idCard" width="200" />
          <el-table-column label="挂号类型" prop="regItemId" width="100" />
          <el-table-column label="过敏史" prop="allergyInfo" width="120" />
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-button
                type="success"
                size="small"
                @click="chooseSelectedPatient(scope.row.regId)"
              >
                <el-icon><Select /></el-icon>
                <span>选择</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="就诊完成列表" name="third">
        <el-table :data="regListData" border style="width: 100%">
          <el-table-column label="患者姓名" prop="name" width="100" />
          <el-table-column label="身份证号" prop="idCard" width="200" />
          <el-table-column label="挂号类型" prop="regItemId" width="100" />
          <el-table-column label="过敏史" prop="allergyInfo" width="120" />
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-button
                type="success"
                size="small"
                @click="chooseSelectedPatient(scope.row.regId)"
              >
                <el-icon><Select /></el-icon>
                <span>选择</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>

  <!-- 添加用药处方或添加检查处方对话框 -->
  <el-dialog
    v-model="prescriptionVisible"
    :title="prescriptionTitle"
    center
    style="min-width: 1000px; max-width: 1400px"
  >
    <!-- 选择的检查项目/药品 -->
    <el-row>
      <el-col>
        <el-button type="success">
          <el-icon><Plus /></el-icon>
          <span>确认添加</span>
        </el-button>
      </el-col>
    </el-row>
    <!-- 显示已添加的项目 -->
    <el-row class="mt-10px">
      <el-col>
        <!-- 表格 -->
        <el-table :data="careOrderItemObj" style="width: 100%" border>
          <el-table-column label="序号" width="60">
            <template #default="scope">
              {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="col in tableColumns"
            :key="col.prop"
            :label="col.label"
            :prop="col.prop"
            :width="col.width"
          />
          <el-table-column fixed="right" prop="remark" label="备注">
            <template #default="scope">
              <el-input v-model="scope.row.remark" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button @click="removeItem(scope.row)" type="danger">
                <el-icon><Delete /></el-icon>
                <span>删除</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 选择检查项目 / 药品按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" style="width: 100%" @click="openListDrawer">{{
          prescriptionButtonContent
        }}</el-button>
      </el-col>
    </el-row>
  </el-dialog>

  <!-- 检查项目列表和药品列表抽屉 -->
  <el-drawer v-model="listDrawerVisible" :show-close="false" size="40%">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="text-align: center">{{ listDrawerTitle }}</h4>
    </template>
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="14">
        <el-form-item label="关键字">
          <el-input
            @change="search(keyWord)"
            v-model="keyWord"
            placeholder="请输入关键字"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6" class="ml-10px">
        <el-button type="primary" @click="search(keyWord)">
          <el-icon><Search /></el-icon>
          <span>搜索</span>
        </el-button>
      </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-row>
      <el-col>
        <el-table
          :data="currentTableData"
          style="width: 100%"
          max-height="580"
          :row-key="(row) => row.checkItemId || row.medicinesId || row.dictId"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column fixed type="selection" width="55" />
          <!-- 动态列 -->
          <el-table-column
            v-for="col in tableColumns"
            :key="col.prop"
            :label="col.label"
            :prop="col.prop"
            :width="col.width ?? 'auto'"
          />
        </el-table>
      </el-col>
    </el-row>
    <!-- 分页行 -->
    <el-row class="mt-10px">
      <el-col :span="24">
        <el-pagination
          size="small"
          background
          layout="total,sizes,prev, pager, next,jumper"
          :total="pageTotal"
          :pager-count="5"
          :page-size="pageSize"
          :page-sizes="[20, 40, 60]"
          :current-page="pageNum"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </el-col>
    </el-row>
    <el-row style="text-align: center; margin-top: 20px">
      <el-col>
        <el-button type="primary" @click="addItems">
          <el-icon><Check /></el-icon>
          <span>添加并关闭</span>
        </el-button>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script setup lang="ts">
import http from '@/http'
import { ElMessage, ElNotification } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const activeName = ref('first') // 默认选中的 tab
const pageNum = ref(1) //当前页
const pageSize = ref(20) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const listDrawerTitle = ref('') //检查项目列表和药品列表抽屉标题
const listDrawerVisible = ref(false) //检查项目列表和药品列表抽屉控制显示
const dialogVisible = ref(false) //挂号患者对话框控制显示
const prescriptionVisible = ref(false) //处方对话框控制显示
const prescriptionTitle = ref('') //处方对话框标题
const prescriptionButtonContent = ref('') //处方对话框按钮内容
let contagious = reactive([]) //是否传染
let receiveType = reactive([]) //接诊类型
const patientData = reactive({
  patientId: '',
  regId: '',
  phone: '',
  name: '',
  age: 0,
  sex: '0',
  birthDay: '',
  idCard: '',
  address: '',
  allergyInfo: '',
  isFinal: '',
  password: '',
  openId: '',
}) //患者信息对象
const careHistoryData = reactive({
  chId: '', //病例编号
  patientId: '', //患者ID
  patientName: '', //患者名
  regId: '', //挂号编号
  careDate: '', //就诊时间
  deptId: '', //部门编号
  deptName: '', //部门名
  receiveType: '', //接诊类型  初诊  复诊
  isContagious: '', //是否传染  否 是
  caseTitle: '', //主诉
  caseResult: '', //诊断信息
  doctorTips: '', //医生建议
  remark: '', //备注
}) //病例对象
const regListData = ref([]) //挂号数据
const hisCareHistoryData = ref([]) //患者历史病例数据
const hisPatientFile = ref([]) //患者档案数据
const schedulingTypeMap = ref({}) //存储排班类型字典
const currentTableData = ref([]) // **用于存储当前表格数据**
const tableColumns = ref([]) // **用于存储当前表格列**
const selectedRows = ref([]) // 存储选中的行
const careOrderItemObj = ref([]) // 存储用药和检查项目

// **不同数据类型的列配置**
//检查费用列
const checkItemColumns = [
  { label: '项目名称', prop: 'checkItemName', width: '160' },
  { label: '关键字', prop: 'keyWords', width: '80' },
  { label: '单价', prop: 'unitPrice', width: '80' },
  { label: '单位', prop: 'unit', width: '80' },
]
//药品列
const medicinesColumns = [
  { label: '药品名称', prop: 'medicinesName', width: '200' },
  { label: '库存', prop: 'medicinesStockNum', width: '120' },
  { label: '换算量', prop: 'conversion', width: '120' },
  { label: '单位', prop: 'unit', width: '120' },
]

// **删除某项**
const removeItem = (row) => {
  careOrderItemObj.value = careOrderItemObj.value.filter((item) => item.id !== row.id)
}

//监听选中的数据
const handleSelectionChange = (val) => {
  selectedRows.value = val
  // console.log(selectedRows.value)
}

// 点击“添加并关闭”按钮，将选中的数据存入 careOrderItemObj
const addItems = () => {
  careOrderItemObj.value = [...selectedRows.value] // 赋值
  // console.log('选中的数据：', careOrderItemObj.value)
  listDrawerVisible.value = false
}

onMounted(() => {
  getSchedulingType()
})

//获取排班类型数据
const getSchedulingType = () => {
  http.get('/dictData/get/his_scheduling_type').then((res) => {
    const dictData = res.data.data || []

    schedulingTypeMap.value = dictData.reduce((map, item) => {
      map[Number(item.dictValue)] = item.dictLabel
      return map
    }, {})
  })
}

//保存病例
const saveCareHistory = () => {
  if (careHistoryData.chId !== '') {
    ElMessage.warning('病例已存在！')
  } else {
    http.post('/careHistory/add', careHistoryData).then((res) => {
      if (res.status === 200) {
        careHistoryData.chId = res.data.data
        ElNotification({
          title: '保存病例成功！',
          type: 'success',
          offset: 50,
          duration: 3000,
        })
      }
    })
  }
}

//根据身份证号计算出生日期和年龄的方法
const getBirthdayAndAgeFromIdCard = (idCard) => {
  if (!/^\d{17}[\dXx]$/.test(idCard)) return { birthday: '', age: 0 }

  const year = idCard.slice(6, 10)
  const month = idCard.slice(10, 12)
  const day = idCard.slice(12, 14)
  const birthday = `${year}-${month}-${day}`
  const age =
    new Date().getFullYear() - year - (new Date() < new Date(year, month - 1, day) ? 1 : 0)
  return { birthday, age }
}

// 选择患者
const chooseSelectedPatient = async (regId) => {
  const patient = regListData.value.find((item) => item.regId === regId)

  dialogVisible.value = false

  if (patient) {
    const { birthday, age } = getBirthdayAndAgeFromIdCard(patient.idCard)

    //解构赋值patientData
    Object.assign(patientData, {
      patientId: patient.patientId,
      regId: patient.regId,
      phone: patient.phone || '',
      name: patient.name || '',
      age: age, // 自动计算年龄
      sex: patient.sex || '0',
      birthDay: birthday, // 自动计算生日
      idCard: patient.idCard || '',
      address: patient.address || '',
      allergyInfo: patient.allergyInfo || '',
      isFinal: patient.isFinal || '',
      password: patient.password || '',
      openId: patient.openId || '',
    })
    //解构赋值careHistoryData
    Object.assign(careHistoryData, {
      deptId: patient.deptId,
      deptName: patient.deptName,
      patientId: patient.patientId,
      patientName: patient.name,
      regId: patient.regId,
    })
    //根据患者ID查询患者档案
    await getHisPatientFileByPid(patient.patientId)
    //根据患者ID查询历史病例
    await getHisCareHistoryByPid(patient.patientId)
    //修改挂号状态为就诊中
    await updateRegistrationStatus(2)
    ElMessage.success('选择成功！')
  } else {
    console.warn('未找到匹配的患者信息')
  }
}

//修改挂号状态为就诊中2
const updateRegistrationStatus = (regStatus) => {
  http.put(`/regList/status/${careHistoryData.regId}/${regStatus}`).then((res) => {
    if (res.status === 200) {
      // console.log('状态已变就诊中')
    }
  })
}

// 根据患者ID查询患者档案
const getHisPatientFileByPid = (pid) => {
  http.get(`/PatientFile/get/${pid}`).then((res) => {
    hisCareHistoryData.value = res.data.data
    // console.log(hisCareHistoryData.value)
  })
}
// 根据患者ID查询历史病例
const getHisCareHistoryByPid = (pid) => {
  http.get(`/careHistory/get/${pid}`).then((res) => {
    hisPatientFile.value = res.data.data
    // console.log(hisPatientFile.value)
  })
}

//选择患者根据状态查询，默认待就诊1
const selectionPatientFetch = () => {
  getRegListFetchByStatus(1)
  dialogVisible.value = true
}

// 监听 tab 切换
const handleTabClick = (pane) => {
  switch (pane.props.name) {
    case 'first':
      getRegListFetchByStatus(1)
      break
    case 'second':
      getRegListFetchByStatus(2)
      break
    case 'third':
      getRegListFetchByStatus(3)
      break
  }
}

// 获取挂号数据
const getRegListFetchByStatus = async (status) => {
  try {
    const res = await http.get(`/regList/get/${status}`)
    regListData.value = res.data.data || []
    // console.log('----------->' + regListData.value)
    pageTotal.value = res.data.data?.total || 0
  } catch (error) {
    console.error('获取挂号数据失败', error)
  }
}

const currentFetchType = ref('') // 默认是获取药品数据
const getDataFetch = () => {
  switch (currentFetchType.value) {
    case 'medicines':
      getMedicinesFetch()
      break
    case 'checkItems':
      getCheckItemsFetch()
      break
    default:
      console.warn('未找到匹配的获取方法:', currentFetchType.value)
  }
}

const openListDrawer = () => {
  listDrawerVisible.value = true
}

//模糊查询
const search = (keyWordInput) => {
  keyWord.value = keyWordInput
  getDataFetch()
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getDataFetch()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getDataFetch()
}

//添加用药处方
const addMedicationPrescription = () => {
  //设置标题
  prescriptionTitle.value = '添加用药处方'
  listDrawerTitle.value = '药品列表'
  //设置按钮内容
  prescriptionButtonContent.value = '添加药品项'

  //清空当前表格数据
  currentTableData.value = []
  //设置动态列
  tableColumns.value = medicinesColumns
  //设置调用的方法
  currentFetchType.value = 'medicines'
  getMedicinesFetch()
  //打开对话框
  prescriptionVisible.value = true
}

//添加检查处方
const addExaminePrescription = () => {
  //设置标题
  prescriptionTitle.value = '添加检查处方'
  listDrawerTitle.value = '检查项目列表'
  //设置按钮内容
  prescriptionButtonContent.value = '添加检查项'
  //清空当前表格数据
  currentTableData.value.length = 0
  //设置动态列
  tableColumns.value = checkItemColumns
  //设置调用的方法
  currentFetchType.value = 'checkItems'
  getCheckItemsFetch()
  //打开对话框
  prescriptionVisible.value = true
}

//获取检查项目数据
const getCheckItemsFetch = () => {
  http
    .get('/checkItem/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyWord: keyWord.value,
      },
    })
    .then((res) => {
      const checkItemData = res.data
      if (checkItemData.list) {
        pageTotal.value = checkItemData.total
        pageNum.value = checkItemData.pageNum
        pageSize.value = checkItemData.pageSize
        currentTableData.value = [...res.data.list]
      }
    })
}
//获取药品数据
const getMedicinesFetch = () => {
  http
    .get('/medicines/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyWord: keyWord.value,
      },
    })
    .then((res) => {
      const medicinesData = res.data.data
      if (medicinesData.list) {
        pageTotal.value = medicinesData.total
        pageNum.value = medicinesData.pageNum
        pageSize.value = medicinesData.pageSize
        currentTableData.value = [...res.data.data.list]
      }
    })
}

//获取是否传染方法
const getContagious = () => {
  if (contagious.length === 0) {
    http.get(`/dictData/list/his_contagious_status`).then((res) => {
      const list = Array.isArray(res.data) ? res.data : []
      contagious.splice(0, contagious.length, ...list)
    })
  }
}

//获取接诊类型方法
const getReceiveType = () => {
  if (receiveType.length === 0) {
    http.get(`/dictData/list/his_receive_type`).then((res) => {
      const list = Array.isArray(res.data) ? res.data : []
      receiveType.splice(0, receiveType.length, ...list)
    })
  }
}
</script>

<style>
@import url('https://at.alicdn.com/t/c/font_4844128_v8p50ve8kk9.css');
.mr-20px {
  margin-right: 20px;
}
.mr-10px {
  margin-right: 10px;
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
.min-width-120px {
  min-width: 120px;
}
</style>
