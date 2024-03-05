<script lang="ts" setup>
import { Dashboard } from '@uppy/vue'
import Uppy, { type SuccessResponse } from '@uppy/core'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/status-bar/dist/style.min.css'
import XHRUpload from '@uppy/xhr-upload'
import zh_CN from '@uppy/locales/lib/zh_CN'

import { getAccessToken } from '@/utils/auth'

const message = useMessage()

const uploadHeaders = ref({
  Authorization: getAccessToken()
})

const uppy = computed(() => {
  return new Uppy({
    locale: zh_CN,
    autoProceed: false
  }).use(XHRUpload, {
    endpoint: `${import.meta.env.VITE_UPLOAD_URL}`,
    headers: uploadHeaders.value,
    formData: true,
    fieldName: 'file',
    allowedMetaFields: [],
    limit: 5,
    timeout: 0,
    getResponseError: (responseText: string, response: unknown) => {
      try {
        const response = JSON.parse(responseText)
        message.notifyError(response.msg)
      } catch (e) {
        const responseBody = response as XMLHttpRequest
        const { status, statusText } = responseBody
        const defaultMessage = [status, statusText].join(': ')
        return new Error(defaultMessage)
      }
      return new Error('Internal Server Error')
    }
  })
})

onUnmounted(() => {
  uppy.value.close({ reason: 'unmount' })
})

const dialogVisible = ref(false)
const open = async () => {
  dialogVisible.value = true
}
defineExpose({ open })

const handleClose = () => {
  uppy.value.cancelAll()
}
</script>

<template>
  <Dialog title="上传文件" v-model="dialogVisible" @close="handleClose()" :close-on-click-modal="false">
    <Dashboard
      :uppy="uppy"
      :props="{
        theme: 'light',
        width: '750px',
        height: '300px',
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false
      }"
    />
  </Dialog>
</template>
