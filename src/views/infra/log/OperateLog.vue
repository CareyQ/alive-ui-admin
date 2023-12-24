<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as LogApi from '@/api/infra/log'
import OperateLogDetail from './components/OperateLogDetail.vue'

defineOptions({ name: 'InfraOperateLog' })

const tableLoading = ref(false)
const tableData = ref<any>([])

const queryFormRef = ref()
const detailRef = ref()

const createDate = ref<ElDate>([undefined, undefined])
const total = ref(0)
const queryParams = reactive({
  current: 1,
  size: 10,
  nickname: undefined,
  module: undefined,
  type: undefined,
  success: undefined,
  startDate: computed(() => createDate.value[0]),
  endDate: computed(() => createDate.value[1])
})

const getPage = async () => {
  tableLoading.value = true
  try {
    const data = await LogApi.getOperateLog(queryParams)
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

const openDetail = (id: number) => {
  detailRef.value.open(id)
}

onMounted(() => {
  getPage()
})
</script>

<template>
  <div class="page">
    <div class="table-header">
      <el-form ref="queryFormRef" :model="queryParams" inline>
        <el-form-item label="操作人员" prop="nickname">
          <el-input v-model="queryParams.nickname" placeholder="请输入操作人员" clearable />
        </el-form-item>

        <el-form-item label="操作模块" prop="module">
          <el-input v-model="queryParams.module" placeholder="请输入操作模块" clearable />
        </el-form-item>

        <el-form-item label="操作类型" prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择操作类型" clearable>
            <el-option
              v-for="(item, index) in getIntDictOptions(DICT_TYPE.INFRA_OPERATE_TYPE)"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="操作状态" prop="success">
          <el-select v-model="queryParams.success" placeholder="请选择操作状态" clearable>
            <el-option label="成功" :value="true" />
            <el-option label="失败" :value="false" />
          </el-select>
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
    </div>

    <el-table ref="tableRef" v-loading="tableLoading" :data="tableData" border stripe show-overflow-tooltip>
      <el-table-column align="center" label="日志编号" prop="id" />
      <el-table-column align="center" label="操作模块" prop="module" />
      <el-table-column align="center" label="操作名称" prop="name" />
      <el-table-column align="center" label="日志类型" prop="type">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.INFRA_OPERATE_TYPE" :value="row.type" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人员" prop="nickname" />
      <el-table-column label="操作结果" align="center" prop="status">
        <template #default="scope">
          <span>{{ scope.row.resultCode === 0 ? '成功' : '失败' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间" prop="startTime" :formatter="dateFormatter" />
      <el-table-column label="执行时长" align="center" prop="duration">
        <template #default="scope">
          <span>{{ scope.row.duration }} ms</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button link size="small" type="primary" @click="openDetail(row.id)"> 详情 </el-button>
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
  <OperateLogDetail ref="detailRef" />
</template>

<style scoped></style>
