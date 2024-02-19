<script setup lang="ts">
import { Plus, EditPen, Delete } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getPage, del } from '@/api/system/post'
import PostForm from './PostForm.vue'

defineOptions({ name: 'SystemPost' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const handleDel = async (id: number) => {
  try {
    await message.delConfirm()
    await del(id)
    message.success('删除成功')
    await aliveTable.value.getTableList()
  } catch {}
}
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="getPage">
      <template #search>
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入岗位名称" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="aliveTable.searchParam.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="(item, index) in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <template #operation>
        <el-button type="primary" :icon="Plus" @click="openForm()">添加岗位</el-button>
      </template>

      <el-table-column align="center" label="岗位名称" prop="name" width="300" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="状态" prop="status" width="150">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.COMMON_STATUS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" width="300" />

      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button :icon="EditPen" link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-button :icon="Delete" link type="danger" size="small" @click="handleDel(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>
  <PostForm ref="formRef" />
</template>
