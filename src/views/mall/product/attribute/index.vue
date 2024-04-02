<script setup lang="ts">
import { dateFormatter } from '@/utils/date'
import * as ProductAttributeApi from '@/api/product/attribute'

defineOptions({ name: 'ProductAttribute' })

const aliveTable = ref()
</script>

<template>
  <div class="table-box">
    <AliveTable ref="aliveTable" :request-api="ProductAttributeApi.getAttributePage">
      <template #searchOne>
        <el-form-item prop="name">
          <el-input v-model="aliveTable.searchParam.name" placeholder="请输入属性名称" clearable />
        </el-form-item>
      </template>

      <el-table-column label="编号" align="center" prop="id" width="80" />
      <el-table-column label="所属商品" align="center" prop="productName" />
      <el-table-column label="属性名称" align="center" prop="name" />
      <el-table-column label="属性值" align="center" prop="value">
        <template #default="{ row }">
          <el-tag v-for="item in row.value" :key="item" style="margin-right: 6px; margin-bottom: 2px">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormatter" width="300" />
    </AliveTable>
  </div>
</template>
