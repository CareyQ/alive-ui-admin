<script lang="ts" setup>
import { type ProductDTO } from '@/api/product/product'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ProductDTO>,
    required: true
  }
})

const formRef = ref()

const formData = computed(() => props.modelValue)
const formRules = reactive({
  sort: [{ required: true, message: '排序不能为空', trigger: 'change' }],
  status: [{ required: true, message: '上架状态不能为空', trigger: 'change' }]
})

const emit = defineEmits(['next', 'prev'])
const handleNext = () => {
  emit('next', formData.value)
}

const handlePrev = () => {
  emit('prev')
}
</script>

<template>
  <div style="width: 70%; margin: 50px auto 0">
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
      <el-form-item label="赠送积分" prop="giftPoint">
        <el-input v-model="formData.giftPoint" />
      </el-form-item>
      <el-form-item label="赠送成长值" prop="giftGrowth">
        <el-input v-model="formData.giftGrowth" />
      </el-form-item>
      <el-form-item label="积分使用限制" prop="usePointLimit">
        <el-input v-model="formData.usePointLimit" />
      </el-form-item>
      <el-form-item label="商品上架" prop="status">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="商品推荐">
        <div>
          新品
          <el-switch
            v-model="formData.newStatus"
            :active-value="true"
            :inactive-value="false"
            style="margin: 0 20px 0 8px"
          />
        </div>
        <div>
          推荐
          <el-switch
            v-model="formData.recommendStatus"
            :active-value="true"
            :inactive-value="false"
            style="margin: 0 20px 0 8px"
          />
        </div>
      </el-form-item>
      <el-form-item label="服务保障">
        <el-checkbox-group v-model="formData.serviceIds">
          <el-checkbox label="无忧退货" :value="1" />
          <el-checkbox label="极速退款" :value="2" />
          <el-checkbox label="免费包邮" :value="3" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" @click="handleNext">下一步，填写商品属性</el-button>
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
