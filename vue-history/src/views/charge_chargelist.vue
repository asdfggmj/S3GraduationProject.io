<!-- 收费列表 -->
<template>
  <!-- 卡片1 -->
  <el-card shadow="always">
    <el-row>
      <el-col :span="6">
        <el-form-item label="挂号单号">
          <el-input placeholder="请输入挂号单号" />
        </el-form-item>
      </el-col>
      <el-col :span="6" style="margin-left: 6px">
        <el-form-item label="患者姓名">
          <el-input placeholder="请输入患者姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="4" style="margin-left: 6px">
        <el-button type="primary">
          <el-icon><Search /></el-icon>
          <span>查询</span>
        </el-button>
      </el-col>
    </el-row>
  </el-card>
  <!-- 卡片2 -->
  <el-card class="mt-10px" shadow="always">
    <el-row>
      <el-col>
        <el-table :data="chargeListData">
          <el-table-column prop="ddh" label="订单号" />
          <el-table-column prop="ghdh" label="挂号单号" />
          <el-table-column prop="name" label="患者姓名" />
          <el-table-column prop="total" label="总金额" />
          <el-table-column prop="payType" label="支付类型" />
          <el-table-column prop="orderStatus" label="订单状态" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column label="操作" fixed="right" width="400">
            <template #default="scope">
              <el-button-group>
                <el-button type="primary">
                  <i class="iconfont icon-chakan" style="margin-right: 6px"></i>
                  <span>查看详细</span>
                </el-button>
                <el-button type="primary">
                  <i class="iconfont icon-_xianjin" style="margin-right: 6px"></i>
                  <span>现金收费</span>
                </el-button>
                <el-button type="primary">
                  <i class="iconfont icon-zhifubaozhifu" style="margin-right: 6px"></i>
                  <span>支付宝收费</span>
                </el-button>
                <el-button type="primary">
                  <i class="iconfont icon-weixin" style="margin-right: 6px"></i>
                  <span>微信收费</span>
                </el-button>
                <el-button type="primary">
                  <i class="iconfont icon-yinlian" style="margin-right: 6px"></i>
                  <span>银联收费</span>
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
  <el-dialog
    v-model="payforVisible"
    title="使用[微信]扫码支付"
    width="500"
    :before-close="handleClose"
  >
    <el-card shadow="hover">
      <el-row>
        <el-col :span="12">订单号：</el-col>
        <el-row :span="12">总金额：</el-row>
      </el-row>
    </el-card>
    <el-card class="mt-10px">
      <el-row>
        <el-col :span="24">二维码</el-col>
      </el-row>
    </el-card>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数

const chargeListData = reactive([
  {
    ddh: '12321313',
    ghdh: '1321321321',
    name: '张三三',
    total: '999',
    payType: '现金',
    orderStatus: '未支付',
    createTime: '2025-3-4',
  },
])

const payforVisible = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('你确定要取消支付吗')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<style>
@import url('https://at.alicdn.com/t/c/font_4844128_4azmggyqmzg.css');
.mt-10px {
  margin-top: 10px;
}
</style>
