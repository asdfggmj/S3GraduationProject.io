<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addDict">
              <el-icon><Plus /></el-icon>
              <span>通过</span>
            </el-button>
            <el-button type="danger">
              <el-icon><Minus /></el-icon>
              <span>不通过</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchDict"
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
            <el-table :data="dictData" style="width: 100%" max-height="500" row-key="dictId">
              <el-table-column fixed type="selection" width="55" />
              <el-table-column fixed label="单据编号" prop="dictName" width="120" />
              <el-table-column label="供应商" prop="dictType" width="200" />
              <el-table-column label="采购批发总额" prop="dictType" width="200" />
              <el-table-column label="状态" prop="dictType" width="200" />
              <el-table-column label="申请人" prop="dictType" width="200" />
              <el-table-column label="入库操作人" prop="dictType" width="200" />
              <el-table-column label="入库时间" prop="dictType" width="200" />
              <el-table-column label="创建时间" prop="createTime" width="200" />
              <el-table-column label="创建人" prop="createBy" width="120" />
              <el-table-column label="最后一次修改时间" prop="updateTime" width="200" />
              <el-table-column label="修改人" prop="updateBy" width="120" />
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
import http from '@/http'
import router from '@/router'
import { useDictTypeStore } from '@/stores/dictType'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const dictData = reactive([]) //科室数据
const rowLoadingMap = reactive({}) //是否处于加载状态
const dictTypeStore = useDictTypeStore() //使用字典类别的xx

//根据ID查看数据类别的数据
const checkDictData = (dictType) => {
  dictTypeStore.setDictType({ dictType: dictType })
  console.log(dictTypeStore.getDictType)
  ElMessage.success(dictType)
  router.push({ name: 'dictData' })
}

//模糊查询
const searchDict = (keyWordInput) => {
  keyWord.value = keyWordInput
  ElMessage.info(keyWord.value)
  // getUserData()
}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getDictFetch()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getDictFetch()
}

//页面加载时挂载
onMounted(() => {
  getDictFetch()
})

const getDictFetch = () => {
  //获取字典数据
  http
    .get('/dict/type', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyWord: keyWord.value,
      },
    })
    .then((res) => {
      const list = Array.isArray(res.data.list) ? res.data.list : []
      dictData.splice(0, dictData.length, ...list)
      pageTotal.value = res.data?.total || 0
    })
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
