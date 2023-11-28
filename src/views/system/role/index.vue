<script setup lang="ts">
import { RefreshRight, Plus, Search } from '@element-plus/icons-vue'

const tableLoading = ref(false)

const tableData = ref<any>([])
</script>

<template>
  <div class="page">
    <div class="table-header table-header-split">
      <div class="btn">
        <el-button type="info" :icon="RefreshRight" />
        <el-button type="primary" :icon="Plus">添加</el-button>
      </div>

      <el-form ref="queryFormRef" inline>
        <el-form-item label="角色名称" prop="label">
          <el-input placeholder="请输入字典标签" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      ref="tableRef"
      v-loading="tableLoading"
      :data="tableData"
      border
      stripe
      show-overflow-tooltip
      class="menu-table"
    >
      <el-table-column label="角色名称" prop="name" />
      <el-table-column label="备注" prop="permission" />
      <el-table-column align="center" label="默认角色" prop="path" />

      <el-table-column align="center" label="操作" width="300">
        <template>
          <el-button link type="primary" size="small">菜单权限</el-button>
          <el-divider direction="vertical" />
          <el-button link type="primary" size="small"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped></style>
