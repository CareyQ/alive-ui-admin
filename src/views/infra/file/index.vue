<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { fileSizeFormatter } from '@/utils'
import * as FileApi from '@/api/infra/file'
import UploadFile from './UploadFile.vue'
import FileDetail from './FileDetail.vue'

defineOptions({ name: 'FileList' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const detailRef = ref()
const folders = ref([])
const openForm = () => {
  formRef.value.open(aliveTable.value.getTableList)
}

const openDetail = (id: number) => {
  detailRef.value.open(id)
}

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.createDate && (newParams.startDate = newParams.createDate[0])
  newParams.createDate && (newParams.endDate = newParams.createDate[1])
  delete newParams.createDate
  return FileApi.getFilePage(newParams)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await FileApi.delFile(id)
  message.success('删除成功')
  await aliveTable.value.getTableList()
}

const getFileFolder = async () => {
  folders.value = await FileApi.getFileFolder()
}

onMounted(() => {
  getFileFolder()
})
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getTableList">
      <template #search>
        <el-form-item label="文件名" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入文件名" clearable />
        </el-form-item>
        <el-form-item label="文件目录" prop="folder">
          <el-select v-model="aliveTable.searchParam.folder" placeholder="请选择目录" clearable>
            <el-option v-for="(item, index) in folders" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传时间" prop="createTime">
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

      <el-table-column label="文件">
        <template #default="{ row }">
          <div>{{ row.name }}</div>
          <span style="font-size: 12px; color: rgb(107 114 128)">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件路径" align="center" prop="path" />
      <el-table-column label="文件大小" align="center" prop="size" :formatter="fileSizeFormatter" width="150" />
      <el-table-column align="center" label="上传时间" prop="createTime" :formatter="dateFormatter" width="220" />
      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openDetail(row.id)"> 详情 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>

  <UploadFile ref="formRef" />
  <FileDetail ref="detailRef" />
</template>
