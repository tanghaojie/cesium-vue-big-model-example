<template>
  <div
    class="overlay"
    :style="{
      'z-index': zIndex,
      'pointer-events': acceptPointerEvents ? 'all' : 'none',
      position: positionMode
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    zIndex: {
      type: Number,
      default: 1,
      required: false
    },
    acceptPointerEvents: {
      type: Boolean,
      default: false
    },
    positionMode: {
      type: String,
      default: 'absolute'
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
