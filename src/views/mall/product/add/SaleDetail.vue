<script lang="ts" setup>
import { type ProductDTO } from '@/api/product/product'
import UploadImg from '@/components/Upload/UploadImg.vue'
import * as ProductAttributeApi from '@/api/product/attribute'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ProductDTO>,
    required: true
  }
})

const message = useMessage()
const formRef = ref()
const attributeGroupList = ref()
const attributeList = ref()
const attributeParams = ref()
const formData = props.modelValue
const formRules = reactive({
  attributeGroupId: [{ required: true, message: '属性类型不能为空', trigger: 'change' }]
})

const handelPic = (val: string) => {
  formData.pic = val
}

const emit = defineEmits(['next'])
const handleNext = () => {
  emit('next', formData)
}

const getInitData = async () => {
  attributeGroupList.value = await ProductAttributeApi.getAttributeGroupList(props.modelValue.categoryId!)
  if (attributeGroupList.value.length === 0) {
    message.warning('该商品分类下暂无属性类型')
  }
}

const getAttributeList = async (groupId: number, type: number) => {
  const res = await ProductAttributeApi.getAttributeList(groupId, type)
  console.log(res)
}

const handleGroupChange = (groupId: number) => {
  getAttributeList(groupId, 0)
  getAttributeList(groupId, 1)
}

onMounted(() => {
  getInitData()
})
</script>

<template>
  <div style="margin-top: 50px">
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="属性类型" prop="attributeGroupId">
            <el-select v-model="formData.attributeGroupId" placeholder="请选择属性类型" @change="handleGroupChange">
              <el-option v-for="item in attributeGroupList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="赠送积分" prop="giftPoint">
            <el-input v-model="formData.giftPoint" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="赠送成长值" prop="giftGrowth">
            <el-input v-model="formData.giftGrowth" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="积分使用限制" prop="usePointLimit">
            <el-input v-model="formData.usePointLimit" />
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item label="关键字" prop="keyword">
            <el-input v-model="formData.keyword" placeholder="请输入关键字" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品编码" prop="snCode">
            <el-input v-model="formData.snCode" placeholder="请输入商品编码" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="封面图" prop="pic">
            <UploadImg
              v-model:image-url="formData.pic"
              :file-size="3"
              height="120px"
              width="180px"
              @update:image-url="handelPic"
            />
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="计量单位" prop="unit">
                <el-input v-model="formData.unit" placeholder="请输入商品计量单位" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="价格" prop="price">
                <el-input v-model="formData.price" placeholder="默认取属性最低价" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="市场价" prop="marketPrice">
                <el-input v-model="formData.marketPrice" placeholder="默认取属性最低市场价" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="商品简介" prop="intro">
                <el-input type="textarea" :rows="3" v-model="formData.intro" placeholder="请输入商品简介" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-form-item style="text-align: center">
        <el-button type="primary" @click="handleNext">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  padding: 15px 0 0;
}
</style>
