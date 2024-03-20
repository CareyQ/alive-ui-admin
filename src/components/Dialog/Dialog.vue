<script setup lang="ts">
import { isNumber } from '@/utils/utils'

defineOptions({ name: 'Dialog' })

const props = defineProps({
  title: String,
  width: {
    type: [String, Number],
    default: '40%'
  },
  scroll: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: [String, Number],
    default: '400px'
  },
  showClose: {
    type: Boolean,
    default: true
  }
})

const slots = useSlots()
const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight)
  }
})

const getBindValue = computed(() => {
  const delArr: string[] = ['title', 'maxHeight']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})
</script>

<template>
  <el-dialog v-bind="getBindValue" :show-close="false" :width="width" :class="['alive-dialog', scroll && 'scroll']">
    <template #header="{ close }">
      <div class="dialog-header flex-center-between">
        <slot name="title">
          {{ title }}
        </slot>

        <Icon class="pointer" icon="ep:close" @click="close" v-if="showClose" />
      </div>
    </template>

    <el-scrollbar v-if="scroll" :style="dialogStyle">
      <slot></slot>
    </el-scrollbar>
    <slot v-else></slot>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.el-dialog.alive-dialog {
  padding: 0;

  .el-dialog__header {
    padding: 0;
    margin-right: 0;
  }

  .dialog-header {
    padding: 16px;
    font-size: 16px;
    border-bottom: var(--dialog-header-border);
  }

  .el-dialog__body {
    padding: 16px;
  }

  .el-dialog__footer {
    padding: 12px 16px;
    box-shadow:
      0 12px 32px 4px rgba(0 0 0 / 4%),
      0 8px 20px rgba(0 0 0 / 8%);
  }
}

.alive-dialog.scroll {
  .el-dialog__body {
    padding: 0;
  }

  .el-scrollbar {
    padding: 16px;
  }

  .el-table .el-scrollbar {
    padding: 0;
  }
}
</style>
