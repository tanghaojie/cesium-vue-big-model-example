<template>
  <div id="app">
    <cesium-wrapper :fullscreenButton="q" globalViewerMountKey="qq" class="map">
      <overlay>
        <proj />
      </overlay>
    </cesium-wrapper>
    <!-- <button @click="q = !q">默认按钮</button> -->
  </div>
</template>

<script>
import CesiumWrapper from './components/cesium-wrapper'
import Overlay from './components/overlay'
import proj from './components/proj'

export default {
  name: 'App',
  components: {
    CesiumWrapper,
    Overlay,
    proj
  },
  methods: {},
  data() {
    return {
      q: false
    }
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  .map {
    height: 100vh;
    width: 100vw;
    z-index: 0;
  }
}
</style>
