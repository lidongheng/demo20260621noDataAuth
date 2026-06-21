<template>
  <main class="home-view">
    <section class="home-view__panel">
      <h1>Vue 3 项目已创建</h1>
      <p>基于 Vue CLI、pnpm、Vue Router、Vuex、Pinia 和 Element Plus。</p>
      <el-button type="primary">开始开发</el-button>
    </section>
  </main>
</template>

<style lang="less" scoped>
.home-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background: #f6f8fb;
}

.home-view__panel {
  width: min(520px, 100%);
  padding: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 32px rgba(31, 45, 61, 0.08);
}

.home-view__panel h1 {
  margin: 0 0 12px;
  color: #1f2d3d;
  font-size: 28px;
  line-height: 1.3;
}

.home-view__panel p {
  margin: 0 0 24px;
  color: #606266;
  line-height: 1.7;
}
</style>
