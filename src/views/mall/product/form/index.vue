<script lang="ts" setup>
import type { ProductSkuDTO } from '@/api/product/product'
import * as ProductApi from '@/api/product/product'
import { useNavTabStore } from '@/store/modules/navTab'
import ProductInfo from './ProductInfo.vue'
import SaleDetail from './SaleDetail.vue'
import AttrDetail from './AttrDetail.vue'

defineOptions({ name: 'ProductForm' })

const { closeTab } = useNavTabStore()
const message = useMessage()
const { push, currentRoute } = useRouter()
const { params } = useRoute()
const active = ref(0)
const showStatus = ref([true, false, false])

const defaultData: ProductApi.ProductDTO = {
  id: undefined,
  categoryId: undefined,
  brandId: undefined,
  name: undefined,
  slidePic: undefined,
  status: 0,
  sort: 0,
  price: undefined,
  stock: undefined,
  unit: undefined,
  detailHtml: '',
  detailMobileHtml: '',
  giftPoint: undefined,
  giftGrowth: undefined,
  usePointLimit: undefined,
  newStatus: false,
  recommendStatus: false,
  service: undefined,
  subTitle: undefined,
  keyword: undefined,
  skus: []
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
}

const prevStep = () => {
  if (active.value > 0 && active.value < showStatus.value.length) {
    active.value--
    hideAll()
    showStatus.value[active.value] = true
  }
}

const submitLoading = ref(false)
const submit = async (skus?: ProductSkuDTO[]) => {
  submitLoading.value = true
  try {
    productData.value.skus = skus

    if (productData.value.id) {
      await ProductApi.updateProduct(productData.value)
    } else {
      await ProductApi.createProduct(productData.value)
    }
    message.success('保存成功')
    push({ name: 'ProductList' })
    closeTab(unref(currentRoute))
  } finally {
    submitLoading.value = false
  }
}

const getDetail = async (id: number) => {
  if (id) {
    productData.value = await ProductApi.getDetail(id)
  }
}

onBeforeRouteUpdate((to, from) => {
  if (to.params.id !== from.params.id) {
    const id = to.params.id as unknown as number
    getDetail(id)
  }
})

onMounted(async () => {
  const id = params.id as unknown as number
  await getDetail(id)
})
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
        :submitLoading="submitLoading"
        @prev="prevStep"
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
