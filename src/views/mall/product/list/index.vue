<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import * as ProductApi from '@/api/product/product'
import * as ProductBrandApi from '@/api/product/brand'
import * as ProductCategoryApi from '@/api/product/category'

defineOptions({ name: 'ProductList' })

const { push } = useRouter()
const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const categoryTree = ref()
const brandList = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await ProductApi.del(id)
  message.success('删除成功')
  await aliveTable.value.getTableList()
}

const getInitData = async () => {
  categoryTree.value = await ProductCategoryApi.getTree()
  brandList.value = await ProductBrandApi.getBrandList()
}

const statusChange = async (row: any) => {
  try {
    // 修改状态的二次确认
    const text = row.status === 1 ? '上架' : '下架'
    await message.confirm(`确定要${text}该商品吗？`)
    // 发起修改状态
    await ProductApi.updateStatus(row.id!, row.status!)
    // 刷新列表
    await aliveTable.value.getTableList()
  } catch {
    // 取消后，进行恢复按钮
    row.status = row.status === 1 ? 0 : 1
  }
}

onMounted(() => {
  getInitData()
})
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="ProductApi.getPage">
      <template #search>
        <el-form-item label="商品分类" prop="categoryId">
          <el-cascader
            v-model="aliveTable.searchParam.categoryId"
            :options="categoryTree"
            :props="{ label: 'name', value: 'id', emitPath: false }"
            clearable
            placeholder="请选择商品分类"
            filterable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="商品分类" prop="brandId">
          <el-select v-model="aliveTable.searchParam.brandId" placeholder="请选择商品品牌" clearable>
            <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品编号" prop="snCode">
          <el-input v-model="aliveTable.searchParam.snCode" placeholder="请输入商品编号" clearable />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="aliveTable.searchParam.status" placeholder="请选择商品状态" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
      </template>

      <template #operation>
        <el-button type="primary" :icon="Plus" @click="push({ name: 'ProductAdd' })">发布商品</el-button>
      </template>

      <el-table-column label="编号" align="center" prop="id" width="80px" />
      <el-table-column label="商品图片" align="center" prop="pic">
        <template #default="{ row }">
          <el-image style="width: 50px; height: 50px" :src="row.pic" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" />
      <el-table-column label="货号" align="center" prop="snCode" />
      <el-table-column label="分类" align="center" prop="categoryName" />
      <el-table-column label="品牌" align="center" prop="brandName" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="库存" align="center" prop="stock" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="销量" align="center" prop="salesVolume" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            active-text="上架"
            inactive-text="下架"
            inline-prompt
            @change="statusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openForm(row.id)"> 详情 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="primary" size="small" @click="push({ name: 'ProductEdit', params: { id: row.id } })">
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>
</template>
