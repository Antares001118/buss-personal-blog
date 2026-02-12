<script setup>
import { ref} from 'vue'
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

</script>

<template>
  <el-row class="blog-container">
    <el-col :span="6">
      <el-card>
        去迎接应该你的更好的明天<br>
        昙花若只一现，更要开的耀眼
      </el-card>
      <br>
      <div class="carousel-container">
        <el-carousel>
          <el-carousel-item
          v-for="item in carouselImages"
          :key="item"
          style="height: 400px;">
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
    .el-card {
      height: 100px;
    }
    .carousel-container {
      margin: auto;
      .el-carousel {
        height: 400px;
        overflow: hidden;
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
