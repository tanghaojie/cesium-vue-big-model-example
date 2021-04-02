<template>
  <div
    class="all h-screen w-screen z-0"
    :style="{ '--tool-bar-height': toolBarHeight + 'px' }"
  >
    <cesium-wrapper
      :timeline="options.timeline"
      :animation="options.animation"
      :baseLayerPicker="options.baseLayerPicker"
      :fullscreenButton="options.fullscreenButton"
      :geocoder="options.geocoder"
      :homeButton="options.homeButton"
      :infoBox="options.infoBox"
      :sceneModePicker="options.sceneModePicker"
      :selectionIndicator="options.selectionIndicator"
      :navigationHelpButton="options.navigationHelpButton"
      :cesium-token="
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOWUwNzhlOS00NWY3LTRhYjAtODI2Mi02NGI0YmJlMzdlYTkiLCJpZCI6NDMyMjgsImlhdCI6MTYxNzM1MjYwOX0.RP05v-KUiNYBMWhMYIl2x7Q-eys__7QrBsnLIzGy4Ms'
      "
      :depth-test-against-terrain="true"
      globalViewerMountKey="qq"
      globalCesiumMountKey="cc"
      class="cesium-wrapper relative"
    >
      <overlay position-mode="fixed" class="over flex flex-col">
        <div class="tool-bar relative w-full">
          <tool-bar ref="toolBar" v-show="showToolBar" />
          <resize-observer @notify="handleResize" />
        </div>
        <div class="content-view relative flex-auto">
          <browser-panel />
        </div>
      </overlay>
    </cesium-wrapper>
  </div>
</template>

<script>
import CesiumWrapper from './cesium/viewer-wrapper/viewer-wrapper'
import browserPanel from './cesium/browser-panel/browser-panel.vue'
import toolBar from './cesium/tool-bar/tool-bar'
import Overlay from './overlay/overlay'
import { mapState } from 'vuex'

export default {
  components: {
    CesiumWrapper,
    Overlay,
    browserPanel,
    toolBar
  },
  computed: {
    ...mapState('cesium/cesium', {
      options: state => state.options
    }),
    ...mapState('utils/layout', {
      showToolBar: state => state.showToolBar
    })
  },
  methods: {
    handleResize({ height }) {
      this.toolBarHeight = height
    }
  },
  data() {
    return {
      toolBarHeight: 100
    }
  },
  mounted() {
    this.toolBarHeight = this.$refs.toolBar.$el.clientHeight
  }
}
</script>

<style lang="scss" scoped>
.all {
  padding-top: var(--tool-bar-height); //same as tool-bar height
}
</style>
