<script lang="ts" setup>
defineOptions({ name: 'Header' })

const title = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="5">
      <div id="menu-btn" class="nav-menu">
        <img class="logo" src="@/assets/logo.png" :alt="title" />
        <span class="title">{{ title }}</span>
        <Icon icon="gg:menu" color="var(--el-color-primary)" size="24" />
      </div>
    </el-col>
    <el-col :span="8">面包</el-col>
    <el-col :span="8">settings</el-col>
  </el-row>
</template>

<style lang="scss" scoped>
#menu-btn {
  cursor: pointer;
}

.nav-menu {
  padding: 0 10px;
  justify-content: space-between;
}

.logo {
  width: var(--logo-width);
}

.title {
  color: var(--el-color-primary);
  font-size: var(--el-font-size-extra-large);
  font-weight: 600;
  line-height: 1;
}
</style>
