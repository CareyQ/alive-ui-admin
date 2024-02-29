<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as ProductBrandApi from '@/api/product/brand'
import BrandForm from './BrandForm.vue'

defineOptions({ name: 'ProductBrand' })

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
  return ProductBrandApi.getPage(newParams)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await ProductBrandApi.del(id)
  message.success('删除成功')
  await aliveTable.value.getTableList()
}
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getTableList">
      <template #search>
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入品牌名称" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="aliveTable.searchParam.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="(item, index) in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-button type="primary" :icon="Plus" @click="openForm()">添加商品品牌</el-button>
      </template>

      <el-table-column label="品牌名称" align="center" prop="name" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="品牌 logo" align="center" prop="logo" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.COMMON_STATUS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" width="300" />
      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-button link type="danger" size="small" @click="handleDel(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>
  <BrandForm ref="formRef" />
</template>
