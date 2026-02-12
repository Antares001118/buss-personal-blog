<script setup>
import { ref, computed } from 'vue'
import BlogContainer from '@/components/BlogContainer.vue'
import { getBlogListData } from '@/api/BlogData'
import { useRouter } from 'vue-router'
const pageSize = ref(5)
const currentPage = ref(1)
const router = useRouter()
const BlogListData = ref([])
const handlePageChange = (newPage) => {
  currentPage.value = newPage // 更新当前页码
}
const getBlogList = async () => {
  const res = await getBlogListData()
  BlogListData.value = res.data
  console.log(BlogListData);

}
getBlogList()

const PageData = computed(() => {
  const start = (currentPage.value - 1) * 5
  return BlogListData.value.slice(start, start + pageSize.value)
})

const handleRowClick = (item) => {
   router.push(`/article/details/${item.id}`)
}
</script>

<template>
  <BlogContainer>
    <div class="blogList">
      <el-table :data="PageData" stripe style="width: 100%" @row-click="handleRowClick">
          <el-table-column prop="image" label="image" width="100" >
            <template #default="scope">
              <img
                :src="scope.row.image"
                alt="头像"
                 style="height: 60px;object-fit: cover;border-radius: 10%;"
              />
           </template>
          </el-table-column>
          <el-table-column prop="title" label="title" />
          <el-table-column prop="date" label="Date" width="150" />
          <el-table-column prop="classify" label="classify" width="150"/>

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
  height: 100%;
  .pagination-block {
  margin-top: 20px;
}
}
</style>
