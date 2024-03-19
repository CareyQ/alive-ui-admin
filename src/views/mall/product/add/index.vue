<script lang="ts" setup>
import * as ProductApi from '@/api/product/product'
import ProductInfo from './ProductInfo.vue'
import SaleDetail from './SaleDetail.vue'
import AttrDetail from './AttrDetail.vue'

defineOptions({ name: 'ProductAdd' })

const message = useMessage()
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
  detailHtml: '',
  detailMobileHtml: '',
  giftPoint: undefined,
  giftGrowth: undefined,
  usePointLimit: undefined,
  subTitle: undefined,
  keyword: undefined,
  intro: undefined
}

const productData = ref<ProductApi.ProductDTO>(defaultData)

const hideAll = () => {
  for (let i = 0; i < showStatus.value.length; i++) {
    showStatus.value[i] = false
  }
}

const nextStep = (value?: any) => {
  if (active.value < showStatus.value.length - 1) {
    active.value++
    hideAll()
    showStatus.value[active.value] = true
    Object.assign(productData.value, value)
  }
  console.log(productData.value)
}

const prevStep = () => {
  if (active.value > 0 && active.value < showStatus.value.length) {
    active.value--
    hideAll()
    showStatus.value[active.value] = true
  }
}

const submitLoading = ref(false)
const submit = (value?: any) => {
  submitLoading.value = true
  try {
    console.log(productData.value)
    console.log(value)
  } finally {
    submitLoading.value = false
  }
}
</script>

<template>
  <div class="card">
    <div class="product-page">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="商品信息" />
        <el-step title="商品促销" />
        <el-step title="商品属性" />
      </el-steps>
      <ProductInfo v-show="showStatus[0]" v-model="productData" @next="nextStep" />
      <SaleDetail v-show="showStatus[1]" v-model="productData" @prev="prevStep" @next="nextStep" />
      <AttrDetail
        v-show="showStatus[2]"
        v-model="productData"
        @prev="prevStep"
        :submitLoading="submitLoading"
        @submit="submit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-page {
  max-width: 1200px;
  padding: 30px 0;
  margin: 0 auto;
}
</style>
