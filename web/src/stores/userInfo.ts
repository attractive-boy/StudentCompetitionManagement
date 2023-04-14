import { ref } from 'vue'
import { defineStore } from 'pinia'

export const userInfoStore = defineStore('userInfo', () => {
  //存储用户邮箱，用户名，角色
  const user = ref({
    email: '',
    username: '',
    role: '',
  })
  const userInfo = () => {
    if (user.value.email === '') {
      return JSON.parse(localStorage.getItem('userInfo') || '{}')
    }
    return user.value
  }
  const setUserInfo = (email: string, username: string, role: string) => {
    user.value.email = email
    user.value.username = username
    user.value.role = role
    localStorage.setItem('userInfo', JSON.stringify(user.value))
  }
  return {
    userInfo,
    setUserInfo,
  }
})
