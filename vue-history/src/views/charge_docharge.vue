<!-- 处方收费 -->
<template>
  <!-- 卡片1 -->
  <el-card shadow="always">
    <el-row>
      <el-col :span="6">
        <el-form-item label="挂单号ID">
          <el-input placeholder="请输入挂单号" />
        </el-form-item>
      </el-col>
      <el-col :span="4" style="margin-left: 6px">
        <el-button type="primary" @click="get">
          <el-icon><Search /></el-icon>
          <span>查询</span>
        </el-button>
        <el-button type="primary">
          <el-icon><Search /></el-icon>
          <span>读取IC卡</span>
        </el-button>
      </el-col>
    </el-row>
  </el-card>
  <!-- 卡片2 -->
  <el-card class="mt-10px" shadow="always" v-if="msg === true">
    <el-row>
      <el-col :span="24">
        <el-text size="large" type="primary">基本信息：</el-text>
      </el-col>
    </el-row>
    <el-row justify="space-evenly">
      <el-col :span="9">
        <el-row class="mt-10px">
          <el-col>挂号单号：</el-col>
        </el-row>
        <el-row class="mt-10px">
          <el-col>科室名称：</el-col>
        </el-row>
        <el-row class="mt-10px">
          <el-col>就诊时间：</el-col>
        </el-row>
        <el-row class="mt-10px">
          <el-col>诊断信息：</el-col>
        </el-row>
      </el-col>
      <el-col :span="9">
        <el-row class="mt-10px">
          <el-col>医生姓名：</el-col>
        </el-row>
        <el-row class="mt-10px">
          <el-col>患者姓名：</el-col>
        </el-row>
        <el-row class="mt-10px">
          <el-col>主诉：</el-col>
        </el-row>
        <el-row class="mt-10px">
          <el-col>医生建议：</el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
  <!-- 卡片3 -->
  <el-card shadow="always" class="mt-10px" v-if="msg === true">
    <el-row>
      <el-col :span="12">
        <el-text size="large" type="primary">支付方式：</el-text>
      </el-col>
      <el-col :span="12">
        <el-text size="large" type="danger">订单总额：300￥</el-text>
      </el-col>
    </el-row>
    <el-row class="mt-10px">
      <el-col :span="24">
        <el-button type="primary" @click="xianjin">
          <i class="iconfont icon-_xianjin" style="margin-right: 6px"></i>
          <span>现金</span>
        </el-button>
        <el-button type="primary" @click="zhifubao">
          <i class="iconfont icon-zhifubaozhifu" style="margin-right: 6px"></i>
          <span>支付宝</span>
        </el-button>
        <el-button type="primary" @click="weixin">
          <i class="iconfont icon-weixin" style="margin-right: 6px"></i>
          <span>微信</span>
        </el-button>
        <el-button type="primary" @click="yinlian">
          <i class="iconfont icon-yinlian" style="margin-right: 6px"></i>
          <span>银联</span>
        </el-button>
      </el-col>
    </el-row>
  </el-card>
  <!-- 卡片4 -->
  <el-card shadow="always" class="mt-10px" v-if="msg === true">
    <el-row>
      <el-col :span="12">
        <el-text size="large" type="primary">订单明细：</el-text>
      </el-col>
    </el-row>
    <el-row class="mt-10px">
      <el-col :span="24">
        <el-collapse accordion>
          <el-collapse-item title="[检查处方]-[1]-[处方总金额]：150￥" name="1">
            <div>
              Consistent with real life: in line with the process and logic of real life, and comply
              with languages and habits that the users are used to;
            </div>
            <div>
              Consistent within interface: all elements should be consistent, such as: design style,
              icons and texts, position of elements, etc.
            </div>
          </el-collapse-item>
          <el-collapse-item title="[检查处方]-[2]-[处方总金额]：10￥" name="2">
            <div>
              Operation feedback: enable the users to clearly perceive their operations by style
              updates and interactive effects;
            </div>
            <div>
              Visual feedback: reflect current state by updating or rearranging elements of the
              page.
            </div>
          </el-collapse-item>
          <el-collapse-item title="[药品处方]-[3]-[处方总金额]：150￥" name="3">
            <div>Simplify the process: keep operating process simple and intuitive;</div>
            <div>
              Definite and clear: enunciate your intentions clearly so that the users can quickly
              understand and make decisions;
            </div>
            <div>
              Easy to identify: the interface should be straightforward, which helps the users to
              identify and frees them from memorizing and recalling.
            </div>
          </el-collapse-item>
          <el-collapse-item title="[药品处方]-[4]-[处方总金额]：150￥" name="4">
            <div>
              Decision making: giving advices about operations is acceptable, but do not make
              decisions for the users;
            </div>
            <div>
              Controlled consequences: users should be granted the freedom to operate, including
              canceling, aborting or terminating current operation.
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </el-card>
  <el-row class="mt-10px" v-else style="text-align: center">
    <el-col>
      <el-text type="primary">暂无数据或挂单号错误</el-text>
    </el-col>
  </el-row>
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
import { ref } from 'vue'

const payforVisible = ref(false)
const msg = ref(false)

const xianjin = () => {
  payforVisible.value = true
}
const weixin = () => {
  payforVisible.value = true
}
const zhifubao = () => {
  payforVisible.value = true
}
const yinlian = () => {
  payforVisible.value = true
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('你确定要取消支付吗')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const get = () => {
  msg.value = true
}
</script>

<style>
@import url('https://at.alicdn.com/t/c/font_4844128_4azmggyqmzg.css');
.mt-10px {
  margin-top: 10px;
}
</style>
