<template>
  <a-layout-header class="header-wrapper">
    <a-row type="flex" id="the-header">
      <a-col flex="200px">
        <router-link class="logo" to="/home">
          <img alt="logo" src="@/assets/logo-sm.png">
        </router-link>
      </a-col>
      <a-col flex="auto">
        <div id="nav">
          <a-menu :selectedKeys="[current]" mode="horizontal" class="header-menu">
            <a-menu-item key="home"><router-link to="/home">精选</router-link></a-menu-item>
            <a-menu-item key="blog"><router-link to="/blog">文章</router-link></a-menu-item>
            <a-menu-item key="project"><router-link to="/project">项目</router-link></a-menu-item>
            <a-menu-item key="resource"><router-link to="/resource">资源</router-link></a-menu-item>
          </a-menu>
        </div>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script>
const pageArray = ['home', 'blog', 'project', 'resource']

export default {
  name: "HeaderWrapper",
  computed: {
    current: {
      get() {
        return this.$store.state.page
      },
      set(page) {
        this.$store.commit('setPage', page)
      }
    }
  },
  watch: {
    $route(to) {
      console.log(to)
      if (this.current === to.meta.page) {
        return
      }
      let that = this
      pageArray.forEach(function(item) {
        if (item === to.meta.page) {
          that.current = item
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.header-wrapper {
  height: 80px;
  background: white;
  position: fixed;
  z-index: 1000;
  width: 100%;
  box-shadow: 0 2px 8px #f0f1f2;

  .logo {
    display: inline;
    float: left;
  }

  #the-header {
    width: 1350px;
    margin: 0 auto;

    @media screen and (max-width: 1350px) {
      width: 100%;
    }
  }
}

#nav {
  margin: 0;
  padding: 0;
  display: inline-block;
  float: right;

  ul {
    font-size: 16px;
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  }

  .ant-menu-horizontal {
    height: 80px;
    border-bottom-color: transparent;

    .ant-menu-item, .ant-menu-submenu {
      height: 80px;
      line-height: 80px;
    }
  }
}
</style>