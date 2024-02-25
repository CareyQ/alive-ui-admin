<script lang="ts" setup>
import * as ProductCategoryApi from '@/api/product/category'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)
const formRef = ref()
const categoryList = ref<any[]>([])

const defaultData: ProductCategoryApi.ProductCategoryDTO = {
  id: undefined,
  parentId: undefined,
  name: undefined,
  sort: 0,
  icon: undefined,
  status: 1
}

const formData = ref<ProductCategoryApi.ProductCategoryDTO>(defaultData)

const formRules = reactive({
  parentId: [{ required: true, message: '请选择父级分类', trigger: 'blur' }],
  name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
})

let refersh: () => void
const open = async (id: number, getTableList: () => void) => {
  resetForm()
  refersh = getTableList
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑商品分类'
    formLoading.value = true
    try {
      formData.value = await ProductCategoryApi.getDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增商品分类'
  }
  // 获得分类树
  categoryList.value = await ProductCategoryApi.getList({ parentId: 0 })
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
    await ProductCategoryApi.save(data)
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
      <el-form-item label="父级分类" prop="parentId">
        <el-select v-model="formData.parentId" placeholder="请选择上级分类">
          <el-option :key="0" label="顶级分类" :value="0" />
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="分类图标" prop="icon">
        <el-input v-model="formData.icon" placeholder="请输入图标" />
      </el-form-item>
      <el-form-item label="分类状态">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
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
