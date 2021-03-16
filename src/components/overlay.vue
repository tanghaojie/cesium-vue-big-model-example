<template>
  <div class="overlay" :style="{ 'z-index': zIndex }">
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
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}
</style>
