<template>
  <div class="elevation-contour w-80" @click.stop>
    <div class="flex flex-row w-full justify-center items-center">
      <div class="flex-0 w-12">等高距</div>
      <div class="flex-1">
        <a-slider
          :disabled="!elevationContourItemActive"
          v-model="contourDistance"
          :min="contourMinDistance"
          :max="contourMaxDistance"
          :step="10"
          :tipFormatter="
            val => {
              return val.toFixed(0) + '米'
            }
          "
          @afterChange="contourDistanceChange"
        />
      </div>
      <div class="flex-0">
        <a-input-number
          :disabled="!elevationContourItemActive"
          v-model="contourDistance"
          :min="contourMinDistance"
          :max="contourMaxDistance"
          size="small"
          @change="contourDistanceChange"
        />
      </div>
    </div>

    <div class="flex flex-row w-full justify-center items-center">
      <div class="flex-0 w-12">线宽</div>
      <div class="flex-1">
        <a-slider
          :disabled="!elevationContourItemActive"
          v-model="contourWidth"
          :min="contourMinWidth"
          :max="contourMaxWidth"
          :step="1"
          @afterChange="contourWidthChange"
        />
      </div>
      <div class="flex-0">
        <a-input-number
          :disabled="!elevationContourItemActive"
          v-model="contourWidth"
          :min="contourMinWidth"
          :max="contourMaxWidth"
          size="small"
          @change="contourWidthChange"
        />
      </div>
    </div>

    <div class="flex flex-row w-full justify-center items-center">
      <div class="flex-0 w-12">颜色</div>
      <div class="flex-1">
        <div
          class="h-4 w-full"
          :class="
            elevationContourItemActive ? 'cursor-pointer' : 'cursor-not-allowed'
          "
          :style="{
            'background-color': contourColor
          }"
          @click="openColorPicker"
        ></div>
        <sketch-picker
          v-show="colorPickerShow"
          v-model="contourColor"
          @input="contourColorChange"
          class="mt-3 w-full text-black text-opacity-70"
        />
      </div>
    </div>
  </div>
</template>

<script>
import common from '@/mixin/common'
import { Sketch } from 'vue-color'

import { mapState } from 'vuex'

export default {
  components: { 'sketch-picker': Sketch },
  props: {},
  data() {
    return {
      contourDistance: 100,
      contourMinDistance: 30,
      contourMaxDistance: 1000,

      contourWidth: 1,
      contourMinWidth: 1,
      contourMaxWidth: 10,

      colorPickerShow: false,
      contourColor: 'rgba(255, 0, 0, 1)'
    }
  },
  mixins: [common],
  computed: {
    ...mapState('cesium/tool-bar-terrain-color', {
      elevationContourItemActive: state => state.elevationContourItemActive
    })
  },
  watch: {},
  created() {},
  mounted() {
    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer
      if (
        !viewer.scene.globe.material ||
        viewer.scene.globe.material.type !== 'ElevationContour'
      ) {
        return
      }
      const uniforms = viewer.scene.globe.material.uniforms
      this.contourDistance = uniforms.spacing
      this.contourWidth = uniforms.width

      const color = uniforms.color
      this.contourColor = `rgba(${color.red * 255}, ${color.green *
        255}, ${color.blue * 255}, ${color.alpha})`
    })
  },
  methods: {
    contourDistanceChange(val) {
      const { viewer } = this
      if (
        !viewer.scene.globe.material ||
        viewer.scene.globe.material.type !== 'ElevationContour'
      ) {
        return
      }
      const uniforms = viewer.scene.globe.material.uniforms
      uniforms.spacing = this.contourDistance
    },
    contourWidthChange(val) {
      const { viewer } = this
      if (
        !viewer.scene.globe.material ||
        viewer.scene.globe.material.type !== 'ElevationContour'
      ) {
        return
      }
      const uniforms = viewer.scene.globe.material.uniforms
      uniforms.width = this.contourWidth
    },
    openColorPicker() {
      if (!this.elevationContourItemActive) {
        return
      }
      this.colorPickerShow = !this.colorPickerShow
    },
    contourColorChange(val) {
      if (!val || !val.rgba) {
        return
      }
      const rgba = val.rgba
      this.contourColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
      const { viewer } = this
      if (
        !viewer.scene.globe.material ||
        viewer.scene.globe.material.type !== 'ElevationContour'
      ) {
        return
      }
      const uniforms = viewer.scene.globe.material.uniforms
      uniforms.color.red = rgba.r / 255
      uniforms.color.green = rgba.g / 255
      uniforms.color.blue = rgba.b / 255
      uniforms.color.alpha = rgba.a
    }
  }
}
</script>

<style>
.elevation-contour .ant-input-number {
  width: 70px;
}
</style>
