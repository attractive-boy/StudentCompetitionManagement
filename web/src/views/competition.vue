<template>
  <div class="officialNews">
    <div class="search">
      <!-- el-icon 矩形中间一个加号的按钮，最左边用于新增 -->
      <el-button @click="handleAdd" class="add-icon search-plus-button" type="primary">+</el-button>
      <!-- 公告标题和公告类型的搜索摆在右边 element组件 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="竞赛名称">
          <el-input v-model="searchForm.name" placeholder="请输入竞赛名称"></el-input>
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
      max-height="500"
    >
      <el-table-column type="index" label="序号" width="5%"></el-table-column>
      <el-table-column prop="name" label="竞赛名称" width="10%"></el-table-column>
      <el-table-column prop="type" label="竞赛类型" width="10%">
        <template #default="scope">
          <span>{{ competitionType[scope.row.type - 1].label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="img" label="竞赛图片" width="10%">
        <template #default="scope">
          <img :src="scope.row.img" alt="" width="100px" height="100px" />
        </template>
      </el-table-column>
      <el-table-column prop="num" label="参与人数" width="10%"></el-table-column>
      <el-table-column prop="video" label="宣传视频" width="10%">
        <template #default="scope">
          <video :src="scope.row.video" controls width="100px" height="100px"></video>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="竞赛时间" width="10%"></el-table-column>
      <el-table-column prop="address" label="竞赛地点" width="10%"></el-table-column>
      <el-table-column label="操作" width="20%">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 当前页码，总页数，每页显示条数，背景色，布局，上一页，下一页，页码 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalNum"
      class="mt-4"
      :current-page="1"
    ></el-pagination>

    <!-- 添加或者编辑的弹出框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%" class="add-dialog">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="公告类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择公告类型">
            <el-option
              v-for="item in noticeType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告图片" prop="img">
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
        <el-form-item label="公告内容" prop="content">
          <el-input type="textarea" v-model="form.content"></el-input>
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
import { competitionType } from '@/enum'
import { ref, reactive, onMounted } from 'vue'
import request, { baseURL } from '@/utils/request'

const searchForm = reactive({
  name: '',
  type: '',
  address: '',
})

const tableData: any = reactive([])
const currentPage = ref(1)
const totalNum = ref(0)
const fileList: any = reactive([])
const form = reactive({
  id: '',
  title: '',
  type: '',
  img: [],
  content: ''
})

const dialogVisible = ref(false)
onMounted(() => {
  search()
})
const dialogTitle = ref('添加公告')
const search = async () => {
  const res = await request.get('/api/officialNewsInfo', {
    params: {
      ...searchForm,
      page: currentPage.value,
      pageSize: 10
    }
  })
  let list = res.data.list
  // img 转数组 '["http://localhost:81/api/file/download/721c0eb0-b518-4f48-9c63-a7a99ebef0bc"]'
  list.forEach((item: any) => {
    item.img = JSON.parse(item.img)
  })
  tableData.splice(0, tableData.length, ...list)
}

const handleEdit = (index: number, row: any) => {
  dialogVisible.value = true
  dialogTitle.value = '编辑公告'
  form.title = row.title
  form.type = row.type
  form.img = row.img
  form.content = row.content
  form.id = row.id

  let List: any = []
  row.img.forEach((item: any) => {
    List.push({
      name: item,
      url: item
    })
  })
  fileList.splice(0, fileList.length, ...List)
}

const handleDelete = async (index: number, row: any) => {
  const res: any = await request.post('/api/officialNewsInfo/delete', {
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
  dialogTitle.value = '添加公告'
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
  title: [
    {
      required: true,
      message: '请输入公告标题',
      trigger: 'blur'
    }
  ],
  type: [
    {
      required: true,
      message: '请选择公告类型',
      trigger: 'change'
    }
  ],
  img: [
    {
      required: true,
      message: '请上传公告图片',
      trigger: 'change'
    }
  ],
  content: [
    {
      required: true,
      message: '请输入公告内容',
      trigger: 'blur'
    }
  ]
})

const submitForm = async () => {
  if (dialogTitle.value === '添加公告') {
    await add()
  } else {
    await edit()
  }
}

const add = async () => {
  const res: any = await request.post('/api/officialNewsInfo/add', form)
  if (res.code === 200) {
    dialogVisible.value = false
    search()
  }
}

const edit = async () => {
  console.log(form)
  const res: any = await request.post('/api/officialNewsInfo/edit', form)
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

const transformNoticeType = (type: number) => {
  //遍历枚举
  for (let i = 0; i < noticeType.length; i++) {
    if (noticeType[i].value == type) {
      return noticeType[i].label
    }
  }
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
