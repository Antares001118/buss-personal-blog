import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

export const useUserStore = defineStore('User', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  // 模拟api延迟
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  // 模拟的用户数据库
  const mockUsers = ref(JSON.parse(localStorage.getItem('userList')) || [
    { id: 1, username: '图图', password: '123456' },
    { id: 2, username: 'WAY', password:'123456'},
  ])
  // 简单登录
  // credentials,用户凭证
  const login = async credentials => {
    await delay(500) //模拟网络延迟
    // 获取formModel表单
    const { formModel } = credentials
    console.log('formModel登录调用', formModel);
    // 简单验证
    const user = mockUsers.value.find(u =>
      u.username === formModel.username && u.password === formModel.password
    )

    if (user) {
      // 1. 生成模拟的token
      token.value = 'mock-token-' + Date.now()
      // 2. 准备好要存储的用户信息（移除敏感数据）
      user.value = {...user, password:undefined }
      // 3. 将上面的数据保存起来
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      router.push('/')
      return { success: true }
    } else {
      return { success: false, error: '密码错误'}
    }
  }

  // 简单注册
  const register = async registrationData => {
    await delay(500)
    // 获取formModel表单
    const { formModel } = registrationData

    // 创建新用户
    const newUser = {
      id: mockUsers.value.length + 1,
      username: formModel.value.username,
      password: formModel.value.password
    }
    console.log('3. mockUsers.value 类型:', typeof mockUsers.value)
    // 添加到模拟数据库
    mockUsers.value.push(newUser)
    localStorage.setItem('userList', JSON.stringify(mockUsers.value))
    console.log('mockUsers添加成功', mockUsers);

    // 注册成功后自动登录
    token.value = 'mock-token-' + Date.now()
    user.value = {
      id: newUser.id,
      username: newUser.username,
      password: newUser.password
     }

    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(user.value))

    router.push('/')
    return { success: true }
  }

  // 获取用户数据
  console.log('读取的 token:', token)
  console.log('读取的 mockUsers:', mockUsers)
  console.log('读取的 user:', user)

  const getUser = localStorage.getItem('user')
  if (getUser) {
    try {
      user.value = JSON.parse(getUser)
      console.log('读取的 user:',user.value)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      // 如果解析失败，清除无效数据
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      user.value = null
      token.value = ''
    }
  } else {
    console.log('没有找到用户信息')
  }

  return {
    user,
    token,
    isAuthenticated: token.value ? true : false,
    login,
    register,
    getUser,
    mockUsers
  }
})
