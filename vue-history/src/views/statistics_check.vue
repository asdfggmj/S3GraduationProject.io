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
                <el-input placeholder="请输入项目名称" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="7">
                <span>患者名称：</span>
                <el-input placeholder="请输入患者名称" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="10">
                <span>检查时间：</span>
                <el-date-picker type="date" placeholder="请选择检查日期" />
              </el-col>
              <el-divider />
            </el-row>

            <el-row>
              <el-col>
                <el-table :data="saleListData" border>
                  <el-table-column label="项目ID" prop="id" />
                  <el-table-column label="项目名称" prop="name" />
                  <el-table-column label="项目价格" prop="price" />
                  <el-table-column label="患者姓名" prop="price" />
                  <el-table-column label="检查状态" prop="price" />
                  <el-table-column label="创建时间" prop="createTime" />
                  <el-table-column label="创建人" prop="createTime" />
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="检查项目统计列表" name="second">
            <el-row>
              <el-col :span="7">
                <span>项目名称：</span>
                <el-input placeholder="请输入药品名称" style="width: 240px"></el-input>
              </el-col>
              <el-col :span="10">
                <span>检查时间：</span>
                <el-date-picker type="date" placeholder="请选择检查日期" />
              </el-col>
            </el-row>
            <el-divider />
            <el-row>
              <el-col>
                <el-table :data="saleListData" border>
                  <el-table-column label="项目ID" prop="id" />
                  <el-table-column label="项目名称" prop="name" />
                  <el-table-column label="总金额" prop="total" />
                  <el-table-column label="检查次数" prop="createTime" />
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
