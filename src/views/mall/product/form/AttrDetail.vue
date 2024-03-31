<script lang="ts" setup>
import { isEmpty } from 'lodash-es'
import type { ProductDTO, ProductSkuDTO, ProductSpec } from '@/api/product/product'
import * as ProductAttributeApi from '@/api/product/attribute'
import SpecDialog from './components/SpecDialog.vue'
import SpecTable from './components/SpecTable.vue'

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
const formData = computed(() => props.modelValue)

// 添加规格
interface Spec {
  id: number
  name: string
  value: Array<string>
}

const specAttributes = ref<Spec[]>([])
const specFormRef = ref()
const openSpecForm = () => {
  specFormRef.value.open()
}

/** 添加规格 */
const addSpec = async (specName: string) => {
  if (isEmpty(specName)) {
    return
  }
  const isDuplicate = specAttributes.value.some((e) => {
    return e.name === specName
  })

  if (isDuplicate) {
    message.error('规格名称已存在')
    return
  }
  const id = await ProductAttributeApi.saveAttribute(specName)

  specAttributes.value.push({ id, name: specName, value: [] })
  specFormRef.value.specDialogVisible = false
}

/** 监听规格属性，生成表头 */
const tableHeaders = ref<{ prop: string; label: string }[]>([])
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

/** 删除属性*/
const handleCloseSpec = async (index: number, specId: number) => {
  specAttributes.value?.splice(index, 1)
  await ProductAttributeApi.delAttribute(specId)
}

/** 添加属性值 */
const handleInputConfirm = async (index: number) => {
  if (isEmpty(inputValue.value)) {
    return
  }
  specAttributes.value[index].value.push(inputValue.value)
  attributeIndex.value = null
  inputValue.value = ''
}

/** 删除属性值*/
const handleCloseValue = async (index: number, valueIndex: number) => {
  specAttributes.value[index].value.splice(valueIndex, 1)
}

/** 生成 sku 表格 */
const specTableData = ref<ProductSkuDTO[]>([])
const buildTableData = () => {
  if (specAttributes.value.length === 0) {
    message.error('请先添加规格')
    return
  }

  const list = [] as any[]
  for (let index = 0; index < specAttributes.value.length; index++) {
    const element = specAttributes.value[index]
    if (element.value.length === 0) {
      message.error(`请先添加[${element.name}]规格值`)
      return
    }
    const item = element.value.map((e) => {
      return {
        attributeId: element.id,
        attributeName: element.name,
        value: e
      }
    })
    list.push(item)
  }

  const result = cartesianProductOfArrays(list)
  specTableData.value = result.map((e: ProductSpec[], index: number) => {
    if (specTableData.value[index]) {
      return specTableData.value[index]
    }

    return {
      spec: e,
      price: 0,
      stock: 0,
      pic: '',
      weight: 0,
      volume: 0
    } as ProductSkuDTO
  })
}

const cartesianProductOfArrays = (arrays: any[][]) => {
  if (arrays.length === 0) {
    return [[]]
  }
  const [first, ...rest] = arrays
  const productsRest = cartesianProductOfArrays(rest)
  return first.flatMap((valueFirst) => productsRest.map((productRest) => [valueFirst, ...productRest]))
}

const emit = defineEmits(['submit', 'prev'])
const submit = () => {
  if (isEmpty(specTableData.value)) {
    message.notifyError('商品 SKU 信息不能为空')
    return
  }
  for (const index in specTableData.value) {
    const item = specTableData.value[index]
    if (!item.price || item.price <= 0) {
      message.notifyError(`商品价格不能为0`)
      return
    }
    if (!item.stock || item.stock <= 0) {
      message.notifyError(`商品库存不能为0`)
      return
    }
  }
  emit('submit', specTableData.value)
}

const handlePrev = () => {
  emit('prev')
}

/** 数据回显 */
const isEdit = ref(false)
watch(
  () => props.modelValue.id,
  (id) => {
    if (id) {
      isEdit.value = true
      const skus = formData.value.skus!
      const spec = skus.flatMap((e) => e.spec) as ProductSpec[]
      specAttributes.value = transformSpecAttributes(spec)
      specTableData.value = skus
      console.log(specAttributes.value)
    }
  },
  { deep: true }
)

/** 回显转换规格属性 */
const transformSpecAttributes = (data: ProductSpec[]) => {
  return data.reduce((prev: Spec[], current: ProductSpec) => {
    const existsSpec = prev.find((e: Spec) => e.id === current.attributeId) || {
      id: current.attributeId,
      name: current.attributeName,
      value: []
    }

    existsSpec.value.push(current.value)

    if (!prev.includes(existsSpec as Spec)) {
      prev.push(existsSpec)
    }

    return prev
  }, [])
}

const attributeIndex = ref<number | null>(null)
const inputVisible = computed(() => (index: number) => {
  if (attributeIndex.value === null) return false
  if (attributeIndex.value === index) return true
})

const inputRef = ref()
const inputValue = ref('')
const showInput = async (index: number) => {
  attributeIndex.value = index
  inputRef.value[index].focus()
}
</script>

<template>
  <div style="margin-top: 50px">
    <el-form ref="formRef" :model="formData" label-width="100px">
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
                v-for="(value, valueIndex) in item.value"
                :key="valueIndex"
                closable
                style="margin: 0 4px"
                @close="handleCloseValue(index, valueIndex)"
              >
                {{ value }}
              </el-tag>
              <el-input
                class="value-input"
                v-model="inputValue"
                ref="inputRef"
                v-show="inputVisible(index)"
                :id="`input${index}`"
                size="small"
                @blur="handleInputConfirm(index)"
                @keyup.enter="handleInputConfirm(index)"
              />
              <el-button v-show="!inputVisible(index)" size="small" @click="showInput(index)" style="margin-left: 4px">
                + 添加
              </el-button>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="商品 SKU" prop="skus">
        <SpecTable :spec-table-data="specTableData" :table-headers="tableHeaders" :is-edit="isEdit" />
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit">提交商品</el-button>
      </el-form-item>
    </el-form>

    <SpecDialog ref="specFormRef" @add-spec="addSpec" />
  </div>
</template>

<style lang="scss" scoped>
.value-input {
  width: 80px;
}
</style>
