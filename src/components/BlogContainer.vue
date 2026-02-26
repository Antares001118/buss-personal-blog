<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const carouselImages = ref([
  {
    src: new URL('../assets/swiper1.jpg', import.meta.url), // 使用导入的图片
    title: '图片1',
  },
    {
    src: new URL('../assets/swiper2.jpg', import.meta.url), // 使用导入的图片
    title: '图片2',
  },
    {
    src: new URL('../assets/swiper3.jpg', import.meta.url), // 使用导入的图片
    title: '图片3',
  },
])
defineProps({
  title: {
    require: true,
    type: String
  }
})
const goAddBlog = () => {
  router.push('/article/add')
}
</script>

<template>
  <el-row class="blog-container">
    <el-col :span="6">
      <el-button plain @click="goAddBlog">添加文章</el-button>
      <br>
      <div class="carousel-container">
        <el-carousel>
          <el-carousel-item
            v-for="item in carouselImages"
            :key="item"
            style="height: 460px;">
              <img
              :src="item.src"
              :alt="item.title"
            >
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-col>
    <el-col :span="18">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.blog-container {
  .el-col {
    padding: 10px;
    height: 600px;
    .el-button {
      width: 100%;
      height: 120px;
      background-color: #cdcdcd;
      font-size: large;
    }
    .el-button:hover {
      border: #fff;
      color: #fff;
    }
    .carousel-container {
      padding-top: 10px;
      margin: auto;
      .el-carousel {
        width: 100%;
        height: 460px;
        overflow: hidden;
        border-radius: 5px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  }
</style>
