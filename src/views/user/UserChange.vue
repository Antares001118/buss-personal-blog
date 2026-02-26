<script setup>
import { ref, onMounted } from 'vue'
import useComponent from '@/views/user/component/UseComponent.vue'
import { useUserStore } from '@/stores/user'
import { Camera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userFormRef = ref(null)
const passwordFormRef = ref(null)
const fileInput = ref(null)
const uploading = ref(false)

// 表单数据
const UserForm = ref({
  username: '',
})

// 密码表单
const passwordForm = ref({
  newPassword: '',
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
    newPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ]
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
  await passwordFormRef.value?.validate(async (valid) => {
    if(!valid) return

    const submitPswData = await userStore.changePassword(
      passwordForm.value.newPassword
    )

    if (submitPswData) {
      // 清空密码表单
      passwordForm.value.newPassword = '',
      passwordFormRef.value?.clearValidate()
    }
  })
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
              <el-form-item label="更改昵称" prop="currentUsername">
                <el-input  v-model="UserForm.username"  placeholder="请输入新用户名"/>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitNameForm"
                  :loading="userStore.loading"
                >
                  保存修改
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
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" placeholder="请输入新的密码"/>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="danger"
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
}
</style>
