<!-- 检查项目统计 -->
<!-- 药品销售统计 -->
<template>
  <el-row style="text-align: center">
    <el-col :span="24">
      <el-text type="danger">
        *注意：默认只查询当天的数据，如果需要查询其他的，请选择范围查询
      </el-text>
      <el-divider />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-card shadow="always">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="检查项目列表" name="first">
            <el-row>
              <el-col :span="7">
                <span>项目名称：</span>
                <el-input placeholder="请输入项目名称" v-model="itemName" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="7">
                <span>患者名称：</span>
                <el-input placeholder="请输入患者名称" v-model="paientName" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="10">
                <el-form-item label="交易时间：">
              <div class="demo-date-picker">
                <div class="block">
                  <el-date-picker
                  v-model="valueDate"
                  type="daterange"
                  style="width: 100%"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  unlink-panels="false">
                  </el-date-picker>
                </div>
              </div>
            </el-form-item>
              </el-col>
              <el-col :span="17" style="margin-left: 10px;margin-bottom: 20px;">
            <el-button type="primary" @click="searchByDate">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-table :data="listData" border :summary-method="getTotal"
                show-summary>
                  <el-table-column label="项目ID" prop="checkItemId" />
                  <el-table-column label="项目名称" prop="checkItemName" />
                  <el-table-column label="项目价格" prop="price" />
                  <el-table-column label="患者姓名" prop="name" />
                  <el-table-column label="检查状态">
                    <template #default="scope">
                      <span>{{ scope.row.resultStatus=='0'?'检测中':'检测完成' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="创建时间" >
                    <template #default="scope">
                      {{ scope.row.createTime.replace("T"," ") }}
                    </template>
                  </el-table-column>
                  <el-table-column label="创建人" prop="createTime" />
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="检查项目统计列表" name="second">
            <el-row>
              <el-col :span="7">
                <span>项目名称：</span>
                <el-input placeholder="请输入项目名称" v-model="itemName" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="10">
                <el-form-item label="交易时间：">
              <div class="demo-date-picker">
                <div class="block">
                  <el-date-picker
                  v-model="valueDate"
                  type="daterange"
                  style="width: 100%"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  unlink-panels="false">
                  </el-date-picker>
                </div>
              </div>
            </el-form-item>
              </el-col>
              <el-col :span="17" style="margin-left: 10px;margin-bottom: 20px;">
            <el-button type="primary" @click="searchByDate">搜索</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-table :data="statisticsData" border :summary-method="getTotalStatistics"
                show-summary>
                  <el-table-column label="项目ID" prop="checkItemId" />
                  <el-table-column label="项目名称" prop="checkItemName" />
                  <el-table-column label="总金额" prop="totalPrice" />
                  <el-table-column label="检查次数" prop="totalNum" />
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
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
  </el-row>
</template>

<script setup lang="ts">
import http from '@/http'
import { format } from 'date-fns'
import { onMounted, reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const listData = ref([])//检查项目页面数据
const statisticsData = ref([])//检查项目统计页面数据
const valueDate = ref([])    //日期范围数组
const pickdata = reactive({ //开始日期和结束日期
  startDate: '',
  endDate: ''
})
const itemName=ref('')//项目名称
const paientName=ref('')//患者名称
const activeName = ref('first')

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getData()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getData()
}

// 搜索按钮，获取日期选择器
const searchByDate = () => {
  // if (valueDate.value.length === 0) {
  //   ElMessage({
  //     message: '请输入要查询的日期！',
  //     type: 'warning',
  //     duration: 3000
  //   })
  // } else {
    if (valueDate.value.length !== 0){
    // 格式化日期为 yyyy-MM-dd
    pickdata.startDate = format(new Date(valueDate.value[0]), 'yyyy-MM-dd')
    pickdata.endDate = format(new Date(valueDate.value[1]), 'yyyy-MM-dd')
    }
    //刷新
    getData()
  //}
}

// 重置按钮，清空数据
const reset = () => {
  valueDate.value = [];
  pickdata.startDate = '';
  pickdata.endDate = '';
  itemName.value='';
  paientName.value='';

  // 重置后重新请求默认数据（即使当天数据为空，也会覆盖旧数据）
  getData();
}

//页面挂载
onMounted(() => {
  //获取页面数据
  getData()
})

//获取检查列表页面数据
const getData=()=>{
  //发送后端异步请求
http.get("statistics/listCheckItem",{
    params:{
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      startDate:pickdata.startDate,
      endDate:pickdata.endDate,
      itemName:itemName.value,
      patientName:paientName.value
      }
    }
  )
  .then((res)=>{
    listData.value=res.data.data.list
    pageTotal.value = res.data.data?.total || 0
    })
      //发送后端异步请求
http.get("statistics/statisticsCheckItem",{
    params:{
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      startDate:pickdata.startDate,
      endDate:pickdata.endDate,
      itemName:itemName.value
      }
    }
  )
  .then((res)=>{
    statisticsData.value=res.data.data.list
    pageTotal.value = res.data.data?.total || 0
    })
}


//计算检查项目合计数据
const getTotal = (param) => {
  const { columns, data } = param;
    const sums = [];
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计';
            return;
        }
        if (column.property === 'price') {
            // 处理空数据：如果 data 为空，返回 0
            const values = data.length > 0
                ? data.map(item => Number(item[column.property]))
                : [0];
            sums[index] = values.reduce((prev, curr) => prev + curr, 0);
        } else {
            sums[index] = '';
        }
    });
    return sums;
}

//计算检查项目统计合计数据
const getTotalStatistics = (param) => {
  const { columns, data } = param;
    const sums = [];
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计';
            return;
        }
        if (column.property === 'totalPrice' ||
            column.property === 'totalNum') {
            // 处理空数据：如果 data 为空，返回 0
            const values = data.length > 0
                ? data.map(item => Number(item[column.property]))
                : [0];
            sums[index] = values.reduce((prev, curr) => prev + curr, 0);
        } else {
            sums[index] = '';
        }
    });
    return sums;
}
</script>
