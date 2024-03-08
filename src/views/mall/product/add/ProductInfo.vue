<script lang="ts" setup>
import { type ProductDTO } from '@/api/product/product'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ProductDTO>,
    required: true
  }
})

const formData = props.modelValue
</script>

<template>
  <div style="margin-top: 50px">
    <el-form ref="formRef" :model="formData" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品分类" prop="categoryId">
            <el-input v-model="formData.categoryId" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品品牌" prop="brandId">
            <el-input v-model="formData.brandId" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="副标题" prop="subTitle">
            <el-input v-model="formData.subTitle" placeholder="请输入副标题" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品编码" prop="snCode">
            <el-input v-model="formData.snCode" placeholder="请输入商品编码" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计量单位" prop="unit">
            <el-input v-model="formData.unit" placeholder="请输入商品计量单位" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="关键字" prop="keyword">
            <el-input v-model="formData.keyword" placeholder="请输入关键字" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="价格" prop="price">
            <el-input v-model="formData.price" placeholder="请输入价格" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="市场价" prop="marketPrice">
            <el-input v-model="formData.marketPrice" placeholder="请输入市场价" />
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item label="商品简介" prop="intro">
            <el-input type="textarea" :rows="3" v-model="formData.intro" placeholder="请输入商品简介" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="封面图" prop="pic">
            <el-input v-model="formData.pic" placeholder="请输入价格" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
