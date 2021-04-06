<template>
  <div @click.stop>
    <sketch-picker
      v-model="color"
      @input="colorChange"
      class="w-full text-black text-opacity-70"
    />
  </div>
</template>

<script>
import common from '@/mixin/common'
import { Sketch } from 'vue-color'
import { mapState } from 'vuex'

export default {
  components: { 'sketch-picker': Sketch },
  data() {
    return {
      color: 'rgba(255, 0, 0, 1)'
    }
  },
  mixins: [common],
  computed: {
    ...mapState('cesium/tool-bar-earth-color', {
      earthColor: state => state.earthColor
    })
  },
  mounted() {
    const { earthColor } = this
    this.color = `rgba(${earthColor.r}, ${earthColor.g}, ${earthColor.b}, ${earthColor.a})`

    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer
    })
  },
  methods: {
    colorChange(val) {
      if (!val || !val.rgba) {
        return
      }
      const rgba = val.rgba
      this.color = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`

      this.$store.dispatch('cesium/tool-bar-earth-color/setEarthColor', {
        rgba,
        viewer: this.viewer
      })
    }
  }
}
</script>
