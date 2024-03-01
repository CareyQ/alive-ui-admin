<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE } from '@/utils/dict'
import * as OssConfigApi from '@/api/infra/file'
import OssConfigForm from './OssConfigForm.vue'

defineOptions({ name: 'OssConfig' })

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
  return OssConfigApi.getOssConfigPage(newParams)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await OssConfigApi.delOssConfig(id)
  message.success('删除成功')
  await aliveTable.value.getTableList()
}
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getTableList">
      <template #search>
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入配置名称" clearable />
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
        <el-button type="primary" :icon="Plus" @click="openForm()">添加对象存储配置</el-button>
      </template>

      <el-table-column label="配置名称" align="center" prop="name" />
      <el-table-column label="桶名称" align="center" prop="bucket" />
      <el-table-column label="访问站点" align="center" prop="endpoint" />
      <el-table-column label="域" align="center" prop="region" />
      <el-table-column label="主配置" align="center" prop="master">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.TRUE_OR_FALSE" :value="row.master" />
        </template>
      </el-table-column>
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
  <OssConfigForm ref="formRef" />
</template>
