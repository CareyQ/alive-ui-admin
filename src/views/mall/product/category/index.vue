<script setup lang="ts">
import { RefreshRight, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/date'
import { handleTree } from '@/utils/tree'
import * as ProductCategoryApi from '@/api/product/category'
import ProductCategoryForm from './ProductCategoryForm.vue'

defineOptions({ name: 'ProductCategory' })

const message = useMessage()

const tableLoading = ref(false)
const tableData = ref<any>([])
const formRef = ref()
const queryFormRef = ref()

const queryParams = reactive({
  name: undefined
})

const getProductCategoryList = async () => {
  tableLoading.value = true
  try {
    const data = await ProductCategoryApi.getList(queryParams)
    tableData.value = handleTree(data, 'id', 'parentId')
  } finally {
    tableLoading.value = false
  }
}

const openForm = (id?: number) => {
  formRef.value.open(id)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await ProductCategoryApi.del(id)
  message.success('删除成功')
  await getProductCategoryList()
}

const resetQuery = async () => {
  queryFormRef.value.resetFields()
  await getProductCategoryList()
}

onMounted(() => {
  getProductCategoryList()
})
</script>

<template>
  <div class="page">
    <el-form ref="queryFormRef" :model="queryParams" class="table-header" inline>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入分类名称" clearable />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getProductCategoryList">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table-header">
      <el-button type="info" :icon="RefreshRight" @click="getProductCategoryList()" />
      <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加商品分类</el-button>
    </div>

    <el-table
      ref="tableRef"
      v-loading="tableLoading"
      :data="tableData"
      border
      stripe
      show-overflow-tooltip
      row-key="id"
    >
      <el-table-column label="分类名称" prop="name" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="图标" align="center" prop="icon" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.COMMON_STATUS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" width="300" />
      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ProductCategoryForm ref="formRef" @success="getProductCategoryList()" />
</template>

<style lang="scss" scoped></style>
