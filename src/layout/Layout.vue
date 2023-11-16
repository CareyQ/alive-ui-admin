<script lang="ts" setup>
import Header from './components/Header.vue'
</script>

<template>
  <div class="main">
    <el-container>
      <el-header height="50px">
        <Header />
      </el-header>
      <el-main height="">
        <!-- Main content -->
      </el-main>
      <el-footer height="">
        <!-- Footer content -->
      </el-footer>
    </el-container>
  </div>
</template>

<style lang="scss">
.main {
  padding: 10px;
}

.el-header {
  padding: 0;
}
</style>
