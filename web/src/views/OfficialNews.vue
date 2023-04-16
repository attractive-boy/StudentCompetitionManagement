<template>
  <div class="officialNews">
    <div class="search">
      <!-- el-icon 矩形中间一个加号的按钮，最左边用于新增 -->
      <el-button @click="handleAdd" class="add-icon search-plus-button" type="primary">+</el-button>
      <!-- 公告标题和公告类型的搜索摆在右边 element组件 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="公告标题">
          <el-input v-model="searchForm.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告类型">
          <el-select v-model="searchForm.type" placeholder="请选择公告类型">
            <el-option
              v-for="item in noticeType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="search">搜索</el-button> </el-form-item>、
      </el-form>
    </div>
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
      <el-table-column label="索引" width="180" prop="index"></el-table-column>
      <el-table-column prop="title" label="公告标题" width="180"></el-table-column>
      <el-table-column label="公告类型" width="180">
        <template #default="scope">
          <span>{{ transformNoticeType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="img" label="公告图片" width="180">
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
      <el-table-column prop="content" label="公告内容">
        <template #default="scope">
          <!-- 预览 -->
          <el-popover placement="top" width="180" trigger="hover">
            <div class="content" v-html="scope.row.content"></div>
            <template #reference>
              <el-button type="text" size="small">预览</el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 格式化成年月日 -->
      <el-table-column prop="date" label="发布时间" width="180">
        <template #default="scope">
          <span>{{ scope.row.date.split('T')[0] }}</span>
        </template>
      </el-table-column>
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
            :limit="1"
          >
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model:visible="dialogImageUrl" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="公告内容" prop="content" class="editor">
          <Editor
            api-key="h53l8ewpt6uv6bxgap7um5xfx3e6a37p1b13io4e6rnwt9lz"
            v-model="form.content"
          />
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
import { noticeType } from '@/enum'
import { ref, reactive, onMounted } from 'vue'
import request, { baseURL } from '@/utils/request'
import { userInfoStore } from '@/stores/userInfo'
// 导入tinyMCE
import Editor from '@tinymce/tinymce-vue'

const user = userInfoStore()

const searchForm = reactive({
  title: '',
  type: ''
})
const popoverVisible = ref(false)
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
  list.forEach((item: any) => {
    item.img = JSON.parse(item.img)
  })
  tableData.splice(0, tableData.length, ...list)
  totalNum.value = res.data.total
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

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  search()
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
.editor .el-form-item__content {
  display: block;
}
.tox-statusbar__branding{
  display: none;
}
</style>
