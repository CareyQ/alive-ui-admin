<script lang="ts" setup>
import * as DictApi from '@/api/system/dict'

const dialogTitle = ref('')
const dialogVisible = ref(false)

const formRef = ref()

const formData = ref({
  id: 0,
  label: '',
  value: '',
  dictType: '',
  remark: '',
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
  } else {
    dialogTitle.value = '新增字典类型'
  }
}
defineExpose({ open })

const resetForm = () => {
  formData.value = {
    id: 0,
    label: '',
    value: '',
    dictType: '',
    remark: '',
    status: 1
  }
  formRef.value?.resetFields()
}
</script>

<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form :modle="formData" :rules="formRules" label-width="80px">
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入字典名称" />
      </el-form-item>

      <el-form-item label="字典类型" prop="type">
        <el-input v-model="formData.type" placeholder="请输入字典类型" />
      </el-form-item>

      <el-form-item label="启用状态">
        <el-switch v-model="formData.status" :active-value="1" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button>取消</el-button>
        <el-button type="primary">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
