<script setup lang="ts">
import { DictDataType, getDictOptions } from '@/utils/dict'

defineOptions({ name: 'Tag' })

const props = defineProps({
  type: {
    type: String as PropType<string>,
    required: true
  },
  value: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    required: true
  }
})

const dictData = ref<DictDataType>({
  value: '',
  label: '',
  colorType: ''
})

const getDictObj = (dictType: string, value: string) => {
  const dictOptions = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    if (dict.value === value) {
      dictData.value = dict
    }
  })
}

onMounted(() => {
  getDictObj(props.type, props.value.toString())

  watch(
    () => [props.type, props.value],
    () => {
      getDictObj(props.type, props.value.toString())
    }
  )
})
</script>

<template>
  <el-tag :type="dictData?.colorType">{{ dictData.label }}</el-tag>
</template>
