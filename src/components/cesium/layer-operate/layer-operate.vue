<template>
  <overlay
    position-mode="fixed"
    :accept-pointer-events="true"
    :z-index="999"
    @click.native.stop="overlayClicked"
    class="flex justify-center items-center"
  >
    <div class="flex flex-col px-16 rounded-lg bg-gray-700" @click.stop>
      <div class="alpha w-80 my-2">
        <div class="text-white">alpha：</div>
        <a-slider
          v-model="alpha"
          :min="0"
          :max="1"
          :step="0.1"
          @afterChange="afterChange('alpha')"
        />
      </div>
      <div class="brightness w-80 my-2">
        <div class="text-white">亮度：</div>
        <a-slider
          v-model="brightness"
          :min="0"
          :max="6"
          :step="0.1"
          @afterChange="afterChange('brightness')"
        />
      </div>
      <div class="contrast w-80 my-2">
        <div class="text-white">对比度：</div>
        <a-slider
          v-model="contrast"
          :min="0"
          :max="6"
          :step="0.1"
          @afterChange="afterChange('contrast')"
        />
      </div>
      <div class="hue w-80 my-2">
        <div class="text-white">色调：</div>
        <a-slider
          v-model="hue"
          :min="0"
          :max="12"
          :step="0.1"
          @afterChange="afterChange('hue')"
        />
      </div>
      <div class="saturation w-80 my-2">
        <div class="text-white">饱和度：</div>
        <a-slider
          v-model="saturation"
          :min="0"
          :max="12"
          :step="0.1"
          @afterChange="afterChange('saturation')"
        />
      </div>
    </div>
  </overlay>
</template>

<script>
import overlay from '../../overlay/overlay'
export default {
  components: { overlay },
  props: {
    a: Number,
    b: Number,
    c: Number,
    h: Number,
    s: Number,
    cb: Function
  },
  data() {
    return {
      alpha: 0,
      brightness: 0,
      contrast: 0,
      hue: 0,
      saturation: 0
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.alpha = this.a || 0
    this.brightness = this.b || 0
    this.contrast = this.c || 0
    this.hue = this.h || 0
    this.saturation = this.s || 0
  },
  methods: {
    overlayClicked() {
      this.$emit('close')
    },
    afterChange(key) {
      this.cb && this.cb({ key: key, value: this[key] })
    }
  }
}
</script>

<style lang="scss" scoped></style>
