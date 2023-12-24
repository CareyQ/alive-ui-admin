<script setup lang="ts">
import { RefreshRight, Plus } from '@element-plus/icons-vue'
import * as ConfigApi from '@/api/infra/dataSourceConfig'
import DataSourceConfigForm from './DataSourceConfigForm.vue'

defineOptions({ name: 'DataSourceConfig' })

const message = useMessage()

const tableLoading = ref(false)
const tableData = ref<any>([])

const formRef = ref()

const openForm = (id?: number) => {
  formRef.value.open(id)
}

const getList = async () => {
  tableLoading.value = true
  try {
    tableData.value = await ConfigApi.getConfigList()
  } finally {
    tableLoading.value = false
  }
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await ConfigApi.delConfig(id)
  message.success('删除成功')
  await getList()
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="page">
    <div class="table-header">
      <el-button type="info" :icon="RefreshRight" @click="getList" />
      <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加数据源</el-button>
    </div>

    <el-table ref="tableRef" v-loading="tableLoading" :data="tableData" border stripe show-overflow-tooltip>
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
    </el-table>
  </div>
  <DataSourceConfigForm ref="formRef" @success="getList" />
</template>
