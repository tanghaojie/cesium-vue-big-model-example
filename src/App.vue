<template>
  <div id="app">
    <all />
  </div>
</template>

<script>
import all from './components/all'

export default {
  name: 'App',
  components: {
    all
  }
}
</script>

<style lang="scss">
html,
body {
  font-size: 16px;
  margin: 0;
  padding: 0;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
