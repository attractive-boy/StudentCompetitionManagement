<template>
  <div class="officialNews">
    <div class="search">
      <span></span>
      <!-- 公告标题和公告类型的搜索摆在右边 element组件 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <!-- 学号 -->
        <el-form-item label="学号">
          <el-input v-model="searchForm.studentId" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
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
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="title" label="竞赛名称" width="150"></el-table-column>
      <el-table-column prop="type" label="竞赛类型" width="100">
        <template #default="scope">
          <span>{{ competitionType[scope.row.type - 1].label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="竞赛时间" width="200">
        <template #default="scope">
          <span>{{ new Date(scope.row.time).toLocaleString() }}</span>
        </template>
      </el-table-column>
      <!-- 竞赛编号 -->
      <el-table-column prop="number" label="竞赛编号" width="200"></el-table-column>
      <!-- 学号 -->
      <el-table-column prop="studentId" label="学号" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="150"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <!-- 删除二次确认 -->
          <el-popconfirm
            v-if="user.userInfo().role === 'teacher'"
            placement="top"
            width="180"
            trigger="click"
            title="确定取消该生资格吗？，取消后需要重新报名。"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button type="text" size="small">取消资格</el-button>
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
  </div>
</template>

<script lang="ts" setup>
import { competitionType } from '@/enum'
import { ref, reactive, onMounted } from 'vue'
import request from '@/utils/request'
import { userInfoStore } from '@/stores/userInfo'

const user = userInfoStore()

const searchForm = reactive({
  name: '',
  studentId: ''
})
const tableData: any = reactive([])
const currentPage = ref(1)
const totalNum = ref(0)

onMounted(() => {
  search()
})
const search = async () => {
  const res = await request.get('/api/competitionApply', {
    params: {
      ...searchForm,
      page: currentPage.value,
      pageSize: 10
    }
  })
  let list = res.data.list
  tableData.splice(0, tableData.length, ...list)
  totalNum.value = res.data.total
}

const handleDelete = async (index: number, row: any) => {
  const res: any = await request.post('/api/competitionApply/delete', {
    id: row.id
  })
  if (res.code === 200) {
    tableData.splice(index, 1)
    ElMessage.success('删除成功')
  } else {
    ElMessage.error('删除失败')
  }
}

const tableRowKey = (row: any) => {
  return row.id
}

const defaultSort = {
  prop: 'time',
  order: 'descending'
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
</style>
