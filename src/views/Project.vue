<template>
  <div>
    <a-row type="flex">
      <a-col flex="350px">
        <git-account-list />
      </a-col>
      <a-col flex="auto">
        <repository />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import GitAccountList from "@/components/project/GitAccountList";
import Repository from "@/components/project/Repository";
export default {
  name: "Project",
  components: {
    Repository,
    GitAccountList
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
.p-slid {
  width: 300px;
}
</style>