<script setup lang="ts">
import { RefreshRight, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE } from '@/utils/dict'
import * as ProductBrandApi from '@/api/product/brand'
import BrandForm from './BrandForm.vue'

defineOptions({ name: 'ProductBrand' })

const message = useMessage()

const tableLoading = ref(false)
const tableData = ref<any>([])
const formRef = ref()
const queryFormRef = ref()
const total = ref(0)
const createDate = ref<ElDate>([undefined, undefined])
const queryParams = reactive({
  current: 1,
  size: 10,
  name: undefined,
  status: undefined,
  startDate: computed(() => createDate.value[0]),
  endDate: computed(() => createDate.value[1])
})

const getBrandPage = async () => {
  tableLoading.value = true
  try {
    const data = await ProductBrandApi.getPage(queryParams)
    tableData.value = data.records
    total.value = data.total
  } finally {
    tableLoading.value = false
  }
}

const openForm = (id?: number) => {
  formRef.value.open(id)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await ProductBrandApi.del(id)
  message.success('删除成功')
  await getBrandPage()
}

const resetQuery = async () => {
  queryFormRef.value.resetFields()
  await getBrandPage()
}

onMounted(() => {
  getBrandPage()
})
</script>

<template>
  <div class="page">
    <el-form ref="queryFormRef" class="table-header" :model="queryParams" inline>
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入品牌名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="createDate"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getBrandPage">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table-header">
      <el-button type="info" :icon="RefreshRight" @click="getBrandPage()" />
      <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加商品品牌</el-button>
    </div>

    <el-table ref="tableRef" v-loading="tableLoading" :data="tableData" border stripe show-overflow-tooltip>
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
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getBrandPage()"
    />
  </div>
  <BrandForm ref="formRef" @success="getBrandPage()" />
</template>

<style lang="scss" scoped></style>
