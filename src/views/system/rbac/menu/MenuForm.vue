<script lang="ts" setup>
import * as MenuApi from '@/api/system/menu'

const message = useMessage()

const dialogTitle = ref('')
const dialogVisible = ref(false)

const formLoading = ref(false)
const formRef = ref()

const menuType = [
  { value: 1, label: '目录' },
  { value: 2, label: '分组' },
  { value: 3, label: '菜单' },
  { value: 4, label: '按钮' }
]

const defaultData: MenuApi.MenuVO = {
  id: '',
  type: 1,
  parentId: '',
  name: '',
  permission: '',
  icon: '',
  sort: Number(0),
  path: '',
  component: '',
  componentName: '',
  status: 1,
  keepAlive: true,
  visible: true
}

const currentType = ref({
  type: menuType[0].value,
  label: menuType[0].label
})

const formData = ref<MenuApi.MenuVO>(defaultData)

const parent = ref<any[]>([])

const formRules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

let refersh: () => void
const open = async (id: number, getTableList: () => void, parentId?: number) => {
  resetForm()
  refersh = getTableList
  dialogVisible.value = true
  formLoading.value = true
  try {
    parent.value = await MenuApi.getMenuTree()
    if (id) {
      dialogTitle.value = '编辑'
      const data = await MenuApi.getDetail(id)
      formData.value = data

      const type = getType(data.type)
      if (type) {
        currentType.value.type = type.value
        currentType.value.label = type.label
      }
    } else {
      dialogTitle.value = '新增'
    }

    if (parentId) {
      currentType.value.type = menuType[3].value
      currentType.value.label = menuType[3].label
      formData.value.parentId = parentId
    }
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open })

const getType = (type: number) => {
  return menuType.find((item) => item.value === type)
}

const handleParentChange = (node) => {
  const { type } = node
  if (type === 1) {
    currentType.value.type = 2
    currentType.value.label = '分组'
  } else if (type === 2) {
    currentType.value.type = 3
    currentType.value.label = '菜单'
  } else if (type === 3) {
    currentType.value.type = 4
    currentType.value.label = '按钮'
  } else {
    currentType.value.type = 1
    currentType.value.label = '目录'
  }
}

const resetForm = () => {
  formData.value = defaultData
  formRef.value?.resetFields()
}

const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }
  formLoading.value = true
  try {
    const data = formData.value
    data.type = currentType.value.type
    if (data.parentId === '') {
      data.parentId = 0
    }
    await MenuApi.saveMenu(data)
    message.success('保存成功')
    dialogVisible.value = false
    refersh()
  } finally {
    formLoading.value = false
  }
  dialogVisible.value = false
}
</script>

<template>
  <Dialog ialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="formLoading">
      <el-form-item label="菜单类型">
        <el-text>{{ currentType.label }}</el-text>
      </el-form-item>

      <el-form-item :label="'父级'" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="parent"
          :props="{ label: 'name', value: 'id' }"
          placeholder="不选择默认为顶级"
          clearable
          check-strictly
          default-expand-all
          style="width: 100%"
          @current-change="handleParentChange"
          @clear="handleParentChange({ type: 0 })"
        />
      </el-form-item>

      <el-form-item :label="currentType.label + '名称'" prop="name">
        <el-input v-model="formData.name" :placeholder="`请输入${currentType.label}名称`" />
      </el-form-item>

      <el-form-item label="目录图标" v-if="currentType.type === 1">
        <el-input v-model="formData.icon" placeholder="请选择目录图标" />
      </el-form-item>

      <el-form-item label="权限标识">
        <el-input v-model="formData.permission" placeholder="请输入权限标识" />
      </el-form-item>

      <el-form-item label="路由地址" prop="path" v-if="currentType.type !== 4">
        <el-input v-model="formData.path" :placeholder="currentType.type === 1 ? '例：/system' : '例：menu'" />
      </el-form-item>

      <el-form-item label="组件路径" prop="component" v-if="currentType.type === 3">
        <el-input v-model="formData.component" placeholder="例：system/menu/index" />
      </el-form-item>

      <el-form-item label="组件名称" prop="componentName" v-if="currentType.type === 3">
        <el-input v-model="formData.componentName" placeholder="例：SystemMenu" />
      </el-form-item>

      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
      </el-form-item>

      <el-form-item label="是否可见" prop="visible">
        <el-switch v-model="formData.visible" :active-value="true" :inactive-value="false" />
      </el-form-item>

      <el-row>
        <el-col :span="currentType.type !== 3 ? 24 : 11">
          <el-form-item label="启用状态">
            <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>

        <el-col :span="11" v-if="currentType.type === 3">
          <el-form-item label="缓存">
            <el-switch v-model="formData.keepAlive" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" v-throttle="submitForm">保存</el-button>
      </span>
    </template>
  </Dialog>
</template>
