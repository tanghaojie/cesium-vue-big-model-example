<template>
  <svg class="svg-icon" :class="className" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
.svg-icon {
  display: block;
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
