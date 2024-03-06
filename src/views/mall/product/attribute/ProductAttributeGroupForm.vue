<script lang="ts" setup>
import * as ProductAttributeGroupApi from '@/api/product/attribute'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)
const formRef = ref()

const defaultData: ProductAttributeGroupApi.ProductAttributeGroupDTO = {
  id: undefined,
  categoryId: undefined,
  name: undefined,
  sort: 0
}

const formData = ref<ProductAttributeGroupApi.ProductAttributeGroupDTO>(defaultData)
const formRules = reactive({
  categoryId: [{ required: true, message: '分类 ID不能为空', trigger: 'change' }],
  name: [{ required: true, message: '属性分组名称不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
})

let refersh: () => void
const open = async (id: number, getTableList: () => void) => {
  resetForm()
  refersh = getTableList
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑商品属性分组'
    formLoading.value = true
    try {
      formData.value = await ProductAttributeGroupApi.getAttributeGroupDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增商品属性分组'
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
    await ProductAttributeGroupApi.saveAttributeGroup(data)
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
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="formLoading">
      <el-form-item label="商品分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择商品分类">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="分组名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入属性分组名称" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
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
