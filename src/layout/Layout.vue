<script lang="tsx">
import { defineComponent } from 'vue'
import AppView from './components/AppView.vue'

const renderLayout = () => {
  return (
    <>
      <div>
        <AppView />
      </div>
    </>
  )
}

export default defineComponent({
  name: 'Layout',
  setup() {
    return () => <div class={['main']}>{renderLayout()}</div>
  }
})
</script>
