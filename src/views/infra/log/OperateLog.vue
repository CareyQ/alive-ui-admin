<script setup lang="ts">
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as LogApi from '@/api/infra/log'
import OperateLogDetail from './components/OperateLogDetail.vue'

defineOptions({ name: 'InfraOperateLog' })

const aliveTable = ref()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.createDate && (newParams.startDate = newParams.createDate[0])
  newParams.createDate && (newParams.endDate = newParams.createDate[1])
  delete newParams.createDate
  return LogApi.getOperateLog(newParams)
}
</script>

<template>
    <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getTableList">
      <template #search>
        <el-form-item label="操作人员" prop="nickname">
          <el-input v-model="aliveTable.searchParam.nickname" placeholder="请输入操作人员" clearable />
        </el-form-item>

        <el-form-item label="操作模块" prop="module">
          <el-input v-model="aliveTable.searchParam.module" placeholder="请输入操作模块" clearable />
        </el-form-item>

        <el-form-item label="操作类型" prop="type">
          <el-select v-model="aliveTable.searchParam.type" placeholder="请选择操作类型" clearable>
            <el-option
              v-for="(item, index) in getIntDictOptions(DICT_TYPE.INFRA_OPERATE_TYPE)"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="操作状态" prop="success">
          <el-select v-model="aliveTable.searchParam.success" placeholder="请选择操作状态" clearable>
            <el-option label="成功" :value="true" />
            <el-option label="失败" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="创建日期" prop="startDate">
          <el-date-picker
            v-model="aliveTable.searchParam.createDate"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </template>

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
          <el-button link size="small" type="primary" @click="openForm(row.id)"> 详情 </el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>

  <OperateLogDetail ref="formRef" />
</template>
