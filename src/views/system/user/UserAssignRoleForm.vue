<script lang="ts" setup>
import * as UesrApi from '@/api/system/user'
import * as PermissionApi from '@/api/system/permission'
import * as RoleApi from '@/api/system/role'

const message = useMessage()
const formLoading = ref(false)
const dialogVisible = ref(false)

const formRef = ref()
const roleList = ref<any[]>([])
const username = ref('')

const formData = ref<PermissionApi.PermissionAssign>({
  primaryId: undefined,
  linkIds: []
})

const resetForm = () => {
  formData.value = {
    primaryId: undefined,
    linkIds: []
  }
  formRef.value?.resetFields()
}

const open = async (user: UesrApi.User) => {
  resetForm()
  dialogVisible.value = true
  formLoading.value = true

  formData.value.primaryId = user.id
  username.value = user.username
  try {
    formData.value.linkIds = await PermissionApi.getRoleUserList(user.id!)
    roleList.value = await RoleApi.getList()
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }
  formLoading.value = true
  try {
    const data = formData.value
    await PermissionApi.assignRoleUser(data)
    message.success('保存成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog title="分配角色" v-model="dialogVisible" width="25%">
    <el-form ref="formRef" :model="formData" :loading="formLoading">
      <el-form-item label="用户名:">
        <el-text>{{ username }}</el-text>
      </el-form-item>

      <el-form-item label="角色">
        <el-select v-model="formData.linkIds" multiple placeholder="请选择角色" style="width: 100%">
          <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
