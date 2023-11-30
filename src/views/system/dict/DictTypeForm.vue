<script lang="ts" setup>
import * as DictApi from '@/api/system/dict'

const message = useMessage()

const dialogTitle = ref('')
const dialogVisible = ref(false)
const formLoading = ref(false)

const formRef = ref()

const formData = ref({
  id: '',
  name: '',
  type: '',
  status: 1
})

const formRules = reactive({
  name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  type: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
})

const open = async (id: number) => {
  resetForm()
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑字典类型'
    formLoading.value = true
    try {
      formData.value = await DictApi.getDictTypeDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增字典类型'
  }
}
defineExpose({ open })

const resetForm = () => {
  formData.value = {
    id: '',
    name: '',
    type: '',
    status: 1
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
    await DictApi.saveDictType(data)
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
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" :loading="formLoading">
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入字典名称" :maxlength="20" />
      </el-form-item>

      <el-form-item label="字典类型" prop="type">
        <el-input v-model="formData.type" placeholder="请输入字典类型" :maxlength="50" />
      </el-form-item>

      <el-form-item label="启用状态">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
