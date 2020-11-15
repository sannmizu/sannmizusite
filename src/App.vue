<template>
  <!-- vue3中外面自动套了层app，vue2中没有 -->
  <div id="app">
    <a-layout class="app-layout">
      <header-wrapper></header-wrapper>
      <main-wrapper></main-wrapper>
      <a-layout-footer class="app-footer">
        备案号：<a href="http://beian.miit.gov.cn/" target="_blank">湘ICP备 2020020630号</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import HeaderWrapper from "@/components/HeaderWrapper";
import MainWrapper from "@/components/MainWrapper";

export default {
  name: "APP",
  components: {
    MainWrapper, HeaderWrapper
  }
}
</script>

<style lang="scss">
/* vue2中没有::v-deep()的语法，这是vue3新增且推荐的 */

#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  background: #f5f6f7;

  .app-layout {
    width: 100%;
    min-height: 100%;
    background: #f5f6f7;
  }

  .app-footer {
    text-align: center;
    padding: 16px 50px;
    background: #0c102d;
    color: #dbdbdb;

    a {
      color: white;
    }
  }
}
</style>