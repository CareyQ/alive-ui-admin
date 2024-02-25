<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import * as CodegenApi from '@/api/infra/codegen'
import { dateFormatter } from '@/utils/date'
import download from '@/utils/download'
import ImportTable from './ImportTable.vue'
import EditTable from './EditTable.vue'
import PreviewCode from './PreviewCode.vue'

defineOptions({ name: 'InfraCodegen' })

const aliveTable = ref()
const message = useMessage()
const editRef = ref()
const openForm = (id?: number) => {
  editRef.value.open(id, aliveTable.value.getTableList)
}

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.createDate && (newParams.startDate = newParams.createDate[0])
  newParams.createDate && (newParams.endDate = newParams.createDate[1])
  delete newParams.createDate
  return CodegenApi.getPage(newParams)
}

const importRef = ref()
const openImportTable = () => {
  importRef.value.open(aliveTable.value.getTableList)
}

const previewRef = ref()
const previewForm = (id: number) => {
  previewRef.value.open(id)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await CodegenApi.delCodegen(id)
  message.success('删除成功')
  await aliveTable.value.getTableList()
}

/** 生成代码操作 */
const handleGenTable = async (id: number, className: string) => {
  const res = await CodegenApi.downloadCodegen(id)
  download.zip(res, 'codegen-' + className + '.zip')
}
</script>

<template>
    <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getTableList">
      <template #search>
        <el-form-item label="表名称" prop="tableName">
        <el-input v-model="aliveTable.searchParam.tableName" placeholder="请输入表名称" clearable />
      </el-form-item>

      <el-form-item label="表描述" prop="tableComment">
        <el-input v-model="aliveTable.searchParam.tableComment" placeholder="请输入表描述" clearable />
      </el-form-item>

      <el-form-item label="创建日期" prop="startDate">
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
        <el-button type="primary" :icon="Plus" @click="openImportTable()">导入</el-button>
      </template>

      <el-table-column align="center" label="表名称" prop="tableName" />
      <el-table-column align="center" label="表描述" prop="tableComment" />
      <el-table-column align="center" label="数据源" prop="dataSourceName" />
      <el-table-column align="center" label="实体" prop="className" />
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" />
      <el-table-column align="center" label="更新时间" prop="updateTime" :formatter="dateFormatter" />

      <el-table-column align="center" label="操作" width="250">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="primary" size="small" @click="previewForm(row.id)"> 预览 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="primary" size="small" @click="handleGenTable(row.id, row.className)">
            生成代码
          </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>

  <ImportTable ref="importRef" />
  <EditTable ref="editRef"  />
  <PreviewCode ref="previewRef" />
</template>
