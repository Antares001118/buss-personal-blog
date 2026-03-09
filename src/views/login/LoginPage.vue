<script setup>
import{ ref  } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// 1.2. 获取 router 和 store 实例
const userStore = useUserStore()
const router = useRouter()

// 1.3. 定义响应式数据
const isLogin = ref(true)
const error = ref('')
const loginForm = ref()
const registerForm = ref()

// 2.1 Form数据对象
const formModel = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 清理form对象
const clearForm = () => {
  formModel.value = {
    username: '',
    password: '',
    confirmPassword: ''
  }
}
// 2.2 校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名必须是2-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 判断value和当前form中手机的password是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

// 1.4. 处理登录提交
const handleLogin = async () => {
  // 重置错误信息
  error.value = ''
  try {
    // 简单的前段验证
    await loginForm.value.validate()
    // 1.5. 核心调用： 调用store的login方法
    const result = await userStore.login({
      username: formModel.value.username,
      password: formModel.value.password
    })
    // 1.6. 根据结果处理
    if (result) {
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      // 登录失败
      ElMessage.error('登录失败1')
    }
  } catch (e) {
    // 捕获未预期的错误
    e.value = '登录过程出错，请重试'
    console.log('登录错误:', e)
  }
}

// 2.1 处理注册申请
const handleRegister = async () => {
  // 2.2 校验注册规则
  try {
    await registerForm.value.validate()
    const result = await userStore.register({
      username: formModel.value.username,
      password: formModel.value.password
      // 注意：confirmPassword 不需要传递给API
    })
    console.log('RegisterFormModel传达：', formModel);
    if (result) {
      console.log('注册成功')
      router.push('/')
    } else {
      // 注册失败
      error.value = result.error || '注册失败'
    }
  } catch (err){
    error.value = '注册失败，请重试'
    console.log('注册错误', err)
  }
}

const changeISlogin = () => {
  isLogin.value = !isLogin.value
  clearForm()
}
</script>

<template>
  <div class="handle-container">
    <el-card>
      <div class="handle-cardLeft">
        <div class="brand"><h1>您好呀，我们一起来看看吧</h1></div>
        <div class="illustration"><img src="/src/assets/handle.jpg" alt=""></div>
      </div>
      <div class="handle-cardRight">
        <div class="handle-header">
          <h2>{{ isLogin ? "登录账号" : "注册账号" }}</h2>
        </div>
        <el-form
        :model="formModel"
        :rules="rules"
        ref="loginForm"
        label-width="auto"
        v-if="isLogin">
          <el-form-item prop="username">
            <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
            v-model="formModel.password"
            type="password"
            :prefix-icon="Lock"
            placeholder="请输入密码"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleLogin" color="#909399"><span style="color: aliceblue;">登录</span></el-button>
          </el-form-item>
          <el-form-item>
            <el-link type="info" underline="hover"  @click="changeISlogin">没有账号？去注册→</el-link>
          </el-form-item>
        </el-form>
        <el-form
      :model="formModel"
      :rules="rules"
      ref="registerForm"
      label-width="auto"
      v-else
      >
      <el-form-item>
        <el-link type="info" underline="hover" @click="changeISlogin">←已有账号，返回登录</el-link>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
        v-model="formModel.password"
        type="password"
        :prefix-icon="Lock"
        placeholder="请输入密码"/>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
        v-model="formModel.confirmPassword"
        type="password"
        :prefix-icon="Lock"
        placeholder="请输入再次密码"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleRegister" color="#909399"><span style="color: aliceblue;">注册</span></el-button>
      </el-form-item>
        </el-form>
      </div>
    </el-card>
    </div>
</template>
<style lang="scss" scoped>
.handle-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #81B5D8 0%, #EBC3D5 100%);
  padding: 20px;
  .el-card {
    width: 1000px;
    max-width: 100%;
    background: white;
    overflow: hidden;
    border-radius: 20px;
    .handle-cardLeft {
      min-height: 300px;
      background: linear-gradient(135deg, #53302a 0%, #81B5D8 100%);
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      .brand h1 {
        color: white;
        font-size: 2rem;
        margin-bottom: 5px;
        font-weight: 600;
      }
      .illustration {
        flex: 1;
        max-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin-top: 30px;
        border-radius: 10px;
        background: #f0f0f0;
        img {
          width: 100%;
          object-fit: cover;
          object-position: center
        }
      }
      .illustration:hover {
        transition: all 0.3s ease;
        box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
        border-radius: 20px;
      }
    }
    .handle-cardRight {
      flex: 1;
      padding: 20px;
      background: white;
      .handle-header {
        margin-bottom: 20px;
        .handle-header h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 5px;
        }
      }
      .el-form {
        .el-form-item {
          margin-bottom: 20px;
        }
      }
    }
  }
}


</style>
