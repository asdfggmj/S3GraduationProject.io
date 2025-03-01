<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 第一行 -->
  <el-row>
    <el-col :span="24">
      <el-card shadow="always" class="mb-10px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-button type="primary" @click="addMenu">
              <el-icon><Plus /></el-icon>
              <span>新增目录</span>
            </el-button>
          </el-col>
          <!-- 模糊查询 -->
          <el-col :span="5">
            <el-input
              v-model="keyWord"
              @change="searchDept"
              placeholder="请输入关键字回车以查询"
              clearable
              size=""
            />
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <el-card shadow="always">
        <!-- 菜单行 -->
        <el-table :data="menuData" row-key="menuId">
          <el-table-column prop="name" label="菜单名称" />
          <el-table-column prop="descn" label="菜单类型" />
          <el-table-column prop="linkUrl" label="组件路径" />
          <el-table-column prop="linkUrl" label="权限标识" />
          <el-table-column prop="imageUrl" label="图标">
            <template #default="scope">
              <img :src="'/icons/' + scope.row.imageUrl" alt="icon" class="menu-icon" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="菜单状态">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :before-change="
                  () =>
                    handleBeforeChange(scope.row.id, scope.row.status === 1 ? 0 : 1, scope.row.name)
                "
                :active-value="1"
                :inactive-value="0"
                active-text="正常"
                inactive-text="禁用"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                :loading="rowLoadingMap[scope.row.id]"
              />
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="类型">
            <template #default="scope">
              <el-tag effect="dark" :type="scope.row.typeName == '目录' ? 'primary' : 'warning'">{{
                scope.row.typeName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" />
          <el-table-column label="操作" width="360">
            <el-button type="primary" :icon="Plus">添加</el-button>
            <el-button type="success" :icon="Edit">编辑</el-button>
            <el-button type="danger" :icon="Delete">删除</el-button>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
</script>
