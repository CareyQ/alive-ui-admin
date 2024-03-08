<script lang="ts" setup>
import ProductInfo from './ProductInfo.vue'
import * as ProductApi from '@/api/product/product'

defineOptions({ name: 'ProductAdd' })

const active = ref(0)
const showStatus = ref([true, false, false])

const defaultData: ProductApi.ProductDTO = {
  id: undefined,
  categoryId: undefined,
  brandId: undefined,
  attributeGroupId: undefined,
  snCode: undefined,
  name: undefined,
  pic: undefined,
  status: undefined,
  sort: undefined,
  salesVolume: undefined,
  price: undefined,
  marketPrice: undefined,
  stock: undefined,
  unit: undefined,
  detailHtml: undefined,
  detailMobileHtml: undefined,
  giftPoint: undefined,
  giftGrowth: undefined,
  usePointLimit: undefined,
  subTitle: undefined,
  keyword: undefined,
  intro: undefined
}

const productData = ref<ProductApi.ProductDTO>(defaultData)
</script>

<template>
  <div class="card product-page">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="商品信息" />
      <el-step title="商品促销" />
      <el-step title="商品属性" />
    </el-steps>
    <ProductInfo v-show="showStatus[0]" v-model="productData" />
  </div>
</template>

<style lang="scss" scoped>
.product-page {
  padding: 30px;
}
</style>
