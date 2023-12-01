<script setup lang="ts">
import { RefreshRight, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import * as UserApi from '@/api/system/user'
import UserForm from './UserForm.vue'

defineOptions({ name: 'SystemUser' })

const message = useMessage()

const tableLoading = ref(false)
const tableData = ref<any>([])
const formRef = ref()
const queryFormRef = ref()
const total = ref(0)

const queryParams = reactive({
  current: 1,
  size: 10,
  username: undefined,
  deptId: undefined,
  gender: undefined,
  mobile: undefined,
  status: undefined,
  createStartDate: undefined,
  createEndDate: undefined
})

const getUserPage = async () => {
  tableLoading.value = true
  try {
    const data = await UserApi.getPage(queryParams)
    tableData.value = data.records
    total.value = data.total
  } finally {
    tableLoading.value = false
  }
}

const openForm = (id?: number) => {
  formRef.value.open(id)
}

const resetQuery = async () => {
  queryFormRef.value.resetFields()
  await getUserPage()
}

onMounted(() => {
  getUserPage()
})
</script>

<template>
  <div class="page">
    <el-form ref="queryFormRef" class="table-header" :model="queryParams" inline>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
      </el-form-item>

      <el-form-item label="所属部门" prop="deptId">
        <el-input v-model="queryParams.deptId" placeholder="请选择部门" clearable />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-input v-model="queryParams.gender" placeholder="请选择性别" clearable />
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="手机号精确匹配" clearable />
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

      <el-form-item label="创建日期" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="手机号精确匹配" clearable />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getUserPage">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table-header">
      <el-button type="info" :icon="RefreshRight" @click="getUserPage" />
      <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加用户</el-button>
    </div>

    <el-table ref="tableRef" v-loading="tableLoading" :data="tableData" border stripe show-overflow-tooltip>
      <el-table-column align="center" label="用户名" prop="username" width="300" />
      <el-table-column align="center" label="用户昵称" prop="nickname" />
      <el-table-column align="center" label="所属部门" prop="dept">
        <template #default="{ row }">
          {{ row.dept.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" prop="gender">
        <template #default="{ row }">
          {{ getDictLabel(DICT_TYPE.SYSTEM_USER_GENDER, row.gender) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱" prop="email" />
      <el-table-column align="center" label="状态" prop="status" width="150">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" width="300" />

      <el-table-column align="center" label="操作" width="220">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button type="primary" link size="small">分配角色</el-button>
          <el-divider direction="vertical" />
          <el-button :type="row.status === 0 ? 'primary' : 'danger'" link size="small">
            {{ row.status === 0 ? '启用' : '停用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getUserPage"
    />
  </div>
  <UserForm ref="formRef" @success="getUserPage" />
</template>

<style scoped></style>
