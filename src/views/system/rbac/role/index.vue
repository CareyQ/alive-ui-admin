<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import * as RoleApi from '@/api/system/role'
import RoleForm from './RoleForm.vue'
import RoleAssignMenuDrawer from './RoleAssignMenuDrawer.vue'

defineOptions({ name: 'SystemRole' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const menuDrawerRef = ref()

const openMenuDrawer = (id?: number) => {
  menuDrawerRef.value.open(id)
}

const handleDel = async (id: number) => {
  try {
    await message.delConfirm()
    await RoleApi.del(id)
    message.success('删除成功')
    await aliveTable.value.getTableList()
  } catch {}
}

const handleDefaultChange = async (id: number, isDefault: boolean) => {
  try {
    await RoleApi.changeDefault(id, isDefault)
    message.success('设置成功')
  } catch (e) {
  } finally {
    await aliveTable.value.getTableList()
  }
}
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="RoleApi.getPage">
      <template #search>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
      </template>

      <template #operation>
        <el-button type="primary" :icon="Plus" @click="openForm()">添加角色</el-button>
      </template>

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
    </AliveTable>
  </div>
  <RoleForm ref="formRef" />
  <RoleAssignMenuDrawer ref="menuDrawerRef" />
</template>
