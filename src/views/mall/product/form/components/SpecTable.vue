<script setup lang="ts">
import UploadImg from '@/components/Upload/UploadImg.vue'

const props = defineProps({
  specTableData: {
    type: Array,
    required: true,
    default: () => []
  },
  tableHeaders: {
    type: Array as PropType<{ prop: string; label: string }[]>,
    required: true,
    default: () => []
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const amountInput = (value: string | number) => {
  const numValue = Number.parseFloat(value as string)
  return !isNaN(numValue) ? numValue.toFixed(2) : ''
}

const otherInput = (value: string | number) => {
  const numValue = Number.parseFloat(value as string)
  return !isNaN(numValue) ? numValue.toFixed(4).replace(/\.?0+$/, '') : ''
}

const integerInput = (value: string | number) => {
  const numValue = Number.parseInt(value as string, 10)
  return !isNaN(numValue) ? numValue.toString() : ''
}
</script>

<template>
  <el-table :data="props.specTableData" border>
    <el-table-column align="center" label="图片" min-width="110">
      <template #default="{ row }">
        <UploadImg v-model:image-url="row.pic" :file-size="3" height="80px" width="80px" :folder="'product'" />
      </template>
    </el-table-column>
    <el-table-column
      v-for="(item, index) in props.tableHeaders"
      :key="index"
      :label="item.label"
      align="center"
      min-width="80"
    >
      <template #default="{ row }">
        {{ row.spec[index]?.value }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="商品编号" min-width="80" v-if="isEdit">
      <template #default="{ row }">
        {{ row.snCode }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="价格/元" min-width="80">
      <template #default="{ row }">
        <el-input v-model="row.price" :formatter="amountInput" />
      </template>
    </el-table-column>
    <el-table-column align="center" label="库存" min-width="80">
      <template #default="{ row }">
        <el-input v-model="row.stock" :formatter="integerInput" />
      </template>
    </el-table-column>
    <el-table-column align="center" label="重量/KG" min-width="80">
      <template #default="{ row }">
        <el-input v-model="row.weight" :formatter="otherInput" />
      </template>
    </el-table-column>
    <el-table-column align="center" label="体积/m³" min-width="80">
      <template #default="{ row }">
        <el-input v-model="row.volume" :formatter="otherInput" />
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
:deep(.el-upload) {
  margin: 0 auto;
}

:deep(.el-upload__tip) {
  display: none;
}
</style>
