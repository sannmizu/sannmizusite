<template>
  <a-page-header
      :title="title"
      class="blog-header"
  >
    <template v-slot:tags>
      <a-tag :color="blogTag.color">
        {{ blogTag.name }}
      </a-tag>
    </template>
    <span class="blog-header-date">
      {{ date }}
    </span>
  </a-page-header>
</template>

<script>
const tagArray = [
  {
    type: 'original',
    name: '原创',
    color: 'red'
  },
  {
    type: 'reprint',
    name: '转载',
    color: 'blue'
  }
]

export default {
  name: "BlogHeader",
  props: {
    title: String,
    date: String,
    original: Boolean
  },
  computed: {
    blogTag() {
      if (this.original) {
        return tagArray[0]
      }
      return tagArray[1]
    }
  }
}
</script>

<style scoped lang="scss">
.blog-header {
  border-bottom: 1px solid rgb(235, 237, 240);

  ::v-deep .ant-page-header-heading-title {
    font-size: 30px;
    line-height: 38px;
  }

  .blog-header-date {
    font-size: 16px;
    float: right;
  }
}
</style>