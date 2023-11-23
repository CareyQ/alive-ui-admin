<script lang="tsx">
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'

import { useRenderMenuItem } from './components/useRenderMenuItem'

export default defineComponent({
  name: 'Menu',
  setup() {
    const appStore = useAppStore()
    const permissionStore = usePermissionStore()

    const menuRef = ref()

    const routers = computed(() => permissionStore.getRouters)
    const collapse = computed(() => appStore.getCollapse)

    const menuClass = computed(() => `menu ${unref(collapse) ? '' : 'opened'}`)

    return () => (
      <ul className={menuClass.value} ref={menuRef.value}>
        {{
          default: () => {
            const { renderMenuItem } = useRenderMenuItem()
            return renderMenuItem(unref(routers))
          }
        }}
      </ul>
    )
  }
})
</script>

<style lang="scss">
@import './menu.scss';
</style>
