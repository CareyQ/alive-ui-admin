<script setup lang="ts">
import { formatDate } from '@/utils/date'
import * as LogApi from '@/api/infra/log'

const dialogVisible = ref(false)
const detailLoading = ref(false)
const detailData = ref()

const open = async (id: number) => {
  dialogVisible.value = true
  detailLoading.value = true
  try {
    detailData.value = await LogApi.getOperateLogDtail(id)
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
        {{ detailData.nickname + '-' + detailData.creator }}
      </el-descriptions-item>

      <el-descriptions-item label="操作人 IP">
        {{ detailData.ip }}
      </el-descriptions-item>

      <el-descriptions-item label="操作人设备" :span="2">
        {{ detailData.device }}
      </el-descriptions-item>

      <el-descriptions-item label="操作模块">
        {{ detailData.module }}
      </el-descriptions-item>

      <el-descriptions-item label="操作名称">
        {{ detailData.name }}
      </el-descriptions-item>

      <el-descriptions-item label="请求地址" :width="140" :span="2">
        {{ detailData.requestMethod + ' ' + detailData.requestUrl }}
      </el-descriptions-item>

      <el-descriptions-item label="操作明细" v-if="detailData.content" :width="140" :span="2">
        {{ detailData.content }}
      </el-descriptions-item>

      <el-descriptions-item label="拓展参数" v-if="detailData.extra" :width="140" :span="2">
        {{ detailData.extra }}
      </el-descriptions-item>

      <el-descriptions-item label="Java 方法名" :width="140" :span="2">
        <el-input v-model="detailData.javaMethod" :autosize="{ maxRows: 2 }" :readonly="true" type="textarea" />
      </el-descriptions-item>

      <el-descriptions-item label="Java 方法参数" :width="140" :span="2">
        <el-input v-model="detailData.javaMethodArgs" :autosize="{ maxRows: 2 }" :readonly="true" type="textarea" />
      </el-descriptions-item>

      <el-descriptions-item label="操作时间">
        {{ formatDate(detailData.startTime) }}
      </el-descriptions-item>

      <el-descriptions-item label="执行时长">{{ detailData.duration }} ms</el-descriptions-item>

      <el-descriptions-item label="操作结果" :width="140" :span="2">
        <div v-if="detailData.resultCode === 0">成功</div>
        <div v-else>失败({{ detailData.resultCode }})</div>
      </el-descriptions-item>

      <el-descriptions-item v-if="detailData.resultCode > 0" label="失败提示">
        {{ detailData.resultMsg }}
      </el-descriptions-item>

      <el-descriptions-item v-if="detailData.resultCode === 0" label="结果内容">
        <el-input v-model="detailData.resultData" :autosize="{ maxRows: 10 }" :readonly="true" type="textarea" />
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
