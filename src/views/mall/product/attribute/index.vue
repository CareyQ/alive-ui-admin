<script setup lang="ts">
import { Plus, EditPen, Delete } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as ProductAttributeGroupApi from '@/api/product/attribute'
import * as ProductCategoryApi from '@/api/product/category'
import ProductAttributeGroupForm from './ProductAttributeGroupForm.vue'

defineOptions({ name: 'ProductAttribute' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.createDate && (newParams.startDate = newParams.createDate[0])
  newParams.createDate && (newParams.endDate = newParams.createDate[1])
  delete newParams.createDate
  return ProductAttributeGroupApi.getAttributeGroupPage(newParams)
}

const handleDel = async (id: number) => {
  try {
    await message.delConfirm()
    await ProductAttributeGroupApi.delAttributeGroup(id)
    message.success('删除成功')
    await aliveTable.value.getTableList()
  } catch {}
}

const categoryTree = ref()
const getCategoryTree = async () => {
  categoryTree.value = await ProductCategoryApi.getTree()
}

onMounted(() => {
  getCategoryTree()
})
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getTableList">
      <template #search>
        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="aliveTable.searchParam.categoryId" placeholder="请选择商品分类" clearable>
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入属性分组名称" clearable />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="aliveTable.searchParam.createDate"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </template>

      <template #operation>
        <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加属性分组</el-button>
      </template>

      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="商品分类" align="center" prop="categoryId" />
      <el-table-column label="属性分组名称" align="center" prop="name" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" width="300" />

      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button :icon="EditPen" link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button :icon="Delete" link type="danger" size="small" @click="handleDel(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>
  <ProductAttributeGroupForm ref="formRef" />
</template>
