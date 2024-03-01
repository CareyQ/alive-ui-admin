<script lang="ts" setup>
import * as OssConfigApi from '@/api/infra/file'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)
const formRef = ref()

const defaultData: OssConfigApi.OssConfigDTO = {
  id: undefined,
  name: undefined,
  accessKey: undefined,
  secretKey: undefined,
  bucket: undefined,
  endpoint: undefined,
  region: undefined,
  master: undefined
}

const formData = ref<OssConfigApi.OssConfigDTO>(defaultData)
const formRules = reactive({
  name: [{ required: true, message: '配置名称不能为空', trigger: 'blur' }],
  accessKey: [{ required: true, message: 'accessKey不能为空', trigger: 'blur' }],
  secretKey: [{ required: true, message: '秘钥不能为空', trigger: 'blur' }],
  bucket: [{ required: true, message: '桶名称不能为空', trigger: 'blur' }],
  endpoint: [{ required: true, message: '访问站点不能为空', trigger: 'blur' }],
  region: [{ required: true, message: '域不能为空', trigger: 'blur' }],
  master: [{ required: true, message: '是否为主配置不能为空', trigger: 'blur' }]
})

let refersh: () => void
const open = async (id: number, getTableList: () => void) => {
  resetForm()
  refersh = getTableList
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑对象存储配置'
    formLoading.value = true
    try {
      formData.value = await OssConfigApi.getOssConfigDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增对象存储配置'
  }
}
defineExpose({ open })

const resetForm = () => {
  formData.value = defaultData
  formRef.value?.resetFields()
}

const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }
  formLoading.value = true
  try {
    const data = formData.value
    await OssConfigApi.saveOssConfig(data)
    message.success('保存成功')
    dialogVisible.value = false
    refersh()
  } finally {
    formLoading.value = false
  }
  dialogVisible.value = false
}
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="formLoading">
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入配置名称" />
      </el-form-item>
      <el-form-item label="accessKey" prop="accessKey">
        <el-input v-model="formData.accessKey" placeholder="请输入accessKey" />
      </el-form-item>
      <el-form-item label="秘钥" prop="secretKey">
        <el-input
          type="password"
          v-model="formData.secretKey"
          autocomplete="new-password"
          placeholder="请输入秘钥"
          show-password
        />
      </el-form-item>
      <el-form-item label="桶名称" prop="bucket">
        <el-input v-model="formData.bucket" placeholder="请输入桶名称" />
      </el-form-item>
      <el-form-item label="访问站点" prop="endpoint">
        <el-input v-model="formData.endpoint" placeholder="请输入访问站点" />
      </el-form-item>
      <el-form-item label="域" prop="region">
        <el-input v-model="formData.region" placeholder="请输入域" />
      </el-form-item>
      <el-form-item label="主配置" prop="master">
        <el-switch v-model="formData.master" :active-value="true" :inactive-value="false" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </template>
  </Dialog>
</template>
