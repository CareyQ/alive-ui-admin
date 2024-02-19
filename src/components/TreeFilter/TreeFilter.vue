<script lang="ts" setup name="TreeFilter">
interface TreeFilterProps {
  requestApi?: (data?: any) => Promise<any> // 请求分类数据的 api ==> 非必传
  data?: { [key: string]: any }[] // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
  title?: string // treeFilter 标题 ==> 非必传
  id?: string // 选择的id ==> 非必传，默认为 “id”
  label?: string // 显示的label ==> 非必传，默认为 “label”
  defaultValue?: any // 默认选中的值 ==> 非必传
}
const props = withDefaults(defineProps<TreeFilterProps>(), {
  id: 'id',
  label: 'label'
})

const defaultProps = {
  children: 'children',
  label: props.label
}

const treeRef = ref()
const treeData = ref<{ [key: string]: any }[]>([])

const selected = ref()
const setSelected = () => {
  selected.value = props.defaultValue
}

onBeforeMount(async () => {
  setSelected()
  if (props.requestApi) {
    const { data } = await props.requestApi!()
    treeData.value = data
  }
})

// 使用 nextTick 防止打包后赋值不生效，开发环境是正常的
watch(
  () => props.defaultValue,
  () => nextTick(() => setSelected()),
  { deep: true, immediate: true }
)

watch(
  () => props.data,
  () => {
    if (props.data?.length) {
      treeData.value = props.data
    }
  },
  { deep: true, immediate: true }
)

const filterText = ref('')
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

// 过滤
const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
  if (!value || !data) return true
  let parentNode = node.parent,
    labels = [node.label],
    level = 1
  while (level < node.level) {
    labels = [...labels, parentNode.label]
    parentNode = parentNode.parent
    level++
  }
  return labels.some((label) => label.indexOf(value) !== -1)
}

const emit = defineEmits<{
  change: [value: any]
}>()

// 单选
const handleNodeClick = (data: { [key: string]: any }) => {
  emit('change', data[props.id])
}
</script>

<template>
  <div class="card tree-filter">
    <h4 v-if="title">{{ title }}</h4>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <el-tree
        ref="treeRef"
        default-expand-all
        highlight-current
        :node-key="id"
        :data="treeData"
        :check-strictly="false"
        :current-node-key="selected"
        :expand-on-click-node="false"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
        <template #default="scope">
          <span>
            <slot :row="scope">
              {{ scope.node.label }}
            </slot>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<style lang="scss"></style>
