<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import * as FileApi from '@/api/infra/file'
import FileForm from './FileForm.vue'

defineOptions({ name: 'FileList' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.createDate && (newParams.startDate = newParams.createDate[0])
  newParams.createDate && (newParams.endDate = newParams.createDate[1])
  delete newParams.createDate
  return FileApi.getOssConfigPage(newParams)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await FileApi.delFile(id)
  message.success('删除成功')
  await aliveTable.value.getTableList()
}
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getTableList">
      <template #search>
        <el-form-item label="配置编号" prop="configId">
          <el-input v-model="aliveTable.searchParam.configId" placeholder="请输入配置编号" clearable />
        </el-form-item>
        <el-form-item label="文件名" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入文件名" clearable />
        </el-form-item>
        <el-form-item label="文件路径" prop="path">
          <el-input v-model="aliveTable.searchParam.path" placeholder="请输入文件路径" clearable />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
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
        <el-button type="primary" :icon="Upload" @click="openForm()">上传文件</el-button>
      </template>

      <el-table-column label="配置编号" align="center" prop="configId" />
      <el-table-column label="文件名" align="center" prop="name" />
      <el-table-column label="文件路径" align="center" prop="path" />
      <el-table-column label="文件 URL" align="center" prop="url" />
      <el-table-column label="文件类型" align="center" prop="type" />
      <el-table-column label="文件大小" align="center" prop="size" />
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" width="300" />
      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>

  <FileForm ref="formRef" />
</template>
