<script lang="ts" setup>
import { LoginStateEnum, useLoginState } from './useLogin'
const { setLoginState, getLoginState } = useLoginState()

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
</script>

<template>
  <el-form size="large" style="width: 100%" v-if="getShow">
    <el-form-item>
      <el-row justify="space-between" style="width: 100%; align-items: flex-end">
        <h2 class="title">登录</h2>
        <p style="margin: 0; line-height: 16px" class="flex align-end">
          <span>没有账号？</span>
          <el-button
            type="primary"
            text
            style="height: 1rem; padding: 0"
            @click="setLoginState(LoginStateEnum.REGISTER)"
          >
            点此注册
          </el-button>
        </p>
      </el-row>
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入用户名" clearable />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入密码" clearable />
    </el-form-item>

    <el-form-item style="margin-top: -15px">
      <el-row justify="space-between" style="width: 100%">
        <el-col :span="6">
          <el-checkbox>记住我</el-checkbox>
        </el-col>

        <el-col :span="12" :offset="6">
          <el-link style="float: right" type="primary" :underline="false" href="">
            忘记密码？
          </el-link>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" class="login-btn"> 登 录 </el-button>
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
  margin-top: -18px;
  width: 100%;
}
</style>
