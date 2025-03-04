<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <!-- 卡片 -->
      <el-card shadow="always">
        <!-- 切换卡 -->
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="药品总库存" name="first">
            <!-- 按钮行 -->
            <el-row>
              <el-col :span="5">
                <el-form-item label="药品名称">
                  <el-input placeholder="请输入药品名称" />
                </el-form-item>
              </el-col>
              <el-col :span="5" style="margin-left: 6px">
                <el-form-item label="药品类型">
                  <el-select v-model="value" placeholder="药品类型" style="width: 240px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="margin-left: 6px">
                <el-form-item label="生产厂家">
                  <el-select v-model="value" placeholder="生产厂家" style="width: 240px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="margin-left: 6px">
                <el-form-item label="处方类型">
                  <el-select v-model="value" placeholder="处方类型" style="width: 240px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="margin-left: 20px">
                <el-button type="primary">搜索</el-button>
                <el-button type="primary">重置</el-button>
              </el-col>
            </el-row>
            <!-- 表格行 -->
            <el-row>
              <el-col>
                <el-table>
                  <el-table-column label="药品编号"></el-table-column>
                  <el-table-column label="药品名称"></el-table-column>
                  <el-table-column label="库存数量"></el-table-column>
                  <el-table-column label="预警值"></el-table-column>
                  <el-table-column label="生产厂家"></el-table-column>
                  <el-table-column label="药品类型"></el-table-column>
                  <el-table-column label="处方类型"></el-table-column>
                  <el-table-column label="单位"></el-table-column>
                  <el-table-column label="换算量"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <!-- 分页行 -->
            <el-row style="margin-top: 10px">
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
          </el-tab-pane>
          <el-tab-pane label="批次库存及价格" name="second">
            <!-- 按钮行 -->
            <el-row justify="space-between">
              <el-col :span="5">
                <el-form-item label="采购单编号">
                  <el-input placeholder="请输入药品名称" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="药品名称">
                  <el-input placeholder="请输入药品名称" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="药品类型">
                  <el-select v-model="value" placeholder="生产厂家">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="生产厂家">
                  <el-select v-model="value" placeholder="处方类型">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 第二行 -->
            <el-row justify="space-between">
              <el-col :span="10">
                <el-form-item label="处方类型">
                  <el-select v-model="value" placeholder="处方类型" style="width: 240px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="创建时间">
                  <el-date-picker v-model="value1" type="date" placeholder="Select date and time" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button type="primary">搜索</el-button>
                <el-button type="primary">重置</el-button>
              </el-col>
            </el-row>
            <!-- 表格行 -->
            <el-row>
              <el-col>
                <el-table>
                  <el-table-column label="药品编号"></el-table-column>
                  <el-table-column label="药品名称"></el-table-column>
                  <el-table-column label="采购数量"></el-table-column>
                  <el-table-column label="批发价"></el-table-column>
                  <el-table-column label="批发额"></el-table-column>
                  <el-table-column label="批次号"></el-table-column>
                  <el-table-column label="生产厂家"></el-table-column>
                  <el-table-column label="药品类型"></el-table-column>
                  <el-table-column label="处方类型"></el-table-column>
                  <el-table-column label="创建时间"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <!-- 分页行 -->
            <el-row style="margin-top: 10px">
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
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('first')
const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  // getDictFetch()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  // getDictFetch()
}
</script>
