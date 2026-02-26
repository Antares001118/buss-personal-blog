<script setup>
import BlogContainer from '@/components/BlogContainer.vue'
import { ref, computed, onMounted  } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useBlogStore } from '@/stores/blog'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const store = useBlogStore()

// 表单数据
const form = ref({
  id: null,
  title: '',
  content: '',
  classify: '',
  cover_img: ''
})

// 编辑参数判断
const isEdit = computed(() => !!route.params.id)

// 将图片转变为base64
const imgURL = ref('')
const handleImgChange = uploadFile => {
  console.log('imgURL:', imgURL);
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgURL.value = reader.result
    form.value.cover_img = reader.result
  }
}

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请填写博客内容', trigger: 'blur' }
    // 注意：trigger 可根据需要调整
  ],
  classify: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

// 表单引用
const Blogform = ref(null)
// 提交状态
const submitting = ref(false)

// 编辑模式的加载文章数据
onMounted(async () => {
  if (isEdit.value) {
  const id = route.params.id
  console.log('编辑文章的id', id);
  // 查找文章
  const blog = store.blogs.find(item => item.id === Number(id))
  if (blog) {
    // 填充表单
    form.value.id = blog.id
    form.value.title = blog.title
    form.value.content = blog.content
    form.value.classify = blog.classify
    form.value.cover_img = blog.cover_img
  } else {
    ElMessage('未找到博客文章')
    router.push('/')
  }
  }
})

// 提交表单
const handleSubmit = async () => {
  if (!Blogform.value) return

  await Blogform.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      // 获取当前日期
      const today = new Date()
      const formattedDate = formatDate(today)
      try {
        if (isEdit.value) {
          console.log('调用编辑功能');
          // 调用编辑功能
          await store.updatebBlog({
            id: form.value.id,
            title: form.value.title,
            content: form.value.content,
            classify: form.value.classify,
            cover_img: form.value.cover_img
          })
          ElMessage.success('修改成功！')
          console.log('修改成功！');
        } else { // 调用新增功能
          console.log('调用新增功能');
          const blogData = {
            date: formattedDate,
            title: form.value.title,
            content: form.value.content,
            classify: form.value.classify,
            cover_img: form.value.cover_img
          }
          console.log('提交的纯对象:', blogData)
          await store.addBlog(blogData)
          ElMessage.success('发布成功！')
          console.log('发布成功！');
        }
        // 跳转回列表页
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } catch(error) {
        ElMessage.error('发布失败', error)
      } finally {
        submitting.value = false
      }
    } else {
      ElMessage.error('请完善博客内容！')
    }
  })
}

// 取消返回
const goBack = () => {
  router.back() // 返回上一页
}

// 日期格式化函数
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`  // 格式：2024-01-17
}
</script>

<template>
<BlogContainer>
  <div class="blog-add">
    <h1>{{ isEdit ? "编辑博客" : "添加博客"}}</h1>
    <el-form
    ref="Blogform"
    :model="form"
    :rules="rules"
    @submit.prevent="handleSubmit">
      <!-- 标题 -->
      <el-form-item label="标题" prop="title">
        <el-input
        v-model="form.title"
        placeholder="请输入标题"
        />
      </el-form-item>
      <!-- markdown内容 -->
      <el-form-item label="内容" prop="content">
         <MdEditor v-model="form.content"/>
      </el-form-item>
      <!-- 分类 -->
      <el-form-item label="分类" prop="classify">
        <el-select v-model="form.classify" placeholder="请选择分类">
          <el-option label="Self-Awareness" value="Self-Awareness" />
          <el-option label="Vitality" value="Vitality" />
          <el-option label="Lonely yet brave" value="Lonely yet brave" />
        </el-select>
      </el-form-item>
      <el-form-item label="博客封面" prop="cover_img" >
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-change="handleImgChange "
          :auto-upload="false"
        >
          <img v-if="imgURL" :src="imgURL"  class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
        type="primary"
        native-type="submit"
        :loading="submitting"
        >
        {{isEdit ? '保存修改' : '发布博客'}}
      </el-button>
      <el-button @click="goBack">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</BlogContainer>
</template>

<style lang="scss" scoped>
h1 {
  font-size: large;
}
.el-form {
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  .md-editor {
    height: 250px;
  }
  .avatar-uploader {
    .avatar {
      width: 30px;
      height: 40px;
      display: block;
      object-fit: cover;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 30px;
        height: 40px;
        text-align: center;
      }
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
  }
}
</style>
