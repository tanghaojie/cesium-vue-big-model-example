<template>
  <side-collapse :default-pin="true" class="side" width="300px">
    <div style="height: 100px; background-color: transparent;">
      <a-icon
        type="menu"
        @click="$store.dispatch('utils/layout/toolBarShown', !showToolBar)"
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
import sideCollapse from '../../side-collapse/side-collapse'
import scrollbar from '../../scrollbar/scrollbar'
import imangeryManager from './imagery-manager'
import primitiveManager from './primitive-manager'
import terrainManager from './terrain-manager'
import { mapState } from 'vuex'

export default {
  components: {
    imangeryManager,
    primitiveManager,
    sideCollapse,
    scrollbar,
    terrainManager
  },
  computed: {
    ...mapState('utils/layout', {
      showToolBar: state => state.showToolBar
    })
  }
}
</script>

<style lang="scss" scoped>
.side {
  .scrollbar {
  }
}
</style>
