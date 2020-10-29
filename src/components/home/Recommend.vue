<template>
  <a-carousel arrows autoplay class="recommend">
    <template v-slot:prevArrow>
      <div class="custom-slick-arrow" style="left: 10px;zIndex: 1">
        <left-circle-outlined />
      </div>
    </template>
    <template v-slot:nextArrow>
      <div class="custom-slick-arrow" style="right: 10px">
        <right-circle-outlined />
      </div>
    </template>
    <div><h3>1</h3></div>
    <div><h3>2</h3></div>
    <div><h3>3</h3></div>
    <div><h3>4</h3></div>
  </a-carousel>
</template>

<script>
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';

export default {
  name: "Recommend",
  components: {
    LeftCircleOutlined,
    RightCircleOutlined
  }
}
</script>

<style scoped lang="scss">
.ant-carousel {
  margin: 0 auto;
  width: 800px;

  @media screen and (max-width: 1350px) {
    width: 100%;
  }

  ::v-deep(.slick-slide) {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
  }

  ::v-deep(.slick-arrow.custom-slick-arrow) {
     width: 25px;
     height: 25px;
     font-size: 25px;
     color: #fff;
     background-color: rgba(31, 45, 61, 0.11);
     opacity: 0.3;
  }
  ::v-deep(.custom-slick-arrow:before) {
    display: none;
  }
  ::v-deep(.custom-slick-arrow:hover) {
    opacity: 0.5;
  }

  ::v-deep(.slick-slide h3) {
    color: #fff;
  }
}
</style>