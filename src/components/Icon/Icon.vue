<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'Icon' })

const props = defineProps({
  // icon name
  icon: propTypes.string,
  // icon color
  color: propTypes.string,
  // icon size
  size: propTypes.number.def(16),
  // icon svg class
  svgClass: propTypes.string.def(''),
  style: propTypes.string
})
</script>

<template>
  <ElIcon class="el-icon" :color="color" :size="size">
    <Icon :icon="props.icon" :color="props.color" :style="props.style" />
  </ElIcon>
</template>
