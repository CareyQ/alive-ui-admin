<script lang="ts" setup>
import { RefreshRight, Plus, Search, MoreFilled } from '@element-plus/icons-vue'
import * as DictApi from '@/api/system/dict'
import DictTypeForm from './DictTypeForm.vue'
import DictDataForm from './DictDataForm.vue'

const dictTypeLoading = ref(false)
const dictDataLoading = ref(false)

const defaultCurrentKey = ref(null)
const treeData = ref<any>([])

const treeRef = ref()
const dictTypeFormRef = ref()
const dictDataFormRef = ref()

const getDictTypeList = async () => {
  dictTypeLoading.value = dictDataLoading.value = true
  try {
    const data = await DictApi.getDictType()
    if (!data || data.length <= 0) {
      return
    }
    treeData.value = data
    nextTick(() => {
      defaultCurrentKey.value = data[0].id
      treeRef.value.setCurrentKey(data[0].id)
    })
  } finally {
    dictTypeLoading.value = dictDataLoading.value = false
  }
}

const openDictTypeForm = (id?: number) => {
  dictTypeFormRef.value.open(id)
}

const openDictDataForm = (id?: number) => {
  dictDataFormRef.value.open(id)
}

onMounted(() => {
  getDictTypeList()
})
</script>

<template>
  <div class="page page-split">
    <div class="page-left">
      <div>
        <el-button type="info" :icon="RefreshRight" />
        <el-button type="primary" :icon="Plus" @click="openDictTypeForm(undefined, 'dictType')">
          新增类型
        </el-button>
      </div>

      <el-input placeholder="输入字典类型搜索" />

      <el-tree
        ref="treeRef"
        v-loading="dictTypeLoading"
        :data="treeData"
        :props="{ label: 'name' }"
        node-key="id"
        :current-node-key="defaultCurrentKey"
        highlight-current
      >
        <template #default="{ node }">
          <span class="custom-tree-node flex-center-between">
            <span>{{ node.label }}</span>
            <el-dropdown>
              <el-icon><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </template>
      </el-tree>
    </div>

    <div class="page-right">
      <el-form class="table-header" inline>
        <el-form-item>
          <el-button type="primary" :icon="Plus" @click="openDictDataForm">添加数据</el-button>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="输入字典标签搜索" :suffix-icon="Search" />
        </el-form-item>
        <el-form-item>
          <el-input placeholder="选择字典标签状态" />
        </el-form-item>
      </el-form>
    </div>
  </div>

  <DictTypeForm ref="dictTypeFormRef" />
  <DictDataForm ref="dictDataFormRef" />
</template>

<style lang="scss" scoped>
.dict-data {
  width: calc(100% - 230px);
}
</style>
