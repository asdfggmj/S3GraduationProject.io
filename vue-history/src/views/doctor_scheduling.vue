<template>
  <el-row>
    <el-col :span="24" style="text-align: right">
      <el-card shadow="always">
        <el-row justify="space-between">
          <!-- 左侧 -->
          <el-col :span="5">
            <el-form>
              <el-form-item label="所属科室">
                <el-select
                  v-model="selectedDeptValue"
                  @click="getDepts"
                  placeholder="请选择所属科室"
                >
                  <el-option
                    v-for="item in deptData"
                    :key="item.deptId"
                    :label="item.deptName"
                    :value="item.deptId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="5" class="ml-10px">
            <el-form>
              <el-form-item label="医生名字">
                <el-select
                  v-model="selectedDoctorValue"
                  @click="getUsers"
                  placeholder="请选择医生名字"
                >
                  <el-option
                    v-for="item in doctorData"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <!-- 右侧 -->
          <el-col :span="13">
            <el-button type="primary">
              <el-icon><ArrowLeftBold /></el-icon>
              <span>上一周</span>
            </el-button>
            <el-button type="success">当前周</el-button>
            <el-button type="primary">
              <el-icon><ArrowRightBold /></el-icon>
              <span>下一周</span>
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第二行 -->
  <el-row class="mt-10px">
    <el-col>
      <el-card shadow="always">
        <el-row>
          <el-col :span="24" style="text-align: center">
            <el-text>2025-3-3(周一)-2025-3-9(周日)</el-text>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第三行 -->
  <el-row class="mt-10px">
    <el-col>
      <el-card shadow="always">
        <el-row>
          <el-col :span="24">
            <el-table
              border
              :data="schedulingData"
              :span-method="objectSpanMethod"
              :row-key="(row) => `${row.userId}-${row.subsectionType}`"
              max-height="500"
            >
              <el-table-column label="医生" prop="userName" align="center" />
              <el-table-column label="科室" prop="deptName" align="center" />
              <el-table-column label="时间段" prop="subsectionName" align="center" />
              <el-table-column
                v-for="date in schedulingData.schedulingDay"
                :key="date"
                :label="date"
                align="center"
              >
                <template #default="scope">
                  {{ scope.row.scheduling[date] ?? '-' }}
                </template>
              </el-table-column>
              <!-- 操作列 -->
              <el-table-column label="操作" prop="userId" align="center">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="editScheduling(scope.row)">
                    <el-icon><Edit /></el-icon>
                    <span>排班</span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>

  <!-- 医生排班对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="schedulingEditTitle"
    style="min-width: 1200px; max-width: 1800px"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-row>
      <el-col :span="24">
        <!-- 数据表格 -->
        <el-table :data="editSchedulingData">
          <el-table-column label="时间/日期" prop="time"></el-table-column>
          <el-table-column
            v-for="item in 7"
            :key="item"
            :label="'2025 - 3 - ' + (item + 2) + '(周' + item + ')'"
          >
            <template #default="scope">
              <el-select v-model="value" placeholder="请选择所属科室">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import http from '@/http'
import { dayjs, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

const dialogVisible = ref(false) //对话框控制显示
const schedulingData = ref([]) //排班医生数据
const deptData = ref([]) //部门数据
const doctorData = ref([]) //医生(用户)数据
const selectedDeptValue = ref('') //选中的部门值
const selectedDoctorValue = ref('') //选中的医生值
const schedulingEditTitle = ref('') //编辑标题

onMounted(() => {
  getDoctorFetch()
})

//获取所有医生用户信息
const getUsers = () => {
  if (doctorData.value.length === 0) {
    http.get('/user/getDoctor').then((res) => {
      console.log(res.data.data)

      doctorData.value = res.data.data
    })
  }
}

//获取所有部门信息
const getDepts = () => {
  if (deptData.value.length === 0) {
    http.get('/dept/getAll').then((res) => {
      deptData.value = res.data
    })
  }
}

//获取所有医生信息
const getDoctorFetch = () => {
  http.get('/doctors/ScheduleList').then((res) => {
    schedulingData.value = res.data.data
  })
}

// 跨行合并
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex % 3 === 0) {
      return [3, 1]
    } else {
      return [0, 0]
    }
  }
  if (columnIndex === 1) {
    if (rowIndex % 3 === 0) {
      return {
        rowspan: 3,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

//关闭对话框前执行的方法
const handleClose = () => {
  ElMessageBox.confirm('你确定要关闭吗?所作的内容还没有保存呢', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    dialogVisible.value = false
  })
}

//编辑医生排班
const editScheduling = (row) => {
  dialogVisible.value = true
  const user_name = row.userName // 获取部门信息
  schedulingEditTitle.value = `修改${user_name}的排班信息`
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
