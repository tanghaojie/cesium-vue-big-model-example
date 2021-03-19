<template>
  <div class="all" :style="{ '--tool-bar-height': toolBarHeight + 'px' }">
    <cesium-wrapper
      :timeline="cesiumOptions.timeline"
      :animation="cesiumOptions.animation"
      :baseLayerPicker="cesiumOptions.baseLayerPicker"
      :fullscreenButton="cesiumOptions.fullscreenButton"
      :geocoder="cesiumOptions.geocoder"
      :homeButton="cesiumOptions.homeButton"
      :infoBox="cesiumOptions.infoBox"
      :sceneModePicker="cesiumOptions.sceneModePicker"
      :selectionIndicator="cesiumOptions.selectionIndicator"
      :navigationHelpButton="cesiumOptions.navigationHelpButton"
      globalViewerMountKey="qq"
      globalCesiumMountKey="cc"
      class="cesium-wrapper"
    >
      <overlay position-mode="fixed" class="over">
        <div class="tool-bar">
          <tool-bar ref="toolBar" v-show="showToolBar" />
          <resize-observer @notify="handleResize" />
        </div>
        <div class="content-view">
          <browser-panel />
          <location-bar />
        </div>
      </overlay>
    </cesium-wrapper>
    <overlay
      v-if="showSetting"
      :position-mode="'fixed'"
      :z-index="999"
      :accept-pointer-events="true"
    >
      <setting :current="cesiumOptions" @optionChange="optionChange" />
    </overlay>
  </div>
</template>

<script>
import CesiumWrapper from './cesium/viewer-wrapper/viewer-wrapper'
import browserPanel from './cesium/browser-panel/browser-panel.vue'
import toolBar from './cesium/tool-bar/tool-bar'
import locationBar from './cesium/location-bar/location-bar'
import setting from './cesium/setting/setting'
import Overlay from './overlay/overlay'
import { mapState } from 'vuex'

export default {
  components: {
    CesiumWrapper,
    Overlay,
    browserPanel,
    setting,
    toolBar,
    locationBar
  },
  computed: {
    ...mapState('utils/layout', {
      showSetting: state => state.showSetting,
      showToolBar: state => state.showToolBar
    })
  },
  methods: {
    optionChange(option) {
      this.cesiumOptions[option.key] = option.value
    },
    handleResize({ height }) {
      this.toolBarHeight = height
    }
  },
  data() {
    return {
      cesiumOptions: {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false
      },
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
  height: 100vh;
  width: 100vw;
  z-index: 0;
  padding-top: var(--tool-bar-height); //same as tool-bar height

  .cesium-wrapper {
    position: relative;
    .over {
      display: flex;
      flex-direction: column;
      .tool-bar {
        position: relative;
        width: 100%;
      }
      .content-view {
        position: relative;
        flex: 1 1 auto;
      }
    }
  }
}
</style>
