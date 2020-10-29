<template>
  <div class="home">
    <div class="part">
      <img alt="logo" src="@/assets/logo-lg.png">
    </div>
    <div class="part">
      <recommend></recommend>
    </div>
    <div class="part">
      <star-box></star-box>
    </div>
  </div>
</template>

<script>
import Recommend from "@/components/home/Recommend";
import StarBox from "@/components/home/StarBox";

export default {
  name: 'Home',
  components: {
    Recommend,
    StarBox
  }
}
</script>

<style scoped lang="scss">
.home {
  .part {
    margin: 40px 0 40px 0;
    text-align: center;
  }
}
</style>