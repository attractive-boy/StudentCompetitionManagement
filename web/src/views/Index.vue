<template>
  <div class="index">
    <VueHeader />
    <div class="index-body">
      <div class="index-sider">
        <el-menu :default-active="activeIndex" router unique-opened>
          <el-menu-item index="/">
            <el-icon>
              <location />
            </el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <!-- 用户头像图标 -->
                <avatar />
              </el-icon>
              <span>个人中心</span>
            </template>
            <el-menu-item index="/changepassword">修改密码</el-menu-item>
            <el-menu-item index="/usercenter">个人中心</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2" v-if="user.userInfo().role === 'teacher'">
            <template #title>
              <el-icon>
                <document />
              </el-icon>
              <span>公告信息管理</span>
            </template>
            <el-menu-item index="/officialnews">公告信息</el-menu-item>
          </el-sub-menu>
          <!-- 学生管理 -->
          <el-sub-menu v-if="user.userInfo().role === 'teacher'" index="3">
            <template #title>
              <el-icon>
                <document />
              </el-icon>
              <span>学生管理</span>
            </template>
            <el-menu-item index="/student">学生</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon>
                <document />
              </el-icon>
              <span>竞赛信息{{ user.userInfo().role == 'teacher' ? '管理' : '' }}</span>
            </template>
            <el-menu-item index="/competition">竞赛信息</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5" v-if="user.userInfo().role === 'teacher'">
            <template #title>
              <el-icon>
                <document />
              </el-icon>
              <span>竞赛报名管理</span>
            </template>
            <el-menu-item index="/competitionapply">竞赛报名</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="6">
            <template #title>
              <el-icon>
                <document />
              </el-icon>
              <span>竞赛成绩{{ user.userInfo().role == 'teacher' ? '管理' : '' }}</span>
            </template>
            <el-menu-item index="/competitionresult">竞赛成绩</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="index-content">
        <div class="index-content-body">
          <RouterView />
          <!-- 网格布局上面一个下面两个，间距20px -->
          <!-- 如果不是首页就隐藏 hidden -->
          <el-row
            :gutter="20"
            class="grid-content"
            :style="{ visibility: vueWindow.location.pathname === '/' ? 'visible' : 'hidden' }"
          >
            <el-col :span="24" style="margin-bottom: 20px">
              <el-carousel indicator-position="outside">
                <el-carousel-item v-for="item in carousel" :key="item">
                  <div
                    :style="{ backgroundImage: 'url(' + JSON.parse(item.img)[0] + ')' }"
                    class="carousel-img"
                  >
                    <h1 class="carousel-title">{{ item.title }}</h1>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </el-col>
            <el-col :span="16">
              <el-card class="box-card">
                <div class="clearfix">
                  <span>竞赛参与统计</span>
                </div>
                <div id="main" style="width: 100%; height: 210px"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card">
                <div class="clearfix">
                  <span>高分榜</span>
                </div>
                <div style="width: 100%; height: 210px">
                  <ul class="infinite-list" style="overflow: auto" id="scroll">
                    <li v-for="item in tableData" :key="item.id" class="infinite-list-item">
                      <el-row>
                        <el-col :span="8">
                          <span>{{ item.name }}</span>
                        </el-col>
                        <el-col :span="8">
                          <span>{{ item.grade }}</span>
                        </el-col>
                        <el-col :span="8">
                          <span>{{ item.title }}</span>
                        </el-col>
                      </el-row>
                    </li>
                  </ul>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import router from '@/router'
import { userInfoStore } from '@/stores/userInfo'
import request from '@/utils/request'
import { computed, onMounted, ref } from 'vue'
// echarts引入
import * as echarts from 'echarts'

const user = userInfoStore()
const carousel: any = ref([])
const vueWindow = window
// 根据路由判断当前激活的菜单
const activeIndex = computed(() => {
  return vueWindow.location.pathname
})
// 获取轮播图的图片和标题
const getCarousel = async () => {
  const res = await request.get('/api/officialNewsInfo', {
    params: {
      page: 1,
      pageSize: 9999999
    }
  })
  carousel.value = res.data.list
}
onMounted(async () => {
  await getCarousel()
  await getHighScore()
  await getCompetitionApply()
  echartinit()
})

// 高分榜
const tableData: any = ref([])
const getHighScore = async () => {
  const res = await request.get('/api/competitionApply/highScore', {
    params: {
      page: 1,
      pageSize: 20
    }
  })
  tableData.value = tableData.value.concat(res.data.list)
}
const scroll = () => {}
const competitionStatics = ref([])
//获取不同竞赛的报名人数
const getCompetitionApply = async () => {
  const res = await request.get('/api/competitionApply/competitionApplyCount')
  competitionStatics.value = res.data.list
}
const echartinit = () => {
  const myChart = echarts.init(document.getElementById('main') as HTMLDivElement)
  const option = {
    tooltip: {},
    legend: {
      data: ['参与人数']
    },
    xAxis: {
      data: competitionStatics.value.map((item: any) => item.title)
    },
    yAxis: {},
    series: [
      {
        name: '参与人数',
        type: 'bar',
        data: competitionStatics.value.map((item: any) => item.count)
      }
    ]
  }
  myChart.setOption(option)
}
</script>
<style scoped lang="scss">
.index {
  padding: 20px;
  background-color: #f5f5f5;

  .index-body {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100vh - 140px);
    background-color: #fff;
    border-radius: 0 0 10px 10px;

    .index-sider {
      width: 250px;
      height: calc(100vh - 140px);
      background-color: #fff;
      border-radius: 0 0 0 10px;
      padding: 20px;
      margin-right: 20px;

      span {
        font-size: 20px;
        height: 70px;
        line-height: 70px;
        font-weight: 700;
      }

      .el-sub-menu__title,
      .el-menu {
        border-right: none;
      }

      .el-menu-item {
        font-size: 18px;
        height: 70px;
        font-weight: 700;
        line-height: 70px;
      }

      .el-sub-menu {
        .el-menu-item {
          //文字缩进
          padding-left: 70px;
        }
      }
    }

    .index-content {
      width: calc(100% - 270px);
      height: calc(100vh - 140px);
      background-color: rgb(229, 233, 242);
      border-radius: 0 0 10px 0;
      padding: 20px;

      .index-content-body {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 10px;
        .grid-content {
          padding: 20px;
        }
        .carousel-img {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          // 标题再最下面，文字居中，黑色背景，透明度0.5
          .carousel-title {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.3);
            color: #fff;
            padding: 10px 0;
          }
        }
        .clearfix {
          // 加粗，大号
          span {
            font-weight: 700;
            font-size: 20px;
          }
        }
        .infinite-list {
          // 高分榜 一次五条
          li {
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #e9e9e9;
            padding: 0 20px;
          }
        }
      }
    }
  }
}
</style>
