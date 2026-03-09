import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { userApi } from '@/api/UserData'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('User', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  // 初始化/获取用户信息（从localStorage恢复）
  const initUserInfo = () => {
    const userStored = localStorage.getItem('userInfo')
    console.log('userStored:', userStored);

    if (userStored) {
      try {
        userInfo.value = JSON.parse(userStored)
        console.log('userInfo.value:', userInfo);
      } catch (e) {
        console.error('解析用户信息失败', e)
      }
    }
  }

  // 更新个人资料
  const updatedProfil = async (profileData) => {
    loading.value = true
    try {
      // 更新用户信息方法的调用
      const res = await userApi.updateUserInfo(profileData)

      if (res.code === 0) {
        // 更新 userStored 的状态
        userInfo.value = res.data // 合并userInfo和res
      }

      // 将合并的userInfo存储入localStorage
      localStorage.setItem('userInfo', JSON.stringify(res.data))

      ElMessage.success('个人资料更新成功')
      return true
    } catch (error) {
      ElMessage.error(error.message || '资料更新失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 上传头像
  const uploadAvatar = async (file) => {
    loading.value = true
    try {
      const res = await userApi.uploadAvatar(file)
      if (res.code === 0) {
        // 更新头像URL
        const avatarUrl = res.data.url

        // 更新头像信息至api,更新用户信息
        const updateRes = await userApi.updateUserInfo({
          avatar_img: avatarUrl
        })

        if (updateRes.code === 0) {
          userInfo.value = updateRes.data
        }

        // 将更新的userInfo存储入localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))

        ElMessage.success('头像上传成功')
        console.log('avatar_img:', userInfo.value.avatar_img);

        return res.data.url
      }
    } catch (error) {
      ElMessage.error(error.message || '头像上传失败')
      return null
    } finally {
      loading.value = false
    }
  }

  // 修改密码
  const changePassword = async (oldPassword, newPassword) => {
    loading.value = true
    try {
      const res = await userApi.changePassword(oldPassword, newPassword)
      if (res.code === 0) {
        ElMessage.success('密码修改成功')
        return true
      } else {
        ElMessage.error(res.message || '密码修改失败')
        return false
      }
    } catch (error) {
      ElMessage.error(error.message || '密码修改失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 登录方法的调用
  const login = async loginData => {
    console.log('已进入store层');

    loading.value = true
    try {
      const res = await userApi.login(loginData)
      if (res.code === 0) {
        console.log('调取登录API成功');
        userInfo.value = res.data.user
        token.value = res.data.token
        localStorage.setItem('token', token.value)
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        return true
      } else {
        console.log('调取登录API失败');
      }
    } catch (error) {
      ElMessage.error(error.message || '登录失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 注册方法的调用
  const register = async registrationData => {
    loading.value = true
    try {
      const res = await userApi.register(registrationData)
      if (res.code === 0) {
        // 更新状态
        userInfo.value = res.data.user
        token.value = res.data.token

        // 持久化存储
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userInfo', JSON.stringify(res.data.user))
        ElMessage.success('注册成功')
        return true
      }
    } catch (error) {
      ElMessage.error(error.message || '注册失败')
      console.log('注册失败的原因：', error);
      return false
    } finally {
      loading.value = false
    }
  }

  // 退出用户登录
  const removeToken = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('已退出登录')
  }

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    if (!token.value) return null

    loading.value = true
    try {
      const res = await userApi.getUserInfo(token.value)

      if (res.code === 0) {
        userInfo.value = res.data
        localStorage.setItem('userInfo', JSON.stringify(res.data))
      }

      return res
    } finally {
      loading.value = false
    }
  }

  // 初始化 - 检查登录状态
  const init = async () => {
    if (token.value) {
      await this.fetchCurrentUser()
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!userInfo.value)
  const username = computed(() => userInfo.value?.username || '')
  const avatar = computed(() => userInfo.value?.avatar || '')
  return {
    userInfo,
    token,
    loading,

    isAuthenticated,
    username,
    avatar,

    login,
    register,
    removeToken,

    initUserInfo,
    updatedProfil,
    uploadAvatar,
    changePassword,
    fetchCurrentUser,
    init
  }
})
