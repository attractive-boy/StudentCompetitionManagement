<script setup lang="ts">
import { ref } from "vue";
const radio = ref("teacher");
const onSubmit = (e: Event) => {
  e.preventDefault();
  // 获取表单数据
  const formData = new FormData(e.target as HTMLFormElement);
  // 获取表单数据
  const name = formData.get("registerName");
  const password = formData.get("registerPassword");
  const passwordConfirm = formData.get("registerPasswordConfirm");
  const email:any = formData.get("registerEmail");
  const emailCode:any = formData.get("registerEmailCode");
  const role = radio.value;
  // 验证表单数据
  // 如果其中有一项为空,则提示用户
  if (!name || !password || !passwordConfirm || !email || !emailCode) {
    ElMessage.error(`${name ? "" : "用户名 "}${password ? "" : "密码 "}${passwordConfirm ? "" : "确认密码 "}${email ? "" : "邮箱 "}${emailCode ? "" : "邮箱验证码 "}不能为空`);
    return;
  }
  // 如果密码和确认密码不一致,则提示用户
  if (password !== passwordConfirm) {
    ElMessage.error("两次输入的密码不一致");
    return;
  }
  // 如果邮箱格式不正确,则提示用户
  if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g.test(email)) {
    ElMessage.error("邮箱格式不正确");
    return;
  }
  // 如果邮箱验证码不是6位数字,则提示用户
  if (!/^\d{6}$/g.test(emailCode)) {
    ElMessage.error("邮箱验证码格式不正确");
    return;
  }
  // 发送请求
  
};
</script>

<template>
  <form v-on:submit="onSubmit">
    <div class="inputGroup">
      <label for="registerName" id="registerNameLabel">用户名</label>
      <input id="registerName" maxlength="254" name="registerName" />
    </div>
    <div class="inputGroup">
      <label for="registerPassword" id="registerPasswordLabel">密码</label>
      <input id="registerPassword" type="password" maxlength="254" name="registerPassword" />
    </div>
    <div class="inputGroup">
      <label for="registerPasswordConfirm" id="registerPasswordConfirmLabel">确认密码</label>
      <input id="registerPasswordConfirm" type="password" maxlength="254" name="registerPasswordConfirm" />
    </div>
    <!-- 邮箱 -->
    <div class="inputGroup">
      <label for="registerEmail" id="registerEmailLabel">邮箱</label>
      <input id="registerEmail" maxlength="254" name="registerEmail" />
    </div>
    <!-- 邮箱验证码: 6位数字,右边可以点击获取,点击后按钮变灰,倒计时60s -->
    <div class="inputGroup">
      <label for="registerEmailCode" id="registerEmailCodeLabel">邮箱验证码</label>
      <input id="registerEmailCode" maxlength="6" name="registerEmailCode" />
      <button class="getEmailCode" type="button">获取</button>
    </div>
    <!-- 角色: 教师/学生 -->
    <div class="inputGroup roleInput">
      <label class="selectRole">角色</label>
      <input type="radio" id="teacher" value="teacher" v-model="radio" />
      <label for="teacher">教师</label>
      <input type="radio" id="student" value="student" v-model="radio" />
      <label for="student">学生</label>
    </div>
    <button type="submit">注册</button>
    <!-- 已有账号? 登录 -->
    <div class="inputGroup">
      <a href="/login">已有账号? 登录</a>
    </div>
  </form>
</template>

<style scoped lang="scss">
/* colors */
$darkBlue: #217093;
$medBlue: #4eb8dd;
$lightBlue: #ddf1fa;
$inputBG: #f3fafd;

form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  width: 100%;
  max-width: 500px;
  background-color: #FFF;
  margin: 0;
  padding: 2.25em;
  box-sizing: border-box;
  border: solid 1px #DDD;
  border-radius: .5em;
  font-family: 'Source Sans Pro', sans-serif;

  .title {
    text-align: center;
    font-size: 1.5em;
    color: #217093;
    font-weight: 700;
    font-family: inherit;
  }

  .inputGroup {
    margin: 0 0 2em;
    padding: 0;
    position: relative;

    &:last-of-type {
      margin-bottom: 0;
    }

    &.roleInput {
      margin: 0;
      padding: 0;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      //内容不换行
      white-space: nowrap;

      input {
        height: 20px;

        &:focus {
          box-shadow: none;
          border: none;
        }

        &[type="radio"] {
          // 向下偏移
          margin-top: 5px;
          // 使label可以点击
          cursor: pointer;
        }
      }

      label {
        // 文字垂直居中
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
    }

    .getEmailCode {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 95px;
      height: 47px;
      border-radius: 0 4px 4px 0;
      font-size: 18px;
      color: #FFF;
      font-weight: 600;
      font-family: inherit;
      transition: background-color .2s ease-out;

      &:hover,
      &:active {
        background-color: $darkBlue;
      }
    }
  }

  label {
    margin: 0 0 12px;
    display: block;
    font-size: 1.25em;
    color: #217093;
    font-weight: 700;
    font-family: inherit;
  }

  input {
    display: block;
    margin: 0;
    padding: 0 1em 0;
    // padding: .875em 1em 0;
    background-color: $inputBG;
    border: solid 2px $darkBlue;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    font-size: 1.55em;
    color: #353538;
    font-weight: 600;
    font-family: inherit;
    transition: box-shadow .2s linear, border-color .25s ease-out;

    &:focus {
      outline: none;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, .1);
      border: solid 2px $medBlue;
    }
  }

  button {
    display: block;
    margin: 0;
    padding: .65em 1em 1em;
    background-color: $medBlue;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: none;
    width: 100%;
    height: 65px;
    font-size: 1.55em;
    color: #FFF;
    font-weight: 600;
    font-family: inherit;
    transition: background-color .2s ease-out;

    &:hover,
    &:active {
      background-color: $darkBlue;
    }
  }
}</style>