<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue'
import * as CodegenApi from '@/api/infra/codegen'

const message = useMessage()

const activeName = ref('first')
const dialogTitle = ref('编辑表')
const dialogVisible = ref(false)
const importLoading = ref(false)

const table = ref<any>()
const columns = ref<any>([])

const open = async (tableId: number) => {
  const res = await CodegenApi.getDetail(tableId)
  table.value = res.table
  columns.value = res.columns
  dialogTitle.value = `编辑表（${table.value.tableName}）`
  dialogVisible.value = true
}
defineExpose({ open })

const emit = defineEmits(['success'])
const handleImportTable = async () => {
  importLoading.value = true
}

const formRules = reactive({
  name: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入数据源链接', trigger: 'blur' }],
  username: [{ required: true, message: '请输入数据源用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入数据源密码', trigger: 'blur' }]
})
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="75%" scroll :maxHeight="500">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <el-form :model="table" :rules="formRules" label-width="100px" class="tabs-form">
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
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="字段信息" name="second">Config</el-tab-pane>
    </el-tabs>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="importLoading" @click="handleImportTable"> 保存 </el-button>
      </span>
    </template>
  </Dialog>
</template>

<style scoped></style>
