<script setup lang="ts">
const specDialogVisible = ref(false)

const specForm = ref({
  name: ''
})
const specFormRules = reactive({
  name: [{ required: true, message: '规格名称不能为空', trigger: 'blur' }]
})

const open = () => {
  specForm.value.name = ''
  specDialogVisible.value = true
}
defineExpose({ open, specDialogVisible })

const emit = defineEmits(['addSpec'])
const addSpec = () => {
  emit('addSpec', specForm.value.name)
}
</script>

<template>
  <Dialog title="添加规格" v-model="specDialogVisible" width="30%">
    <el-form ref="formRef" :model="specForm" label-width="100px" :rules="specFormRules">
      <el-form-item label="规格名称" prop="name">
        <el-input v-model="specForm.name" placeholder="请输入规格名称" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="specDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addSpec">添加</el-button>
      </span>
    </template>
  </Dialog>
</template>
