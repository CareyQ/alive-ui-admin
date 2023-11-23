<script lang="ts" setup>
const { push } = useRouter()

defineOptions({ name: 'DropdownMenuItem' })

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <li class="dropdown-menu-item flex-center-between pointer" @click="push(props.link)">
    <div class="flex align-center">
      <Icon :icon="props.icon" />
      <span style="margin-left: 10px">{{ props.text }}</span>
    </div>
    <Icon icon="mdi:chevron-right" />
  </li>
</template>

<style lang="scss" scoped>
.dropdown-menu-item {
  padding: 0 10px;
  height: 38px;
  border-radius: 8px;
  transition: all 0.3s;
  white-space: nowrap;
  margin-bottom: 2px;
  &:hover {
    color: var(--white-color);
    background-color: var(--el-color-primary);
  }
}
</style>
