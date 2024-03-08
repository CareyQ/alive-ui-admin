<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { LoginForm, RegisterForm } from './components'

const appStore = useAppStore()
</script>

<template>
  <div class="page-container flex-center">
    <div class="login-panel flex">
      <section class="login-intro flex justify-center">
        <h1>{{ appStore.getTitle }}</h1>
        <p>欢迎使用本系统！</p>
        <img src="@/assets/login-bg.svg" :alt="appStore.getTitle" />
      </section>

      <section class="form-panel flex align-center">
        <LoginForm />
        <RegisterForm />
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  height: 100vh;
}

.height {
  height: 500px;
}

.panel {
  @extend .height;

  padding: 50px;
}

.login-panel {
  @extend .height;

  overflow: hidden;
  background-color: white;
  border-radius: 6px;
}

.login-intro {
  @extend .panel;

  width: 500px;
  padding: 50px;
  color: white;
  background-color: var(--el-color-primary);
  flex-direction: column;

  h1 {
    margin: 0;
    font-size: 1.375rem;
    line-height: 1.5rem;
  }

  p {
    position: relative;
    z-index: 1;
    margin-top: 10px;
    margin-bottom: 0;
    font-size: 0.875rem;
  }

  img {
    position: relative;
    z-index: 0;
    width: 95%;
    margin: -10px auto 0;
  }
}

.form-panel {
  @extend .panel;

  width: 400px;
}
</style>
