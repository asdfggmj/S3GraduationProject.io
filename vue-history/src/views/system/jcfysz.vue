<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addInspectionFee">
              <el-icon><Plus /></el-icon>
              <span>新增</span>
            </el-button>
            <el-button type="danger">
              <el-icon><Minus /></el-icon>
              <span>删除选中</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchInspectionFee"
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
            <el-table
              :data="InspectionFeeData"
              style="width: 100%"
              max-height="500"
              row-key="dictId"
            >
              <el-table-column fixed type="selection" width="55" />
              <el-table-column label="项目费用ID" prop="userName" width="120" />
              <el-table-column label="项目名称" prop="deptId" />
              <el-table-column label="关键字" prop="background" />
              <el-table-column label="项目单价" prop="createTime" width="200" />
              <el-table-column label="项目成本" prop="createTime" width="200" />
              <el-table-column label="单位" prop="createTime" width="200" />
              <el-table-column label="类别" prop="createTime" width="200" />
              <el-table-column label="状态" prop="createTime" width="200" />
              <el-table-column label="创建时间" prop="createTime" width="200" />

              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="240">
                <template #default="scope">
                  <el-button-group>
                    <el-button
                      type="success"
                      size="small"
                      @click="editInspectionFee(scope.row.userId)"
                    >
                      <el-icon><Edit /></el-icon>
                      <span>编辑</span>
                    </el-button>
                    <el-button
                      type="danger"
                      size="small"
                      @click="delInspectionFee(scope.row.userId)"
                    >
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
const InspectionFeeData = reactive([]) //科室数据
</script>
