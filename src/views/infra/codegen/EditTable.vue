<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as CodegenApi from '@/api/infra/codegen'

const message = useMessage()
const activeName = ref('first')
const dialogTitle = ref('编辑表')
const dialogVisible = ref(false)
const submitLoading = ref(false)
const dataLoading = ref(false)
const formRef = ref()

const table = ref<any>({})
const columns = ref<any>([])

const open = async (tableId: number) => {
  dialogVisible.value = true
  dataLoading.value = true
  dialogTitle.value = `编辑表（${table.value.tableName}）`
  try {
    const res = await CodegenApi.getDetail(tableId)
    table.value = res.table
    columns.value = res.columns
  } finally {
    dataLoading.value = false
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])

const formRules = reactive({
  tableName: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
  tableComment: [{ required: true, message: '请输入表描述', trigger: 'blur' }],
  className: [{ required: true, message: '请输入实体类名称', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  scene: [{ required: true, message: '请选择场景', trigger: 'blur' }],
  moduleName: [{ required: true, message: '请输入模块名', trigger: 'blur' }],
  businessName: [{ required: true, message: '请输入业务名', trigger: 'blur' }],
  classComment: [{ required: true, message: '请输入类描述', trigger: 'blur' }]
})

const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }
  submitLoading.value = true
  try {
    const params = {
      table: table.value,
      columns: columns.value
    }
    await CodegenApi.updateCodegen(params)
    message.success('保存成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    submitLoading.value = false
  }
}
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="80%" align-center scroll maxHeight="760px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="表信息" name="first">
        <el-form
          ref="formRef"
          :model="table"
          :rules="formRules"
          label-width="100px"
          class="tabs-form"
          v-loading="dataLoading"
        >
          <h3 class="sub-title">基本信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="表名称" prop="tableName">
                <el-input v-model="table.tableName" placeholder="请输入表名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="表描述" prop="tableComment">
                <el-input v-model="table.tableComment" placeholder="请输入表描述" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实体类名称" prop="className">
                <el-input v-model="table.className" placeholder="请输入实体类名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="作者" prop="author">
                <el-input v-model="table.author" placeholder="请输入作者" />
              </el-form-item>
            </el-col>
          </el-row>

          <h3 class="sub-title">生成信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="生成场景" prop="scene">
                <el-select v-model="table.scene" placeholder="请选择场景" style="width: 100%">
                  <el-option
                    v-for="(item, index) in getIntDictOptions(DICT_TYPE.INFRA_CODEGEN_SCENE)"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模块名" prop="moduleName">
                <el-input v-model="table.moduleName" placeholder="请输入模块名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务名" prop="businessName">
                <el-input v-model="table.businessName" placeholder="请输入业务名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类名称" prop="className">
                <el-input v-model="table.className" placeholder="请输入类名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类描述" prop="classComment">
                <el-input v-model="table.classComment" placeholder="请输入类描述" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="字段信息" name="second">
        <el-table ref="tableRef" :data="columns" border stripe show-overflow-tooltip v-loading="dataLoading">
          <el-table-column align="center" label="字段名称" prop="columnName" />
          <el-table-column align="center" label="字段描述" prop="columnComment">
            <template #default="{ row }">
              <el-input v-model="row.columnComment" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="物理类型" prop="dataType" />
          <el-table-column align="center" label="Java 类型" prop="javaType">
            <template #default="{ row }">
              <el-select v-model="row.javaType">
                <el-option label="Long" value="Long" />
                <el-option label="String" value="String" />
                <el-option label="Integer" value="Integer" />
                <el-option label="Double" value="Double" />
                <el-option label="BigDecimal" value="BigDecimal" />
                <el-option label="LocalDateTime" value="LocalDateTime" />
                <el-option label="Boolean" value="Boolean" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Java 属性" prop="javaField">
            <template #default="{ row }">
              <el-input v-model="row.javaField" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="插入" width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.createOperation" false-label="false" true-label="true" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="编辑" width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.updateOperation" false-label="false" true-label="true" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="列表" width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.queryResult" false-label="false" true-label="true" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="查询" width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.queryCondition" false-label="false" true-label="true" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="查询方式">
            <template #default="{ row }">
              <el-select v-model="row.queryType">
                <el-option label="=" value="=" />
                <el-option label="!=" value="!=" />
                <el-option label=">" value=">" />
                <el-option label=">=" value=">=" />
                <el-option label="<" value="<>" />
                <el-option label="<=" value="<=" />
                <el-option label="LIKE" value="LIKE" />
                <el-option label="BETWEEN" value="BETWEEN" />
                <el-option label="BETWEEN_DATA" value="BETWEEN_DATA" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="空值" width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.nullable" false-label="false" true-label="true" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="显示类型">
            <template #default="{ row }">
              <el-select v-model="row.htmlType">
                <el-option label="文本框" value="input" />
                <el-option label="文本域" value="textarea" />
                <el-option label="下拉框" value="select" />
                <el-option label="单选框" value="radio" />
                <el-option label="复选框" value="checkbox" />
                <el-option label="日期控件" value="datetime" />
                <el-option label="图片上传" value="imageUpload" />
                <el-option label="文件上传" value="fileUpload" />
                <el-option label="富文本控件" value="editor" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm"> 保存 </el-button>
      </span>
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
.sub-title {
  margin-top: 0;
}
</style>
