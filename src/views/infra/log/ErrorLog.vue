<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as LogApi from '@/api/infra/log'
import ErrorLogDetail from './components/ErrorLogDetail.vue'

defineOptions({ name: 'InfraOperateLog' })

const message = useMessage()
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
  userType: undefined,
  requestUrl: undefined,
  processStatus: undefined,
  startDate: computed(() => createDate.value[0]),
  endDate: computed(() => createDate.value[1])
})

const getPage = async () => {
  tableLoading.value = true
  try {
    const data = await LogApi.getErrorLog(queryParams)
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

const handleProcess = async (id: number, processStatus: number) => {
  try {
    // 操作的二次确认
    const type = processStatus === 1 ? '已处理' : '已忽略'
    await message.confirm('确认标记为' + type + '?')
    // 执行操作
    await LogApi.updateErrorProcessStatus(id, processStatus)
    await message.success(type)
    // 刷新列表
    await getPage()
  } catch {}
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

        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="queryParams.userType" placeholder="请选择用户类型" clearable>
            <el-option
              v-for="(item, index) in getIntDictOptions(DICT_TYPE.USER_TYPE)"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="请求地址" prop="requestUrl">
          <el-input v-model="queryParams.requestUrl" placeholder="请输入请求地址" clearable />
        </el-form-item>

        <el-form-item label="处理状态" prop="processStatus">
          <el-select v-model="queryParams.processStatus" placeholder="请选择处理状态" clearable>
            <el-option
              v-for="(item, index) in getIntDictOptions(DICT_TYPE.INFRA_ERROR_LOG_PROCESS_STATUS)"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="异常时间" prop="startDate">
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
      <el-table-column align="center" label="用户昵称" prop="nickname" />
      <el-table-column align="center" label="用户类型" prop="userType">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.USER_TYPE" :value="row.userType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="请求地址" prop="requestUrl" width="300" />
      <el-table-column align="center" label="异常时间" prop="createTime" :formatter="dateFormatter" width="200" />
      <el-table-column align="center" label="异常名" prop="exName" width="500" />
      <el-table-column align="center" label="处理状态" prop="processStatus">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.INFRA_ERROR_LOG_PROCESS_STATUS" :value="row.processStatus" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button link size="small" type="primary" @click="openDetail(row.id)"> 详情 </el-button>
          <el-button link size="small" type="primary" v-if="row.processStatus === 0" @click="handleProcess(row.id, 1)">
            处理
          </el-button>
          <el-button link size="small" type="primary" v-if="row.processStatus === 0" @click="handleProcess(row.id, 2)">
            忽略
          </el-button>
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
  <ErrorLogDetail ref="detailRef" />
</template>

<style scoped></style>
