<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import * as UserApi from '@/api/system/user'
import * as DeptApi from '@/api/system/dept'
import UserForm from './UserForm.vue'
import UserAssignRoleForm from './UserAssignRoleForm.vue'

defineOptions({ name: 'SystemUser' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value?.getTableList)
}

const assignRoleFormRef = ref()
const deptTree = ref()

const getDept = async () => {
  const data = await DeptApi.getSimpleList()
  if (data) {
    deptTree.value = data
  }
}

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.createDate && (newParams.createStartDate = newParams.createDate[0])
  newParams.createDate && (newParams.createEndDate = newParams.createDate[1])
  delete newParams.createDate
  return UserApi.getPage(newParams)
}

const openAssignRoleForm = (user: UserApi.User) => {
  assignRoleFormRef.value.open(user)
}

const handleStatusChange = async (user: UserApi.User) => {
  try {
    // 修改状态的二次确认
    const text = user.status === 1 ? '启用' : '停用'
    await message.confirm(`确定要${text}【${user.username}】吗？`)
    // 发起修改状态
    await UserApi.updateStatus(user.id!, user.status!)
    // 刷新列表
    await aliveTable.value.getTableList()
  } catch {
    // 取消后，进行恢复按钮
    user.status = user.status === 1 ? 0 : 1
  }
}

const handleResetPwd = async (user: UserApi.User) => {
  try {
    // 重置的二次确认
    const result = await message.prompt(`请输入【${user.username}】的新密码`, '重置密码')
    const password = result.value
    // 发起重置
    await UserApi.updatePassword(user.id!, password)
    message.success('修改成功，新密码：' + password)
  } catch {}
}

onMounted(() => {
  getDept()
})
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getTableList">
      <template #search>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="aliveTable.searchParam.username" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <el-tree-select
            v-model="aliveTable.searchParam.deptId"
            :data="deptTree"
            :props="{ value: 'id', label: 'name' }"
            clearable
            check-strictly
            node-key="id"
            placeholder="请选择归属部门"
          />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="aliveTable.searchParam.gender" placeholder="请选择性别" clearable>
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in getIntDictOptions(DICT_TYPE.SYSTEM_USER_GENDER)"
              :key="index"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="aliveTable.searchParam.mobile" placeholder="手机号精确匹配" clearable />
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

        <el-form-item label="创建日期" prop="createStartDate">
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
        <el-button type="primary" :icon="Plus" @click="openForm()">添加用户</el-button>
      </template>

      <el-table-column align="center" label="用户名" prop="username" />
      <el-table-column align="center" label="用户昵称" prop="nickname" />
      <el-table-column align="center" label="所属部门" prop="dept">
        <template #default="{ row }">
          {{ row.dept.label }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" prop="gender" width="120">
        <template #default="{ row }">
          {{ getDictLabel(DICT_TYPE.SYSTEM_USER_GENDER, row.gender) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" prop="mobile" />
      <el-table-column align="center" label="邮箱" prop="email" />
      <el-table-column align="center" label="状态" prop="status" width="120">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" />

      <el-table-column align="center" label="操作" width="250">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button type="primary" link size="small" @click="openAssignRoleForm(row)">分配角色</el-button>
          <el-divider direction="vertical" />
          <el-button type="warning" link size="small" @click="handleResetPwd(row)">重置密码</el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>
  <UserForm ref="formRef" />
  <UserAssignRoleForm ref="assignRoleFormRef" />
</template>

<style scoped></style>
