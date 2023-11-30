import type { RouteMeta } from 'vue-router'
import Icon from '@/components/Icon/Icon.vue'
import { ElIcon } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'

export default defineComponent({
  props: {
    meta: {
      type: Object as PropType<RouteMeta>,
      required: true
    },
    once: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const renderTitle = () => {
      return (
        <>
          {props.meta.icon ? <Icon icon={props.meta.icon as string} /> : null}
          <span class="menu__title no-wrap">{props.meta.title as string}</span>
          {props.once ? null : (
            <ElIcon class="menu__icon-arrow">
              <ArrowRight />
            </ElIcon>
          )}
        </>
      )
    }
    return () => <>{props.once ? renderTitle() : <div class="sub-menu__title">{renderTitle()}</div>}</>
  }
})
