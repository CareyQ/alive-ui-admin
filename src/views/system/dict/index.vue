<script lang="ts" setup>
import { RefreshRight, Plus, MoreFilled, Refresh } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useDictStoreWithOut } from '@/store/modules/dict'
import * as DictApi from '@/api/system/dict'
import DictTypeForm from './DictTypeForm.vue'
import DictDataForm from './DictDataForm.vue'

defineOptions({ name: 'SystemDcit' })

const aliveTable = ref()
const treeLoading = ref(true)
const message = useMessage()
const dictStore = useDictStoreWithOut()

const selectDictType = ref<DictApi.DictType | null>(null)
const treeData = ref<any>([])

const treeRef = ref()
const dictTypeFormRef = ref()
const dictDataFormRef = ref()
const treeFilter = ref('')

const getDictTypeList = async () => {
  treeLoading.value = true
  try {
    const data = await DictApi.getDictTypeList()
    if (!data || data.length <= 0) {
      return
    }
    treeData.value = data
    selectDictType.value = null
  } finally {
    treeLoading.value = false
  }
}

const openDictTypeForm = (id?: number) => {
  dictTypeFormRef.value.open(id)
}

const openDictDataForm = (id?: number) => {
  dictDataFormRef.value.open(id, selectDictType.value, aliveTable.value.getTableList)
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
  aliveTable.value.getTableList()
}

const getTableList = (params: any) => {
  if (selectDictType.value) {
    Object.assign(params, { dictType: selectDictType.value.type })
  }
  return DictApi.getDictDataPage(params)
}

const refreshCache = () => {
  dictStore.resetDict()
}

watch(treeFilter, (val: string) => {
  treeRef.value!.filter(val)
})

const handleDictTypeDel = async (id: number) => {
  await message.delConfirm()
  await DictApi.delDictType(id)
  message.success('删除成功')
  await getDictTypeList()
}

const handleDictDataDel = async (id: number) => {
  await message.delConfirm()
  await DictApi.delDictData(id)
  message.success('删除成功')
  await aliveTable.value.getTableList()
}

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

onMounted(() => {
  getDictTypeList()
})
</script>

<template>
  <div class="main-box dict-page">
    <div class="card tree-filter" style="width: 230px">
      <div style="margin-bottom: 15px">
        <el-button type="info" :icon="RefreshRight" @click="getDictTypeList" />
        <el-button type="primary" :icon="Plus" @click="openDictTypeForm(undefined)"> 新增类型 </el-button>
      </div>
      <el-input v-model="treeFilter" placeholder="输入字典类型搜索" clearable />
      <el-tree
        ref="treeRef"
        v-loading="treeLoading"
        :data="treeData"
        :props="{ label: 'name' }"
        node-key="id"
        :filter-node-method="filterNode"
        @current-change="handleCurrentChange"
        highlight-current
      >
        <template #default="{ node }">
          <span class="custom-tree-node flex-center-between">
            <el-tooltip v-if="node.data.status === 0" effect="dark" placement="top" content="已停用">
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

    <div class="table-box">
      <AliveTable ref="aliveTable" :request-api="getTableList">
        <template #search>
          <el-form-item label="字典标签" prop="label">
            <el-input v-model="aliveTable.queryParams.label" placeholder="请输入字典标签" clearable />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="aliveTable.queryParams.status" placeholder="请选择状态" clearable>
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
          <el-button type="primary" :icon="Plus" @click="openDictDataForm(undefined)"> 添加数据 </el-button>
          <el-button type="warning" :icon="Refresh" @click="refreshCache">刷新字典缓存</el-button>
        </template>

        <el-table-column label="字典标签" prop="label" />
        <el-table-column label="字典键值" prop="value" />
        <el-table-column label="备注" prop="remark" />

        <el-table-column align="center" label="颜色类型" prop="colorType">
          <template #default="{ row }">
            <el-tag :type="row.colorType === 'default' ? '' : row.colorType" v-if="row.colorType">
              {{ row.colorType }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态" prop="status">
          <template #default="{ row }">
            <Tag :type="DICT_TYPE.COMMON_STATUS" :value="row.status" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openDictDataForm(scope.row.id)"> 编辑 </el-button>
            <el-divider direction="vertical" />
            <el-button link type="danger" size="small" @click="handleDictDataDel(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </AliveTable>
    </div>
  </div>

  <DictTypeForm ref="dictTypeFormRef" @success="getDictTypeList" />
  <DictDataForm ref="dictDataFormRef" />
</template>

<style lang="scss">
.dict-page {
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 0;
  }
}
</style>
