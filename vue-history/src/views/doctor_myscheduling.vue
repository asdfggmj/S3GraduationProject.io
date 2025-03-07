<template>
  <el-row>
    <el-col :span="24" style="text-align: right">
      <el-card shadow="always">
        <el-button type="primary">
          <el-icon><ArrowLeftBold /></el-icon>
          <span>上一周</span>
        </el-button>
        <el-button type="success">当前周</el-button>
        <el-button type="primary">
          <el-icon><ArrowRightBold /></el-icon>
          <span>下一周</span>
        </el-button>
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
            <el-table border :data="schedulingData" :span-method="objectSpanMethod">
              <el-table-column label="医生" prop="doctorName" align="center"></el-table-column>
              <el-table-column label="科室" prop="deptName" align="center"></el-table-column>
              <el-table-column label="时间/日期" prop="time" align="center"></el-table-column>
              <el-table-column label="1" prop="time1" align="center"></el-table-column>
              <el-table-column label="2" prop="time2" align="center"></el-table-column>
              <el-table-column label="3" prop="time3" align="center"></el-table-column>
              <el-table-column label="4" prop="time4" align="center"></el-table-column>
              <el-table-column label="5" prop="time5" align="center"></el-table-column>
              <el-table-column label="6" prop="time6" align="center"></el-table-column>
              <el-table-column label="7" prop="time7" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-button-group>
                    <el-button size="small" type="primary" @click="editScheduling(scope.row.index)">
                      <el-icon><Edit /></el-icon>
                      <span>编辑</span>
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import http from '@/http'
import { onMounted, ref } from 'vue'

//排班医生数据《固定值，换成动态
const schedulingData = ref([
  {
    doctorName: '张三',
    deptName: '儿科',
    time: '上午',
    time1: '2025-3-3',
    time2: '2025-3-4',
    time3: '2025-3-5',
    time4: '2025-3-6',
    time5: '2025-3-7',
    time6: '2025-3-8',
    time7: '2025-3-9',
  },
  {
    time: '下午',
    time1: '2025-3-3',
    time2: '2025-3-4',
    time3: '2025-3-5',
    time4: '2025-3-6',
    time5: '2025-3-7',
    time6: '2025-3-8',
    time7: '2025-3-9',
  },
  {
    time: '晚上',
    time1: '2025-3-3',
    time2: '2025-3-4',
    time3: '2025-3-5',
    time4: '2025-3-6',
    time5: '2025-3-7',
    time6: '2025-3-8',
    time7: '2025-3-9',
  },
])

onMounted(() => {
  getMySchedulingData()
})

//获取我的排班信息
const getMySchedulingData = () => {
  http.get('/doctors/schedule').then((res) => {
    console.log(res.data)
  })
}

//表格跨列方法
const objectSpanMethod = ({ rowIndex, columnIndex }) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 10) {
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
