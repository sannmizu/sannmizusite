<script>
export default {
  name: "PAnchorLink",
  props: {
    autoJump: {
      type: Boolean,
      default: true
    }
  },
  inject: {
    // 从a-anchor中偷来的
    antAnchor: { 'default': function _default() {
        return {};
      } }
  },
  mounted() {
    const hash = location.hash
    if (hash && this.autoJump) {
      setTimeout(() => {
        this.antAnchor.scrollTo(hash)
      }, 170)
    }
  }
}
</script>

<style scoped>

</style>