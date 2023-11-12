<script lang="ts" setup>
import { LoginStateEnum, useLoginState } from './useLogin'
const { handleBackLogin, getLoginState } = useLoginState()

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER)
</script>

<template>
  <el-form size="large" style="width: 100%" v-if="getShow">
    <el-form-item>
      <el-row justify="space-between" style="width: 100%; align-items: flex-end">
        <h2 class="title">注册</h2>
        <p style="margin: 0; line-height: 1.2" class="flex align-end">
          <span>已有账号？</span>
          <el-button
            type="primary"
            text
            style="height: 1rem; padding: 0"
            @click="handleBackLogin()"
          >
            点此登录
          </el-button>
        </p>
      </el-row>
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入用户名，仅支持英文" clearable />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入密码" clearable />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请再次输入密码" clearable />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" class="login-btn"> 注 册 </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.title {
  font-size: 1.5rem;
  margin: 0;
  line-height: 1.2;
}

.login-btn {
  margin-top: 10px;
  width: 100%;
}
</style>
