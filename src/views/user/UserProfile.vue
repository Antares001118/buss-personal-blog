<script setup>
import { ref } from 'vue'
import useComponent from '@/views/user/component/UseComponent.vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const defaultAvatar = ref('https://wx2.sinaimg.cn/mw2000/a49b2405gy1i8ukcu60rvj22b91qg1kx.jpg')

</script>
<template>
  <useComponent>
    <h2 style="margin-left: 20px;">个人资料</h2>
    <div class="user-profile">
      <div class="profile-header">
        <el-avatar shape="square" :size="100" :src="userStore.userInfo.avatar_img || defaultAvatar" />
         <h2 class="profile-name">{{ userStore.userInfo.username }}</h2>
      </div>
    </div>
  </useComponent>
</template>
<style lang="scss" scoped>
.user-profile {
  max-width: 60vw;
  margin: 20px auto;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 30px;
    .profile-avatar {
      margin-bottom: 15px;
      border: 4px solid #f0f2f5;
      transition: border-color 0.2s;
    }
  }
  }
.user-profile:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

</style>
