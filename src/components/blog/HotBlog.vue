<template>
  <div class="hot-blog">
    <a-card title="热点文章">
      <a-list item-layout="horizontal" :data-source="hotBlogs" style="margin: 0">
        <template v-slot:renderItem="{ item, index }">
          <a-list-item>
            <a href="javascript:void(0)" @click="$router.push('/blog/' + item.id)">
              <b style="font-size: 16px">{{ index + 1 }}:</b>&nbsp;
              {{ item.title }}
            </a>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "HotBlog",
  data() {
    return {
      hotBlogs: require('@/assets/mock/HotBlog.js')
    }
  }
}
</script>

<style scoped lang="scss">
.hot-blog {
  margin-top: 110px;
  width: 300px;

  .ant-card {
    width: 100%;
    height: 100%;
    padding-bottom: 5px;

    ::v-deep(.ant-card-body) {
      padding: 0 10px 0;
    }

    .ant-list {
      text-align: start;

      li {
        padding-bottom: 2px;
      }

      a {
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>