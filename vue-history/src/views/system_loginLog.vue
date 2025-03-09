<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <!-- 模糊查询 -->
          <el-col :span="12">
            <el-button type="primary" @click="addLoginLog">
              <el-icon><Plus /></el-icon>
              <span>删除</span>
            </el-button>
            <el-button type="danger">
              <el-icon><Minus /></el-icon>
              <span>清空</span>
            </el-button>
          </el-col>
          <el-form-item label="用户名称" style="font-size: 15px;">
      <el-input v-model="userName"   placeholder="请输入用户名称" @change="searchLoginLog"/>
    </el-form-item>
    <!-- <el-form-item label="用户账号" style="font-size: 15px;">
      <el-input v-model="loginAccount"  placeholder="请输入用户账号" @change="searchLoginLog"/>
    </el-form-item> -->
    <!-- <el-form-item label="IP地址" style="font-size: 15px;">
      <el-input v-model="ipAddr" placeholder="请输入IP地址"/>
    </el-form-item>
    <el-form-item label="登录状态" style="font-size: 15px;">
      <el-select v-model="loginStatus" placeholder="请选择登录状态">
        <el-option label="成功" value="0" />
        <el-option label="失败" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="登录类型" style="font-size: 15px;">
      <el-select v-model="loginType" placeholder="请选择登录类型">
        <el-option label="系统用户" value="0" />
        <el-option label="患者用户" value="1" />
      </el-select>
    </el-form-item> -->
    <!-- <el-form-item label="登录时间" style="font-size: 15px;">
      <el-date-picker
        v-model="loginTime"
        type="date"
        placeholder=""
        clearable
      />
    </el-form-item> -->
    <!-- <el-button type="primary" :icon="Search">
      搜索
      </el-button>
      <el-button type="plain" :icon="Refresh" >
      重置
      </el-button> -->
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
            <el-table :data="loginLogData" style="width: 100%" max-height="500" row-key="dictId">
              <el-table-column fixed type="selection" width="55" />
              <el-table-column label="用户名" prop="userName" width="120" />
              <el-table-column label="登录账号" prop="loginAccount" />
              <el-table-column label="IP" prop="background" />
              <el-table-column label="登录地址" prop="ipAddr" width="200" />
              <el-table-column label="浏览器" prop="browser" width="200" />
              <el-table-column label="操作系统" prop="os" width="200" />
              <el-table-column label="登录状态" width="200" >
              <template #default="scope">
                  <span>{{ scope.row.schedulingFlag === 0 ? '成功' : '失败' }}</span>
                </template>
                </el-table-column>
              <el-table-column label="用户类型" width="200" >
                <template #default="scope">
                  <span>{{ scope.row.schedulingFlag === 0 ? '系统用户' : '患者用户' }}</span>
                </template>
                </el-table-column>
              <el-table-column label="登录时间" prop="loginTime" width="200" />
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="240">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="danger" size="small" @click="delLoginLog(scope.row.userId)">
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
import { onMounted, reactive, ref } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import http from '@/http'
import { useCookies } from '@vueuse/integrations/useCookies';

//从cookie获取authorization
const cookie=useCookies();
const auhtorization=cookie.get('authorization')

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const userName = ref('') //用户名称
const loginAccount = ref('') //用户账号
const ipAddr = ref('') //IP地址
const loginStatus = ref('') //登录状态
const loginType = ref('') //登录类型
const loginTime = ref('') //登录时间

//登录日志数据
const loginLogData = reactive([
  {
    infoId:'',
    userName:'',
    loginAccount:'',
    ipAddr:'',
    loginLocation:'',
    browser:'',
    status:'',
    msg:'',
    loginTime:'',
    loginType:''
  }
])

//模糊查询
const searchLoginLog = () => {
   getLoginLoginData()
}

//添加登录日志
const addLoginLog = () => {

}

//删除登录日志
const delLoginLog = (userId) => {

}

//上一页
const sizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  getLoginLoginData()
}

//下一页
const currentChange = (newPage) => {
  pageNum.value = newPage
  getLoginLoginData()
}

// 页面加载时获取登录数据
onMounted(() => {
  getLoginLoginData()
})

// 获取登录日志记录数据
const getLoginLoginData = () => {
  http
    .get('/loginInfo/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        userName: userName.value,
        loginAccount: loginAccount.value,
        ipAddr: ipAddr.value,
        loginStatus: loginStatus.value,
        loginType: loginType.value,
        loginTime: loginTime.value
      },headers: { 'Authorization': 'Bearer' + auhtorization }
    })
    .then((res) => {
      const loginLog = res.data.data
      if (loginLog.list) {
        pageTotal.value = loginLog.total
        pageNum.value = loginLog.pageNum
        pageSize.value = loginLog.pageSize
        loginLogData.splice(0, loginLogData.length, ...loginLog.list)
      }
    })
  }
</script>
