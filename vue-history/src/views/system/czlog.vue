<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addOperateLog">
              <el-icon><Plus /></el-icon>
              <span>删除</span>
            </el-button>
            <el-button type="danger">
              <el-icon><Minus /></el-icon>
              <span>清空</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchOperateLog"
              placeholder="请输入关键字回车以查询"
              clearable
              size=""
            />
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第二行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always">
        <!-- 表格 -->
        <el-row class="mt-10px">
          <el-col>
            <el-table :data="OperateLogData" style="width: 100%" max-height="500" row-key="dictId">
              <el-table-column fixed type="selection" width="55" />
              <el-table-column label="日志ID" prop="userName" width="120" />
              <el-table-column label="系统模块" prop="userName" width="120" />
              <el-table-column label="操作类型" prop="deptId" />
              <el-table-column label="请求方式" prop="createTime" width="200" />
              <el-table-column label="操作人员" prop="createTime" width="200" />
              <el-table-column label="主机" prop="createTime" width="200" />
              <el-table-column label="操作地点" prop="createTime" width="200" />
              <el-table-column label="操作状态" prop="createTime" width="200" />
              <el-table-column label="操作时间" prop="createTime" width="200" />

              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="240">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="danger" size="small" @click="delOperateLog(scope.row.userId)">
                      <el-icon><Delete /></el-icon>
                      <span>删除</span>
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
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
import { reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const OperateLogData = reactive([]) //科室数据
</script>
