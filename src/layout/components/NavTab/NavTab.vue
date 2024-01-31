<script lang="ts" setup>
import { useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import { useNavTabStore } from '@/store/modules/navTab'
import { usePermissionStore } from '@/store/modules/permission'
import { useTemplateRefsList } from '@vueuse/core'
import { ContextMenu, type ContextMenuItem, type ContextmenuItemClickEmitArg } from '@/layout/components/ContextMenu'
import horizontalScroll from '@/utils/horizontalScroll'
import { filterAffixTabs, filterNotAffixTabView } from './helper'

const { currentRoute, push } = useRouter()
const navTabStore = useNavTabStore()

const tabScrollbarRef = ref()
const tabsRefs = useTemplateRefsList<HTMLDivElement>()

const contextmenuRef = ref()
const state: {
  contextmenuItems: ContextMenuItem[]
} = reactive({
  contextmenuItems: [
    { name: 'close', label: '关闭标签', icon: 'gg:close' },
    { name: 'closeOther', label: '关闭其他标签', icon: 'gg:math-minus' },
    { name: 'closeAll', label: '关闭全部标签', icon: 'gg:play-stop' }
  ]
})

const activeBoxStyle = reactive({
  width: '0',
  transform: 'translateX(0px)'
})

const affixTabArr = ref<RouteLocationNormalizedLoaded[]>([])
const permissionStore = usePermissionStore()

const routers = computed(() => permissionStore.getRouters)

const initTabs = () => {
  affixTabArr.value = filterAffixTabs(unref(routers))
  for (const tab of unref(affixTabArr)) {
    if (tab.name) {
      navTabStore.addTab(tab)
    }
  }
}

const onContextmenu = (menu: RouteLocationNormalizedLoaded, el: MouseEvent) => {
  const isAffix = menu.meta.affix
  const tabs = navTabStore.getTabsView
  const notAffixTab = filterNotAffixTabView(tabs, menu)
  const hasOther = notAffixTab.length > 0

  state.contextmenuItems[0].disabled = isAffix ? true : false
  state.contextmenuItems[1].disabled = state.contextmenuItems[2].disabled = !hasOther

  const { clientX, clientY } = el
  contextmenuRef.value.onShowContextmenu(menu, {
    x: clientX,
    y: clientY
  })
}

const selectNavTab = function (dom: HTMLDivElement) {
  if (!dom) {
    return false
  }
  activeBoxStyle.width = dom.clientWidth + 'px'
  activeBoxStyle.transform = `translateX(${dom.offsetLeft}px)`

  let scrollLeft = dom.offsetLeft + dom.clientWidth - tabScrollbarRef.value.clientWidth
  if (dom.offsetLeft < tabScrollbarRef.value.scrollLeft) {
    tabScrollbarRef.value.scrollTo(dom.offsetLeft, 0)
  } else if (scrollLeft > tabScrollbarRef.value.scrollLeft) {
    tabScrollbarRef.value.scrollTo(scrollLeft, 0)
  }
}

const toLastTab = () => {
  const lastTab = navTabStore.getTabsView.slice(-1)[0]
  if (lastTab) {
    push(lastTab)
  }
}

const closeTab = (route: RouteLocationNormalizedLoaded) => {
  navTabStore.closeTab(route)
  if (currentRoute.value.path === route.path) {
    toLastTab()
  } else {
    navTabStore.setActiveRoute(unref(currentRoute))
    nextTick(() => {
      selectNavTab(tabsRefs.value[navTabStore.getActiveIndex])
    })
  }

  contextmenuRef.value.onHideContextmenu()
}

const closeOtherTab = (menu: RouteLocationNormalizedLoaded) => {
  navTabStore.closeTabs(menu)
  navTabStore.setActiveRoute(menu)

  if (currentRoute.value.path !== menu.path) {
    push(menu!.path)
  }
  nextTick(() => {
    selectNavTab(tabsRefs.value[navTabStore.getActiveIndex])
  })
}

const closeAllTab = () => {
  navTabStore.closeTabs(false)
  push(navTabStore.getTabsView[0].path)
  nextTick(() => {
    selectNavTab(tabsRefs.value[navTabStore.getActiveIndex])
  })
}

const onContextmenuItem = async (item: ContextmenuItemClickEmitArg) => {
  const { name, menu } = item
  if (!menu) return
  switch (name) {
    case 'close':
      closeTab(menu)
      break
    case 'closeOther':
      closeOtherTab(menu)
      break
    case 'closeAll':
      closeAllTab()
      break
  }
}

const updateTab = function () {
  const { name, meta } = unref(currentRoute)

  if (name) {
    if (!meta.affix) {
      // 添加tab
      navTabStore.addTab(unref(currentRoute))
    }
    // 激活当前tab
    navTabStore.setActiveRoute(unref(currentRoute))
  }
  nextTick(() => {
    selectNavTab(tabsRefs.value[navTabStore.getActiveIndex])
  })

  return false
}

onMounted(() => {
  initTabs()
  updateTab()
  new horizontalScroll(tabScrollbarRef.value)
})

watch(
  () => unref(currentRoute),
  () => {
    updateTab()
  }
)
</script>

<template>
  <div class="nav-tabs flex" ref="tabScrollbarRef">
    <router-link
      :to="{ ...item }"
      custom
      v-slot="{ navigate }"
      v-for="(item, idx) in navTabStore.getTabsView"
      :key="item.fullPath"
    >
      <div
        :class="['nav-tab', { active: navTabStore.getActiveIndex == idx }]"
        :ref="tabsRefs.set"
        @click="navigate"
        @contextmenu.prevent="onContextmenu(item, $event)"
      >
        <div class="nowrap flex align-center">
          {{ item.meta.title }}
          <transition @after-leave="selectNavTab(tabsRefs[navTabStore.getActiveIndex])" name="el-fade-in">
            <Icon
              class="nav-tab__item--close"
              icon="ep:close"
              :size="12"
              v-if="!item.meta.affix"
              @click.prevent.stop="closeTab(item)"
            />
          </transition>
        </div>
      </div>
    </router-link>
    <div :style="activeBoxStyle" class="nav-tab-active-box"></div>
  </div>
  <ContextMenu ref="contextmenuRef" :items="state.contextmenuItems" @contextmenu-item-click="onContextmenuItem" />
</template>

<style lang="scss" scoped>
.nav-tabs {
  position: relative;
  margin: 0 16px;
  overflow-x: auto;
  overflow-y: hidden;
  justify-content: flex-start;
  height: var(--el-header-height);
  flex: 1;
}

.nav-tab {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: var(--nav-tab-height);
  cursor: pointer;
  user-select: none;
  z-index: 1;
  &:hover {
    color: var(--el-color-primary);
  }
}

.nav-tab-active-box {
  position: absolute;
  height: var(--nav-tab-height);
  background-color: var(--white-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s;
}

.nav-tab__item--close {
  margin: 2px 0 0 4px;
}
</style>
