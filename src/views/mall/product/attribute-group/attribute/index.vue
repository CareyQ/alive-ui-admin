<script setup lang="ts">
import { Plus, EditPen, Delete } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as ProductAttributeApi from '@/api/product/attribute'
import ProductAttributeForm from './ProductAttributeForm.vue'

defineOptions({ name: 'ProductAttribute' })

const route = useRoute()
const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const attrType = ref([])
const group = ref([])
const getAttributeEnums = async () => {
  const res = await ProductAttributeApi.getAttributeEnums()
  attrType.value = res.attrType
  group.value = res.group
}

const initParams = reactive({
  groupId: Number(route.params.groupId),
  type: attrType.value[0].value
})

const handleDel = async (id: number) => {
  try {
    await message.delConfirm()
    await ProductAttributeApi.delAttribute(id)
    message.success('删除成功')
    await aliveTable.value.getTableList()
  } catch {}
}

onMounted(() => {
  getAttributeEnums()
})
</script>

<template>
  <div class="table-box">
    <AliveTable
      ref="aliveTable"
      :request-api="ProductAttributeApi.getAttributePage"
      :initParams="initParams"
      :request-auto="false"
    >
      <template #search>
        <el-form-item label="所属分组" prop="groupId">
          <el-select v-model="aliveTable.searchParam.groupId" placeholder="请选择所属分组" clearable>
            <el-option v-for="(item, index) in group" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="属性类型" prop="type">
          <el-select v-model="aliveTable.searchParam.type" placeholder="请选择属性类型" clearable>
            <el-option v-for="(item, index) in attrType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入属性名称" clearable />
        </el-form-item>
      </template>

      <template #operation>
        <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加商品属性</el-button>
      </template>

      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="属性类型" align="center" prop="type" />
      <el-table-column label="属性名称" align="center" prop="name" />
      <el-table-column label="选择类型" align="center" prop="selectType" />
      <el-table-column label="录入方式" align="center" prop="inputType" />
      <el-table-column label="可选值列表，以逗号隔开" align="center" prop="inputList" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="检索类型" align="center" prop="searchType" />
      <el-table-column label="支持新增" align="center" prop="addition" />

      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button :icon="EditPen" link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button :icon="Delete" link type="danger" size="small" @click="handleDel(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>
  <ProductAttributeForm ref="formRef" />
</template>
