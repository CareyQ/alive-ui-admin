<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue'
import * as CodegenApi from '@/api/infra/codegen'
import * as ConfigApi from '@/api/infra/dataSourceConfig'

const message = useMessage()
const tableLoading = ref(false)
const dialogTitle = ref('导入表')
const dialogVisible = ref(false)
const importLoading = ref(false)

const dbConfigList = ref<ConfigApi.DataSourceConfigDTO[]>([])
const tableData = ref<any>([])

const queryFormRef = ref()
const queryParams = reactive({
  dataSourceConfigId: 0,
  name: undefined,
  comment: undefined
})

const open = async () => {
  dbConfigList.value = await ConfigApi.getConfigList()
  if (dbConfigList.value.length === 0) {
    message.error('未找到数据源配置')
    return
  }
  queryParams.dataSourceConfigId = dbConfigList.value[0].id as number
  dialogVisible.value = true
  await getList()
}
defineExpose({ open })

const getList = async () => {
  tableLoading.value = true

  try {
    tableData.value = await CodegenApi.getDbList(queryParams)
  } finally {
    tableLoading.value = false
  }
}

const resetQuery = async () => {
  queryFormRef.value.resetFields()
  await getList()
}

const tableList = ref<string[]>([])
const handleSelectionChange = (selection) => {
  tableList.value = selection.map((item) => item.name)
}

const emit = defineEmits(['success'])
const handleImportTable = async () => {
  importLoading.value = true
  try {
    if (tableList.value.length === 0) {
      message.error('请选择要导入的表')
      return
    }
    await CodegenApi.importCodegenTable({
      dataSourceConfigId: queryParams.dataSourceConfigId,
      tableNames: tableList.value
    })
    message.success('导入成功')
    emit('success')
    dialogVisible.value = false
    tableList.value = []
  } finally {
    importLoading.value = false
  }
}
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="75%" scroll :maxHeight="500">
    <el-form ref="queryFormRef" :model="queryParams" class="table-header" inline>
      <el-form-item label="数据源" prop="dataSourceConfigId">
        <el-select v-model="queryParams.dataSourceConfigId" placeholder="请选择数据源">
          <el-option v-for="(item, index) in dbConfigList" :key="index" :label="item.name" :value="item.id!" />
        </el-select>
      </el-form-item>

      <el-form-item label="表名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入表名称" clearable />
      </el-form-item>

      <el-form-item label="表描述" prop="comment">
        <el-input v-model="queryParams.comment" placeholder="请输入表描述" clearable />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getList">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="tableLoading" :data="tableData" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="表名称" prop="name" />
      <el-table-column label="表描述" prop="comment" />
    </el-table>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="tableList.length === 0"
          :loading="importLoading"
          @click="handleImportTable"
        >
          导入
        </el-button>
      </span>
    </template>
  </Dialog>
</template>

<style scoped></style>
