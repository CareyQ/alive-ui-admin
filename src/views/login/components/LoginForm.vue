<script lang="ts" setup>
import { LoginStateEnum, useLoginState } from './useLogin'
import * as LoginApi from '@/api/login'
import * as authUtil from '@/utils/auth'

const { setLoginState, getLoginState } = useLoginState()
const message = useMessage()

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
const loginLoading = ref(false)
const loginFormRef = ref()
const redirect = ref<string>('')

const { push } = useRouter()

const LoginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
}

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  loginLoading.value = true
  try {
    const valid = await loginFormRef.value?.validate()
    if (!valid) return

    const res = await LoginApi.login(loginForm)
    if (!res) {
      return
    }
    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/'
    }
    push({ path: redirect.value })
  } finally {
    loginLoading.value = false
  }
}
</script>

<template>
  <el-form size="large" ref="loginFormRef" style="width: 100%" :rules="LoginRules" :model="loginForm" v-if="getShow">
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

    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable />
    </el-form-item>

    <el-form-item prop="password">
      <el-input v-model="loginForm.password" placeholder="请输入密码" clearable />
    </el-form-item>

    <el-form-item style="margin-top: -15px">
      <el-row justify="space-between" style="width: 100%">
        <el-col :span="6">
          <el-checkbox>记住我</el-checkbox>
        </el-col>

        <el-col :span="12" :offset="6">
          <el-link style="float: right" type="primary" :underline="false" href=""> 验证码登录 </el-link>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loginLoading"> 登 录 </el-button>
      <el-link style="margin: 0 auto" type="primary" :underline="false" @click="message.notify('请联系管理员重置密码')">
        已有帐号，忘记密码？
      </el-link>
    </el-form-item>

    <el-form-item>
      <el-divider>其他登录方式</el-divider>
      <div class="flex-center-around" style="width: 100%">
        <Icon class="pointer" icon="ri:wechat-fill" :size="30" />
        <Icon class="pointer" icon="ri:dingding-fill" :size="30" />
        <Icon class="pointer" icon="ri:github-fill" :size="30" />
        <Icon class="pointer" icon="simple-icons:gitee" :size="25" />
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.title {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.2;
}

.login-btn {
  width: 100%;
  margin-top: -18px;
  font-size: 16px;
  font-weight: bold;
}

.pointer:hover {
  color: var(--el-color-primary);
}
</style>
