<script lang="ts" setup>
import Header from './components/Header.vue'
import { useNavTabStore } from '@/store/modules/navTab'

const navTabStore = useNavTabStore()

const getCaches = computed((): string[] => {
  return navTabStore.getCachedViews
})
</script>

<template>
  <div class="main">
    <el-container>
      <Header />

      <el-main>
        <el-scrollbar>
          <div class="main-content">
            <router-view v-slot="{ Component }">
              <keep-alive :include="getCaches">
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </div>
        </el-scrollbar>
      </el-main>

      <el-footer height="">
        <!-- Footer content -->
      </el-footer>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.el-main {
  margin-top: 16px;
  padding: 0;
  border-radius: var(--el-border-radius-base);
}

.main-content {
  background-color: var(--white-color);
}

.el-scrollbar {
  padding-left: 10px;
  padding-right: 16px;
  height: calc(100vh - 70px);
}
</style>
