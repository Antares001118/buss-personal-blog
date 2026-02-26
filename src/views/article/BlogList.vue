<script setup>
import { ref, computed } from 'vue'
import BlogContainer from '@/components/BlogContainer.vue'
import { useBlogStore } from '@/stores/blog'
import { useRouter } from 'vue-router'
import { Delete, Edit, Reading } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// 定义页码页数
const pageSize = ref(5)
const currentPage = ref(1)

// 获取路由和存储内容
const router = useRouter()
const store = useBlogStore()

 // 更新当前页码
const handlePageChange = (newPage) => {
  currentPage.value = newPage
}

// 获取博客列表数据
const BlogListData = computed(() => {
  return store.blogs || []
})

// 查看博客内容逻辑
const handleRowClick = row => {
   router.push(`/article/details/${row.id}`)
}

// 编辑博客逻辑
const onEditBlog = row => {
  router.push(`/article/edit/${row.id}`)
}

// 删除博客逻辑
const onDelBlog = row => {
  ElMessageBox.confirm(
    `确定要删除这条博客吗`,
    `删除确认`,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 确定删除
    store.DelBlog(row.id)
    ElMessage.success('删除成功')
  })
}

// 博客列表分页显示
const PageData = computed(() => {
  const start = (currentPage.value - 1) * 5
  return BlogListData.value.slice(start, start + pageSize.value)
})


</script>

<template>
  <BlogContainer>
    <div class="blogList">
      <el-table
        :data="PageData"
        stripe style="width: 100%; max-height: 100%;">
          <el-table-column prop="iamge" label="image" width="100" >
            <template #default="scope">
              <img
                :src="scope.row.cover_img"
                alt="头像"
                style="height: 80px; object-fit: cover; border-radius: 10%;"
              />
           </template>
          </el-table-column>
          <el-table-column prop="title" label="title" />
          <el-table-column prop="date" label="Date" width="150" />
          <el-table-column prop="classify" label="classify" width="150"/>
          <el-table-column prop="operation" label="operation" width="150">
            <template  #default="scope">
              <el-button color="#666699" type="info" :icon="Reading" @click="handleRowClick(scope.row)" circle />
              <el-button color="#5f9f9f" type="primary" :icon="Edit" @click="onEditBlog(scope.row)" circle />
              <el-button color="#8e2323" type="danger" :icon="Delete" @click="onDelBlog(scope.row)" circle />
            </template>
          </el-table-column>
      </el-table>
      <div class="pagination-block">
        <el-pagination
        :total="BlogListData.length"
        :page-size="5"
        :current-page="currentPage"
        @current-change="handlePageChange" />
      </div>
    </div>

  </BlogContainer>
</template>
<style lang="scss" scoped>
.blogList {
  height: 600px;
  .el-button {
    opacity: .7;
    color: #5c4545;
  }
  .el-button:hover {
    background-color: #f5f5f5;
  }
  .pagination-block {
    margin-top: 5px;
}
}
</style>
