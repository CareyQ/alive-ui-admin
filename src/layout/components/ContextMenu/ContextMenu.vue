<script lang="ts" setup>
import type { RouteLocationNormalized } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import type { Axis, ContextmenuItemClickEmitArg, Props } from './index'

const props = withDefaults(defineProps<Props>(), {
  width: 150,
  items: () => []
})

const emits = defineEmits<{
  (e: 'contextmenuItemClick', item: ContextmenuItemClickEmitArg): void
}>()

const state: {
  show: boolean
  axis: {
    x: number
    y: number
  }
  menu: RouteLocationNormalized | undefined
  arrowAxis: number
} = reactive({
  show: false,
  axis: {
    x: 0,
    y: 0
  },
  menu: undefined,
  arrowAxis: 10
})

const onShowContextmenu = (menu: RouteLocationNormalized, axis: Axis) => {
  state.menu = menu
  state.axis = axis
  state.show = true
}

const onContextmenuItem = (item: ContextmenuItemClickEmitArg) => {
  if (item.disabled) return
  item.menu = toRaw(state.menu)
  emits('contextmenuItemClick', item)
}

const onHideContextmenu = () => {
  state.show = false
}

defineExpose({
  onShowContextmenu,
  onHideContextmenu
})

onMounted(() => {
  useEventListener(document, 'click', onHideContextmenu)
})
</script>

<template>
  <transition name="el-zoom-in-center">
    <div
      class="el-popper is-pure is-light el-dropdown__popper ba-contextmenu"
      :style="`top: ${state.axis.y + 5}px;left: ${state.axis.x - 14}px;width:${props.width}px`"
      :key="Math.random()"
      v-show="state.show"
      aria-hidden="false"
      data-popper-placement="bottom"
    >
      <ul class="el-dropdown-menu">
        <template v-for="item in props.items" :key="item.name">
          <li
            class="el-dropdown-menu__item"
            :class="item.disabled ? 'is-disabled' : ''"
            tabindex="-1"
            @click="onContextmenuItem(item)"
          >
            <Icon :icon="item.icon" :size="12" />

            <span>{{ item.label }}</span>
          </li>
        </template>
      </ul>
      <span class="el-popper__arrow" :style="{ left: `${state.arrowAxis}px` }"></span>
    </div>
  </transition>
</template>
