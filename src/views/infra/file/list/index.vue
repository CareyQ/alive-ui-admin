<script setup lang="ts">
import { RefreshRight, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import * as FileApi from '@/api/infra/file'
import FileForm from './FileForm.vue'

defineOptions({ name: 'FileList' })

const message = useMessage()

const tableLoading = ref(false)
const tableData = ref<any>([])
const formRef = ref()
const queryFormRef = ref()
const total = ref(0)
const createDate = ref<ElDate>([undefined, undefined])
const queryParams = reactive({
  current: 1,
  size: 10,
  configId: undefined,
  name: undefined,
  path: undefined,
  startDate: computed(() => createDate.value[0]),
  endDate: computed(() => createDate.value[1])
})

const getFilePage = async () => {
  tableLoading.value = true
  try {
    const data = await FileApi.getFilePage(queryParams)
    tableData.value = data.records
    total.value = data.total
  } finally {
    tableLoading.value = false
  }
}

const openForm = (id?: number) => {
  formRef.value.open(id)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await FileApi.delFile(id)
  message.success('删除成功')
  await getFilePage()
}

const resetQuery = async () => {
  queryFormRef.value.resetFields()
  createDate.value = [undefined, undefined]
  await getFilePage()
}

onMounted(() => {
  getFilePage()
})
</script>

<template>
  <div class="page">
    <el-form ref="queryFormRef" class="table-header" :model="queryParams" inline>
      <el-form-item label="配置编号" prop="configId">
        <el-input v-model="queryParams.configId" placeholder="请输入配置编号" clearable />
      </el-form-item>
      <el-form-item label="文件名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入文件名" clearable />
      </el-form-item>
      <el-form-item label="文件路径" prop="path">
        <el-input v-model="queryParams.path" placeholder="请输入文件路径" clearable />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
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
        <el-button type="primary" :icon="Search" @click="getFilePage">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table-header">
      <el-button type="info" :icon="RefreshRight" @click="getFilePage()" />
      <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加文件</el-button>
    </div>

    <el-table ref="tableRef" v-loading="tableLoading" :data="tableData" border stripe show-overflow-tooltip>
      <el-table-column label="配置编号" align="center" prop="configId" />
      <el-table-column label="文件名" align="center" prop="name" />
      <el-table-column label="文件路径" align="center" prop="path" />
      <el-table-column label="文件 URL" align="center" prop="url" />
      <el-table-column label="文件类型" align="center" prop="type" />
      <el-table-column label="文件大小" align="center" prop="size" />
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" width="300" />
      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getFilePage()"
    />
  </div>
  <FileForm ref="formRef" @success="getFilePage()" />
</template>

<style lang="scss" scoped></style>
