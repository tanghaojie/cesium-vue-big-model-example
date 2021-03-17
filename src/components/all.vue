<template>
  <div class="all">
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
    >
      <overlay>
        <browser-panel />
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
import CesiumWrapper from './cesium/viewer-wrapper'
import browserPanel from './cesium/browser-panel'
import setting from './cesium/setting'
import Overlay from './overlay/overlay'

import { mapState } from 'vuex'

export default {
  components: {
    CesiumWrapper,
    Overlay,
    browserPanel,
    setting
  },
  computed: {
    ...mapState('utils/cesium-setting', {
      showSetting: state => state.showSetting
    })
  },
  methods: {
    optionChange(option) {
      this.cesiumOptions[option.key] = option.value
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.all {
  height: 100vh;
  width: 100vw;
  z-index: 0;
}
</style>
