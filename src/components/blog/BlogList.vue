<template>
  <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="blogList">
    <a-list-item key="item.title" slot="renderItem" slot-scope="item">
      <template v-slot:extra>
        <img
            width="272"
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
        />
      </template>
      <a-list-item-meta :description="item.date">
        <template v-slot:title>
          <a-tag color="red">
            原创
          </a-tag>
          <router-link :to="'/blog/' + item.id">{{ item.title }}</router-link>
        </template>
      </a-list-item-meta>
      {{ item.preview.content }}
    </a-list-item>
  </a-list>
</template>

<script>
// eslint-disable-next-line no-unused-vars
// import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'

export default {
  name: "BlogList",
  data() {
    return {
      blogList: [],
      pagination: {
        onChange: page => {
          console.log(page);
        },
        pageSize: 10,
      }
    }
  },
  created() {
    this.blogList = require('@/assets/mock/AllBlog')
  }
}
</script>

<style scoped>

</style>