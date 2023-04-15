<template>
  <!-- 表单：Student ID	学号
name	姓名
gender	性别
picture	头像
Mobile Number	手机号 -->
  <div class="form">
    <el-form :model="form" ref="ruleFormRef" label-width="200px" size="large" :rules="rules">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="form.studentId" placeholder="请输入学号"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="`${baseURL}/api/file/upload`"
          :headers="{ Authorization: 'Bearer ' + localStorage.getItem('token') }"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import request, { baseURL } from '@/utils/request'
import type { FormInstance } from 'element-plus'

const ruleFormRef = ref<FormInstance>()
const localStorage = window.localStorage
const form = reactive({
  username: '',
  studentId: '',
  gender: '',
  mobile: '',
  name: '',
  avatar: '',
  email: ''
})

onMounted(async () => {
  const { data } = await request.get('/api/userInfo')
  form.username = data.username
  form.studentId = data.studentId
  form.gender = data.gender
  form.mobile = data.mobile
  form.avatar = data.avatar
  form.name = data.name
  form.email = data.email
})
const handleAvatarSuccess = (res: any, file: any) => {
  console.log(res)
  form.avatar = baseURL + res.url
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      const res: any = await request.post('/api/updateUserInfo', form)
      if (res.code === 200) {
        ElMessage.success('修改成功')
      } else {
        ElMessage.error('修改失败')
      }
    } else {
      ElMessage.error('请检查表单')
    }
  })
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 10, max: 10, message: '长度为 10 个字符', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '长度为 11 个字符', trigger: 'blur' }
  ],
  avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ]
}

const beforeAvatarUpload = (file: any) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}
</script>

<style lang="scss" scoped>
.form {
  width: 80%;
  margin: 0 auto;
  padding: 20px;

  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
