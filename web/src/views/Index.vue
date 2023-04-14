
<template>
    <div class="index">
        <VueHeader />
        <div class="index-body">
            <div class="index-sider">
                <el-menu default-active="/" router unique-opened>
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
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <document />
                            </el-icon>
                            <span>公告信息管理</span>
                        </template>
                        <el-menu-item index="/officialnews">公告信息</el-menu-item>
                    </el-sub-menu>
                    <!-- 竞赛分类 -->
                    <el-sub-menu v-if="user.userInfo().role === 'teacher'" index="3">
                        <template #title>
                            <el-icon>
                                <document />
                            </el-icon>
                            <span>竞赛分类管理</span>
                        </template>
                        <el-menu-item index="/competitioncategory">竞赛分类</el-menu-item>
                    </el-sub-menu>
                    <!-- 学生管理 -->
                    <el-sub-menu v-if="user.userInfo().role === 'teacher'" index="4">
                        <template #title>
                            <el-icon>
                                <document />
                            </el-icon>
                            <span>学生管理</span>
                        </template>
                        <el-menu-item index="/student">学生</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="5">
                        <template #title>
                            <el-icon>
                                <document />
                            </el-icon>
                            <span>竞赛信息管理</span>
                        </template>
                        <el-menu-item index="/competition">竞赛信息</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="6">
                        <template #title>
                            <el-icon>
                                <document />
                            </el-icon>
                            <span>竞赛报名管理</span>
                        </template>
                        <el-menu-item index="/competitionapply">竞赛报名</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="7">
                        <template #title>
                            <el-icon>
                                <document />
                            </el-icon>
                            <span>竞赛成绩管理</span>
                        </template>
                        <el-menu-item index="/competitionresult">竞赛成绩</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div>
            <div class="index-content">
                <div class="index-content-body">
                    <RouterView />
                </div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
import { userInfoStore } from '@/stores/userInfo'

const user = userInfoStore()
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
            }
        }
    }
}
</style>