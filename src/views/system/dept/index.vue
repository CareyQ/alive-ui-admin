<script setup lang="ts">
import { RefreshRight, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as DeptApi from '@/api/system/dept'
import DeptForm from './DeptForm.vue'

defineOptions({ name: 'SystemDept' })

const message = useMessage()

const tableLoading = ref(false)
const tableData = ref<any>([])
const formRef = ref()
const queryFormRef = ref()

const queryParams = reactive({
  name: '',
  status: undefined
})

const getDeptList = async () => {
  tableLoading.value = true
  try {
    tableData.value = await DeptApi.getList(queryParams)
  } finally {
    tableLoading.value = false
  }
}

const openForm = (id?: number) => {
  formRef.value.open(id)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await DeptApi.del(id)
  message.success('删除成功')
  await getDeptList()
}

const resetQuery = async () => {
  queryFormRef.value.resetFields()
  await getDeptList()
}

onMounted(() => {
  getDeptList()
})
</script>

<template>
  <div class="page">
    <el-form ref="queryFormRef" class="table-header" :model="queryParams" inline>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入部门名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="(item, index) in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getDeptList">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table-header">
      <el-button type="info" :icon="RefreshRight" @click="getDeptList" />
      <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加部门</el-button>
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
      <el-table-column label="部门名称" prop="name" />
      <el-table-column align="center" label="负责人" prop="managerName" />
      <el-table-column align="center" label="联系电话" prop="mobile" />
      <el-table-column align="center" label="排序" prop="sort" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.COMMON_STATUS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark" />

      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <DeptForm ref="formRef" @success="getDeptList" />
</template>

<style lang="scss" scoped></style>
