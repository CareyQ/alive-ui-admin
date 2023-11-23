<script lang="ts" setup>
import { useNavTabStore } from '@/store/modules/navTab'

const navTabStore = useNavTabStore()

const getCaches = computed((): string[] => {
  return navTabStore.getCachedViews
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="['SystemMenu']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
