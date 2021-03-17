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
    </scrollbar>
  </side-collapse>
</template>

<script>
import sideCollapse from '../side-collapse/side-collapse'
import scrollbar from '../scrollbar/scrollbar'
import imangeryManager from './imagery-manager'
import primitiveManager from './primitive-manager'

export default {
  components: { imangeryManager, primitiveManager, sideCollapse, scrollbar }
}
</script>

<style lang="scss" scoped>
.side {
  .scrollbar {
  }
}
</style>
