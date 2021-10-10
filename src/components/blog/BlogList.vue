<template>
  <div>
    <a-pagination :current="currentPage" :pageSize="pageSize" :total="blogCount"
                  @change="onPageChange" class="top-pagination"/>
    <a-list item-layout="vertical" size="large" :data-source="blogList">
      <a-list-item key="item.title" slot="renderItem" slot-scope="item">
        <template v-slot:extra>
          <img
              width="272"
              alt="logo"
              :src='item.coverUrl || "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"'
          />
        </template>
        <a-list-item-meta :description="item.publishDate">
          <template v-slot:title>
            <a-tag color="red">
              原创
            </a-tag>
            <router-link :to="'/blog/' + item.blogId">{{ item.title }}</router-link>
          </template>
        </a-list-item-meta>
        <p>{{ item.summary }}</p>
      </a-list-item>
    </a-list>
    <a-pagination :current="currentPage" :pageSize="pageSize" :total="blogCount"
                  @change="onPageChange"/>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
// import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'

export default {
  name: "BlogList",
  data() {
    return {
      blogList: [],
      currentPage: 1,
      pageSize: 2,
      blogCount: 0
    }
  },
  created() {
    // this.currentPage = this.$route.query.p || 1
  },
  mounted() {
    this.refreshBlogList()
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this.refreshBlogList()
    },
    refreshBlogList() {
      this.axios.get(process.env.VUE_APP_API_LIST_BLOG, {
        params: {
          'page': this.currentPage,
          'limit': this.pageSize
        }
      }).then((response) => {
        let result = response.data
        if (result || result.code === 200) {
          let data = result.data
          this.blogCount = data.total
          this.currentPage = data.page
          this.blogList = data.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.ant-list-item {
  p {
    position: relative;
    line-height: 20px;
    max-height: 40px;
    overflow: hidden;
  }

  p::after {
    content: "...";
    position: absolute;
    bottom: 0;
    right: 0;
    padding-left: 20px;
    background: -webkit-linear-gradient(left, transparent, #fff 55%);
    background: -o-linear-gradient(right, transparent, #fff 55%);
    background: -moz-linear-gradient(right, transparent, #fff 55%);
    background: linear-gradient(to right, transparent, #fff 55%);
  }
}

.top-pagination {
  margin-top: 15px;
}
</style>