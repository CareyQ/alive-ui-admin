<script lang="ts" setup>
import * as UesrApi from '@/api/system/user'
import { validateUsername, validateMobile, validateEmail } from '@/utils/validate'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)

const formRef = ref()

const formData = ref({
  id: undefined,
  username: '',
  nickname: '',
  password: '',
  remark: undefined,
  deptId: undefined,
  postIds: undefined,
  gender: undefined,
  email: undefined,
  mobile: undefined
})

const formRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { validator: validateUsername, trigger: 'blur' }
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: `密码长度在 6~20 个字符之间`, trigger: 'blur' }
  ],
  mobile: [{ validator: validateMobile, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }]
})

const open = async (id: number) => {
  resetForm()
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑用户'
    formLoading.value = true
    try {
      formData.value = await UesrApi.getDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增用户'
  }
}
defineExpose({ open })

const resetForm = () => {
  formData.value = {
    id: '',
    name: '',
    remark: undefined,
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
    await PostApi.save(data)
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
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入岗位名称" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
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
