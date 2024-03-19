<script setup lang="ts">
import { type TableHeader } from '../AttrDetail.vue'

const props = defineProps({
  specTableData: {
    type: Array,
    required: true,
    default: () => []
  },
  tableHeaders: {
    type: Array as PropType<TableHeader[]>,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['imgOperation'])
const openImg = (row: any) => {
  emit('imgOperation', row)
}
</script>

<template>
  <div class="spec-table" style="width: 100%; margin-top: 20px">
    <el-table :data="props.specTableData" border>
      <el-table-column
        v-for="(item, index) in props.tableHeaders"
        :key="index"
        :label="item.label"
        align="center"
        min-width="120"
      >
        <template #default="{ row }">
          {{ row.spec[index]?.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品编号" min-width="140">
        <template #default="{ row }">
          <el-input v-model="row.skuCode" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template #default="{ row }">
          <el-input v-model="row.price" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="市场价">
        <template #default="{ row }">
          <el-input v-model="row.marketPrice" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存">
        <template #default="{ row }">
          <el-input v-model="row.stock" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="重量">
        <template #default="{ row }">
          <el-input v-model="row.weight" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="体积">
        <template #default="{ row }">
          <el-input v-model="row.volume" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button link size="small" type="primary" @click="openImg(row)"> 图片管理 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
