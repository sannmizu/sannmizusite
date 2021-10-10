<template>
  <div class="blog-detail">
    <blog-header :title="blog.title" :date="blog.publishDate" original />
    <div class="blog-context-container">
      <v-md-editor mode="preview" v-model="blog.content" id="show-view" ref="editor" v-on:load="getTitles" />
      <a-anchor :offsetTop="100" class="blog-title-anchor">
        <a-anchor-link v-for="h2 in titles" :key="h2.lineIndex" :title="h2.parent.title" :href="'#' + h2.parent.id">
          <a-anchor-link v-for="h3 in h2.children" :key="h3.lineIndex" :title="h3.title" :href="'#' + h3.id"></a-anchor-link>
        </a-anchor-link>
        <p-anchor-link></p-anchor-link>
      </a-anchor>
    </div>
  </div>
</template>

<script>
import BlogHeader from "@/components/blog/BlogHeader";
import PAnchorLink from "@/components/util/PathAnchorLink";
export default {
  name: "BlogDetail",
  components: {PAnchorLink, BlogHeader},
  data() {
    return {
      blogId: 0,
      blog: {
      },
      titles: {
      },
      id: null
    }
  },
  inject: ['antAnchor'],
  methods: {
    getBlog(route) {
      this.blogId = route.params.blogId
      // TODO:以后封装路径参数
      let url = process.env.VUE_APP_API_BLOG_DETAIL.replace(/{blogId}/, this.blogId)
      this.axios.get(url)
      .then((response) => {
        let result = response.data
        if (result || result.code === 200) {
          let data = result.data
          this.blog = data
          console.log(data)
        }
      })
    },
    getTitles() {
      if (this.id === this.blog.bid) {
        return
      }

      const anchors = this.$refs.editor.$el.querySelectorAll(
          '.v-md-editor-preview h2,h3'
      )
      const titleEls = Array.from(anchors).filter((title) => !!title.innerText.trim())

      console.log(titleEls)
      if (!titleEls.length) {
        this.titles = []
        this.id = this.blog.bid
        return
      }

      let titleObject = null
      let titles = []
      let emptyParent = {
        id: 'not exist',
        title: '',
        lineIndex: -1
      }

      titleEls.forEach((el) => {
        let id = 'blog-title-' + el.getAttribute('data-v-md-line')
        let node = {
          id: id,
          title: el.innerText,
          lineIndex: el.getAttribute('data-v-md-line')
        }
        el.setAttribute('id', id)

        if (el.tagName.toLowerCase() === 'h2') {
          if (titleObject !== null) {
            titles.push(titleObject)
          }
          titleObject = {
            parent: node,
            children: []
          }
        } else if (el.tagName.toLowerCase() === 'h3') {
          if (titleObject !== null) {
            titleObject.children.push(node)
          } else {
            titleObject = {
              parent: emptyParent,
              children: [node]
            }
          }
        }
      })

      if (titleObject != null) {
        titles.push(titleObject)
      }
      console.log('load titles')

      this.titles = titles
      this.id = this.blog.bid
    }
  },
  created() {
    console.log('created')
    this.getBlog(this.$route)
  },
  mounted() {
    console.log('mounted')
    this.getTitles()
  },
  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate')
    if (from.path === to.path) {
      next()
    } else {
      this.getBlog(to)
      this.titles = []
      next()
    }
  },
  updated() {
    console.log('updated')
    this.getTitles()
  }
}
</script>

<style scoped lang="scss">
.blog-detail {
  width: 100%;

    .blog-context-container {
      width: 100%;
      height: 100%;
      padding-right: 200px;
      position: relative;

      #show-view {
        width: 100%;
        height: 100%;
        text-align: start;
      }

      .blog-title-anchor {
        width: 200px;
        top: 20px;
        right: 0;
        position: absolute;
      }
    }
}
</style>