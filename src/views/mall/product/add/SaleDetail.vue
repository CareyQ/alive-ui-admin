<script lang="ts" setup>
import { type ProductDTO } from '@/api/product/product'
import * as ProductAttributeApi from '@/api/product/attribute'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ProductDTO>,
    required: true
  }
})

const message = useMessage()
const formRef = ref()

const selectProductParam = ref()
const formData = props.modelValue
const formRules = reactive({
  attributeGroupId: [{ required: true, message: '属性类型不能为空', trigger: 'change' }]
})

const emit = defineEmits(['next', 'prev'])
const handleNext = () => {
  emit('next', formData)
}

const handlePrev = () => {
  emit('prev')
}

watch(
  () => props.modelValue.categoryId,
  async (newVal) => {
    if (newVal) {
      selectProductParam.value = await ProductAttributeApi.getAttributeList(newVal)
    }
  }
)
</script>

<template>
  <div style="margin-top: 50px">
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="赠送积分" prop="giftPoint">
            <el-input v-model="formData.giftPoint" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="赠送成长值" prop="giftGrowth">
            <el-input v-model="formData.giftGrowth" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="积分使用限制" prop="usePointLimit">
            <el-input v-model="formData.usePointLimit" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item style="text-align: center">
        <el-button @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" @click="handleNext">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  padding: 15px 0 0;
}

.el-card {
  min-width: 50%;
  background-color: #fcfcfc;
}

.params-card {
  :deep(.el-card__body) {
    padding-top: 5px;
  }
}

.el-form-item {
  margin-bottom: 18px;
}

.spec {
  width: 100%;
}

.spec-item {
  padding-bottom: 20px;
  margin-top: 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.value-input {
  width: 80px;
}
</style>
