<script setup>
import { onMounted } from 'vue'
// 初始化文章数据（确保在应用启动时加载）
import { useBlogStore } from './stores/blog'
const blogStore = useBlogStore()
onMounted(() => {
  blogStore.initBlogs()
})

</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
