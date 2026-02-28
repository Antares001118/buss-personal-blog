<script setup>
import { ref, onMounted } from 'vue'
import useComponent from '@/views/user/component/UseComponent.vue'
import { useUserStore } from '@/stores/user'
import { Camera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const userFormRef = ref(null)
const passwordFormRef = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
const pswStrength = ref('')
const strengthClass = ref('')

// 表单数据
const UserForm = ref({
  username: '',
})

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})


// 用户信息表单验证规则
const UserFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名必须是2-10位的字符', trigger: 'blur' }
  ]
}

// 密码验证规则
const passwordFormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur'},
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 判断value和当前form中的password是否一致
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

// 检查密码强度
const checkpswStrength = (psw) => {
  if (!psw) return { text: '', level: 'weak' }
  let score = 0
  if (psw) score += 1
  if (/[A-Z]/.test(psw)) score++
  if (/[0-9]/.test(psw)) score++
  if (/[^A-Za-z0-9]/.test(psw)) score++
  if (score >= 3) return { text: '强', level: 'strong' }
  if (score >= 2) return { text: '中', level: 'medium' }
  return { text: '弱', level: 'weak' }
}

// 更新密码强度
const updatePasswordStrength = (psw) => {
  const strength = checkpswStrength(psw)
  pswStrength.value = strength.text
  strengthClass.value = strength.level
}

// 加载用户信息
onMounted(() => {
  userStore.initUserInfo()
  if (userStore.userInfo) {
     console.log('UserForm的数据：',UserForm.value);
    UserForm.value.username = userStore.userInfo.username
  } else {
    console.log('userStore.userInfo不存在');
  }
})

// 提交新的username
const submitNameForm = async () => {
  const valid = await userFormRef.value?.validate().catch(() => false)
  if (!valid) return
  try {
    const success = await userStore.updatedProfil({
      username: UserForm.value.username,
    })
    if (success) {
      UserForm.value.username = userStore.userInfo.username
      ElMessage.success('用户名修改成功')
    } else {
      // 如果更新失败，恢复原来的用户名
      UserForm.value.username = userStore.userInfo.username
      ElMessage.error('修改失败，请重试')
    }
  } catch (error) {
    console.error('修改用户名失败:', error)
    ElMessage.error('修改失败：' + (error.message || '未知错误'))
  }
}

// 提交新的密码
const submitPswForm = async () => {
  try {
    await passwordFormRef.value?.validate(async (valid) => {
      if(!valid) return

    await ElMessageBox.confirm('确定要修改密码吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

      const submitPswData = await userStore.changePassword(
        passwordForm.value.oldPassword,
        passwordForm.value.newPassword
      )

      if (submitPswData) {
        // 清空密码表单
        passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' },
        passwordFormRef.value?.clearValidate()
        ElMessage.success('密码修改成功')
      } else {
      ElMessage.error('密码修改失败')
      }
    })
  } catch (error) {
    if (error !== 'cancel') console.log('用户取消操作')
  }
}

/* // 将图片转变为base64
const avaURL = ref('')
const onAvatarFile = uploadFile => {
  console.log('avaURL:', avaURL);
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    avaURL.value = reader.result
    UserForm.value.avatar_img = reader.result
  }
} */

// 触发文件选择
const triggerFileSelect = () => {
  fileInput.value.click()
}

// 处理头像变更
const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if(!file) return
  uploading.value = true
  try {
    const Avaurl= await userStore.uploadAvatar(file)
    if (Avaurl) {
    // 上传成功，头像已自动更新
    ElMessage.success('头像上传成功')
    console.log('头像更新成功:', Avaurl)}
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error(error.message || '头像上传失败')
  } finally {
      uploading.value = false
  }


}
</script>

<template>
  <useComponent>
        <el-card>
          <!-- 头像提交 -->
          <div class="avatar-section">
            <h3>个人头像</h3>
            <el-avatar
              :size="100"
              :src="userStore.userInfo.avatar_img"
              fit="cover"
              class="avatar" />
            <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleAvatarChange"
             />
            <div class="avatar-upload"  @click="triggerFileSelect">
              <el-icon><Camera /></el-icon>
              <span>{{ uploading ? '上传中...' : '更新头像' }}</span>
            </div>
          </div>
          <el-divider />

          <!-- 用户名提交 -->
          <div class="nameChange-section">
            <h3>修改用户名</h3>
            <el-form
            ref="userFormRef"
            :model="UserForm"
            :rules="UserFormRules"
            >
              <el-form-item label="新昵称" prop="username"  label-width="125px">
                <el-input v-model="UserForm.username" :prefix-icon="User" placeholder="请输入新用户名"/>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitNameForm"
                  :loading="userStore.loading"
                >
                  修改昵称
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-divider />

          <!-- 新密码提交 -->
          <div class="pswChange-section">
            <h3>修改密码</h3>
            <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordFormRules"
            >
              <el-form-item label="旧密码" prop="oldPassword" label-width="125px">
                <el-input
                v-model="passwordForm.oldPassword"
                placeholder="请输入旧密码"
                :prefix-icon="Lock"
                type="password"
                width="200px"/>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword" label-width="125px">
                <el-input
                v-model="passwordForm.newPassword"
                placeholder="请输入新的密码"
                @input="updatePasswordStrength"
                :prefix-icon="Lock"
                type="password">
                <template #suffix>
                  <span v-if="pswStrength" :class="['strength', strengthClass]">
                    {{ pswStrength }}
                  </span>
                </template>
              </el-input>
              </el-form-item>
              <el-form-item label="再次输入新密码" prop="confirmPassword" label-width="125px">
                <el-input
                v-model="passwordForm.confirmPassword"
                placeholder="请再次输入新的密码"
                :prefix-icon="Lock"
                type="password"/>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitPswForm"
                  :loading="userStore.loading"
                >
                  修改密码
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
  </useComponent>
</template>

<style lang="scss" scoped>
.el-card {
  height: 600px;
  .strength {
    font-size: 12px;
    margin-right: 5px;
    transition: color 0.3s;
    &.strong {
      color: #67c23a;
    }
    &.medium {
      color: #e6a23c;
    }
    &.weak {
      color: #f56c6c;
    }
  }
}

</style>
