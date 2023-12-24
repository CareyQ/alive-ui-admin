<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/date'
import * as LogApi from '@/api/infra/log'

const dialogVisible = ref(false)
const detailLoading = ref(false)
const detailData = ref()

const open = async (id: number) => {
  dialogVisible.value = true
  detailLoading.value = true
  try {
    detailData.value = await LogApi.getErrorLogDtail(id)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open })
</script>

<template>
  <Dialog title="操作日志详情" v-model="dialogVisible" width="800" scroll :maxHeight="600">
    <el-descriptions :column="2" border v-if="!detailLoading">
      <el-descriptions-item label="日志主键">
        {{ detailData.id }}
      </el-descriptions-item>

      <el-descriptions-item label="链路追踪编号">
        {{ detailData.traceId }}
      </el-descriptions-item>

      <el-descriptions-item label="操作人">
        {{ detailData.nickname }}
        <Tag :type="DICT_TYPE.USER_TYPE" :value="detailData.userType" />
      </el-descriptions-item>

      <el-descriptions-item label="操作人 IP">
        {{ detailData.ip }}
      </el-descriptions-item>

      <el-descriptions-item label="异常时间" :width="140" :span="2">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>

      <el-descriptions-item label="请求地址" :width="140" :span="2">
        {{ detailData.requestMethod + ' ' + detailData.requestUrl }}
      </el-descriptions-item>

      <el-descriptions-item label="requestParams" :width="140" :span="2">
        {{ detailData.requestParams }}
      </el-descriptions-item>

      <el-descriptions-item label="请求 curl" :width="140" :span="2">
        <el-input v-model="detailData.requestCurl" :autosize="{ maxRows: 10 }" :readonly="true" type="textarea" />
      </el-descriptions-item>

      <el-descriptions-item label="异常名" :width="140" :span="2">
        {{ detailData.exName }}
      </el-descriptions-item>

      <el-descriptions-item label="异常堆栈" :width="140" :span="2">
        <el-input v-model="detailData.exStackTrace" :autosize="{ maxRows: 10 }" :readonly="true" type="textarea" />
      </el-descriptions-item>

      <el-descriptions-item label="处理状态">
        <Tag :type="DICT_TYPE.INFRA_ERROR_LOG_PROCESS_STATUS" :value="detailData.processStatus" />
      </el-descriptions-item>

      <el-descriptions-item label="处理时间" v-if="detailData.processTime">
        {{ formatDate(detailData.processTime) }}
      </el-descriptions-item>

      <el-descriptions-item label="处理人" v-if="detailData.processUsername">
        {{ detailData.processUsername + '-' + detailData.processUserId }}
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>

<style scoped></style>
