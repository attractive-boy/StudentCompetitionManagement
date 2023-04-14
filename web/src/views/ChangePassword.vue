<template>
    <div class="form">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="200px" size="large">
            <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="form.oldPassword" type="password" placeholder="请输入原密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import request from '@/utils/request'
import type { FormInstance } from 'element-plus';

const ruleFormRef = ref<FormInstance>()
const form = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
    if (value !== form.newPassword) {
        ElMessage.error('两次输入密码不一致!')
    } else {
        callback()
    }
}

const rules = {
    oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' },
    ],
}

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid: boolean) => {
        if (valid) {
            const res: any = await request.post('/api/changePassword', form)
            if (res.code === 200) {
                ElMessage.success('修改成功')
                resetForm(formEl)
            } else {
                ElMessage.error(res.msg)
            }
        } else {
            ElMessage.error('请检查输入项')
        }
    })
}
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>
  
<style scoped lang="scss">
.form {
    width: 100%;
    height: 100%;
    padding: 50px;
}
</style>
  