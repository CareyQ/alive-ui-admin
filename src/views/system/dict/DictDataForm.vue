<script lang="ts" setup>
import * as DictApi from '@/api/system/dict'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)
const dictType = ref<DictApi.DictType | null>(null)

const formRef = ref()

interface ColorType {
  label: string
  value: ElType
}
const colorTypeOptions: ColorType[] = [
  {
    value: 'default',
    label: '默认'
  },
  {
    value: 'success',
    label: '成功'
  },
  {
    value: 'info',
    label: '信息'
  },
  {
    value: 'warning',
    label: '警告'
  },
  {
    value: 'danger',
    label: '危险'
  }
]

const formData = ref({
  id: '',
  label: '',
  value: '',
  dictType: '',
  colorType: '',
  remark: '',
  status: 1
})

const formRules = reactive({
  label: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
})

const open = async (id: number, node: any) => {
  if (!id && !node) {
    message.warning('请选择字典类型')
    return
  }
  dictType.value = node
  resetForm()
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑字典数据'
    formLoading.value = true
    try {
      formData.value = await DictApi.getDictDataDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    formData.value.dictType = dictType.value?.type || ''
    dialogTitle.value = '新增字典数据'
  }
}
defineExpose({ open })

const resetForm = () => {
  formData.value = {
    id: '',
    label: '',
    value: '',
    dictType: '',
    colorType: '',
    remark: '',
    status: 1
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
    await DictApi.saveDictData(data)
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
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="formLoading">
      <el-form-item label="字典类型" v-if="dictType">
        {{ `${dictType?.name}（${dictType?.type}）` }}
      </el-form-item>

      <el-form-item label="标签" prop="label">
        <el-input v-model="formData.label" placeholder="请输入字典标签" />
      </el-form-item>

      <el-form-item label="数据值" prop="value">
        <el-input v-model="formData.value" placeholder="请输入数据值" />
      </el-form-item>

      <el-form-item label="颜色类型" prop="colorType">
        <el-select v-model="formData.colorType" placeholder="请选择颜色类型">
          <el-option
            v-for="item in colorTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value as string"
          >
            <div class="flex-center-between">
              <span>{{ item.label }}</span>
              <el-tag :type="item.value" style="width: 60px">{{ item.value }}</el-tag>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>

      <el-form-item label="启用状态">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
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
