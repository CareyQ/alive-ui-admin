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
  height: 38px;
  padding: 0 10px;
  margin-bottom: 2px;
  white-space: nowrap;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    color: var(--white-color);
    background-color: var(--el-color-primary);
  }
}
</style>
