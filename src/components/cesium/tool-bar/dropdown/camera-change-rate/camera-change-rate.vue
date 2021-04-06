<template>
  <div class="camera-change-rate w-40">
    <div class="name">坐标采样率</div>
    <a-slider
      v-model="value"
      :min="0"
      :max="0.5"
      :step="0.001"
      reverse
      :tipFormatter="
        val => {
          return ((0.5 - val) * 200).toFixed(0) + '%'
        }
      "
      @afterChange="afterChage"
    />
  </div>
</template>

<script>
import common from '@/mixin/common'

export default {
  components: {},
  props: {},
  data() {
    return { value: 0 }
  },
  mixins: [common],
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer
      this.value = viewer.camera.percentageChanged
    })
  },
  methods: {
    afterChage(val) {
      this.viewer.camera.percentageChanged = val
    }
  }
}
</script>
