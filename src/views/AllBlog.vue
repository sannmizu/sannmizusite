<template>
  <div class="blog-page">
    <div class="blog-container">
      <blog-list></blog-list>
    </div>
    <a-affix class="blog-affix">
      <hot-blog />
    </a-affix>
  </div>
</template>

<script>
import HotBlog from "@/components/blog/HotBlog";
import BlogList from "@/components/blog/BlogList";
export default {
  name: "AllBlog",
  components: {
    BlogList,
    HotBlog
  }
}
</script>

<style scoped lang="scss">
.blog-page {
  width: 100%;
  position: relative;

  .blog-container {
    padding-right: 350px;
    text-align: start;
  }

  .blog-affix {
    position: absolute;
    top: -90px;
    right: 10px;
  }
}
</style>