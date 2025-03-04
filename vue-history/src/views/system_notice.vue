<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addAnnouncement">
              <el-icon><Plus /></el-icon>
              <span>新增公告</span>
            </el-button>
            <el-button type="danger">
              <el-icon><Minus /></el-icon>
              <span>删除选中公告</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchAnnouncement"
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
              :data="AnnouncementData"
              style="width: 100%"
              max-height="500"
              row-key="dictId"
            >
              <el-table-column fixed type="selection" width="55" />
              <el-table-column label="公告编号" prop="noticeId" width="120" />
              <el-table-column
                label="公告标题"
                prop="noticeTitle"
                width="300"
                show-overflow-tooltip
              />
              <el-table-column label="公告类型" prop="dictLabel">
                <template #default="scope">
                  <el-tag :type="noticeTag(scope.row.dictLabel)">{{ scope.row.dictLabel }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="status">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.userStatus"
                    :before-change="
                      () =>
                        handleBeforeChange(
                          scope.row.userId,
                          scope.row.userStatus === 0 ? 1 : 0,
                          scope.row.userName,
                        )
                    "
                    :active-value="0"
                    :inactive-value="1"
                    active-text="正常"
                    inactive-text="禁用"
                    class="ml-2"
                    inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    :loading="rowLoadingMap[scope.row.userId]"
                  />
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark" width="200" />
              <el-table-column label="创建时间" prop="createTime" width="200" />
              <el-table-column label="创建人" prop="createBy" width="200" />
              <el-table-column label="最后一次修改日期" prop="udateTime" width="200" />
              <el-table-column label="修改人" prop="updateBy" width="200" />
              <!-- 按钮组 -->
              <el-table-column label="操作" fixed="right" width="240">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="success" size="small" @click="editDept(scope.row.noticeId)">
                      <el-icon><Edit /></el-icon>
                      <span>编辑</span>
                    </el-button>
                    <el-button type="danger" size="small" @click="delDept(scope.row.noticeId)">
                      <el-icon><Delete /></el-icon>
                      <span>删除</span>
                    </el-button>
                    <el-button type="danger" size="small" @click="seeContext(scope.row.noticeId)">
                      <el-icon><Delete /></el-icon>
                      <span>查看内容</span>
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
import http from '@/http'
import { computed, onMounted, reactive, ref } from 'vue'

const pageNum = ref(1) //当前页
const pageSize = ref(10) //每页显示的数据
const pageTotal = ref(0) //总个数
const keyWord = ref('') //关键字
const AnnouncementData = reactive([]) //科室数据
const rowLoadingMap = reactive({}) //是否处于加载状态

//计算菜单类别名字
const noticeTag = computed(() => (tagName) => {
  if (tagName === '通知') return 'primary'
  if (tagName === '公告') return 'success'
  return 'danger'
})

//页面加载时挂载
onMounted(() => {
  getAnnouncementFetch()
})

const getAnnouncementFetch = () => {
  //获取通知公告数据
  http
    .get('/notice/list', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyWord: keyWord.value,
      },
    })
    .then((res) => {
      const list = Array.isArray(res.data.list) ? res.data.list : []
      AnnouncementData.splice(0, AnnouncementData.length, ...list)
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
