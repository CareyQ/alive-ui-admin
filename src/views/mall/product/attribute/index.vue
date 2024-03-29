<script setup lang="ts">
import { EditPen, Delete, Grid } from '@element-plus/icons-vue'
import * as ProductAttributeApi from '@/api/product/attribute'
import ProductAttributeForm from './ProductAttributeForm.vue'

defineOptions({ name: 'ProductAttribute' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList, aliveTable.value.searchParam.groupId)
}

const handleDel = async (id: number) => {
  try {
    await message.delConfirm()
    await ProductAttributeApi.delAttribute(id)
    message.success('删除成功')
    await aliveTable.value.getTableList()
  } catch {}
}
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="ProductAttributeApi.getAttributePage">
      <template #searchOne>
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入属性名称" clearable />
        </el-form-item>
      </template>

      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="属性类型" align="center" prop="typeName" />
      <el-table-column label="属性名称" align="center" prop="name" />
      <el-table-column label="选择类型" align="center" prop="selectTypeName" />
      <el-table-column label="录入方式" align="center" prop="inputTypeName" />
      <el-table-column label="可选值列表" align="center" prop="inputList" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="支持新增" align="center" prop="addition">
        <template #default="{ row }">
          {{ row.addition ? '支持' : '不支持' }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button :icon="EditPen" link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button :icon="Delete" link type="danger" size="small" @click="handleDel(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>
  <ProductAttributeForm ref="formRef" :enums="enums" />
</template>
