<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { Loading, Select, CloseBold } from '@element-plus/icons-vue'
import { LoginStateEnum, useLoginState } from './useLogin'
import { validateUsername, validateMobile } from '@/utils/validate'

import * as RegisterApi from '@/api/register'

const { handleBackLogin, getLoginState } = useLoginState()

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER)
const registerFormRef = ref<FormInstance>()

const registerForm = reactive({
  username: '',
  password: '',
  mobile: '',
  code: ''
})

const captchaEl = reactive({
  btnDisabled: false,
  btnDuation: 10,
  btnText: '获取验证码',
  btnLoading: false,

  inputDisabled: true,

  mobileIsValid: false,
  mobileIsLoading: false,
  mobileValid: false,

  mobileErrorMsg: '',
  codeErrorMsg: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { validator: validateUsername, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: `密码长度在 6~20 个字符之间`, trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ]
}

const check = async () => {
  const valid = await registerFormRef.value?.validateField('mobile')
  if (!valid) return

  captchaEl.mobileIsValid = true
  captchaEl.mobileIsLoading = true

  const isExist = await RegisterApi.checkMobile(registerForm.mobile)
  captchaEl.mobileIsLoading = false
  if (isExist) {
    captchaEl.mobileErrorMsg = '此手机号已被使用'
    captchaEl.mobileValid = false
  } else {
    captchaEl.mobileErrorMsg = ''
    captchaEl.mobileValid = true
  }
}

const getCode = () => {
  registerFormRef.value?.validateField('mobile', (valid) => {
    if (!valid) {
      return
    }
    sendSms()
  })
}

const sendSms = () => {
  captchaEl.btnLoading = true
  captchaEl.btnText = '发送中'
  if (captchaEl.btnDuation !== 10) {
    captchaEl.btnDisabled = true
  }

  setTimeout(() => {
    captchaEl.btnLoading = false
  }, 2000)

  let btnTimer = setInterval(() => {
    const temp = captchaEl.btnDuation--
    captchaEl.btnText = `${temp}秒后可重发`
    captchaEl.inputDisabled = false
    if (temp <= 0) {
      clearInterval(btnTimer)
      captchaEl.btnDuation = 10
      captchaEl.btnText = '重新获取'
      captchaEl.btnDisabled = false
    } else if (temp !== 10 && captchaEl.btnDisabled === false) {
      captchaEl.btnDisabled = true
    }
  }, 1000)
}

const register = async (formEl: FormInstance | undefined) => {
  if (!captchaEl.mobileValid) {
    return
  }
  if (!formEl) return
  await formEl?.validate((valid) => {
    if (!valid) return
    if (!registerForm.code) {
      captchaEl.codeErrorMsg = '请输入验证码'
      return
    } else {
      const reg = /^[0-9]\d{5}$/
      if (!reg.test(registerForm.code)) {
        captchaEl.codeErrorMsg = '请输入正确的验证码'
        return
      }
    }
  })
}
</script>

<template>
  <el-form ref="registerFormRef" :model="registerForm" size="large" :rules="rules" style="width: 100%" v-if="getShow">
    <el-form-item>
      <el-row justify="space-between" style="width: 100%; align-items: flex-end">
        <h2 class="title">注册</h2>
        <p style="margin: 0; line-height: 16px" class="flex align-end">
          <span>已有账号？</span>
          <el-button type="primary" text style="height: 1rem; padding: 0" @click="handleBackLogin()">
            点此登录
          </el-button>
        </p>
      </el-row>
    </el-form-item>

    <el-form-item prop="username">
      <el-input v-model="registerForm.username" :maxlength="16" placeholder="请输入用户名" clearable />
    </el-form-item>

    <el-form-item prop="password">
      <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" clearable show-password />
    </el-form-item>

    <el-form-item prop="mobile" :error="captchaEl.mobileErrorMsg">
      <el-input v-model="registerForm.mobile" @change="check()" placeholder="请输入手机号码" :maxlength="11">
        <template #suffix>
          <el-icon class="is-loading" v-if="captchaEl.mobileIsValid && captchaEl.mobileIsLoading">
            <Loading />
          </el-icon>

          <el-icon v-if="captchaEl.mobileIsValid && !captchaEl.mobileIsLoading">
            <Select v-if="captchaEl.mobileValid" style="color: green" />
            <CloseBold v-else style="color: red" />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="code" v-if="captchaEl.mobileValid" :error="captchaEl.codeErrorMsg">
      <el-row justify="space-between" style="width: 100%; align-items: flex-end">
        <el-col :span="14">
          <el-input
            v-model="registerForm.code"
            :disabled="captchaEl.inputDisabled"
            placeholder="请输入验证码"
            clearable
          />
        </el-col>
        <el-col :span="9">
          <el-button
            type="warning"
            :disabled="captchaEl.btnDisabled"
            :loading="captchaEl.btnLoading"
            @click="getCode"
            plain
            style="width: 100%"
          >
            {{ captchaEl.btnText }}
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" class="login-btn" @click="register(registerFormRef)"> 注 册 </el-button>
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
