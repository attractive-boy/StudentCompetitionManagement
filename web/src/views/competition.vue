<template>
  <div class="officialNews">
    <div class="search">
      <!-- el-icon 矩形中间一个加号的按钮，最左边用于新增 -->
      <el-button
        v-if="user.userInfo().role === 'teacher'"
        @click="handleAdd"
        class="add-icon search-plus-button"
        type="primary"
        >+</el-button
      >
      <span v-else></span>
      <!-- 公告标题和公告类型的搜索摆在右边 element组件 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="竞赛名称">
          <el-input v-model="searchForm.title" placeholder="请输入竞赛名称"></el-input>
        </el-form-item>
        <el-form-item label="竞赛类型">
          <el-select v-model="searchForm.type" placeholder="请选择竞赛类型">
            <el-option
              v-for="item in competitionType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 竞赛地点 -->
        <el-form-item label="竞赛地点">
          <el-input v-model="searchForm.address" placeholder="请输入竞赛地点"></el-input>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="search">搜索</el-button> </el-form-item>、
      </el-form>
    </div>
    <!-- 表单:1、索引 2、竞赛名称 3、竞赛类型 4、竞赛图片 5、参与人数 6、宣传视频 7、竞赛时间 8、竞赛地点 9、操作 
       表头固定，斑马纹，分页，每页显示10条，操作：编辑、删除，删除时弹出确认框，确认后删除 ，编辑时弹出编辑框 ，编辑框和添加框一样 ，添加按钮 ，添加时弹出添加框 ，添加框和编辑框一样 ，带边框，操作列固定，支持筛选和排序 宽度用百分比 -->
    <!-- 有索引的表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      :row-key="tableRowKey"
      :default-sort="defaultSort"
      max-height="450"
      :header-cell-style="{ background: 'RGB(50, 64, 87)', color: '#fff' }"
    >
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="title" label="竞赛名称" width="150"></el-table-column>
      <el-table-column prop="type" label="竞赛类型" width="150">
        <template #default="scope">
          <span>{{ competitionType[scope.row.type - 1].label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="img" label="竞赛图片" width="150">
        <template #default="scope">
          <div v-for="item in scope.row.img" :key="item">
            <el-image
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="scope.row.img"
            >
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="member" label="参与人数" width="150">
        <template #default="scope">
          <span>{{ scope.row.member }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="video" label="宣传视频" width="150">
        <template #default="scope">
          <video :src="scope.row.video" controls width="100" height="100"></video>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="竞赛时间" width="150">
        <template #default="scope">
          <span>{{ new Date(scope.row.time).toLocaleString() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="竞赛地点"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            v-if="user.userInfo().role === 'teacher'"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <!-- 删除二次确认 -->
          <el-popconfirm
            v-if="user.userInfo().role === 'teacher'"
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
          <!-- 报名 -->
          <el-button
            v-if="user.userInfo().role == 'student'"
            type="text"
            @click="openSignUp(scope.$index, scope.row)"
            >报名</el-button
          >
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
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="add-form">
        <el-form-item label="竞赛名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入竞赛名称"></el-input>
        </el-form-item>
        <el-form-item label="竞赛类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择竞赛类型">
            <el-option
              v-for="item in competitionType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="竞赛图片" prop="img">
          <el-upload
            class="upload-demo"
            :action="`${baseURL}/api/file/upload`"
            :headers="{ Authorization: 'Bearer ' + localStorage.getItem('token') }"
            :on-preview="handlePictureCardPreview"
            :on-success="handleAvatarSuccess"
            :file-list="fileList"
            list-type="picture-card"
          >
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model:visible="dialogImageUrl" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="参与人员" prop="member">
          <el-table :data="form.member" border>
            <!-- 报名编号 -->
            <el-table-column prop="number" label="报名编号" width="150"></el-table-column>
            <!-- 姓名 -->
            <el-table-column prop="name" label="姓名" width="100"></el-table-column>
            <!-- 学号 -->
            <el-table-column prop="studentId" label="学号" width="200"></el-table-column>
            <!-- 联系方式 -->
            <el-table-column prop="mobile" label="联系方式"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="宣传视频" prop="video">
          <el-upload
            class="upload-demo"
            :action="`${baseURL}/api/file/upload`"
            :headers="{ Authorization: 'Bearer ' + localStorage.getItem('token') }"
            :on-success="handleVideoSuccess"
            :file-list="videoList"
            :limit="1"
          >
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model:visible="dialogVideoUrl" size="tiny">
            <video width="100%" :src="dialogVideoUrl" controls></video>
          </el-dialog>
        </el-form-item>
        <el-form-item label="竞赛时间" prop="time">
          <el-date-picker
            v-model="form.time"
            placeholder="选择日期时间"
            type="datetime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="竞赛地点" prop="address">
          <el-input v-model="form.address" placeholder="请输入竞赛地点"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 报名对话框 -->
    <el-dialog title="报名" v-model="signUpVisible" width="50%" class="add-dialog">
      <el-form
        :model="signUpForm"
        :rules="signUpRules"
        ref="signUpFormRef"
        label-width="100px"
        class="add-form"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="signUpForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="signUpForm.studentId" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="signUpForm.mobile" placeholder="请输入联系方式"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="signUpVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSignUpForm(signUpFormRef)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { competitionType } from '@/enum'
import { ref, reactive, onMounted } from 'vue'
import request, { baseURL } from '@/utils/request'
import { userInfoStore } from '@/stores/userInfo'
import type { FormInstance } from 'element-plus'

const user = userInfoStore()

const searchForm = reactive({
  title: '',
  type: '',
  address: ''
})
const dialogVideoUrl = ref('')
const tableData: any = reactive([])
const currentPage = ref(1)
const totalNum = ref(0)
const fileList: any = reactive([])
const form = reactive({
  id: '',
  title: '',
  type: '',
  img: [],
  member: [],
  video: '',
  time: '',
  address: ''
})

const dialogVisible = ref(false)
const videoList: any = reactive([])
const formRef = ref<FormInstance>()
onMounted(() => {
  search()
})
const dialogTitle = ref('添加竞赛信息')
const search = async () => {
  const res = await request.get('/api/competition', {
    params: {
      ...searchForm,
      page: currentPage.value,
      pageSize: 10
    }
  })
  let list = res.data.list
  console.log(list)
  list.forEach((item: any) => {
    item.img = JSON.parse(item.img)
  })
  tableData.splice(0, tableData.length, ...list)
  totalNum.value = res.data.total
}

const handleEdit = (index: number, row: any) => {
  dialogVisible.value = true
  dialogTitle.value = '编辑竞赛信息'
  form.title = row.title
  form.type = row.type
  form.img = row.img
  form.video = row.video
  form.time = row.time
  form.address = row.address
  form.id = row.id

  let List: any = []
  row.img.forEach((item: any) => {
    List.push({
      name: item,
      url: item
    })
  })
  fileList.splice(0, fileList.length, ...List)
  let vList: any = []
  vList.push({
    name: row.video,
    url: row.video
  })
  videoList.splice(0, videoList.length, ...vList)
}

const handleDelete = async (index: number, row: any) => {
  const res: any = await request.post('/api/competition/delete', {
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
  dialogTitle.value = '添加竞赛信息'
}

const tableRowKey = (row: any) => {
  return row.id
}

const defaultSort = {
  prop: 'time',
  order: 'descending'
}

const localStorage = window.localStorage
const rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  img: [{ required: true, message: '请上传图片', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  time: [{ required: true, message: '请选择时间', trigger: 'change' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
})
const submitForm = async (formRef: any) => {
  // 是否满足校验规则
  const valid = await formRef.validate()
  if (!valid) {
    return
  }
  if (dialogTitle.value === '添加竞赛信息') {
    await add()
  } else {
    await edit()
  }
}

const add = async () => {
  const res: any = await request.post('/api/competition/add', form)
  if (res.code === 200) {
    dialogVisible.value = false
    search()
  }
}

const edit = async () => {
  const res: any = await request.post('/api/competition/update', form)
  if (res.code === 200) {
    dialogVisible.value = false
    search()
  }
}

const handleAvatarSuccess = (res: any, file: any) => {
  fileList.push({
    name: file.name,
    url: res.url
  })
  form.img.push(baseURL + res.url)
}

const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const dialogImageUrl = ref('')

const handleVideoSuccess = (res: any, file: any) => {
  form.video = baseURL + res.url
  dialogVideoUrl.value = baseURL + res.url
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  search()
}

const signUpVisible = ref(false)

const signUpForm = reactive({
  name: '',
  mobile: '',
  email: '',
  studentId: '',
  parentId: ''
})

const signUpRules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }]
})

const signUpFormRef = ref<FormInstance>()

const submitSignUpForm = async (formRef: any) => {
  // 是否满足校验规则
  const valid = await formRef.validate()
  if (!valid) {
    return
  }
  await signUp()
}

const signUp = async () => {
  const res: any = await request.post('/api/competition/signUp', {
    ...signUpForm
  })
  if (res.code === 200) {
    signUpVisible.value = false
    ElMessage.success('报名成功')
  }
}

const openSignUp = (index: number, row: any) => {
  signUpVisible.value = true
  signUpForm.parentId = row.id
}
</script>

<style scoped lang="scss">
.officialNews {
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
