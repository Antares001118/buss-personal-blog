// 原始用户数据
const defaultUser = {
  id: 1,
  username: '图图',
  password: '123456',
  avatar_img: 'https://wx2.sinaimg.cn/mw2000/a49b2405gy1i8ukcu60rvj22b91qg1kx.jpg'
}

// 从 localStorage 获取用户列表信息
const getUsersFromStorage = () => {
  const usersStored = localStorage.getItem('users')
  if (!usersStored){
    localStorage.setItem('users', JSON.stringify([defaultUser]))
    return [defaultUser]
  }
  try {
    const parsed = JSON.parse(usersStored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// 将用户信息列表存储到 localStorage
const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users))
}

// 从 localStorage 获取当前用户信息
const getCurrentUser = () => {
  const userStored = localStorage.getItem('userInfo')
  console.log('CurrentUser(userInfo):', userStored);

  return userStored ? JSON.parse(userStored) : null
}


// token 生成
const generateToken = (userId) => {
  return 'token_' + userId + '_' + Date.now()
}

export const userApi = {
  // 获取用户信息
  getUserInfo(token) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if(!token) {
          resolve({
            code:101,
            message: '未登录'
          })
          return
        }
        // 通过token解析user
        const userId = token.split('_')[1]
        const users = getUsersFromStorage()
        const user = users.find(u => u.id === Number(userId))

        if (!user) {
          resolve({
            code: 102,
            message: '用户不存在'
          })
          return
        }

        const { password, ...userWithoutPassword } = user

        resolve({
          code: 0,
          data: userWithoutPassword,
          message: '获取成功'
        })
      }, 300)
    })
  },

  // 更新用户信息
  updateUserInfo(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = getCurrentUser()
        const updatedUser = { ...currentUser, ...userData } // 合并（覆盖）新旧数据
        const { password: _, ...userWithoutPassword } = updatedUser
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))

        // 同时更新 users 列表中的用户信息
        const users = getUsersFromStorage()
        const userIndex = users.findIndex(u => u.id === updatedUser.id)
        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          saveUsers(users)
        }
        resolve({ code: 0, data: userWithoutPassword }) // data: userWithoutPassword：更新后不含密码的用户数据
      }, 500)
    })
  },

  // 上传头像
  uploadAvatar(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve({ code: 0, data: { url: reader.result } })
      }
    })
  },

  // 修改密码
  changePassword(oldPassword, newPassword) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = getCurrentUser()
        console.log('currentUser.id:', currentUser.id);

        // 1. 获取用户数据
        const users = getUsersFromStorage()
        const user = users.find(u => u.id === currentUser.id)

        if (!user) {
          resolve({ code: 102, message: '用户不存在' })
          return
        }

        // 2. 验证原密码
        if (user.password !== oldPassword) {
          resolve({ code: 105, message: '原密码错误' })
          return
        }

        // 3. 更新密码
        user.password = newPassword
        saveUsers(users)

        // 4. 更新存储
        const updatedUser = { ...currentUser, password: newPassword }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        resolve({ code: 0, message: '密码修改成功' })
      }, 500)
    })
  },

  // 简单注册
  register(registrationData) {
    return new Promise((resolve) => {
      setTimeout(() => {

        // 1. 获取现有用户
        const users = getUsersFromStorage()

        const existingUser = users.find(u => u.username === registrationData.username)
        if (existingUser) {
          resolve({
            code: 104,
            message: '用户已存在'
          })
          return
        }

        // 2. 创建新用户
        const newUser = {
          id: Date.now(),
          ...registrationData,
          avatar_img: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          createdAt: new Date().toISOString()
        }

        // 3. 保存用户
        users.push(newUser)
        saveUsers(users)

        // **4. 自动登录
        const token = generateToken(newUser.id)

        // 5. 返回成功（不返回密码）
        const { password, ...userWithoutPassword } = newUser
        resolve({
          code: 0,
          data: {
            user: userWithoutPassword,
            token: token
          },
          message: '注册并登录成功'
        })
      }, 300)
    })
  },

  // 简单登录
  login(loginData) {
    return new Promise((resolve) => {
      setTimeout(() => {

        // 1. 获取用户
        const users = getUsersFromStorage()
        const user = users.find(u => u.username === loginData.username)

        // 2.1 验证用户
        if (!user) {
          resolve({
            code: 102,
            message: '用户不存在'
          })
          return
        }
        // 2.2 验证密码
        if (user.password !== loginData.password) {
          resolve({
            code: 103,
            message: '密码错误'
          })
          return
        }

        // 3. 生成token
        const token = generateToken(user.id)

        // 4. 返回用户信息（不返回密码）和token
        const { password, ...userWithoutPassword } = user
        resolve({
          code: 0,
          data: {
            user: userWithoutPassword,
            token: token
          },
          message: '登录成功'
        })
      }, 500)
    })
  },
}
