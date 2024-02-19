<script lang="ts" setup>
import Header from './components/Header.vue'
import { useNavTabStore } from '@/store/modules/navTab'

const navTabStore = useNavTabStore()

const getCaches = computed((): string[] => {
  return navTabStore.getCachedViews
})
</script>

<template>
  <el-container>
    <Header />

    <el-main>
      <router-view v-slot="{ Component }">
        <keep-alive :include="getCaches">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </el-main>

    <el-footer>
      <!-- Footer content -->
      2022 © Geeker-Admin By Geeker Technology.
    </el-footer>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
}

.el-main {
  margin-top: 12px;
  padding: 0 10px 15px 10px;
}

.main-content {
  background-color: var(--white-color);
}

.el-footer {
  height: auto;
  padding: 0;
}
</style>
