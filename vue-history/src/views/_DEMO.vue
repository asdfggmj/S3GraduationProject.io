<template>
  <div>
    <!-- <el-table :data="tableData" :span-method="arraySpanMethod" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="amount1" sortable label="Amount 1" />
      <el-table-column prop="amount2" sortable label="Amount 2" />
      <el-table-column prop="amount3" sortable label="Amount 3" />
    </el-table> -->

    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="amount1" label="Amount 1" />
      <el-table-column prop="amount2" label="Amount 2" />
      <el-table-column prop="amount3" label="Amount 3" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus'

interface User {
  id: string
  name: string
  amount1: string
  amount2: string
  amount3: number
}

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return [1, 2]
    } else if (columnIndex === 1) {
      return [0, 0]
    }
  }
}

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

const tableData = [
  {
    id: '12987122',
    name: '华佗',
    amount1: '上午',
    amount2: '3.2',
    amount3: 10,
  },
  {
    id: '12987123',
    name: '华佗',
    amount1: '中午',
    amount2: '4.43',
    amount3: 12,
  },
  {
    id: '12987124',
    name: '华佗',
    amount1: '下午',
    amount2: '1.9',
    amount3: 9,
  },
  {
    id: '12987125',
    name: '张三',
    amount1: '上午',
    amount2: '2.2',
    amount3: 17,
  },
  {
    id: '12987126',
    name: '张三',
    amount1: '中午',
    amount2: '4.1',
    amount3: 15,
  },
  {
    id: '12987126',
    name: '张三',
    amount1: '下午',
    amount2: '4.1',
    amount3: 15,
  },
]
</script>
