<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/date'
import * as ProductCategoryApi from '@/api/product/category'
import CategoryForm from './CategoryForm.vue'

defineOptions({ name: 'ProductCategory' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await ProductCategoryApi.del(id)
  message.success('删除成功')
  await aliveTable.value.getTableList()
}
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="ProductCategoryApi.getList" :pagination="false">
      <template #searchOne>
        <el-form-item prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入分类名称" clearable />
        </el-form-item>
      </template>

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
    </AliveTable>
  </div>
  <CategoryForm ref="formRef" />
</template>
