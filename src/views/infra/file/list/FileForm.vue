<script lang="ts" setup>
import { Dashboard } from "@uppy/vue";
import Uppy from '@uppy/core'
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import XHRUpload from "@uppy/xhr-upload";
import zh_CN from "@uppy/locales/lib/zh_CN";

import * as FileApi from '@/api/infra/file'

const uppy = computed(() => {
  return new Uppy({
    locale: zh_CN,
    autoProceed: false,
  }).use(XHRUpload, {
    endpoint: `${import.meta.env.VITE_API_URL}/infra/file/upload`,
    withCredentials: true,
    formData: true,
    fieldName: 'file',
    method: 'post',
    limit: 5,
    timeout: 0,
    getResponseError: (responseText: string, response: unknown) => {
      try {
        const response = JSON.parse(responseText);
        console.log(responseText, response);
        
      } catch (e) {
        const responseBody = response as XMLHttpRequest;
        const { status, statusText } = responseBody;
        const defaultMessage = [status, statusText].join(": ");
        return new Error(defaultMessage);
      }
      return new Error("Internal Server Error");
    },
  });
});

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)

const formRef = ref()

const formData = ref({
  id: undefined,
  configId: undefined,
  name: undefined,
  path: undefined,
  url: undefined,
  type: undefined,
  size: undefined
})


const open = async (id: number) => {
  resetForm()
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑文件'
    formLoading.value = true
    try {
      formData.value = await FileApi.getFileDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增文件'
  }
}
defineExpose({ open })

const resetForm = () => {
  formData.value = {
    id: undefined,
    configId: undefined,
    name: undefined,
    path: undefined,
    url: undefined,
    type: undefined,
    size: undefined
  }
  formRef.value?.resetFields()
}
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <Dashboard :uppy="uppy" :props="{
      theme: 'light',
      width: '750px',
      height: '550px'
    }" />
  </Dialog>
</template>
