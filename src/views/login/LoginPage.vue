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
const form = ref()

// 2.1 form数据对象
const formModel = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

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
    await form.value.validate()
    // 1.5. 核心调用： 调用store的login方法
    const result = await userStore.login({
      username: formModel.value.username,
      password: formModel.value.password
    })
    console.log('result：', result);

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
    await form.value.validate()
    const result = await userStore.register({
      username: formModel.value.username,
      password: formModel.value.password
      // 注意：confirmPassword 不需要传递给API
    })
        console.log('formModel传达：',formModel);
    if (result) {
      console.log('处理注册要求已上传到store')
      ElMessage.success('注册成功')
      isLogin.value = true
    } else {
      // 注册失败
      error.value = result.error || '注册失败'
    }
  } catch (err){
    error.value = '注册失败，请重试'
    console.log('注册错误', err)
  }
}
</script>

<template>
  <div class="login-bg">
    <div class="login-banner">
      <img src="/src/assets/login-banner.jpg" alt="" class="login-banne-img">
    </div>
    <el-form
    :model="formModel"
    :rules="rules"
    ref="form"
    label-width="auto"
    style="max-width: 300px"
    v-if="isLogin">
      <el-form-item prop="username">
        <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="formModel.password" :prefix-icon="Lock" placeholder="请输入密码"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleLogin" color="#909399"><span style="color: aliceblue;">登录</span></el-button>
        <el-button>取消</el-button>
      </el-form-item>
      <el-form-item>
        <el-link type="info" underline="hover"  @click="isLogin=false">没有账号？去注册→</el-link>
      </el-form-item>
    </el-form>
    <el-form
      :model="formModel"
      :rules="rules"
      ref="form"
      label-width="auto"
      style="max-width: 300px"
      v-else
      >
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
</template>
<style lang="scss" scoped>
.login-bg {
  height: 100vh;
  background-color:#1C2331 ;
  .login-banner {
      width: 1200px;
      height: 400px;
      margin: 20px auto;
      overflow: hidden;
      object-fit: cover;
    .login-banne-img{
      width: 100%;
    }
  }
  .el-form {
    border: 3px dotted rgba(255, 255, 255, 0.5);
    margin: 60px auto;
    padding:20px 30px;
    .el-link {
      font-size: smaller;
    }
  }
}



</style>
