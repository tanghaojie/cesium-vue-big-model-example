<template>
  <div>
    <button @click="qqq"></button>
    <ss></ss>
  </div>
</template>

<script>
import ss from './ss'
export default {
  components: { ss },
  props: {},
  data() {
    return {}
  },
  provide: {
    str: 'qwe'
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log(this)
    window.qqq = this
  },
  methods: {
    qqq() {
      this._provided.str = 'www'

      console.log(this)
    }
  }
}
</script>

<style lang="scss" scoped></style>
