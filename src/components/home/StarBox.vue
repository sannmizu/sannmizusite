<template>
  <a-card title="最新文章">
    <template v-slot:extra><router-link to="/blog">更多</router-link></template>
    <a-list :grid="{gutter: 16, xs: 1, sm: 2, md: 4}" :data-source="newestBlog">
      <!-- ant-design-vue 2 -->
      <!--<template v-slot:renderItem="{ item }">
        <a-list-item>
          <a-card :hoverable="true" @click="openUrl(item.link)">
            <template v-slot:cover>
              <img :alt="item.link" :src="item.image"/>
            </template>
            <a-card-meta :title="item.title"></a-card-meta>
          </a-card>
        </a-list-item>
      </template>-->
      <!-- ant-design-vue 1 -->
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card :hoverable="true" @click="openUrl(item.link)">
          <template v-slot:cover>
            <img :alt="item.link" :src="item.image"/>
          </template>
          <a-card-meta :title="item.title"></a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
export default {
  name: "StarBox",
  components: {
  },
  data() {
    return {
      newestBlog: require('@/assets/mock/NewestBlog')
    }
  },
  methods: {
    openUrl(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
.ant-card {
  ::v-deep .ant-card-head {
    text-align: start;
  }
}
</style>