<script lang="ts" setup name="AliveTable">
import { Search, Delete, RefreshRight } from '@element-plus/icons-vue'
import { useTable } from '@/hooks/useTable'
import { handleTree } from '@/utils/tree'

export interface AliveTableProps {
  data?: any[] // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => Promise<any> // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (params: any) => void // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  pagination?: boolean // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any // 初始化请求参数 ==> 非必传（默认为{}）
  refersh?: boolean
  treeData?: boolean
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<AliveTableProps>(), {
  requestAuto: true,
  refersh: true,
  pagination: true,
  initParam: {},
  treeData: false
})

const tableRef = ref()
const hasSearch = ref(false)
const hasOneSearch = ref(false)
// 是否显示搜索模块
const isShowSearch = ref(false)

// 表格操作 Hooks
const {
  loading,
  tableData,
  pageable,
  searchParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange
} = useTable(props.requestApi, props.initParam, props.dataCallback, props.requestError)

// 初始化表格数据
onMounted(() => {
  props.requestAuto && getTableList()
  hasSearch.value = !!useSlots().search
  hasOneSearch.value = !!useSlots().searchOne
  props.data && (pageable.value.total = props.data.length)
})

// 处理表格数据
const processTableData = computed(() => {
  if (!props.data) {
    if (!props.treeData) {
      return tableData.value
    }
    return handleTree(tableData.value, 'id', 'parentId')
  }
  if (!props.pagination) {
    return props.data
  }
  return props.data.slice(
    (pageable.value.current - 1) * pageable.value.size,
    pageable.value.size * pageable.value.current
  )
})

defineExpose({
  element: tableRef,
  tableData: processTableData,
  pageable,
  searchParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange
})
</script>

<template>
  <!-- 表格搜索 -->
  <transition name="el-zoom-in-bottom" mode="out-in">
    <el-form ref="formRef" :model="searchParam" class="alive-search card" v-if="hasSearch && isShowSearch" inline>
      <slot name="search"></slot>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="search"> 搜索 </el-button>
        <el-button :icon="Delete" @click="reset"> 重置 </el-button>
      </el-form-item>
    </el-form>
  </transition>

  <!-- 表格主体 -->
  <div class="alive-table card">
    <!-- 表格头 -->
    <div class="table-header flex-center-between">
      <!-- 表格头左侧操作栏 -->
      <div class="table-header-lf">
        <el-button type="info" :icon="RefreshRight" @click="getTableList" v-if="refersh" />
        <slot name="operation"></slot>
      </div>

      <!-- 表格头右侧工具栏 -->
      <div class="table-header-ri" v-if="hasSearch || hasOneSearch">
        <el-form v-if="hasOneSearch" ref="formRef" :model="searchParam" style="display: flex">
          <slot name="searchOne"></slot>
          <el-form-item style="margin-left: 10px">
            <el-button type="primary" :icon="Search" @click="search" />
          </el-form-item>
        </el-form>
        <el-button v-else @click="isShowSearch = !isShowSearch">
          {{ isShowSearch ? '折叠搜索' : '展开搜索' }}
        </el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="processTableData"
      v-loading="loading"
      row-key="id"
      border
      show-overflow-tooltip
    >
      <!-- 默认插槽 -->
      <slot></slot>
      <!-- 无数据 -->
      <template #empty>
        <el-empty :image-size="200" description="暂无数据" />
      </template>
    </el-table>
    <!-- 分页组件 -->
    <Pagination
      v-if="pagination"
      :pageable="pageable"
      :handle-size-change="handleSizeChange"
      :handle-current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.alive-table {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: 16px;
}

.alive-search {
  padding: 13px 15px 0 15px;
  margin-bottom: 13px;
}

.el-table {
  flex: 1;
}
</style>

<style lang="scss">
.alive-search.el-form--inline {
  .el-form-item {
    margin-bottom: 13px;
  }
}

.alive-table {
  .el-table__header th {
    background-color: var(--el-fill-color-light);
  }
}
</style>

<style lang="scss">
.alive-table {
  .table-header-ri {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
