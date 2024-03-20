<script lang="ts" setup>
import { type ProductDTO, ProductSkuDTO, ProductSpecDTO } from '@/api/product/product'
import * as ProductAttributeApi from '@/api/product/attribute'
import SpecDialog from './components/SpecDialog.vue'
import SpecTable from './components/SpecTable.vue'
import SpecImgDialog from './components/SpecImgDialog.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ProductDTO>,
    required: true
  },
  submitLoading: {
    type: Boolean,
    readonly: true
  }
})

const message = useMessage()
const formRef = ref()

const selectProductParam = ref()
const formData = props.modelValue

const emit = defineEmits(['submit', 'prev'])
const submit = () => {
  if (!specTableData.value || specTableData.value.length <= 0) {
    message.notifyError('商品 SKU 信息不能为空')
    return
  }
  const data = {
    spec: specAttributes.value,
    param: selectProductParam.value,
    sku: specTableData.value
  }
  emit('submit', data)
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

interface Sepc {
  id?: number
  name: string
  values: ProductAttributeApi.ProductAttributeValueDTO[]
}

const specAttributes = ref<Sepc[]>([])

// 规格
const specFormRef = ref()
const specImgRef = ref()
const openSpecForm = () => {
  specFormRef.value.open()
}

const imgOperation = (row: any) => {
  specImgRef.value.open(row)
}

/** 添加规格 */
const addSpec = async (specName: string) => {
  if (!specName || specName.length <= 0) {
    return
  }
  const isDuplicate = specAttributes.value.some((e) => {
    return e.name === specName
  })

  if (isDuplicate) {
    message.error('规格名称已存在')
    return
  }

  const spec = {
    id: undefined,
    name: specName,
    values: []
  }
  spec.id = await ProductAttributeApi.saveAttributeSpec(spec)

  specAttributes.value.push(spec)
  specFormRef.value.specDialogVisible = false
}

const attributeIndex = ref<number | null>(null)
const inputVisible = computed(() => (index: number) => {
  if (attributeIndex.value === null) return false
  if (attributeIndex.value === index) return true
})

const inputRef = ref()
const inputValue = ref('')
const showInput = async (index) => {
  attributeIndex.value = index
  inputRef.value[index].focus()
}

const handleInputConfirm = async (index: number, specId: number) => {
  if (!inputValue.value || inputValue.value.length <= 0) {
    return
  }
  const specValue = {
    id: undefined,
    attributeId: specId,
    value: inputValue.value
  }
  specValue.id = await ProductAttributeApi.saveAttributeValue(specValue)
  specAttributes.value[index].values.push(specValue)

  attributeIndex.value = null
  inputValue.value = ''
}

/** 删除属性值*/
const handleCloseValue = async (index: number, valueIndex: number, valueId: number) => {
  specAttributes.value[index].values?.splice(valueIndex, 1)
  await ProductAttributeApi.delAttributeValue(valueId)
}

/** 删除属性*/
const handleCloseSpec = async (index: number, specId: number) => {
  specAttributes.value?.splice(index, 1)
  await ProductAttributeApi.delAttribute(specId)
}

export interface TableHeader {
  prop: string
  label: string
}

const tableHeaders = ref<TableHeader[]>([])
const specTableData = ref<ProductSkuDTO[]>([])
const buildTableData = () => {
  if (specAttributes.value.length === 0) {
    message.error('请先添加规格')
    return
  }
  console.log('specAttributes.value', specAttributes.value)

  const list = [] as any[]
  for (let index = 0; index < specAttributes.value.length; index++) {
    const element = specAttributes.value[index]
    if (element.values.length === 0) {
      message.error(`请先添加[${element.name}]规格值`)
      return
    }
    const item = element.values.map((e) => {
      return {
        attributeId: element.id,
        attributeName: element.name,
        valueId: e.id,
        value: e.value
      }
    })
    list.push(item)
  }
  console.log('list', list)
  const result = cartesianProductOfArrays(list)
  specTableData.value = result.map((e: ProductSpecDTO[], index: number) => {
    const no = String(index).padStart(3, '0')
    return {
      uid: index,
      spec: e,
      skuCode: props.modelValue.snCode ? props.modelValue.snCode + no : no,
      price: 0,
      marketPrice: 0,
      stock: 0,
      albumPics: [],
      weight: 0,
      volume: 0
    }
  })
  console.log('tableData', specTableData.value)
}

const cartesianProductOfArrays = (arrays: any[][]) => {
  if (arrays.length === 0) {
    return [[]]
  }
  const [first, ...rest] = arrays

  const productsRest = cartesianProductOfArrays(rest)

  return first.flatMap((valueFirst) => productsRest.map((productRest) => [valueFirst, ...productRest]))
}

watch(
  () => specAttributes.value,
  () => {
    tableHeaders.value = specAttributes.value.map((item) => {
      return {
        prop: item.name,
        label: item.name
      }
    })
  },
  { deep: true, immediate: true }
)

const handleResult = (data: any) => {
  if (specTableData.value[data.uid]) {
    specTableData.value[data.uid].albumPics = data.imgs
  }
}
</script>

<template>
  <div style="margin-top: 50px">
    <el-form ref="formRef" :model="formData" label-width="100px">
      <el-form-item label="商品参数" prop="params">
        <el-card shadow="never" class="params-card">
          <el-tabs>
            <el-tab-pane :label="item.groupName" v-for="(item, index) in selectProductParam" :key="index">
              <el-form ref="form" label-width="auto">
                <el-form-item :label="paramItem.name" v-for="paramItem in item.attributes" :key="paramItem.id">
                  <el-select v-if="paramItem.inputType === 1" class="paramInput" v-model="paramItem.value">
                    <el-option
                      v-for="option in paramItem.inputList.split(',')"
                      :key="option"
                      :label="option"
                      :value="option"
                    />
                  </el-select>
                  <el-input v-else v-model="paramItem.value" class="paramInput" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-form-item>

      <el-form-item label="商品规格" prop="spec">
        <div class="spec">
          <div class="operation">
            <el-button @click="openSpecForm">添加规格</el-button>
            <el-button type="warning" @click="buildTableData" plain> 生成 SKU 表格 </el-button>
          </div>
          <div class="spec-item" v-for="(item, index) in specAttributes" :key="index">
            <div>
              <el-text>属性名：</el-text>
              <el-tag type="warning" closable @close="handleCloseSpec(index, item.id!)">
                {{ item.name }}
              </el-tag>
            </div>
            <div>
              <el-text>属性值：</el-text>
              <el-tag
                v-for="(value, valueIndex) in item.values"
                :key="value.id"
                closable
                style="margin: 0 4px"
                @close="handleCloseValue(index, valueIndex, value.id!)"
              >
                {{ value.value }}
              </el-tag>
              <el-input
                class="value-input"
                v-model="inputValue"
                ref="inputRef"
                v-show="inputVisible(index)"
                :id="`input${index}`"
                size="small"
                @blur="handleInputConfirm(index, item.id!)"
                @keyup.enter="handleInputConfirm(index, item.id!)"
              />
              <el-button v-show="!inputVisible(index)" size="small" @click="showInput(index)" style="margin-left: 4px">
                + 添加
              </el-button>
            </div>
          </div>
        </div>
        <SpecTable :spec-table-data="specTableData" :table-headers="tableHeaders" @img-operation="imgOperation" />
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit">提交商品</el-button>
      </el-form-item>
    </el-form>

    <SpecDialog ref="specFormRef" @add-spec="addSpec" />
    <SpecImgDialog ref="specImgRef" @result="handleResult" />
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
