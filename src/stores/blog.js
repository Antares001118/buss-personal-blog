import { defineStore } from "pinia";
import { MockBlogDate } from '@/api/BlogData'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    blogs: []
  }),
  actions: {
    // 初始化：从localStorage加载，若无则用mock数据
    initBlogs() {
      const stored = localStorage.getItem('myBlogList')
      if (stored) {
        this.blogs = JSON.parse(stored)
      } else {
        // 首次运用，用mock数据初始化，并存入localStorege
        this.blogs = [...MockBlogDate]
        this.saveToLocal()
      }

    },
    // 添加新博客
    addBlog(blogData) {
      return new Promise((resolve, reject) => {
        // 打印看看传入的数据
        console.log('addBlog 接收到的数据:', blogData)
        try {
          const newBlog = {
            id: Date.now(),
            ...blogData,
            createdAt: new Date().toISOString()
          }
          console.log('新博客对象:', newBlog)
          // 确保 blogs 是数组
          if (!Array.isArray(this.blogs)) {
            this.blogs = []
          }

          this.blogs.push(newBlog)
          console.log('存储的blogs', this.blogs);
          this.saveToLocal()
          resolve(newBlog)
        } catch (error) {
          reject(error)
        }
      })
    },
    // 保存到 localStorage
    saveToLocal() {
      try {
        // 深拷贝数组，移除所有响应式特性
        const blogsCopy = JSON.parse(JSON.stringify(this.blogs))
        localStorage.setItem('myBlogList', JSON.stringify(blogsCopy))
        console.log('保存成功，共', blogsCopy.length, '篇文章')
      } catch (error) {
        console.error('保存到 localStorage 失败:', error)
      }
    },
    // 根据id获取博客
    getBlogId(id) {
      return this.blogs.find(blog => blog.id === Number(id))
    },

    // 编辑博客
    updatebBlog(blogData) {
      return new Promise((resolve, reject) => {
        try {
          const index = this.blogs.findIndex(blog => blog.id === blogData.id)
          if (index === -1) {
            throw new Error('文章不存在')
          }
          this.blogs[index] = {
            ...this.blogs[index],
            ...blogData,
            updatedAt: new Date().toISOString()
          }
          this.saveToLocal()
          resolve(this.blogs[index])
        } catch (error) {
          reject(error)
        }
      })
    },

    // 删除博客
    DelBlog(id) {
      this.blogs = this.blogs.filter(blog => blog.id !== Number(id))
      this.saveToLocal()
      return true
    }
  }
})
