<script lang="ts" setup>
import * as DeptApi from '@/api/system/dept'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)

const treeData = ref<any[]>([])

const formRef = ref()

const formData = ref({
  id: '',
  name: '',
  parentId: '',
  sort: Number(0),
  managerId: undefined,
  mobile: undefined,
  remark: undefined,
  status: 1
})

const formRules = reactive({
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
})

const open = async (id: number) => {
  resetForm()
  dialogVisible.value = true
  const data = await DeptApi.getSimpleList()
  if (data) {
    treeData.value = data
  }
  if (id) {
    dialogTitle.value = '编辑部门'
    formLoading.value = true
    try {
      formData.value = await DeptApi.getDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增部门'
  }
}
defineExpose({ open })

const resetForm = () => {
  formData.value = {
    id: '',
    name: '',
    parentId: '',
    sort: Number(0),
    managerId: undefined,
    mobile: undefined,
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
    await DeptApi.save(data)
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
      <el-form-item label="父级部门" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="treeData"
          :props="{ label: 'name', value: 'id' }"
          placeholder="不选择默认顶级部门"
          clearable
          check-strictly
          default-expand-all
        />
      </el-form-item>

      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入部门名称" />
      </el-form-item>

      <el-form-item label="负责人" prop="managerId">
        <el-input v-model="formData.managerId" placeholder="请选择负责人" />
      </el-form-item>

      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入联系电话" />
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
