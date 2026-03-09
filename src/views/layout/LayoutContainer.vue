<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { CaretBottom, User, EditPen, SwitchButton } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
const router = useRouter()
const userStore = useUserStore()
userStore.initUserInfo()

const defaultAvatar = ref('https://wx2.sinaimg.cn/mw2000/a49b2405gy1i8ukcu60rvj22b91qg1kx.jpg')

onMounted(() => {
  // 组件加载时，Store 已自动从 localStorage 恢复数据
  console.log('完整的', userStore)
  console.log('当前用户:', userStore.userInfo)
  console.log('当前 token:', userStore.token)
})

// 处理下拉菜单点击
const handleCommand = async command => {
  if (command === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('您确认要退出么', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 清除本地user数据
    userStore.removeToken()
    console.log('已清除本地token');
    router.push('/login')
  } else {
    // 跳转到对应的页面
    router.push(`/user/${command}`)

  }
}
</script>
<template>
  <div class="common-layout">
    <header>
      <div class="header-banner">
        <img src="/src/assets/banner.jpg" alt="banner">
        <div class="banner-overlay"></div>
      </div>
      <div class="header-top">
        <div class="welcome-text">欢迎<strong>{{ userStore.userInfo?.username }}</strong>来到的BUSS个人博客</div>
        <el-dropdown  @command="handleCommand">
          <!-- 头像 -->
          <div class="el-dropdown-box">
            <el-avatar
            :size="40"
            :src="userStore.userInfo?.avatar_img || defaultAvatar"
            >
            </el-avatar>
            <el-icon><CaretBottom /></el-icon>
          </div>

          <!-- 头像折叠的下拉部分 -->
           <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">查看个人资料</el-dropdown-item>
              <el-dropdown-item command="change" :icon="EditPen">更改个人资料</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录账户</el-dropdown-item
              >
            </el-dropdown-menu>
           </template>
        </el-dropdown>
      </div>
    </header>
    <main><router-view></router-view></main>
    <footer>buss的个人博客 ©2026 Created by 图图大王</footer>
  </div>
</template>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
.common-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  header {
  width: 100%;
  height: 80vh;
  position: relative;
  overflow: hidden;
    .header-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;  /* 铺满，但可能裁剪 */
      }
    }
    .header-top {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      width: 100%;
      height: 70px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px;
      color: #b4bfff;
      .welcome-text {
        font-size: 16px;
        letter-spacing: 1px;
        strong {
        color: #fff;
        margin: 0 4px;
      }
      }
      .el-dropdown-box {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding-right: 20px;
        .el-avatar {
          border: 1px solid transparent;
        }
        .el-icon {
          padding-left: 10px;
          color: #fff;
          font-size: 25px;
        }
      }
    }
  }
  header
  main {
    flex: 1;
    height: 550px;
  }
  footer {
    padding-top: 10px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: #666;
    }
}
</style>
