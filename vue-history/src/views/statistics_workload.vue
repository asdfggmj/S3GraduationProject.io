<!-- 工作量统计 -->
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
          <el-tab-pane label="医生工作量统计列表" name="first">
            <el-row>
              <el-col :span="7">
                <span>医生姓名：</span>
                <el-input placeholder="请输入项目名称" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="10">
                <span>接诊时间：</span>
                <el-date-picker type="datetime" placeholder="请选择接诊日期" />
              </el-col>
              <el-divider />
            </el-row>

            <el-row>
              <el-col>
                <el-table :data="saleListData" border>
                  <el-table-column label="挂号ID" prop="id" />
                  <el-table-column label="医生编号" prop="name" />
                  <el-table-column label="医生姓名" prop="price" />
                  <el-table-column label="挂号费用" prop="price" />
                  <el-table-column label="患者姓名" prop="price" />
                  <el-table-column label="就诊时间" prop="createTime" />
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="总体工作量统计列表" name="second">
            <el-row>
              <el-col :span="7">
                <span>医生姓名：</span>
                <el-input placeholder="请输入项目名称" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="10">
                <span>接诊时间：</span>
                <el-date-picker type="datetime" placeholder="请选择接诊日期" />
              </el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col>
                <el-table :data="saleListData" border>
                  <el-table-column label="医生编号" prop="id" />
                  <el-table-column label="医生姓名" prop="name" />
                  <el-table-column label="挂号总额" prop="total" />
                  <el-table-column label="接诊数量" prop="createTime" />
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const saleListData = ref([
  {
    id: '1',
    name: '布洛芬',
    price: '39.9',
    num: '10',
    total: '399',
    createTime: 'aa',
  },
])
const activeName = ref('first')
</script>
