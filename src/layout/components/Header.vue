<script lang="ts" setup>
import Menu from './Menu/Menu.vue'
import NavTab from './NavTab/NavTab.vue'
import Tool from './Tool/Tool.vue'
import { useAppStore } from '@/store/modules/app'

defineOptions({ name: 'Header' })

const title = import.meta.env.VITE_APP_TITLE

const appStore = useAppStore()

const collapse = computed(() => appStore.getCollapse)

const toggleCollapse = () => {
  const collapsed = unref(collapse)
  appStore.setCollapse(!collapsed)
}

const handleClickOutside = (event: MouseEvent) => {
  const menuContainer = document.querySelector('.menu-container')

  // 如果点击事件的目标不在菜单容器内，则将 collapse 设置为 false
  if (menuContainer && !menuContainer.contains(event.target as Node)) {
    appStore.setCollapse(true)
  }
}

// 在组件挂载时添加点击外部事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 在组件销毁时移除点击外部事件监听器，以防止内存泄漏
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="header-wrap">
    <el-header height="50px" class="flex align-center">
      <div class="menu-container">
        <div class="nav-menu nav-menu-primary">
          <div class="menu-btn flex-center" @click.stop="toggleCollapse()">
            <Icon :icon="collapse ? 'gg:menu' : 'gg:close'" color="var(--white-color)" :size="24" />
          </div>
          <router-link class="logo-container flex align-center" to="/" style="color: inherit; text-decoration: none">
            <img class="logo" src="@/assets/logo-white.png" :alt="title" />
            <span class="title no-wrap ellipsis">{{ title }}</span>
          </router-link>
        </div>
        <Menu />
      </div>

      <div class="flex header-left">
        <NavTab />
        <Tool />
      </div>
    </el-header>
  </div>
</template>

<style lang="scss" scoped>
.header-wrap {
  padding: 10px 16px 0 10px;
}

.el-header {
  padding: 0;
}

.menu-container {
  position: relative;
  width: var(--menu-width);
}

.nav-menu {
  justify-content: space-between;
}

.logo {
  width: var(--logo-width);
}

.logo-container {
  width: calc(100% - 60px);
}

.title {
  margin-left: 10px;
  font-size: var(--el-font-size-extra-large);
  font-weight: 600;
  line-height: 1;
}

.header-left {
  width: calc(100% - var(--menu-width));
}
</style>
