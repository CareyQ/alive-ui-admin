<script setup lang="ts">
import { RefreshRight, Plus, Search } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import * as RoleApi from '@/api/system/role'
import RoleForm from './RoleForm.vue'
import RoleAssignMenuDrawer from './RoleAssignMenuDrawer.vue'

defineOptions({ name: 'SystemRole' })

const message = useMessage()

const tableLoading = ref(false)
const tableData = ref<any>([])
const formRef = ref()
const menuDrawerRef = ref()

const total = ref(0)
const queryParams = reactive({
  current: 1,
  size: 10,
  name: ''
})

const getRolePage = async () => {
  tableLoading.value = true
  try {
    const data = await RoleApi.getPage(queryParams)
    tableData.value = data.records
    total.value = data.total
  } finally {
    tableLoading.value = false
  }
}

const openForm = (id?: number) => {
  formRef.value.open(id)
}

const openMenuDrawer = (id?: number) => {
  menuDrawerRef.value.open(id)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await RoleApi.del(id)
  message.success('删除成功')
  await getRolePage()
}

const handleDefaultChange = async (id: number, isDefault: boolean) => {
  try {
    await RoleApi.changeDefault(id, isDefault)
    message.success('设置成功')
  } catch (e) {
  } finally {
    await getRolePage()
  }
}

onMounted(() => {
  getRolePage()
})
</script>

<template>
  <div class="page">
    <div class="table-header table-header-split">
      <div class="btn">
        <el-button type="info" :icon="RefreshRight" @click="getRolePage" />
        <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加角色</el-button>
      </div>

      <el-form ref="queryFormRef" :model="queryParams" inline>
        <el-form-item prop="name">
          <el-input v-model="queryParams.name" placeholder="输入角色名称搜索" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="getRolePage">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table ref="tableRef" v-loading="tableLoading" :data="tableData" border stripe show-overflow-tooltip>
      <el-table-column align="center" label="角色名称" prop="name" />
      <el-table-column align="center" label="角色标识" prop="code" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="默认角色" prop="isDefault">
        <template #default="{ row }">
          <el-checkbox v-model="row.isDefault" @change="handleDefaultChange(row.id, row.isDefault)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" />

      <el-table-column align="center" label="操作" width="300">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openMenuDrawer(row.id)"> 菜单权限 </el-button>
          <el-divider direction="vertical" />
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
      @pagination="getRolePage"
    />
  </div>
  <RoleForm ref="formRef" @success="getRolePage" />
  <RoleAssignMenuDrawer ref="menuDrawerRef" @success="getRolePage" />
</template>

<style lang="scss" scoped></style>
