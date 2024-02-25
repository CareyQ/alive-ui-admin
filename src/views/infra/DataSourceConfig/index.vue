<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import * as ConfigApi from '@/api/infra/dataSourceConfig'
import DataSourceConfigForm from './DataSourceConfigForm.vue'

defineOptions({ name: 'DataSourceConfig' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await ConfigApi.delConfig(id)
  message.success('删除成功')
  await aliveTable.value.getTableList()
}
</script>

<template>
    <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="ConfigApi.getConfigList" :pagination="false">
      <template #operation>
        <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加数据源</el-button>
      </template>

      <el-table-column align="center" label="配置编号" prop="id" />
      <el-table-column align="center" label="数据源名称" prop="name" />
      <el-table-column align="center" label="数据源链接" prop="url" />
      <el-table-column align="center" label="用户名" prop="username" />

      <el-table-column align="center" label="操作" width="250">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>

  <DataSourceConfigForm ref="formRef"/>
</template>
