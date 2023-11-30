<script setup lang="ts">
import { RefreshRight, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/date'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as PostApi from '@/api/system/post'
import PostForm from './PostForm.vue'

defineOptions({ name: 'SystemPost' })

const message = useMessage()

const tableLoading = ref(false)
const tableData = ref<any>([])
const formRef = ref()
const queryFormRef = ref()
const total = ref(0)

const queryParams = reactive({
  current: 1,
  size: 10,
  name: '',
  status: undefined
})

const getPostPage = async () => {
  tableLoading.value = true
  try {
    const data = await PostApi.getPage(queryParams)
    tableData.value = data.records
    total.value = data.total
  } finally {
    tableLoading.value = false
  }
}

const openForm = (id?: number) => {
  formRef.value.open(id)
}

const handleDel = async (id: number) => {
  await message.delConfirm()
  await PostApi.del(id)
  message.success('删除成功')
  await getPostPage()
}

const resetQuery = async () => {
  queryFormRef.value.resetFields()
  await getPostPage()
}

onMounted(() => {
  getPostPage()
})
</script>

<template>
  <div class="page">
    <el-form ref="queryFormRef" class="table-header" :model="queryParams" inline>
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入岗位名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="(item, index) in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getPostPage">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table-header">
      <el-button type="info" :icon="RefreshRight" @click="getPostPage" />
      <el-button type="primary" :icon="Plus" @click="openForm(undefined)">添加岗位</el-button>
    </div>

    <el-table
      ref="tableRef"
      v-loading="tableLoading"
      :data="tableData"
      border
      stripe
      show-overflow-tooltip
    >
      <el-table-column align="center" label="岗位名称" prop="name" width="300" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="状态" prop="status" width="150">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="1" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
        :formatter="dateFormatter"
        width="300"
      />

      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openForm(row.id)"> 编辑 </el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getPostPage"
    />
  </div>
  <PostForm ref="formRef" @success="getPostPage" />
</template>

<style scoped></style>
