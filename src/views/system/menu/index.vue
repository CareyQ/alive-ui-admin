<script lang="ts" setup>
import * as MenuApi from '@/api/system/menu'
import { isEmpty, sortBy } from 'lodash-es'
import { DICT_TYPE } from '@/utils/dict'
import { RefreshRight, Plus, Refresh, MoreFilled } from '@element-plus/icons-vue'
import { filterTree } from '@/utils/tree'
import MenuForm from './MenuForm.vue'
import { CACHE_KEY, useCache } from '@/hooks/useCache'

const { wsCache } = useCache()
const message = useMessage()

defineOptions({ name: 'SystemMenu' })

const treeLoading = ref(true)
const tableLoading = ref(true)
const treeRef = ref()
const tableRef = ref()
const formRef = ref()

const treeFilter = ref('')
const treeAll = ref<any>([])
const treeData = ref<any>([])
const defaultCurrentKey = ref('')
const tableData = ref<any>([])

const getList = async () => {
  tableLoading.value = treeLoading.value = true
  try {
    const data = await MenuApi.getMenuTree()
    if (!data || data.length <= 0) {
      return
    }
    treeData.value = filterTree(data, 2)
    treeAll.value = data
    nextTick(() => {
      if (!defaultCurrentKey.value) {
        defaultCurrentKey.value = data[0].id
      }
      treeRef.value.setCurrentKey(defaultCurrentKey.value)
    })
  } finally {
    tableLoading.value = treeLoading.value = false
  }
}

const handleCurrentChange = (node) => {
  defaultCurrentKey.value = node.id
  tableLoading.value = true
  try {
    const rootNode = findTargetNode(treeAll.value, node.id)
    if (rootNode && !isEmpty(rootNode.children)) {
      tableData.value = sortBy(filterAllMenu(rootNode.children), ['sort'])
    } else {
      tableData.value = []
    }
  } finally {
    tableLoading.value = false
  }
}

const findTargetNode = (treeList: any, targetId: number): any => {
  for (const node of treeList) {
    if (node.id === targetId) {
      return node
    }
    if (node.children) {
      const foundNode = findTargetNode(node.children, targetId)
      if (foundNode) {
        return foundNode
      }
    }
  }
}

const filterAllMenu = (treeList: any[]): any[] => {
  let res: any[] = []
  treeList.map((node) => {
    if (node.type === 3) {
      res.push(node)
    }
    if (!isEmpty(node.children)) {
      res.push(...filterAllMenu(node.children))
    }
  })
  return res
}

const openForm = (id?: number) => {
  formRef.value.open(id)
}

const handleDropClick = (event: string, node: any) => {
  if (event === 'edit') {
    openForm(node.data.id)
  }
}

const refershCache = async () => {
  try {
    await message.confirm('即将更新菜单缓存', '刷新菜单缓存')
    wsCache.delete(CACHE_KEY.USER)
    wsCache.delete(CACHE_KEY.ROUTERS)
    location.reload()
  } catch {}
}

watch(treeFilter, (val: string) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="page page-split">
    <div class="page-left">
      <el-input v-model="treeFilter" placeholder="输入菜单名搜索" clearable />
      <el-tree
        ref="treeRef"
        v-loading="treeLoading"
        :data="treeData"
        :props="{ label: 'name' }"
        node-key="id"
        :current-node-key="defaultCurrentKey"
        :filter-node-method="filterNode"
        @current-change="handleCurrentChange"
        highlight-current
        default-expand-all
      >
        <template #default="{ node }">
          <span class="custom-tree-node flex-center-between">
            <div>
              <span>{{ node.label }}</span>
              <span v-if="node.data.status === 0" style="color: var(--el-color-danger)"> [停用] </span>
            </div>
            <el-dropdown @command="handleDropClick($event, node)">
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
      <div class="table-header">
        <el-button type="info" :icon="RefreshRight" @click="getList" />
        <el-button type="primary" :icon="Plus" @click="openForm()">添加菜单</el-button>
        <el-button type="warning" :icon="Refresh" @click="refershCache">刷新菜单缓存</el-button>
      </div>

      <el-table
        ref="tableRef"
        v-loading="tableLoading"
        :data="tableData"
        border
        stripe
        show-overflow-tooltip
        class="menu-table"
      >
        <el-table-column label="菜单名称" prop="name" width="150" />
        <el-table-column align="center" label="权限标识" prop="permission" width="150" />
        <el-table-column align="center" label="路由" prop="path" width="100" />
        <el-table-column align="center" label="排序" prop="sort" width="80" />
        <el-table-column align="center" label="缓存" prop="keepAlive" width="80">
          <template #default="scope">
            <el-switch v-model="scope.row.keepAlive" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="status" width="80">
          <template #default="{ row }">
            <Tag :type="DICT_TYPE.COMMON_STATUS" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限">
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
              v-for="item in scope.row.children"
              :key="item.id"
            >
              <template #default>
                <div>权限标识: {{ item.permission || '暂无' }}</div>
              </template>
              <template #reference>
                <el-tag class="menu-tag" closable @click="openForm(item.id)">
                  {{ item.name }}
                </el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template #default="scope">
            <el-button link type="primary" size="small">新增权限</el-button>
            <el-divider direction="vertical" />
            <el-button link type="primary" size="small" @click="openForm(scope.row.id)"> 编辑 </el-button>
            <el-divider direction="vertical" />
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <MenuForm ref="formRef" @success="getList" />
</template>

<style lang="scss" scoped>
.custom-tree-node {
  width: 100%;
  .el-icon {
    margin-right: 10px;
    outline: none;
  }
}

.menu-tag {
  margin-right: 6px;
  margin-bottom: 2px;
  cursor: pointer;
  &:hover {
    background-color: var(--el-color-primary-light-7);
  }
}
</style>

<style lang="scss">
.menu-table {
  .el-tag.menu-tag.is-closable {
    padding-right: 9px;
    .el-icon {
      display: none;
    }
    &:hover {
      padding-right: 5px;
      .el-icon {
        display: inline-flex;
      }
    }
  }
}
</style>
