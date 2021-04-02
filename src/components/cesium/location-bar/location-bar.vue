<template>
  <div class="flex location-bar">
    <div v-if="locationBar && locationBar.showCameraLocation" class="flex type">
      <span>视角:</span>
      <div class="item">
        <span class="label">经度:</span>
        <span class="value">{{ cameraLocation.longitude }}</span>
      </div>
      <div class="item">
        <span class="label">纬度:</span>
        <span class="value">{{ cameraLocation.latitude }}</span>
      </div>
      <div class="item">
        <span class="label">高度:</span>
        <span class="value">{{ cameraLocation.height }}</span>
      </div>
    </div>

    <div v-if="locationBar && locationBar.showMouseLocation" class="flex type">
      <span>鼠标:</span>
      <div class="item">
        <span class="label">经度:</span>
        <span class="value">{{ mouseLocation.longitude }}</span>
      </div>
      <div class="item">
        <span class="label">纬度:</span>
        <span class="value">{{ mouseLocation.latitude }}</span>
      </div>
      <div class="item">
        <span class="label">海拔:</span>
        <span class="value">{{ mouseLocation.height }}</span>
      </div>
    </div>

    <div v-if="locationBar && locationBar.showFPS" class="flex type">
      <span>FPS:</span>
      <div class="item">
        <span class="value">{{ fps }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import common from '@/mixin/common'
import { mapState } from 'vuex'

export default {
  components: {},
  props: {
    // 范围[0,1]，数字越小越精确，但影响性能
    percentageChanged: {
      type: Number,
      default: undefined
    },
    // fps刷新速度（毫秒）
    fpsRate: {
      type: Number,
      default: 1000
    }
  },
  mixins: [common],
  data() {
    return {
      cameraLocation: {
        longitude: null,
        latitude: null,
        height: null
      },
      unbindCameraLocation: undefined,
      mouseLocation: {
        longitude: null,
        latitude: null,
        height: null
      },
      unbindMouseLocation: undefined,
      fps: 0,
      unbindFps: undefined
    }
  },
  computed: {
    ...mapState('utils/layout', {
      locationBar: state => state.locationBar
    })
  },
  watch: {
    percentageChanged() {
      this.viewer.camera.percentageChanged = this.percentageChanged
    },
    fpsRate() {
      if (this.locationBar.showFPS) {
        this.unbindFps = this.unbindFps && this.unbindFps()
        this.bindFPS()
      } else {
        this.unbindFps = this.unbindFps && this.unbindFps()
      }
    },
    locationBar(val) {
      if (!val) {
        return
      }
      if (val.showCameraLocation) {
        this.unbindCameraLocation =
          this.unbindCameraLocation && this.unbindCameraLocation()
        this.bindCameraLocation()
      } else {
        this.unbindCameraLocation =
          this.unbindCameraLocation && this.unbindCameraLocation()
      }

      if (val.showMouseLocation) {
        this.unbindMouseLocation =
          this.unbindMouseLocation && this.unbindMouseLocation()
        this.bindMouseLocation()
      } else {
        this.unbindMouseLocation =
          this.unbindMouseLocation && this.unbindMouseLocation()
      }

      if (val.showFPS) {
        this.unbindFps = this.unbindFps && this.unbindFps()
        this.bindFPS()
      } else {
        this.unbindFps = this.unbindFps && this.unbindFps()
      }
    }
  },
  mounted() {
    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer
      if (this.locationBar && this.locationBar.showCameraLocation) {
        this.bindCameraLocation()
      }
      if (this.locationBar && this.locationBar.showMouseLocation) {
        this.bindMouseLocation()
      }
      if (this.locationBar && this.locationBar.showFPS) {
        this.bindFPS()
      }
    })
  },
  destroyed() {
    this.unbindCameraLocation =
      this.unbindCameraLocation && this.unbindCameraLocation()
    this.unbindMouseLocation =
      this.unbindMouseLocation && this.unbindMouseLocation()
    this.unbindFps = this.unbindFps && this.unbindFps()
  },
  methods: {
    bindCameraLocation() {
      const { viewer } = this
      if (this.percentageChanged) {
        if (this.percentageChanged > 1 || this.percentageChanged < 0) {
          this.percentageChanged = 0.1
        }
        viewer.camera.percentageChanged = this.percentageChanged
      }
      const that = this
      this.unbindCameraLocation = viewer.camera.changed.addEventListener(
        function() {
          const pos = viewer.camera.positionCartographic

          that.cameraLocation.height = viewer.camera.positionCartographic.height.toFixed(
            0
          )

          that.cameraLocation.longitude = Cesium.Math.toDegrees(
            pos.longitude
          ).toFixed(5)
          that.cameraLocation.latitude = Cesium.Math.toDegrees(
            pos.latitude
          ).toFixed(5)
        }
      )
    },
    bindMouseLocation() {
      const { viewer } = this
      const that = this
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction(function(e) {
        const position = viewer.scene.pickPosition(e.endPosition)
        const cartographic = Cesium.Cartographic.fromCartesian(position)
        console.log(cartographic)
        that.mouseLocation.longitude = Cesium.Math.toDegrees(
          cartographic.longitude
        ).toFixed(5)
        that.mouseLocation.latitude = Cesium.Math.toDegrees(
          cartographic.latitude
        ).toFixed(5)
        that.mouseLocation.height = cartographic.height.toFixed(0)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      this.unbindMouseLocation = function() {
        handler.destroy()
      }
    },
    bindFPS() {
      const { viewer } = this
      const frameRateMonitor = Cesium.FrameRateMonitor.fromScene(viewer.scene)
      const that = this
      this.fps = (frameRateMonitor.lastFramesPerSecond || 0).toFixed(0)
      const intervalId = setInterval(() => {
        that.fps = (frameRateMonitor.lastFramesPerSecond || 0).toFixed(0)
      }, this.fpsRate)
      this.unbindFps = function() {
        clearInterval(intervalId)
        frameRateMonitor.destroy()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.location-bar {
  padding: 5px 2px;
  pointer-events: auto;
  color: white;
  background-color: rgba($color: #333, $alpha: 0.8);
  position: absolute;
  right: 0;
  bottom: 0;
  white-space: nowrap;

  .type {
    padding: 0 5px;
    .item {
      margin: 0 3px;
      span {
        display: inline-block;
        white-space: nowrap;
      }
    }
  }
}
</style>
