<template>
  <div class="j-flex location-bar">
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
</template>

<script>
import * as Cesium from 'cesium'
import common from '@/mixin/common'
export default {
  components: {},
  props: {
    //范围[0,1]，数字越小越精确，但影像性能
    percentageChanged: {
      type: Number,
      default: 0.1
    }
  },
  mixins: [common],
  data() {
    return {
      cameraLocation: {
        longitude: null,
        latitude: null,
        height: null
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer
      this.bindCameraLocation()
    })
  },
  methods: {
    bindCameraLocation() {
      const { viewer } = this

      if (this.percentageChanged > 1 || this.percentageChanged < 0) {
        this.percentageChanged = 0.1
      }

      viewer.camera.percentageChanged = this.percentageChanged
      const that = this
      viewer.camera.changed.addEventListener(function() {
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
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.location-bar {
  pointer-events: auto;
  background-color: red;
  position: absolute;
  right: 0;
  bottom: 0;
  white-space: nowrap;

  .item {
    margin: 0 10px;
    span {
      display: inline-block;
      white-space: nowrap;
    }
  }
}
</style>
