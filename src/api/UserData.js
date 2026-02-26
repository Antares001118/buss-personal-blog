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
  const userStored = localStorage.getItem('currentUser')
  return userStored ? JSON.parse(userStored) : null
}


// token 生成
const generateToken = (userId) => {
  return 'token_' + userId + '_' + Date.now()
}

export const userApi = {
  // 获取用户信息
  getUserInfo(token) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if(!token) {
          reject({
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
          reject({
            code: 102,
            message: '用户不存在'
          })
          return
        }

        const { password: _, ...userWithoutPassword } = user

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
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))

        // 同时更新 users 列表中的用户信息
        const users = getUsersFromStorage()
        const userIndex = users.findIndex(u => u.id === updatedUser.id)
        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          saveUsers(users)
        }
        resolve({ code: 0, data: updatedUser }) // data: updatedUser：更新后的用户数据
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
  changePassword(newPassword) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = getCurrentUser()
        const users = getUsersFromStorage()

        const userIndex = users.findIndex(u => u.id === currentUser.id)
        if (userIndex === -1) {
          resolve({ code: 1, message: '用户不存在' })
          return
        }

        users[userIndex].password = newPassword
        saveUsers(users)
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
        const { username, password } = registrationData
        console.log('API注册层已接收到注册请求');

        // 1. 获取现有用户
        const users = getUsersFromStorage()

        // 2. 创建新用户5rt4
        const newUser = {
          id: Date.now(),
          username,
          password,
          avatar_img: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          createdAt: new Date().toISOString()
        }

        // 3. 保存用户
        users.push(newUser)
        saveUsers(users)

        // 4. 返回成功（不返回密码）
        const { password: _, ...userWithoutPassword } = newUser
        resolve({
          code: 0,
          data: userWithoutPassword,
          message: '注册成功'
        })
      }, 300)
    })
  },

  // 简单登录
  login(loginData) {
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        const { username, password } = loginData

        // 1. 获取用户
        const users = getUsersFromStorage()
        const user = users.find(u => u.username === username)

        // 2.1 验证用户
        if (!user) {
          reject ({
            code: 102,
            message: '用户不存在'
          })
          return
        }
        // 2.2 验证密码
        if (user.password !== password) {
          reject({
            code: 103,
            message: '密码错误'
          })
          return
        }

        // 3. 生成token
        const token = generateToken(user.id)

        // 4. 返回用户信息（不返回密码）和token
        const { password: _, ...userWithoutPassword } = user
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
        console.log('已保存 currentUser:', userWithoutPassword)
        resolve({
          code: 0,
          data: {
            user: userWithoutPassword,
            token
          },
          message: '登录成功'
        })
      }, 500)
    })
  },
}
