<script lang="ts" setup>
import { RefreshRight, Plus, Search, MoreFilled, Refresh } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useDictStoreWithOut } from '@/store/modules/dict'
import * as DictApi from '@/api/system/dict'
import DictTypeForm from './DictTypeForm.vue'
import DictDataForm from './DictDataForm.vue'

const message = useMessage()
const dictStore = useDictStoreWithOut()

const dictTypeLoading = ref(false)
const dictDataLoading = ref(false)

const selectDictType = ref<DictApi.DictType | null>(null)
const treeData = ref<any>([])
const tableData = ref<any>([])

const treeRef = ref()
const dictTypeFormRef = ref()
const dictDataFormRef = ref()
const queryFormRef = ref()

const total = ref(0)

const getDictTypeList = async () => {
  dictTypeLoading.value = true
  try {
    const data = await DictApi.getDictTypeList()
    if (!data || data.length <= 0) {
      return
    }
    treeData.value = data
  } finally {
    dictTypeLoading.value = false
  }
}

const queryParams = reactive({
  current: 1,
  size: 10,
  label: '',
  dictType: '',
  status: undefined
})

const resetQuery = async () => {
  queryFormRef.value.resetFields()
  selectDictType.value = null
  queryParams.current = 1
  await getDictDataPage()
}

const getDictDataPage = async () => {
  dictDataLoading.value = true
  try {
    queryParams.dictType = selectDictType.value?.type || ''
    const data = await DictApi.getDictDataPage(queryParams)
    tableData.value = data.records
    total.value = data.total
  } finally {
    dictTypeLoading.value = false
  }
  dictDataLoading.value = false
}

const openDictTypeForm = (id?: number) => {
  dictTypeFormRef.value.open(id)
}

const openDictDataForm = (id?: number) => {
  dictDataFormRef.value.open(id, selectDictType.value)
}

const handleDropClick = (event: string, node: any) => {
  if (event === 'edit') {
    openDictTypeForm(node.data.id)
  } else if (event === 'del') {
    handleDictTypeDel(node.data.id)
  }
}

const handleCurrentChange = (node) => {
  selectDictType.value = node
  getDictDataPage()
}

const refreshCache = () => {
  dictStore.resetDict()
}

const handleDictTypeDel = async (id: number) => {
  await message.delConfirm()
  await DictApi.delDictType(id)
  message.success('删除成功')
  await getDictTypeList()
  await resetQuery()
}

const handleDictDataDel = async (id: number) => {
  await message.delConfirm()
  await DictApi.delDictData(id)
  message.success('删除成功')
  await getDictDataPage()
}

onMounted(() => {
  getDictTypeList()
  getDictDataPage()
})
</script>

<template>
  <div class="page page-split">
    <div class="page-left">
      <div>
        <el-button type="info" :icon="RefreshRight" @click="getDictTypeList" />
        <el-button type="primary" :icon="Plus" @click="openDictTypeForm(undefined)">
          新增类型
        </el-button>
      </div>

      <el-input placeholder="输入字典类型搜索" />

      <el-tree
        ref="treeRef"
        v-loading="dictTypeLoading"
        :data="treeData"
        node-key="id"
        :props="{ label: 'name' }"
        highlight-current
        @current-change="handleCurrentChange"
      >
        <template #default="{ node }">
          <span class="custom-tree-node flex-center-between">
            <el-tooltip
              v-if="node.data.status === 0"
              effect="dark"
              placement="top"
              content="已停用"
            >
              <Icon icon="mdi:cancel" color="var(--el-color-danger)" class="tree-disabled-icon" />
            </el-tooltip>

            <span>{{ node.label }}</span>
            <el-dropdown @command="handleDropClick($event, node)">
              <el-icon><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </template>
      </el-tree>
    </div>

    <div class="page-right">
      <el-form ref="queryFormRef" class="table-header" :model="queryParams" inline>
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="queryParams.label" placeholder="请输入字典标签" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="getDictDataPage">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="table-header">
        <el-button type="info" :icon="RefreshRight" @click="getDictDataPage" />
        <el-button type="primary" :icon="Plus" @click="openDictDataForm(undefined)">
          添加数据
        </el-button>
        <el-button type="warning" :icon="Refresh" @click="refreshCache">刷新字典缓存</el-button>
      </div>

      <el-table
        ref="tableRef"
        v-loading="dictDataLoading"
        :data="tableData"
        border
        stripe
        show-overflow-tooltip
        class="data-table"
      >
        <el-table-column label="字典标签" prop="label" width="200" />
        <el-table-column label="字典键值" prop="value" width="200" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column align="center" label="状态" prop="status" width="120">
          <template #default="scope">
            <el-tag
              v-model="scope.row.status"
              :active-value="1"
              :type="scope.row.status === 1 ? 'success' : 'danger'"
            >
              {{ scope.row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openDictDataForm(scope.row.id)">
              编辑
            </el-button>
            <el-divider direction="vertical" />
            <el-button link type="danger" size="small" @click="handleDictDataDel(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        v-model:limit="queryParams.size"
        v-model:page="queryParams.current"
        :total="total"
        @pagination="getDictDataPage"
      />
    </div>
  </div>

  <DictTypeForm ref="dictTypeFormRef" @success="getDictTypeList" />
  <DictDataForm ref="dictDataFormRef" @success="getDictDataPage" />
</template>

<style lang="scss" scoped>
.dict-data {
  width: calc(100% - 230px);
}
</style>
