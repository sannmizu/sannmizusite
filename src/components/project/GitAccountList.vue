<template>
  <div class="git-account">
    <a-list>
      <img alt="logo" src="@/assets/github.jpg">
      <p>sannmizu</p>
      <a-button @click="jump">Follow Me</a-button>
    </a-list>
  </div>
</template>

<script>
export default {
  name: "GitAccountList",
  methods: {
    jump() {
      window.open('https://github.com/sannmizu')
    }
  }
}
</script>

<style scoped lang="scss">
.git-account {
  width: 300px;
  margin: 0 auto;
  display: block;

  p {
    font-size: 20px;
  }

  button {
    width: 100%;
    border-radius: 5px;
    margin: 0 auto;
  }
}
</style>