<template>
  <a-layout-content class="main-wrapper">
    <div id="the-body">
        <router-view></router-view>
    </div>
  </a-layout-content>
</template>

<script>
export default {
  name: "MainWrapper"
}
</script>

<style scoped lang="scss">
.main-wrapper {
  width: 100%;
  margin: 80px 0 0;
  padding: 0;
  display: block;

  #the-body {
    width: 1350px;
    margin: 10px auto 10px;
    padding: 0 20px 50px;
    background: white;
    overflow: hidden;

    @media screen and (max-width: 1350px) {
      width: 100%;
    }
  }
}
</style>