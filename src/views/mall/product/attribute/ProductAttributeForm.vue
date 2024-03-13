<script lang="ts" setup>
import * as ProductAttributeApi from '@/api/product/attribute'
import { AttrEnums } from './index.vue'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)
const formRef = ref()

interface Enums {
  enums: AttrEnums
}

const enums = ref<AttrEnums>({
  group: [],
  attrType: []
})

const getAttributeEnums = async () => {
  enums.value = await ProductAttributeApi.getAttributeEnums()
}

const defaultData: ProductAttributeApi.ProductAttributeDTO = {
  id: undefined,
  groupId: undefined,
  name: undefined,
  selectType: 0,
  inputType: 0,
  inputList: undefined,
  sort: 0,
  filterType: 0,
  searchType: 1,
  relatedStatus: 0,
  addition: false
}

const formData = ref<ProductAttributeApi.ProductAttributeDTO>(defaultData)
const formRules = reactive({
  groupId: [{ required: true, message: '所属分组不能为空', trigger: 'change' }],
  name: [{ required: true, message: '属性名称不能为空', trigger: 'blur' }]
})

let refersh: () => void
const open = async (id: number, getTableList: () => void, groupId?: number) => {
  resetForm()
  refersh = getTableList
  getAttributeEnums()
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑商品属性[参数属性]'
    formLoading.value = true
    try {
      formData.value = await ProductAttributeApi.getAttributeDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增商品属性[参数属性]'
    formData.value.groupId = groupId
  }
}
defineExpose({ open })

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
    await ProductAttributeApi.saveAttribute(data)
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
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="35%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" v-loading="formLoading">
      <el-form-item label="所属分组" prop="groupId">
        <el-select v-model="formData.groupId" placeholder="请选择所属分组">
          <el-option v-for="(item, index) in enums.group" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入属性名称" />
      </el-form-item>
      <el-form-item label="属性选择类型" prop="selectType">
        <el-radio-group v-model="formData.selectType">
          <el-radio :value="0">唯一</el-radio>
          <el-radio :value="1">单选</el-radio>
          <el-radio :value="2">多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="筛选样式" prop="filterType">
        <el-radio-group v-model="formData.filterType">
          <el-radio :value="0">普通</el-radio>
          <el-radio :value="1">颜色</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="检索类型" prop="searchType">
        <el-radio-group v-model="formData.searchType">
          <el-radio :value="0">不检索</el-radio>
          <el-radio :value="1">关键字检索</el-radio>
          <el-radio :value="2">范围检索</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="属性录入方式" prop="inputType">
        <el-radio-group v-model="formData.inputType">
          <el-radio :value="0">手工录入</el-radio>
          <el-radio :value="1">从列表中选取</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可选值列表" prop="inputList">
        <el-input v-model="formData.inputList" placeholder="请输入可选值列表，以逗号隔开" />
      </el-form-item>
      <el-form-item label="属性关联" prop="relatedStatus">
        <el-radio-group v-model="formData.relatedStatus">
          <el-radio :value="0">不关联</el-radio>
          <el-radio :value="1">关联</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支持新增" prop="addition">
        <el-radio-group v-model="formData.addition">
          <el-radio :value="true">是</el-radio>
          <el-radio :value="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </template>
  </Dialog>
</template>
