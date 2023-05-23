<template>
  <div class="show-official-news">
  <el-row :gutter="20" class="grid-content">
    <el-col :span="24" style="margin-bottom: 20px">
      <el-carousel indicator-position="outside">
        <el-carousel-item v-for="item in carousel" :key="item">
          <div :style="{ backgroundImage: 'url(' + item + ')' }" class="carousel-img"></div>
        </el-carousel-item>
      </el-carousel>
    </el-col>
    <el-col :span="24">
      <!-- 公告信息 -->
      <div class="clearfix">
        <span>公告信息</span>
        <div class="search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="标题">
              <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
    <!-- 下面采用一行两个展示公告，左边图片，右边上面是标题，中间部分内容，下面是查看详情按钮 -->
    <el-col :span="24">
      <el-row :gutter="20" class="notice">
        <el-col :span="12" v-for="item in noticeList.data" :key="item.id" v-if="noticeList.data.length > 0">
          <div class="notice-item">
            <div class="notice-item-img">
              <img :src="JSON.parse(item.img)[0]" alt="" />
            </div>
            <div class="notice-item-content">
              <div class="notice-item-title">{{ item.title }}</div>
              <!-- innerhtml -->
              <div class="notice-item-desc" v-html="item.content"></div>
              <div class="notice-item-time">{{ item.time }}</div>
              <div class="notice-item-btn">
                <el-button type="primary" @click="handleDetail(item.content)">查看详情</el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="24" v-else>
          <div style="text-align: center">暂无数据</div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, h } from 'vue'
import request, { baseURL } from '@/utils/request'
import { userInfoStore } from '@/stores/userInfo'
// 导入tinyMCE
import Editor from '@tinymce/tinymce-vue'
const carousel = ref([
  'src/assets/img/6b89cdb6accdb9d39010c6e1135693d6.jpeg',
  'src/assets/img/588077dfc97f40de8e2d3e27c2101239.jpeg',
  'src/assets/img/d7e3766a7ad7b353227de74b973ea9e1.jpeg',
  'src/assets/img/dc55010ce15b126f0e5e07c9785418f0.jpg'
])
const noticeList:any = reactive({
  data: []
})
onMounted(async () => {
  // 获取公告信息
  const res = await request.get('/api/officialNewsInfo', {
    params: {
      page: 1,
      pageSize: 999999999999999,
    }
  })
  console.log(res.data.list)
  noticeList.data = [...res.data.list]
})
const form = reactive({
  title: ''
})
const search = async () => {
  const res = await request.get('/api/officialNewsInfo', {
    params: {
      ...form,
      page: 1,
      pageSize: 999999999999999,
    }
  })
  noticeList.data = [...res.data.list]
}
//弹窗展示详情
const handleDetail = (content:string) => {
  ElMessageBox({
    title: '详情',
    message: h('div', {
      innerHTML: content
    }),
    dangerouslyUseHTMLString: true,
    showCancelButton: false,
  })
}
</script>

<style scoped lang="scss">
.show-official-news{
  width: calc(100% - 40px);
  height: 100%;
  margin: 20px;
  overflow: auto;
}
.clearfix{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    span{
        font-size: 20px;
        font-weight: bold;
    }
    .search{
        .demo-form-inline{
            margin-left: 20px;
        }
    }

}
.notice{
  .notice-item{
    display: flex;
    margin-bottom: 20px;
    .notice-item-img{
        width: 200px;
        height: 200px;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .notice-item-content{
        flex: 1;
        padding: 0 20px;
        .notice-item-title{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .notice-item-desc{
            margin-bottom: 20px;
        }
        .notice-item-time{
            margin-bottom: 20px;
        }
        .notice-item-btn{
            text-align: left;
        }
    }
}
}


</style>

<style>
.carousel-img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
