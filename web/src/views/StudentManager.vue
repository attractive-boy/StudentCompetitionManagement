<template>
  <div class="student">
    <div class="search">
      <span></span>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="学号">
          <el-input v-model="searchForm.studentId" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机号">
          <el-input v-model="searchForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="search">搜索</el-button> </el-form-item>、
      </el-form>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      :row-key="tableRowKey"
      :default-sort="defaultSort"
      max-height="500"
      :header-cell-style="{ background: 'RGB(50, 64, 87)', color: '#fff' }"
    >
      <el-table-column label="索引" width="180" prop="index"></el-table-column>
      <el-table-column label="学号" width="180" prop="studentId"></el-table-column>
      <el-table-column label="姓名" width="180" prop="name"></el-table-column>
      <el-table-column label="性别" width="180" prop="gender"></el-table-column>
      <el-table-column label="头像" prop="avatar">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.avatar"
            :preview-src-list="[scope.row.avatar]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="180" prop="mobile"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <!-- 删除二次确认 -->
          <el-popconfirm
            placement="top"
            width="180"
            trigger="click"
            title="确定删除吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 当前页码，总页数，每页显示条数，背景色，布局，上一页，下一页，页码 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalNum"
      class="mt-4"
      :current-page="currentPage"
      @update:current-page="handleCurrentChange"
    ></el-pagination>

    <!-- 添加或者编辑的弹出框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%" class="add-dialog">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="form.studentId" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <template #default>
            <el-radio-group v-model="form.gender" default-value="男">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <template #default>
            <el-upload
              class="avatar-uploader"
              :action="`${baseURL}/api/file/upload`"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import request, { baseURL } from '@/utils/request'

const searchForm = reactive({
  studentId: '',
  name: '',
  mobile: ''
})
const tableData: any = reactive([])
const currentPage = ref(1)
const totalNum = ref(0)
const form = reactive({
  id: '',
  index: '',
  studentId: '',
  name: '',
  gender: '',
  avatar: '',
  mobile: ''
})

const dialogVisible = ref(false)
onMounted(() => {
  search()
})
const dialogTitle = ref('添加公告')
const search = async () => {
  const res = await request.get('/api/students', {
    params: {
      ...searchForm,
      page: currentPage.value,
      pageSize: 10
    }
  })
  tableData.splice(0, tableData.length, ...res.data.list)
  totalNum.value = res.data.total
}

const handleEdit = (index: number, row: any) => {
  dialogVisible.value = true
  dialogTitle.value = '编辑学生信息'
  form.name = row.name
  form.studentId = row.studentId
  form.avatar = row.avatar
  form.mobile = row.mobile
  form.id = row.id
  form.gender = row.gender
}

const handleDelete = async (index: number, row: any) => {
  const res: any = await request.post('/api/students/delete', {
    id: row.id
  })
  if (res.code === 200) {
    tableData.splice(index, 1)
    ElMessage.success('删除成功')
  } else {
    ElMessage.error('删除失败')
  }
}

const handleAdd = () => {
  //弹出添加框
  dialogVisible.value = true
  dialogTitle.value = '添加学生信息'
}

const tableRowKey = (row: any) => {
  return row.id
}

const defaultSort = {
  prop: 'time',
  order: 'descending'
}

const rules = reactive({
  studentId: [
    {
      required: true,
      message: '请输入学号',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'blur'
    }
  ],
  avatar: [
    {
      required: true,
      message: '请上传头像',
      trigger: 'blur'
    }
  ],
  mobile: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    }
  ]
})

const submitForm = async () => {
  if (dialogTitle.value === '添加学生信息') {
    await add()
  } else {
    await edit()
  }
}

const add = async () => {
  const res: any = await request.post('/api/students/add', form)
  if (res.code === 200) {
    dialogVisible.value = false
    search()
  }
}

const edit = async () => {
  const res: any = await request.post('/api/students/update', form)
  if (res.code === 200) {
    dialogVisible.value = false
    search()
  }
}

const dialogImageUrl = ref('')

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  search()
}

const handleAvatarSuccess = (res: any, file: any) => {
  form.avatar = `${baseURL}${res.url}`
  console.log(form.avatar)
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

<style scoped lang="scss">
.student {
  padding: 20px;
  .search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    // 背景色 浅灰 圆角
    background-color: #f5f7fa;
    border-radius: 10px;
    .el-form {
      .el-form-item {
        margin-bottom: 0;
        margin: 10px;
      }
    }
    .add-icon {
      margin-right: 10px;
      border-radius: 10px;
      color: #fff;
      //   正方形
      width: 40px;
      height: 40px;
      margin: auto 20px;
    }
  }
  .mt-4 {
    margin-top: 20px;
    float: right;
  }
  .add-dialog {
    .el-form-item {
      margin-bottom: 0;
      margin: 20px;
    }
    .el-upload {
      width: 100px;
      height: 100px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      .avatar{
        width: 100px;
        height: 100px;
        border-radius: 6px;
      }
    }

    .dialog-footer {
      text-align: center;
      margin-top: 20px;
      width: 100%;
      // 内容居中
      display: flex;
      justify-content: center;
      .el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>

<style>
.el-table .cell {
  text-align: center;
  font-size: 16px;
}
.el-table .el-table__cell {
  z-index: unset;
}
/* 不是el-image-viewer__btn */
.el-table .cell span:not(.el-image-viewer__btn) {
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 16px;
}
.search-plus-button span {
  font-size: 40px !important;
  margin-left: 0 !important;
}
.el-upload-list__item .el-upload-list__item-info {
  width: 100% !important;
  margin-left: 0;
}
</style>
