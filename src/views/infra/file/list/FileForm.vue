<script lang="ts" setup>
import * as FileApi from '@/api/infra/file'

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

const formRules = reactive({
  configId: [{ required: true, message: '配置编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '文件名不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '文件路径不能为空', trigger: 'blur' }],
  url: [{ required: true, message: '文件 URL不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '文件类型不能为空', trigger: 'change' }],
  size: [{ required: true, message: '文件大小不能为空', trigger: 'blur' }]
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

const emit = defineEmits(['success'])
const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }
  formLoading.value = true
  try {
    const data = formData.value
    await FileApi.saveFile(data)
    message.success('保存成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
  dialogVisible.value = false
}
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="formLoading">
      <el-form-item label="配置编号" prop="configId">
        <el-input v-model="formData.configId" placeholder="请输入配置编号" />
      </el-form-item>
      <el-form-item label="文件名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入文件名" />
      </el-form-item>
      <el-form-item label="文件路径" prop="path">
        <el-input v-model="formData.path" placeholder="请输入文件路径" />
      </el-form-item>
      <el-form-item label="文件 URL" prop="url">
        <el-input v-model="formData.url" placeholder="请输入文件 URL" />
      </el-form-item>
      <el-form-item label="文件类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择文件类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="文件大小" prop="size">
        <el-input v-model="formData.size" placeholder="请输入文件大小" />
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
