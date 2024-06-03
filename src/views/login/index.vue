<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { LoginForm, RegisterForm } from './components'

const appStore = useAppStore()

const bg = '/src/assets/bg.jpg'
</script>

<template>
  <div class="login-page flex-center" :style="`background-image: url(${bg});`">
    <div class="filter"></div>
    <div class="login-panel flex">
      <section class="login-intro" :style="`background-image: url(${bg});`"></section>

      <section class="form-panel flex align-center">
        <LoginForm />
        <RegisterForm />
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page,
.filter {
  width: 100%;
  height: 100vh;
}

.login-page,
.login-intro {
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

%height {
  height: 500px;
}

%border-radius {
  border-radius: 14px;
}

.filter {
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(28px);
}

.login-panel {
  @extend %height;

  position: relative;
  width: 60%;
  padding: 35px 0;
}

.login-intro {
  @extend %border-radius;

  width: 70%;
  height: 430px;
}

.form-panel {
  @extend %border-radius;
  @extend %height;

  position: absolute;
  top: 0;
  right: 0;
  width: 360px;
  padding: 50px;
  background-color: #fff;
}
</style>
