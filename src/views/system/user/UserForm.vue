<script lang="ts" setup>
import * as UesrApi from '@/api/system/user'
import * as DeptApi from '@/api/system/dept'
import * as PostApi from '@/api/system/post'
import { validateUsername, validateMobile, validateEmail } from '@/utils/validate'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const message = useMessage()
const formLoading = ref(false)
const dialogTitle = ref('')
const dialogVisible = ref(false)

const formRef = ref()
const deptTree = ref()
const postList = ref()
const isEdit = ref(false)

const formData = ref({
  id: undefined,
  username: '',
  nickname: '',
  password: '',
  remark: undefined,
  deptId: undefined,
  postIds: undefined,
  gender: undefined,
  email: undefined,
  mobile: undefined
})

const formRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { validator: validateUsername, trigger: 'blur' }
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: `密码长度在 6~20 个字符之间`, trigger: 'blur' }
  ],
  mobile: [{ validator: validateMobile, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }]
})

const open = async (id: number) => {
  resetForm()
  dialogVisible.value = true
  if (id) {
    dialogTitle.value = '编辑用户'
    formLoading.value = true
    isEdit.value = true
    try {
      formData.value = await UesrApi.getDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    dialogTitle.value = '新增用户'
    isEdit.value = false
  }
}
defineExpose({ open })

const getDept = async () => {
  const data = await DeptApi.getSimpleList()
  if (data) {
    deptTree.value = data
  }
}

const getPost = async () => {
  const data = await PostApi.getSimpleList()
  if (data) {
    postList.value = data
  }
}

const resetForm = () => {
  formData.value = {
    id: undefined,
    username: '',
    nickname: '',
    password: '',
    remark: undefined,
    deptId: undefined,
    postIds: undefined,
    gender: undefined,
    email: undefined,
    mobile: undefined
  }
  formRef.value?.resetFields()
}

const emit = defineEmits(['success'])
const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }
  formLoading.value = true
  try {
    const data = formData.value
    await UesrApi.save(data)
    message.success('保存成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
  dialogVisible.value = false
}

onMounted(() => {
  getDept()
  getPost()
})
</script>

<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="36%" class="dialog-inline">
    <el-form :model="formData" v-loading="formLoading" v-if="isEdit">
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="用户编号:" prop="id">
            <el-text>{{ formData.id }}</el-text>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="用户名:" prop="username">
            <el-text>{{ formData.username }}</el-text>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" v-loading="formLoading">
      <el-row :gutter="40" v-if="!isEdit">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" clearable :maxlength="16" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              show-password
              v-model="formData.password"
              autocomplete="new-password"
              placeholder="请输入密码"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptId">
            <el-tree-select
              v-model="formData.deptId"
              :data="deptTree"
              :props="{ value: 'id', label: 'name' }"
              clearable
              check-strictly
              node-key="id"
              placeholder="请选择归属部门"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="岗位" prop="postIds">
            <el-select
              v-model="formData.postIds"
              placeholder="请选择岗位"
              filterable
              multiple
              clearable
              collapse-tags
              collapse-tags-tooltip
              :multiple-limit="3"
              style="width: 100%"
            >
              <el-option :label="item.label" :value="item.value" v-for="item in postList" :key="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="formData.gender" placeholder="请选择性别" style="width: 100%" clearable>
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in getIntDictOptions(DICT_TYPE.SYSTEM_USER_GENDER)"
                :key="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="formData.mobile" placeholder="请输入手机号" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="formData.remark" clearable :maxlength="500" show-word-limit :rows="3" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </template>
  </Dialog>
</template>
