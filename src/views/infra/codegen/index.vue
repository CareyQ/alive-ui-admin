<script setup lang="ts">
import { Refresh, Search, RefreshRight, Plus } from '@element-plus/icons-vue'
import * as CodegenApi from '@/api/infra/codegen'
import { dateFormatter } from '@/utils/date'
import ImportTable from './ImportTable.vue'
import EditTable from './EditTable.vue'
import PreviewCode from './PreviewCode.vue'

defineOptions({ name: 'InfraCodegen' })

const message = useMessage()

const tableLoading = ref(false)
const tableData = ref<any>([])

const queryFormRef = ref()

const createDate = ref<ElDate>([undefined, undefined])
const total = ref(0)
const queryParams = reactive({
  current: 1,
  size: 10,
  tableName: undefined,
  tableComment: undefined,
  startDate: computed(() => createDate.value[0]),
  endDate: computed(() => createDate.value[1])
})

const getPage = async () => {
  tableLoading.value = true
  try {
    const data = await CodegenApi.getPage(queryParams)
    tableData.value = data.records
    total.value = data.total
  } finally {
    tableLoading.value = false
  }
}

const resetQuery = async () => {
  queryFormRef.value.resetFields()
  createDate.value = [undefined, undefined]
  await getPage()
}

const importRef = ref()
const openImportTable = () => {
  importRef.value.open()
}

const editRef = ref()
const openForm = (id: number) => {
  editRef.value.open(id)
}

const previewRef = ref()
const previewForm = (id: number) => {
  previewRef.value.open(id)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await CodegenApi.delCodegen(id)
  message.success('删除成功')
  await getPage()
}

onMounted(() => {
  getPage()
})
</script>

<template>
  <div class="page">
    <el-form ref="queryFormRef" :model="queryParams" class="table-header" inline>
      <el-form-item label="表名称" prop="tableName">
        <el-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable />
      </el-form-item>

      <el-form-item label="表描述" prop="tableComment">
        <el-input v-model="queryParams.tableComment" placeholder="请输入表描述" clearable />
      </el-form-item>

      <el-form-item label="创建日期" prop="startDate">
        <el-date-picker
          v-model="createDate"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getPage">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table-header">
      <el-button type="info" :icon="RefreshRight" @click="getPage" />
      <el-button type="primary" :icon="Plus" @click="openImportTable()">导入</el-button>
    </div>

    <el-table ref="tableRef" v-loading="tableLoading" :data="tableData" border stripe show-overflow-tooltip>
      <el-table-column align="center" label="表名称" prop="tableName" />
      <el-table-column align="center" label="表描述" prop="tableComment" />
      <el-table-column align="center" label="数据源" prop="dataSourceName" />
      <el-table-column align="center" label="实体" prop="className" />
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" />
      <el-table-column align="center" label="更新时间" prop="updateTime" :formatter="dateFormatter" />

      <el-table-column align="center" label="操作" width="250">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="primary" size="small" @click="previewForm(row.id)"> 预览 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="primary" size="small"> 生成代码 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getPage"
    />
  </div>
  <ImportTable ref="importRef" @success="getPage" />
  <EditTable ref="editRef" @success="getPage" />
  <PreviewCode ref="previewRef" />
</template>
