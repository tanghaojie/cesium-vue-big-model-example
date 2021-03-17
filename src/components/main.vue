<template>
  <div class="main">
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
      class="map"
    >
      <overlay>
        <proj />
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
import CesiumWrapper from './cesium-wrapper'
import Overlay from './overlay'
import proj from './proj'
import setting from './setting'
import { mapState } from 'vuex'

export default {
  components: {
    CesiumWrapper,
    Overlay,
    proj,
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
.main {
  .map {
    height: 100vh;
    width: 100vw;
    z-index: 0;
  }
}
</style>
