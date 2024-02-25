<script setup lang="ts">
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE } from '@/utils/dict'
import * as LogApi from '@/api/infra/log'

defineOptions({ name: 'SystemLoginLog' })

const aliveTable = ref()

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.createDate && (newParams.createStartDate = newParams.createDate[0])
  newParams.createDate && (newParams.createEndDate = newParams.createDate[1])
  delete newParams.createDate
  return LogApi.getLoginLog(newParams)
}
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getTableList">
      <template #search>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="aliveTable.searchParam.username" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item label="登录地址" prop="ip">
          <el-input v-model="aliveTable.searchParam.ip" placeholder="请输入 IP 地址，精确匹配" clearable />
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

      <el-table-column align="center" label="日志类型" prop="type">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.INFRA_LOGIN_TYPE" :value="row.type" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="username" />
      <el-table-column align="center" label="IP" prop="ip" />
      <el-table-column align="center" label="IP 信息" prop="ipInfo" />
      <el-table-column align="center" label="设备" prop="device" />
      <el-table-column align="center" label="登录结果" prop="result">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.INFRA_LOGIN_RESULT" :value="row.result" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录时间" prop="loginTime" :formatter="dateFormatter" />
    </AliveTable>
  </div>
</template>
