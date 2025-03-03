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
                    <el-button @click="selectionPatient">
                      <el-icon><Avatar /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model="patientData.name" placeholder="请输入身份证号" disabled />
              </el-form-item>
              <el-form-item label="患者电话">
                <el-input v-model="patientData.name" placeholder="请输入患者电话" disabled />
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
                  v-model="patientData.birthday"
                  type="datetime"
                  placeholder="出生日期"
                  format="YYYY-MM-DD HH:mm:ss"
                  date-format="MMM DD, YYYY"
                  time-format="HH:mm"
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
                <el-text>挂号单ID：</el-text><br />
                <el-text>病例编号：</el-text>
              </el-col>
              <el-col :span="12" style="text-align: right">
                <el-button type="primary">
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
                          type="date"
                          placeholder="请选择发病日期"
                          class="min-width-120px"
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
    <el-tabs v-model="activeName" type="card" stretch>
      <el-tab-pane label="待就诊列表" name="first">
        <el-table></el-table>
      </el-tab-pane>
      <el-tab-pane label="就诊中列表" name="second">
        <el-table></el-table>
      </el-tab-pane>
      <el-tab-pane label="就诊完成列表" name="third">
        <el-table></el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>

  <!-- 添加用药处方或添加检查处方对话框 -->
  <el-dialog
    v-model="prescriptionVisible"
    :title="prescriptionTitle"
    center
    style="min-width: 600px; max-width: 1400px"
  >
    <el-row>
      <el-col>
        <el-button type="success">
          <el-icon><Plus /></el-icon>
          <span>确认添加</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table style="width: 100%">
          <el-table-column prop="" label="序号" width="80" />
          <el-table-column prop="" label="项目名称" width="180" />
          <el-table-column prop="" label="单位" width="80" />
          <el-table-column prop="" label="单价（元）" width="80" />
          <el-table-column prop="" label="金额（元）" width="80" />
          <el-table-column prop="" label="检查备注" width="180" />
          <el-table-column prop="" fixed="right" label="操作">
            <template #default="scope">
              <el-button>
                <el-icon><Delete /></el-icon>
                <span>删除</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
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
    <el-row>
      <el-col>
        <el-table
          :data="currentTableData"
          style="width: 100%"
          max-height="580"
          :row-key="(row) => row.checkItemId || row.medicinesId || row.dictId"
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
          :pager-count="2"
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
        <el-button type="primary">
          <el-icon><Check /></el-icon>
          <span>添加并关闭</span>
        </el-button>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script setup lang="ts">
import http from '@/http'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(20) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const listDrawerTitle = ref('') //检查项目列表和药品列表抽屉标题
const listDrawerVisible = ref(false) //检查项目列表和药品列表抽屉控制显示
const activeName = ref('first')
const dialogVisible = ref(false) //挂号患者对话框控制显示
const prescriptionVisible = ref(false) //处方对话框控制显示
const prescriptionTitle = ref('') //处方对话框标题
const prescriptionButtonContent = ref('') //处方对话框按钮内容
let contagious = reactive([]) //是否传染
let receiveType = reactive([]) //接诊类型
const patientData = reactive({
  patientId: '',
  phone: '',
  name: '',
  age: 0,
  sex: '0',
  birthday: '',
  idCard: '',
  address: '',
  allergyInfo: '',
  isFinal: '',
  password: '',
  openId: '',
}) //患者信息对象
const careHistoryData = reactive({
  careDate: '',
  receiveType: '',
  isContagious: '',
  caseTitle: '',
  caseResult: '',
  doctorTips: '',
  remark: '',
}) //病例对象

// **用于存储当前表格数据**
const currentTableData = ref([])
// **用于存储当前表格列**
const tableColumns = ref([])

// **不同数据类型的列配置**
//检查费用列
const checkItemColumns = [
  { label: '项目费用ID', prop: 'checkItemId', width: '120' },
  { label: '项目名称', prop: 'checkItemName', width: '160' },
  { label: '关键字', prop: 'keyWords', width: '80' },
  { label: '单价', prop: 'unitPrice', width: '80' },
  { label: '单位', prop: 'unit', width: '80' },
]

//药品列
const medicinesColumns = [
  { label: '药品ID', prop: 'medicinesId', width: '120' },
  { label: '药品名称', prop: 'medicinesName', width: '200' },
  { label: '库存', prop: 'medicinesStockNum', width: '100' },
  { label: '单位', prop: 'unit', width: '80' },
  { label: '换算量', prop: 'conversion', width: '100' },
]

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
      const medicinesData = res.data
      if (medicinesData.list) {
        pageTotal.value = medicinesData.total
        pageNum.value = medicinesData.pageNum
        pageSize.value = medicinesData.pageSize
        currentTableData.value = [...res.data.list]
      }
    })
}

//获取是否传染方法
const getContagious = () => {
  if (contagious.length === 0) {
    http.get(`/dict/list/his_contagious_status`).then((res) => {
      const list = Array.isArray(res.data) ? res.data : []
      contagious.splice(0, contagious.length, ...list)
    })
  }
}

//获取接诊类型方法
const getReceiveType = () => {
  if (receiveType.length === 0) {
    http.get(`/dict/list/his_receive_type`).then((res) => {
      const list = Array.isArray(res.data) ? res.data : []
      receiveType.splice(0, receiveType.length, ...list)
    })
  }
}

//获取患者方法
const selectionPatient = () => {
  dialogVisible.value = true
  ElMessage.success('获取患者')
}
</script>

<style>
@import url('https://at.alicdn.com/t/c/font_4844128_tnosszl01l.css?spm=a313x.manage_type_myprojects.i1.9.7e4d3a81Tx1WOP&file=font_4844128_tnosszl01l.css');
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
