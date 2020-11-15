<template>
  <div class="repository">
    <a-tabs default-active-key="1" size="large" :animated="false">
      <a-tab-pane key="1" tab="My Repository">
        <a-list :grid="{ gutter: 16, sm: 1, md: 2 }" :data-source="myRepository">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card :hoverable="true" class="r-card" @click="jump(item.link)">
              <p><b>{{ item.name }}</b></p>
              <span>{{ item.description }}</span>
            </a-card>
          </a-list-item>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Star Repository">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  name: "Repository",
  data() {
    return {
      myRepository: require('@/assets/mock/Repository')
    }
  },
  methods: {
    jump(url) {
      window.open(url)
    }
  }
}
</script>

<style scoped lang="scss">
.repository {
  .r-card {
    border-radius: 8px;
    border-width: 1.5px;
    height: 120px;
  }
}
</style>