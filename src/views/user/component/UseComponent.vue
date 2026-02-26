<script setup>
import { User, EditPen } from '@element-plus/icons-vue'
</script>

<template>
  <el-row class="use-component">
    <el-col :span="6">
      <el-menu
        active-text-color="#8F8FBD"
        background-color="#545454"
        text-color="#fff"
        :default-active="$route.path"
        style="height: 600px;overflow-y: auto;padding-top: 30px;"
        router>
        <el-menu-item index="/user/profile">
          <el-icon><User /></el-icon>
          <span>个人资料</span>
        </el-menu-item>
        <el-menu-item index="/user/change">
          <el-icon><EditPen /></el-icon>
          <span>更改资料</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="18">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<style>

</style>
