<script lang="ts" setup name="Pagination">
import type { Pageable } from '@/hooks/useTable'

interface PaginationProps {
  pageable: Pageable
  handleSizeChange: (size: number) => void
  handleCurrentChange: (currentPage: number) => void
}

defineProps<PaginationProps>()
</script>

<template>
  <el-pagination
    :current-page="pageable.current"
    :page-size="pageable.size"
    :page-sizes="[10, 25, 50, 100]"
    :total="pageable.total"
    layout="total, prev, pager, next, sizes"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 15px;
  justify-content: flex-end;
}
</style>
