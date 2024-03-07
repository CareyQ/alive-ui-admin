<script lang="ts" setup></script>

<template>
  <RouterView />
</template>

<style lang="scss">
.size {
  width: 100%;
  height: 100%;
}

html,
body {
  @extend .size;

  padding: 0;
  margin: 0;
  overflow: hidden;
}

#app {
  @extend .size;

  background-color: var(--login-bg-color);
}
</style>
