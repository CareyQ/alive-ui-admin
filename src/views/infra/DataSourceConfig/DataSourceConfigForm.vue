<script lang="ts" setup>
import * as ConfigApi from '@/api/infra/dataSourceConfig'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)
const formRef = ref()

const defaultData: ConfigApi.DataSourceConfigDTO = {
  id: undefined,
  name: undefined,
  url: undefined,
  username: undefined,
  password: undefined
}

const formData = ref<ConfigApi.DataSourceConfigDTO>(defaultData)
const formRules = reactive({
  name: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入数据源链接', trigger: 'blur' }],
  username: [{ required: true, message: '请输入数据源用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入数据源密码', trigger: 'blur' }]
})

let refersh: () => void
const open = async (id: number, getTableList: () => void) => {
  resetForm()
  refersh = getTableList
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑配置'
    formLoading.value = true
    try {
      formData.value = await ConfigApi.getConfigDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增配置'
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
    await ConfigApi.saveConfig(data)
    message.success('保存成功')
    dialogVisible.value = false
    refersh()
  } finally {
    formLoading.value = false
  }
}
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" v-loading="formLoading">
      <el-form-item label="数据源名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入数据源名称" :maxlength="20" />
      </el-form-item>

      <el-form-item label="数据源链接" prop="url">
        <el-input v-model="formData.url" placeholder="请输入角色标识" />
      </el-form-item>

      <el-form-item label="数据源用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入数据源用户名" />
      </el-form-item>

      <el-form-item label="数据源密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入数据源密码" />
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
