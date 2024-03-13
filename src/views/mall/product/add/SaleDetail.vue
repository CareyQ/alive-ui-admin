<script lang="ts" setup>
import { Plus, EditPen, Delete, Grid } from '@element-plus/icons-vue'
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
const selectProductParam = ref()
const formData = props.modelValue
const formRules = reactive({
  attributeGroupId: [{ required: true, message: '属性类型不能为空', trigger: 'change' }]
})

const handelPic = (val: string) => {
  formData.pic = val
}

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

interface SEPC {
  id?: number
  name: string
  values: SEPC[]
}

const specAttributes = ref<SEPC[]>([])
const specForm = ref({
  name: ''
})
const specDialogVisible = ref(false)
const specFormRules = reactive({
  name: [{ required: true, message: '规格名称不能为空', trigger: 'blur' }]
})
const addSpec = () => {
  const isDuplicate = specAttributes.value.some((e) => {
    return e.name === specForm.value.name
  })

  if (isDuplicate) {
    message.error('规格名称已存在')
    return
  }
  specAttributes.value.push({
    name: specForm.value.name,
    values: []
  })
  specDialogVisible.value = false
  specForm.value.name = ''
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

const handleInputConfirm = (index: number) => {
  specAttributes.value[index].values.push({
    name: inputValue.value,
    values: []
  })

  attributeIndex.value = null
  inputValue.value = ''
  console.log(specAttributes.value)
}

const tableHeaders = ref<{ prop: string; label: string }[]>([])
const specTableData = ref([])

const buildTableData = () => {
  if (specAttributes.value.length === 0) {
    specTableData.value = []
  }
  const tableData = []
  specAttributes.value.map((specItem) => {
    specItem.values.map((value) => {
      console.log(value)
    })
  })
}

watch(
  () => specAttributes.value.length,
  (newVal) => {
    tableHeaders.value = specAttributes.value.map((item) => {
      return {
        prop: item.name,
        label: item.name
      }
    })
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

      <el-form-item label="商品参数" prop="params">
        <el-card shadow="never" class="params-card">
          <el-tabs>
            <el-tab-pane :label="item.groupName" v-for="(item, index) in selectProductParam" :key="index">
              <el-form ref="form" label-width="auto">
                <el-form-item :label="paramItem.name" v-for="paramItem in item.attributes" :key="paramItem.id">
                  <el-select v-if="paramItem.inputType === 1" class="paramInput">
                    <el-option
                      v-for="inputValue in paramItem.inputList.split(',')"
                      :key="inputValue"
                      :label="inputValue"
                      :value="inputValue"
                    />
                  </el-select>
                  <el-input v-else class="paramInput" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-form-item>

      <el-form-item label="商品规格" prop="spec">
        <div class="spec">
          <el-button @click="specDialogVisible = true">添加规格</el-button>
          <div class="spec-item" v-for="(item, index) in specAttributes" :key="index">
            <div>
              <el-text>属性名：</el-text>
              <el-tag type="warning" closable>
                {{ item.name }}
              </el-tag>
            </div>
            <div>
              <el-text>属性值：</el-text>
              <el-tag v-for="value in item.values" :key="value.id" closable style="margin: 0 4px">
                {{ value.name }}
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
                + 添加{{ specAttributes.length }}
              </el-button>
            </div>
          </div>
        </div>
        <div class="spec-table" style="width: 100%; margin-top: 20px" v-show="specAttributes.length > 0">
          <el-table :data="specAttributes">
            <el-table-column
              v-for="(item, index) in tableHeaders"
              :key="index"
              :label="item.label"
              align="center"
              min-width="120"
            />
            <el-table-column align="center" label="商品编号" />
            <el-table-column align="center" label="价格" />
            <el-table-column align="center" label="市场价" />
            <el-table-column align="center" label="库存" />
            <el-table-column align="center" label="重量" />
            <el-table-column align="center" label="体积" />
            <el-table-column align="center" label="操作">
              <template>
                <el-button :icon="Delete" link type="danger" size="small"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" @click="handleNext">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>

    <Dialog title="添加规格" v-model="specDialogVisible" width="30%">
      <el-form ref="formRef" :model="specForm" label-width="100px" :rules="specFormRules">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="specForm.name" placeholder="请输入规格名称" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span>
          <el-button @click="specDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addSpec">添加</el-button>
        </span>
      </template>
    </Dialog>
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
