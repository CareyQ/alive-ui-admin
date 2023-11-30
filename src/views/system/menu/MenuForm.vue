<script lang="ts" setup>
import * as MenuApi from '@/api/system/menu'

const message = useMessage()

const dialogTitle = ref('')
const dialogVisible = ref(false)

const labelPrefix = ref('目录')
const labelSuffix = ref('')
const formLoading = ref(false)
const formRef = ref()

const formData = ref({
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
  status: 0,
  keepAlive: true
})

const typeMock = [
  {
    label: '目录',
    value: 1
  },
  {
    label: '分组',
    value: 2
  },
  {
    label: '菜单',
    value: 3
  },
  {
    label: '按钮',
    value: 4
  }
]

const parent = ref<any[]>([])

const formRules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  parentId: [{ required: true, message: '请选择上级所属', trigger: 'blur' }]
})

const open = async (id: number) => {
  resetForm()
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑'
    formLoading.value = true
    try {
      formData.value = await MenuApi.getDetail(id)
      getParentMenu()
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增'
  }
}
defineExpose({ open })

const handleTypeChange = (value: number) => {
  formData.value.parentId = ''
  if (value === 1) {
    labelPrefix.value = '目录'
  }
  if (value === 2) {
    labelSuffix.value = '目录'
    labelPrefix.value = '分组'
  }
  if (value === 3) {
    labelSuffix.value = '分组'
    labelPrefix.value = '菜单'
  }
  if (value === 4) {
    labelSuffix.value = '菜单'
    labelPrefix.value = '按钮'
  }
  getParentMenu()
}

const getParentMenu = async () => {
  const res = await MenuApi.getSimpleMenus(formData.value.type - 1)
  parent.value = res
}

const resetForm = () => {
  formData.value = {
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
    status: 0,
    keepAlive: true
  }
  formRef.value?.resetFields()
}

const emit = defineEmits(['success'])
const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }
  formLoading.value = true
  try {
    const data = formData.value
    await MenuApi.saveMenu(data)
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
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" :loading="formLoading">
      <el-form-item label="所属类型" prop="type">
        <el-radio-group v-model="formData.type" @change="handleTypeChange" :disabled="(formData?.id as any) > 0">
          <el-radio-button v-for="dict in typeMock" :key="dict.value" :label="dict.value">
            {{ dict.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="'父级' + labelSuffix" v-if="formData.type !== 1" prop="parentId">
        <el-select v-model="formData.parentId" :placeholder="`请选择父级${labelSuffix}`" style="width: 100%" clearable>
          <el-option v-for="item in parent" :key="item?.value" :label="item?.label" :value="item?.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="labelPrefix + '名称'" prop="name">
        <el-input v-model="formData.name" :placeholder="`请输入${labelPrefix}名称`" />
      </el-form-item>

      <el-form-item label="目录图标" v-if="formData.type === 1">
        <el-input v-model="formData.icon" placeholder="请选择目录图标" />
      </el-form-item>

      <el-form-item label="权限标识">
        <el-input v-model="formData.permission" placeholder="请输入权限标识" />
      </el-form-item>

      <el-form-item label="路由地址" prop="path" v-if="formData.type !== 4">
        <el-input v-model="formData.path" placeholder="请输入路由地址" />
      </el-form-item>

      <el-form-item label="组件路径" prop="component" v-if="formData.type === 3">
        <el-input v-model="formData.component" placeholder="例：system/menu/index" />
      </el-form-item>

      <el-form-item label="组件名称" prop="componentName" v-if="formData.type === 3">
        <el-input v-model="formData.componentName" placeholder="例：SystemMenu" />
      </el-form-item>

      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
      </el-form-item>

      <el-row>
        <el-col :span="formData.type !== 3 ? 24 : 11">
          <el-form-item label="启用状态">
            <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>

        <el-col :span="11" v-if="formData.type === 3">
          <el-form-item label="缓存">
            <el-switch v-model="formData.keepAlive" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
