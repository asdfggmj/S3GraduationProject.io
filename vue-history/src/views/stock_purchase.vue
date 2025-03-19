<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-card shadow="always">
    <el-form :model="queryForm">
      <el-row>
        <el-form-item style="margin-right: 6px" label="供应商名称">
          <el-col>
            <el-input
              v-model="queryForm.providerId"
              @input="debouncedGetProviderFetch"
              placeholder="请输入供应商名称"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item style="margin-right: 6px" label="申请人">
          <el-col>
            <el-input
              v-model="queryForm.applyUserName"
              @input="debouncedGetProviderFetch"
              placeholder="请输入申请人名字"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item style="margin-right: 6px" label="状态">
          <el-col>
            <el-select
              @change="debouncedGetProviderFetch"
              v-model="queryForm.status"
              placeholder="请选择状态"
              style="width: 240px"
              clearable
            >
              <el-option label="正常" value="0" />
              <el-option label="禁用" value="1" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-col :span="4">
          <el-button type="primary" @click="getPurchaseFetch">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button type="danger" @click="resetQueryFetch">
            <el-icon><Refresh /></el-icon>
            <span>重置</span>
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <!-- 第二行 -->
  <el-row class="mt-10px">
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addPurchase">
              <i class="iconfont icon-xinzengcaigou" style="margin-right: 6px" />
              <span>新增采购</span>
            </el-button>
            <el-button type="danger">
              <i class="iconfont icon-zuofei" style="margin-right: 6px" :disabled="" />
              <span>作废</span>
            </el-button>
            <el-button type="success">
              <i class="iconfont icon-tijiaoruku" style="margin-right: 6px" :disabled="" />
              <span>提交审核</span>
            </el-button>
            <el-button type="success">
              <i class="iconfont icon-rukuqueren" style="margin-right: 6px" :disabled="" />
              <span>提交入库</span>
            </el-button>
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
              border
              :data="purchaseData"
              style="width: 100%"
              max-height="500"
              row-key="purchaseId"
            >
              <el-table-column fixed type="selection" width="55" />
              <el-table-column fixed label="单据编号" prop="purchaseId" width="220">
                <template #default="scope">
                  <el-button type="primary" link @click="checkDictData(scope.row.purchaseId)">{{
                    scope.row.purchaseId
                  }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="供应商" prop="providerId" width="200">
                <template #default="scope">
                  {{ providerMap[scope.row.providerId] || '未知或已禁用的公司' }}
                </template>
              </el-table-column>
              <el-table-column label="采购批发总额" prop="purchaseTradeTotalAmount" width="200" />
              <el-table-column label="状态" prop="status" width="120">
                <template #default="scope">
                  {{ purchaseDataMap[scope.row.status] }}
                </template>
              </el-table-column>
              <el-table-column label="申请人" prop="applyUserName" width="80" />
              <el-table-column label="入库操作人" prop="storageOptUser" width="120">
                <template #default="scope">
                  <span>{{ scope.row.storageOptUser || '未知' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="入库操作时间" prop="storageOptTime" width="200">
                <template #default="scope">
                  <span>{{ scope.row.storageOptTime || '未知' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="createTime" width="200">
                <template #default="scope">
                  <span>{{ formatDate(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建人" prop="createBy" width="120" />
              <el-table-column label="最后一次修改时间" prop="updateTime" width="200">
                <template #default="scope">
                  <span>{{ formatDate(scope.row.updateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="修改人" prop="updateBy" width="120">
                <template #default="scope">
                  <span>{{ scope.row.updateBy || '未知' }}</span>
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

  <!-- 新增采购抽屉 -->
  <el-drawer
    v-model="addPurchaseDialog"
    title="新增采购"
    direction="btt"
    size="70%"
    :before-close="handleClose"
  >
    <!-- 按钮组 -->
    <el-card shadow="always">
      <el-row justify="end">
        <el-col :span="6">
          <el-button type="primary" @click="addMedicinesFetch">添加药品</el-button>
          <el-button type="success" @click="batckSettingFetch">批量设置</el-button>
          <el-button type="warning" @click="temporaryStorageFetch">暂存</el-button>
          <el-button type="danger" @click="submitForReviewFetch">提交审核</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 入库订单信息表单 -->
    <el-form :model="addPurchaseData">
      <!-- 卡片 -->
      <el-card shadow="always" class="mt-10px">
        <!-- 入库订单信息行 -->
        <el-row justify="space-between">
          <el-col :span="4">
            <el-form-item label="单据号">
              <el-input disabled v-model="addPurchaseData.purchaseId" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="制单人">
              <el-input disabled v-model="addPurchaseData.applyUserName" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="供应商">
              <el-select
                v-model="addPurchaseData.providerId"
                placeholder="请选择"
                style="width: 240px"
              >
                <el-option
                  v-for="item in providerDataMap"
                  :key="item.providerId"
                  :label="item.providerName"
                  :value="item.providerId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="制单时间">
              <el-date-picker
                v-model="addPurchaseData.createTime"
                type="datetime"
                placeholder="请选择"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="总批发额">
              <el-input disabled v-model="addPurchaseData.purchaseTradeTotalAmount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <!-- 入库订单详细信息表格行 -->
    <el-card shadow="always" class="mt-10px">
      <el-row>
        <el-col :span="24">
          <el-table
            border
            :data="checkedAddMedicinesDataList"
            style="width: 100%"
            max-height="500"
            row-key="medicinesId"
            empty-text="这里是空的~"
          >
            <el-table-column label="药品ID" prop="medicinesId" width="80" />
            <el-table-column label="药品名称" prop="medicinesName" />
            <el-table-column label="规格">
              <template #default="scope">
                <span>{{ scope.row.conversion + scope.row.unit }}</span>
              </template>
            </el-table-column>
            <el-table-column label="生产厂家" prop="producterName" width="260" />
            <el-table-column label="数量" width="200" prop="purchaseNumber">
              <template #default="scope">
                <el-input-number v-model="scope.row.purchaseNumber" :min="0" />
              </template>
            </el-table-column>
            <el-table-column label="批发价" prop="tradePrice" width="200">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.tradePrice"
                  :min="0.01"
                  :precision="2"
                  :step="0.01"
                />
              </template>
            </el-table-column>
            <el-table-column label="批发额" prop="tradeTotalAmount">
              <template #default="{ row }">
                {{
                  (parseFloat(row.purchaseNumber || 0) * parseFloat(row.tradePrice || 0)).toFixed(2)
                }}
              </template>
            </el-table-column>
            <el-table-column label="批次号">
              <template #default="{ row }">
                <el-input v-model="row.batchNumber" placeholder="输入批次号" />
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template #default="{ row }">
                <el-input v-model="row.remark" placeholder="输入备注" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ $index }">
                <el-button type="danger" @click="removeItem($index)">
                  <el-icon><Delete /></el-icon>
                  <span>删除</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </el-drawer>

  <!-- 新增药品对话框 -->
  <el-dialog
    center
    v-model="addMedicinesDialog"
    title="添加入库药品信息"
    width="1200"
    :before-close="handleCloseMedicines"
    align-center
    draggable
    destroy-on-close
  >
    <!-- 数据内容 -->
    <el-form label-width="auto" :model="medicinesQueryForm">
      <el-row justify="space-evenly">
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input
              placeholder="请输入关键字"
              @change="getAllMedicinesFetch"
              v-model="medicinesQueryForm.keywords"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="药品类型">
            <el-select
              v-model="medicinesQueryForm.medicinesType"
              placeholder="请选择药品类型"
              style="width: 240px"
              @change="getAllMedicinesFetch"
            >
              <el-option
                v-for="item in medicinesDataMap"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="处方类型">
            <el-select
              v-model="medicinesQueryForm.prescriptionType"
              placeholder="请选择处方类型"
              style="width: 240px"
              @change="getAllMedicinesFetch"
            >
              <el-option
                v-for="item in prescriptionTypeDataMap"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table
      border
      :data="medicinesTableData"
      max-height="500"
      @selection-change="handleSelectionChange"
      row-key="medicinesId"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="药品ID" prop="medicinesId" width="80" />
      <el-table-column label="药品名称" prop="medicinesName" />
      <el-table-column label="药品编码" prop="medicinesNumber" width="120" />
      <el-table-column label="生产厂家" prop="producterName" width="260" />
      <el-table-column label="药品类型" prop="medicinesType" width="160">
        <template #default="scope">
          <span>{{ medicinesMap[scope.row.medicinesType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处方类型" prop="prescriptionType" width="100">
        <template #default="scope">
          <span>{{ prescriptionTypeMap[scope.row.prescriptionType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关键字" prop="keywords" />
      <template #empty>
        <el-empty :image-size="100" description="ol,小鬼!没有找到任何数据啊!?!?" />
      </template>
    </el-table>
    <!-- 分页行 -->
    <el-row class="mt-10px">
      <el-col :span="24">
        <el-pagination
          background
          layout="total,sizes,prev, pager, next,jumper"
          :total="medicinesPageTotal"
          size="small"
          :pager-count="11"
          :page-size="medicinesPageSize"
          :page-sizes="[10, 20, 50]"
          :current-page="medicinesPageNum"
          @size-change="medicinesSizeChange"
          @current-change="medicinesCurrentChange"
        />
      </el-col>
    </el-row>
    <!-- 对话框底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="addMedicinesDialog = false"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 批量设置对话框 -->
  <el-dialog
    v-model="batchSettingsVisible"
    title="批量设置"
    width="500"
    :before-close="batchSettingsHandleClose"
    destroy-on-close
  >
    <!-- 内容主体 -->
    <el-form label-width="auto" :model="batchSettingForm">
      <el-row>
        <el-col>
          <el-form-item label="数量">
            <el-input-number v-model="batchSettingForm.num" :min="0" :max="100000" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="批发价格">
            <el-input-number
              v-model="batchSettingForm.price"
              :min="0.0"
              :precision="2"
              :step="0.1"
              :max="100000"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="批次号">
            <el-input placeholder="请输入批次号" v-model="batchSettingForm.batchNumber" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注">
            <el-input placeholder="请输入备注" v-model="batchSettingForm.remark" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="batchSettingsVisible = false">取消</el-button>
        <el-button type="primary" @click="settingBatchSetting"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import http from '@/http'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const medicinesPageNum = ref(1) //药品对话框当前页
const medicinesPageSize = ref(10) //药品对话框每页显示的数据
const medicinesPageTotal = ref(0) //药品对话框总个数
const purchaseData = reactive([]) //入库订单数据
const queryForm = reactive({
  providerId: '', //供应商ID
  applyUserName: '', //申请人名称
  status: '', //单据状态
})
const purchaseDataMap = ref({}) //存储入库状态类型字典
const providerDataMap = ref({}) //存储供应商类型字典
const providerMap = ref([])
const addPurchaseDialog = ref(false) //新增采购抽屉
const addPurchaseData = reactive({
  purchaseId: '', //单据号
  applyUserName: '', //申请人
  providerId: '', //供应商ID
  createTime: new Date().toJSON(), //制单时间(创建时间)
  status: '', //状态
  purchaseTradeTotalAmount: 0, //总批发额
}) //新增采购对象基本信息--->对应入库订单表
const checkedAddMedicinesDataList = ref([
  // {
  //   purchaseId: '', //单据号
  //   purchaseNumber: 0, //采购数量
  //   tradePrice: 0, //批发价
  //   tradeTotalAmount: 0, //批发额
  //   batchNumber: '', //药品生产批次号
  //   remark: '', //备注
  //   medicinesId: '', //药品ID
  //   medicinesName: '', //药品名称
  //   medicinesType: '', //药品分类
  //   prescriptionType: '', //处方类型
  //   producterId: '', //生产厂家ID
  //   conversion: '', //换算量
  //   unit: '', //单位
  //   keywords: '', //关键字
  // },
]) //选中的新增采购对象新增药品数据
const medicinesTableData = reactive([
  {
    medicinesId: '', //药品ID
    medicinesName: '', //药品名称
    medicinesNumber: '', //药品编码
    producterName: '', //生产厂家
    medicinesType: '', //药品类型
  },
]) //新增采购对象新增药品数据
const userStore = useUserStore()
const addMedicinesDialog = ref(false) //新增药品对话框控制显示隐藏
// 记录选中的药品 ID（用于回填选中状态）
const checkedMedicinesIds = ref(new Set())
const prescriptionTypeDataMap = ref({}) //存储处方类型字典
const prescriptionTypeMap = ref([])
const medicinesDataMap = ref({}) //存储药品类型字典
const medicinesMap = ref([])
const medicinesQueryForm = reactive({
  keywords: '', //关键字
  medicinesType: '', //药品类型
  prescriptionType: '', //处方类型
}) //查询条件表单数据对象
const batchSettingsVisible = ref(false) //批量设置对话框控制显示
const batchSettingForm = reactive({
  num: 0, //数量
  price: 0.0, //批发价格
  batchNumber: '', //批次号
  remark: '', //备注
}) //入库订单明细表的批量设置

// 计算总批发额
const totalTradeAmount = computed(() => {
  return checkedAddMedicinesDataList.value
    .reduce((total, row) => {
      return total + parseFloat(row.purchaseNumber || 0) * parseFloat(row.tradePrice || 0)
    }, 0)
    .toFixed(2) // 保留两位小数
})

// 监听计算总批发额的变化
watch(totalTradeAmount, (newValue) => {
  addPurchaseData.purchaseTradeTotalAmount = newValue
})

// 删除某一行
const removeItem = (index) => {
  checkedAddMedicinesDataList.value.splice(index, 1)
}

// 暂存和提交审核的公用方法：提交入库订单（status：'1' = 暂存，'2' = 提交审核）
const submitOrder = async (status) => {
  try {
    // 设置状态（1=暂存, 2=提交审核）
    addPurchaseData.status = status

    // 1 创建入库订单，获取 purchaseId
    const purchaseRes = await http.post('/purchase/add', addPurchaseData)
    if (purchaseRes.data.code !== 200 || !purchaseRes.data.data) {
      return ElMessage.error(status === '1' ? '暂存失败' : '提交审核失败')
    }
    console.log('purchaseRes', purchaseRes)

    // 2 获取后端返回的 purchaseId，确保明细可以正确关联
    const purchaseId = addPurchaseData.purchaseId // 假设后端返回这个字段
    if (!purchaseId) {
      return ElMessage.error('未获取到 purchaseId，明细无法关联')
    }
    console.log('purchaseId', purchaseId)

    // 3 给所有明细添加 purchaseId
    checkedAddMedicinesDataList.value = checkedAddMedicinesDataList.value.map((item) => ({
      ...item,
      purchaseId,
    }))
    console.log('checkedAddMedicinesDataList', checkedAddMedicinesDataList.value)

    // 4 再创建入库订单明细
    const itemRes = await http.post('/purchaseItem/add', checkedAddMedicinesDataList.value)
    if (itemRes.data.code === 200 && itemRes.data.data) {
      //解构重置新增采购对象基本信息--->对应入库订单表对象
      Object.assign(addPurchaseData, {
        purchaseId: '', //单据号
        applyUserName: '', //申请人
        providerId: '', //供应商ID
        createTime: new Date().toJSON(), //制单时间(创建时间)
        status: '', //状态
        purchaseTradeTotalAmount: 0, //总批发额
      })
      //清空选中的新增采购对象新增药品数据
      checkedAddMedicinesDataList.value = []
      //关闭抽屉
      addPurchaseDialog.value = false
      //重新查询
      getPurchaseFetch()
      ElMessage.success(status === '1' ? '暂存成功' : '提交审核成功')
    } else {
      ElMessage.error(status === '1' ? '入库订单明细添加失败' : '提交审核失败')
    }
  } catch (error) {
    console.error(status === '1' ? '暂存失败' : '提交审核失败', error)
    ElMessage.error(
      status === '1' ? '暂存失败，请检查网络或联系管理员' : '提交审核失败，请检查网络或联系管理员',
    )
  }
}

// 暂存-->1
const temporaryStorageFetch = () => submitOrder('1')

// 提交审核-->2
const submitForReviewFetch = () => submitOrder('2')

//重置查询条件
const resetQueryFetch = () => {
  Object.assign(medicinesQueryForm, {
    keywords: '', //关键字
    medicinesType: '', //药品类型
    prescriptionType: '', //处方类型
  })
}

//赋值batchSettingForm
const settingBatchSetting = () => {
  checkedAddMedicinesDataList.value.forEach((item) => {
    item.purchaseId = addPurchaseData.purchaseId //单据号
    item.purchaseNumber = batchSettingForm.num // 采购数量
    item.tradePrice = batchSettingForm.price // 批发价格
    item.batchNumber = batchSettingForm.batchNumber // 批次号
    item.remark = batchSettingForm.remark // 备注
  })
  ElMessage.success('批量设置成功!!!')
  batchSettingsVisible.value = false
  Object.assign(batchSettingForm, {
    num: 0, //数量
    price: 1.0, //批发价格
    batchNumber: '', //批次号
    remark: '', //备注
  })
}

//批量设置方法
const batckSettingFetch = () => {
  batchSettingsVisible.value = true
}

//药品类型
const getMedicinesTypeFetch = () => {
  http.get('/dictData/get/his_medicines_type').then((res) => {
    const medicinesData = res.data.data || []
    medicinesDataMap.value = medicinesData

    medicinesMap.value = medicinesData.reduce((map, item) => {
      map[Number(item.dictValue)] = item.dictLabel
      return map
    }, {})
  })
}

//处方类型
const getPrescriptionTypeFetch = () => {
  http.get('/dictData/get/his_prescription_type').then((res) => {
    const prescriptionTypeData = res.data.data || []
    prescriptionTypeDataMap.value = prescriptionTypeData

    prescriptionTypeMap.value = prescriptionTypeData.reduce((map, item) => {
      map[Number(item.dictValue)] = item.dictLabel
      return map
    }, {})
  })
}

// 监听多选
const handleSelectionChange = (val) => {
  checkedAddMedicinesDataList.value = val // 直接赋值选中的数据
  checkedMedicinesIds.value = new Set(val.map((item) => item.medicinesId)) // 存储选中ID
}

//药品上一页
const medicinesSizeChange = (newPageSize) => {
  medicinesPageSize.value = newPageSize
  getAllMedicinesFetch()
}
//药品下一页
const medicinesCurrentChange = (newPage) => {
  medicinesPageNum.value = newPage
  getAllMedicinesFetch()
}

//新增药品异步方法
const addMedicinesFetch = () => {
  //获取所有药品信息
  getAllMedicinesFetch()
  //打开对话框
  addMedicinesDialog.value = true
}

//获取所有药品
const getAllMedicinesFetch = () => {
  http
    .get('/medicines/list', {
      params: {
        pageNum: medicinesPageNum.value,
        pageSize: medicinesPageSize.value,
        keywords: medicinesQueryForm.keywords,
        medicinesType: medicinesQueryForm.medicinesType,
        prescriptionType: medicinesQueryForm.prescriptionType,
      },
    })
    .then((res) => {
      const list = Array.isArray(res.data.data.list) ? res.data.data.list : []
      medicinesTableData.splice(0, medicinesTableData.length, ...list)
      medicinesPageTotal.value = res.data.data?.total || 0
    })
}

const batchSettingsHandleClose = () => {
  ElMessageBox.confirm('你确定要关闭吗?所有数据将不会做任何保存!!!!!').then(() => {
    batchSettingsVisible.value = false
  })
}

const handleCloseMedicines = () => {
  ElMessageBox.confirm('你确定要关闭吗?所有数据将不会做任何保存!!!!!').then(() => {
    addMedicinesDialog.value = false
  })
}

const handleClose = () => {
  ElMessageBox.confirm('你确定要关闭吗?所有数据将不会做任何保存!!!!!').then(() => {
    addPurchaseDialog.value = false
  })
}

//新增采购
const addPurchase = () => {
  console.log('checkedAddMedicinesDataList', checkedAddMedicinesDataList.value)

  //获取当前的用户名
  let username = userStore.getUser.data.data.userName

  http.get('/purchase/getPurId').then((res) => {
    Object.assign(addPurchaseData, {
      purchaseId: res.data.data,
      applyUserName: username,
    })
  })
  addPurchaseDialog.value = true
}

//供应商
const getProducterFetch = () => {
  http.get('/provider/getIdName').then((res) => {
    const providerData = res.data.data || []
    providerDataMap.value = providerData

    providerMap.value = providerData.reduce((map, item) => {
      map[Number(item.providerId)] = item.providerName
      return map
    }, {})
  })
}

//入库状态
const getPurchaseTypeFetch = () => {
  http.get('/dictData/get/his_order_status').then((res) => {
    const purchaseData = res.data.data || []

    purchaseDataMap.value = purchaseData.reduce((map, item) => {
      map[Number(item.dictValue)] = item.dictLabel
      return map
    }, {})
  })
}

//使用dayjs序列化时间
const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '--'
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getPurchaseFetch()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getPurchaseFetch()
}

//页面加载时挂载
onMounted(() => {
  getPurchaseFetch()
  getPurchaseTypeFetch()
  getProducterFetch()
  getMedicinesTypeFetch()
  getPrescriptionTypeFetch()
})

//获取入库订单数据
const getPurchaseFetch = () => {
  http
    .get('/purchase/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        providerId: queryForm.providerId,
        applyUserName: queryForm.applyUserName,
        status: queryForm.status,
      },
    })
    .then((res) => {
      const list = Array.isArray(res.data.data.list) ? res.data.data.list : []
      purchaseData.splice(0, purchaseData.length, ...list)
      pageTotal.value = res.data.data?.total || 0
    })
}
// 防抖处理
const debouncedGetProviderFetch = debounce(getPurchaseFetch, 500)
</script>

<style>
@import url('https://at.alicdn.com/t/c/font_4844128_0pn97os92c2i.css');
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
