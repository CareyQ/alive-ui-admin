<script setup lang="ts">
import { Refresh, Search, RefreshRight, Plus } from '@element-plus/icons-vue'
import * as LogApi from '@/api/infra/log'
import { dateFormatter } from '@/utils/date'

defineOptions({ name: 'InfraCodegen' })

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
    const data = await LogApi.getLoginLog(queryParams)
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

const openForm = () => {}

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
      <el-button type="primary" :icon="Plus" @click="openForm(undefined)">导入</el-button>
    </div>

    <el-table ref="tableRef" v-loading="tableLoading" :data="tableData" border stripe show-overflow-tooltip>
      <el-table-column align="center" label="日志类型" prop="type" />
      <el-table-column align="center" label="用户名" prop="username" />
      <el-table-column align="center" label="IP" prop="ip" />
      <el-table-column align="center" label="IP 信息" prop="ipInfo" />
      <el-table-column align="center" label="设备" prop="device" />
      <el-table-column align="center" label="登录结果" prop="result" />
      <el-table-column align="center" label="登录时间" prop="loginTime" :formatter="dateFormatter" />
    </el-table>

    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getPage"
    />
  </div>
</template>
