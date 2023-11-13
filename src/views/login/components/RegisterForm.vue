<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { Loading, Select, CloseBold } from '@element-plus/icons-vue'
import { LoginStateEnum, useLoginState } from './useLogin'
import { validateUsername, validateMobile } from '@/utils/validate'

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
  inputDisabled: true,
  captchaShow: false,

  mobileIsValid: false,
  mobileIsLoading: false,
  mobileValid: false,
  errorMsg: ''
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

const check = (formEl: FormInstance | undefined, val: string) => {
  formEl?.validateField('mobile', (valid) => {
    if (!valid) {
      return
    }
    captchaEl.mobileIsValid = true
    captchaEl.mobileIsLoading = true
    setTimeout(() => {
      console.log(val)
      captchaEl.mobileIsLoading = false
      captchaEl.errorMsg = '此手机号已被使用'
    }, 2000)
  })
}

const register = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl?.validate((valid) => {
    if (!valid) return
  })
}
</script>

<template>
  <el-form
    ref="registerFormRef"
    :model="registerForm"
    size="large"
    :rules="rules"
    style="width: 100%"
    v-if="getShow"
  >
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

    <el-form-item prop="username">
      <el-input
        v-model="registerForm.username"
        :maxlength="16"
        placeholder="请输入用户名"
        clearable
      />
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="registerForm.password"
        type="password"
        placeholder="请输入密码"
        clearable
        show-password
      />
    </el-form-item>

    <el-form-item prop="mobile" :error="captchaEl.errorMsg">
      <el-input
        v-model="registerForm.mobile"
        @blur="check(registerFormRef, registerForm.mobile)"
        placeholder="请输入手机号码"
        :maxlength="11"
      >
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

    <el-form-item prop="code" v-if="captchaEl.captchaShow">
      <el-row justify="space-between" style="width: 100%; align-items: flex-end">
        <el-col :span="15">
          <el-input
            v-model="registerForm.code"
            :disabled="captchaEl.inputDisabled"
            placeholder="请输入验证码"
            clearable
          />
        </el-col>
        <el-col :span="8">
          <el-button type="warning" :disabled="captchaEl.btnDisabled" plain style="width: 100%"
            >发送验证码</el-button
          >
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" class="login-btn" @click="register(registerFormRef)">
        注 册
      </el-button>
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
