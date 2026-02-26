<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BlogContainer from '@/components/BlogContainer.vue'
import { useBlogStore } from '@/stores/blog'
const route = useRoute()
const BlogListData = ref([])
const DetailData = ref([])
const getBlogList = () => {
  const id = route.params.id
  const store = useBlogStore()
  BlogListData.value = store.blogs
  DetailData.value = BlogListData.value.find(item => item.id == id)
}
getBlogList()
</script>

<template>
  <BlogContainer>
      <el-card :date="DetailData">
        <template #header>
           <div class="card-header">
            <el-link @click="$router.back()" underline="hover">←返回首页</el-link>
            <div class="card-header-wrapper">
              <h2>{{DetailData.title}}</h2>
            </div>
           </div>
        </template>
        <p>{{DetailData.content}}</p>
        <template #footer>
          <span style="font-size: small;">{{DetailData.date}} | </span>
          <span style="font-size: small;">{{DetailData.classify}}</span>
        </template>
      </el-card>
  </BlogContainer>
</template>
<style lang="scss" scoped>
.el-card {
  width: 100%;
  height: 100%;
    .el-link {
      font-size: small;
      transform: translateY(-50%);
    }
  }

</style>
