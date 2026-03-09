<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import 'github-markdown-css'
import BlogContainer from '@/components/BlogContainer.vue'
import { useBlogStore } from '@/stores/blog'

// 配置 marked
marked.setOptions({
  breaks: true,      // 换行符转换为 <br>
  gfm: true,         // 启用 GitHub 风格的 Markdown
  headerIds: true,   // 为标题添加 id 属性
  mangle: false
})

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

// 计算属性：渲染 Markdown
const renderedContent = computed(() => {
  if (!DetailData.value.content) return ''
  return marked(DetailData.value.content)
})
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
        <div v-html="renderedContent"></div>
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
