<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const circleUrl = ref('https://img2.baidu.com/it/u=2519562163,3079643511&fm=253&app=138&f=JPEG?w=800&h=1067')

onMounted(() => {
  // 组件加载时，Store 已自动从 localStorage 恢复数据
  console.log('当前用户:', userStore.user)
  console.log('当前 token:', userStore.token)

  // 如果需要，可以手动刷新数据
  // userStore.restoreFromLocalStorage()
})
</script>
<template>
  <div class="common-layout">
    <header>
      <div class="header-top">
        <div>欢迎<strong>{{ userStore.user.username }}</strong>来到的BUSS个人博客</div>
        <div class="block">
          <el-avatar
          :size="35"
          :src="circleUrl">
        </el-avatar>
        </div>
      </div>
    </header>
    <main><router-view></router-view></main>
    <footer>buss的个人博客 ©2026 Created by 图图大王</footer>
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  header {
    width: 100%;
    height: 80vh;
    background: url('/src/assets/banner.jpg') center/cover;
    .header-top {
      width: 100%;
      height: 60px;
      border-radius: 0 0 10px 10px;
      background-color: rgba(231, 245, 255,0.3);
      display: flex;
      justify-content: space-between;
      align-items:center;
      color: #fff;
        div {
            padding: 0 20px;
        }
    }
  }
  main {
    height: 550px;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
    }


}
</style>
