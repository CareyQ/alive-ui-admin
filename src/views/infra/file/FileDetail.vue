<script setup lang="ts">
import { isImage } from '@/utils'
import * as FileApi from '@/api/infra/file'
import { fileSizeFormatter } from '@/utils'

const dialogVisible = ref(false)
const formLoading = ref(false)
const formData = ref<FileApi.FileDTO>()
const dialogTitle = ref('')

const open = async (id: number) => {
  dialogVisible.value = true
  formLoading.value = true
  try {
    formData.value = await FileApi.getFileDetail(id)
    dialogTitle.value = `附件：${formData.value?.name}`
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open })
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-descriptions v-loading="formLoading" :column="1" size="large">
      <el-descriptions-item label="预览" class="file-detail">
        <span v-if="!isImage(formData?.type)">暂不支持预览</span>
        <img v-else :src="formData?.url" style="max-width: 50%" />
      </el-descriptions-item>
      <el-descriptions-item label="所属目录">{{ formData?.folder }}</el-descriptions-item>
      <el-descriptions-item label="文件名称">{{ formData?.name }}</el-descriptions-item>
      <el-descriptions-item label="文件类型">{{ formData?.type }}</el-descriptions-item>
      <el-descriptions-item label="文件大小">{{ fileSizeFormatter(null, null, formData?.size) }}</el-descriptions-item>
      <el-descriptions-item label="链接">
        {{ formData?.url }}
      </el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false"> 关闭 </el-button>
      </span>
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
:deep(.el-descriptions__cell) {
  display: flex;
  padding-top: 16px;
  border-top: var(--dialog-header-border);
}

:deep(.el-descriptions__table) {
  tbody > tr:first-child {
    .el-descriptions__cell {
      padding-top: 0;
      border-top: none;
    }
  }

  tbody > tr:last-child {
    .el-descriptions__cell {
      padding-bottom: 0 !important;
    }
  }
}

:deep(.el-descriptions__label) {
  width: 80px !important;
}
</style>
