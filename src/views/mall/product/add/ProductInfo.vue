<script lang="ts" setup>
import { type ProductDTO } from '@/api/product/product'
import UploadImg from '@/components/Upload/UploadImg.vue'
import Editor from '@/components/Editor/Editor.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ProductDTO>,
    required: true
  }
})

const formData = props.modelValue

const activeHtmlName = ref('pc')

const handelPic = (val: string) => {
  console.log(val)

  formData.pic = val
}
</script>

<template>
  <div style="margin-top: 50px">
    <el-form ref="formRef" :model="formData" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品分类" prop="categoryId">
            <el-input v-model="formData.categoryId" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item label="副标题" prop="subTitle">
            <el-input v-model="formData.subTitle" placeholder="请输入副标题" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品品牌" prop="brandId">
            <el-input v-model="formData.brandId" placeholder="请输入商品名称" />
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

        <el-col>
          <el-form-item label="商品详情：">
            <el-tabs v-model="activeHtmlName" type="card">
              <el-tab-pane label="电脑端详情" name="pc">
                <Editor v-model:value="formData.detailHtml" />
              </el-tab-pane>
              <el-tab-pane label="移动端详情" name="mobile">
                <Editor v-model:value="formData.detailMobileHtml" />
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
