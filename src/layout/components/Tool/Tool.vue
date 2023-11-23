<script lang="ts" setup>
import AdminInfo from './components/AdminInfo.vue'
</script>

<template>
  <div class="tool nav-menu">
    <div class="nav-btn">
      <Icon :icon="'zmdi:fullscreen'" :size="18" />
    </div>

    <div class="nav-btn">
      <Icon :size="18" class="cursor-pointer" icon="mdi:bell-outline" />
    </div>

    <AdminInfo />

    <div class="nav-btn">
      <Icon :size="18" class="cursor-pointer" icon="mdi:cog" />
    </div>
  </div>
</template>

<style lang="scss">
.tool {
  position: relative;
  margin-left: auto;
}

.admin-info {
  width: auto;
  padding: 0 10px;
}
</style>
