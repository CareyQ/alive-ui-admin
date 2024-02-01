<script lang="ts" setup>
import * as ProductBrandApi from '@/api/product/brand'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)

const formRef = ref()

const formData = ref({
  id: undefined,
  name: undefined,
  sort: 0,
  logo: undefined,
  description: undefined,
  status: 1
})

const formRules = reactive({
  name: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
  logo: [{ required: true, message: '品牌 logo不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
})

const open = async (id: number) => {
  resetForm()
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑商品品牌'
    formLoading.value = true
    try {
      formData.value = await ProductBrandApi.getDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增商品品牌'
  }
}
defineExpose({ open })

const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    sort: 0,
    logo: undefined,
    description: undefined,
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
    await ProductBrandApi.save(data)
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
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="formLoading">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入品牌名称" />
      </el-form-item>
      <el-form-item label="品牌排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="品牌 logo" prop="logo">
        <el-input v-model="formData.logo" placeholder="请输入品牌 logo" />
      </el-form-item>
      <el-form-item label="品牌状态" prop="status">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="品牌描述" prop="description">
        <el-input type="textarea" v-model="formData.description" placeholder="请输入品牌描述" />
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
