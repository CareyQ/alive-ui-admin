<script setup lang="ts">
import { isImage } from '@/utils'
import * as FileApi from '@/api/infra/file'

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
    <el-descriptions v-loading="formLoading">
      <el-descriptions-item label="预览">
        <span v-if="!isImage(formData?.type)"></span>
        <img v-else :src="formData?.url" />1
      </el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false"> 关闭 </el-button>
      </span>
    </template>
  </Dialog>
</template>
