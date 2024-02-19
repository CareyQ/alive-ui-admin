<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as DeptApi from '@/api/system/dept'
import DeptForm from './DeptForm.vue'

defineOptions({ name: 'SystemDept' })

const aliveTable = ref()
const message = useMessage()
const formRef = ref()
const openForm = (id?: number) => {
  formRef.value.open(id, aliveTable.value.getTableList)
}

const handleDel = async (id: number) => {
  try {
    await message.delConfirm()
    await DeptApi.del(id)
    message.success('删除成功')
    await aliveTable.value.getTableList()
  } catch {}
}
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="DeptApi.getList" :pagination="false">
      <template #search>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入部门名称" clearable />
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

      <el-table-column label="部门名称" prop="name" />
      <el-table-column align="center" label="负责人" prop="managerName" />
      <el-table-column align="center" label="联系电话" prop="mobile" />
      <el-table-column align="center" label="排序" prop="sort" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="{ row }">
          <Tag :type="DICT_TYPE.COMMON_STATUS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark" />

      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </AliveTable>
  </div>
  <DeptForm ref="formRef" />
</template>
