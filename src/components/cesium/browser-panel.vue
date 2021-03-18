<template>
  <side-collapse class="side" width="300px">
    <div style="height: 100px; background-color: transparent;">
      <a-icon
        type="setting"
        @click="$store.dispatch('utils/cesium-setting/settingShown')"
        style="font-size: 24px; color: white; padding: 5px;"
      />
    </div>
    <scrollbar class="scrollbar" height="calc(100% - 100px)" resize>
      <imangery-manager />
      <primitive-manager />
      <terrain-manager />
    </scrollbar>
  </side-collapse>
</template>

<script>
import sideCollapse from '../side-collapse/side-collapse'
import scrollbar from '../scrollbar/scrollbar'
import imangeryManager from './imagery-manager'
import primitiveManager from './primitive-manager'
import terrainManager from './terrain-manager'

export default {
  components: {
    imangeryManager,
    primitiveManager,
    sideCollapse,
    scrollbar,
    terrainManager
  }
}
</script>

<style lang="scss" scoped>
.side {
  .scrollbar {
  }
}
</style>
