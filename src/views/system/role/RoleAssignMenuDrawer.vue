<script setup lang="ts">
import * as MenuApi from '@/api/system/menu'
import * as PermissionApi from '@/api/system/permission'

const message = useMessage()
const roleId = ref()

const drawerVisible = ref(false)

const treeRef = ref()
const treeData = ref<any>([])
const treeLoading = ref(false)

const open = async (id: number) => {
  if (id <= 0) {
    message.warning('请选择角色')
    return
  }
  roleId.value = id
  drawerVisible.value = true
  treeLoading.value = true
  try {
    treeData.value = await MenuApi.getSimpleTree()
    const checked = await PermissionApi.getRoleMenuList(id)
    if (checked) {
      checked.forEach((menuId: number) => {
        treeRef.value.setChecked(menuId, true, false)
      })
    }
  } finally {
    treeLoading.value = false
  }
}
defineExpose({ open })

const submitForm = async () => {
  treeLoading.value = true
  try {
    const data = {
      primaryId: roleId.value,
      linkIds: [
        ...(treeRef.value.getHalfCheckedKeys() as unknown as Array<number>), // 获得半选中的父节点
        ...(treeRef.value.getCheckedKeys(false) as unknown as Array<number>) // 获得当前选中节点
      ]
    }
    await PermissionApi.assignRoleMenu(data)
    message.success('保存成功')
    drawerVisible.value = false
  } finally {
    treeLoading.value = false
  }
}
</script>

<template>
  <el-drawer v-model="drawerVisible" title="绑定菜单" direction="rtl" size="25%">
    <el-tree
      ref="treeRef"
      v-loading="treeLoading"
      :data="treeData"
      :props="{ label: 'name' }"
      node-key="id"
      highlight-current
      show-checkbox
      default-expand-all
      check-on-click-node
      empty-text="加载中，请稍候"
      :expand-on-click-node="false"
    />
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-throttle="submitForm">保存</el-button>
    </template>
  </el-drawer>
</template>

<style scoped></style>
