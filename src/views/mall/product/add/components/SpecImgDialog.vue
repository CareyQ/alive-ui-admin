<script setup lang="ts">
import UploadImgs from '@/components/Upload/UploadImgs.vue'
import type { UploadUserFile } from 'element-plus'

const specImgDialogVisible = ref(false)
const title = ref('')

const imgs = ref([])
const rowData = ref()

const open = (row: any) => {
  rowData.value = row
  title.value = `编号[${row.skuCode}]图片管理`
  specImgDialogVisible.value = true
  if (row.picUrl && row.picUrl.length > 0) {
    imgs.value = row.picUrl
  } else {
    imgs.value = []
  }
}
defineExpose({ open, specDialogVisible: specImgDialogVisible })

const uploadBtnLoading = ref(false)
const uploadImgsRef = ref()
const handleUpload = () => {
  uploadImgsRef.value.uploadImgs()
}

const emit = defineEmits(['result'])

const uploadStatus = (status: number) => {
  if (status === 1) {
    uploadBtnLoading.value = true
  } else if (status === 2) {
    emit('result', { uid: rowData.value.uid, imgs: imgs.value })
    uploadBtnLoading.value = false
    specImgDialogVisible.value = false
  }
}
</script>

<template>
  <Dialog :title="title" v-model="specImgDialogVisible" width="50%">
    <UploadImgs ref="uploadImgsRef" v-model:file-list="imgs" :folder="'product'" @update:status="uploadStatus" />

    <template #footer>
      <span>
        <el-button @click="specImgDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpload" :loading="uploadBtnLoading">上传</el-button>
      </span>
    </template>
  </Dialog>
</template>
