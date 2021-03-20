<template>
  <div class="camera-change-rate">
    <div class="name">坐标采样率</div>
    <a-slider
      v-model="value"
      :min="0"
      :max="1"
      :step="0.001"
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
      console.log('afterChange', val)
      this.viewer.camera.percentageChanged = val
    }
  }
}
</script>

<style lang="scss" scoped>
.camera-change-rate {
  width: 150px;
}
</style>
