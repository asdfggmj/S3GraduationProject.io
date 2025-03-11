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
            <el-button type="primary">
              <el-icon><Search /></el-icon>
              <span>加载患者信息</span>
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
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
                type="datetime"
                placeholder="挂号时间"
                format="YYYY-MM-DD HH:mm:ss"
                date-format="MMM DD, YYYY"
                time-format="HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="submitQuery">
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
            <el-table></el-table>
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
const pageSize = ref(10) //每页显示的数据
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

//查询
const submitQuery = () => {
  ElMessage.info(
    '科室ID：' +
      selectedDeptId.value +
      '=>挂号ID：' +
      querySelectedItemId.value +
      '=>挂号时段：' +
      selectedTimeDataId.value +
      '=>挂号时间：' +
      queryRegTime.value,
  )
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
