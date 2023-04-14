<template>
    <div class="header">
        <h1>林科大竞赛管理系统</h1>
        <!-- 右侧展示用户名 -->
        <div class="header-right">
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ user.userInfo().username }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template #dropdown>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<style scoped lang="scss">
.header {
    // 背景色，字体白色，上面两个圆角，字体靠左
    background-color: RGB(50, 64, 87);
    color: #fff;
    border-radius: 10px 10px 0 0;
    text-align: left;
    padding: 10px 20px;

    h1 {
        // 字体大小
        font-size: 40px;
        // 字体粗细
        font-weight: 700;
        // 字体间距
        letter-spacing: 2px;
        // 字体行高
        line-height: 70px;
        display: inline-block;
    }

    .header-right {
        // 右侧用户名靠右
        float: right;

        .el-dropdown-link {
            // 字体大小
            font-size: 20px;
            // 字体粗细
            font-weight: 700;
            // 字体间距
            letter-spacing: 2px;
            // 字体行高
            line-height: 70px;

            // 鼠标悬浮时的颜色
            &:hover {
                color: #409EFF;
            }

            color: #fff;
        }
    }
}
</style>
<script setup lang="ts">
import { userInfoStore } from '@/stores/userInfo'

const user = userInfoStore()
const logout = () => {
    // 清除本地存储
    localStorage.removeItem('token')
    // 跳转到登录页面
    window.location.href = '/login'
}
</script>