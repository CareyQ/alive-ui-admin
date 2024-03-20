<script lang="ts" setup>
import { type ProductDTO } from '@/api/product/product'
import { getBrandList } from '@/api/product/brand'
import * as ProductCategoryApi from '@/api/product/category'
import UploadImg from '@/components/Upload/UploadImg.vue'
import Editor from '@/components/Editor/Editor.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ProductDTO>,
    required: true
  }
})

const formRef = ref()
const formData = props.modelValue
const formRules = reactive({
  name: [
    { required: true, message: '商品名称不能为空', trigger: 'change' },
    { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
  ],
  categoryId: [{ required: true, message: '商品分类不能为空', trigger: 'change' }],
  subTitle: [{ required: true, message: '副标题不能为空', trigger: 'blur' }],
  brandId: [{ required: true, message: '商品品牌不能为空', trigger: 'change' }],
  snCode: [{ required: true, message: '商品编码不能为空', trigger: 'blur' }],
  pic: [{ required: true, message: '封面图不能为空', trigger: 'blur' }],
  unit: [{ required: true, message: '计量单位不能为空', trigger: 'blur' }]
})
const categoryTree = ref()
const brandList = ref()
const activeHtmlName = ref('pc')

const handelPic = (val: string) => {
  formData.pic = val
}

const emit = defineEmits(['next'])
const handleNext = async () => {
  const valid = await formRef.value?.validate()
  console.log(valid)

  if (!valid) {
    return
  }
  emit('next', formData)
}

const getInitData = async () => {
  categoryTree.value = await ProductCategoryApi.getTree()
  brandList.value = await getBrandList()
}

onMounted(() => {
  getInitData()
})
</script>

<template>
  <div style="margin-top: 50px">
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品分类" prop="categoryId">
            <el-cascader
              v-model="formData.categoryId"
              :options="categoryTree"
              :props="{ label: 'name', value: 'id', emitPath: false }"
              clearable
              placeholder="请选择商品分类"
              filterable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item label="副标题" prop="subTitle">
            <el-input v-model="formData.subTitle" placeholder="请输入副标题" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品品牌" prop="brandId">
            <el-select v-model="formData.brandId" placeholder="请选择商品品牌">
              <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
              :folder="'product'"
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

        <el-col>
          <el-form-item label="商品详情：">
            <el-tabs v-model="activeHtmlName" type="border-card">
              <el-tab-pane label="电脑端详情" name="pc">
                <Editor v-if="activeHtmlName === 'pc'" v-model:value="formData.detailHtml" />
              </el-tab-pane>
              <el-tab-pane label="移动端详情" name="mobile">
                <Editor v-if="activeHtmlName === 'mobile'" v-model:value="formData.detailMobileHtml" />
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
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
