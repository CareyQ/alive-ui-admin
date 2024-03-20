<script setup lang="ts">
import type { UploadFiles } from 'element-plus'
import UploadImgs from '@/components/Upload/UploadImgs.vue'

const message = useMessage()
const specImgDialogVisible = ref(false)
const title = ref('')

const imgs = ref<UploadFiles>([])
const rowData = ref()

const open = (row: any) => {
  rowData.value = row
  title.value = `编辑货品图片 货号：${row.skuCode}`
  specImgDialogVisible.value = true
  if (row.albumPics && row.albumPics.length > 0) {
    typeof row.albumPics[0] === 'string'
      ? (imgs.value = row.albumPics.map((e: string) => ({ url: e })))
      : (imgs.value = row.albumPics)
  } else {
    imgs.value = []
  }
}
defineExpose({ open, specDialogVisible: specImgDialogVisible })

const uploadBtnDisabled = ref(true)
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
    uploadBtnLoading.value = false
    uploadBtnDisabled.value = true
  }
}

const updateFileList = (fileList: UploadFiles) => {
  imgs.value = fileList
}

const submit = async () => {
  if (imgs.value.filter((e) => e.status === 'ready').length > 0) {
    await message.confirm('当前还有图片未上传，确认完成？')
  }
  emit('result', { uid: rowData.value.uid, imgs: imgs.value.filter((e) => e.status === 'success') })
  specImgDialogVisible.value = false
}

watch(
  () => imgs.value,
  (value: UploadFiles) => {
    uploadBtnDisabled.value = value.filter((e) => e.status === 'ready').length <= 0 || false
  }
)
</script>

<template>
  <Dialog :title="title" v-model="specImgDialogVisible" width="50%" :close-on-click-modal="false" :show-close="false">
    <UploadImgs
      ref="uploadImgsRef"
      v-model:file-list="imgs"
      :folder="'product'"
      @update:status="uploadStatus"
      @update:file-list="updateFileList"
    />
    <el-button type="primary" @click="handleUpload" :disabled="uploadBtnDisabled" :loading="uploadBtnLoading">
      上传
    </el-button>
    <template #footer>
      <span>
        <el-button @click="specImgDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="uploadBtnLoading">确定</el-button>
      </span>
    </template>
  </Dialog>
</template>
