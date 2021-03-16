<template>
  <div>
    {{ str }}
    <gs />
  </div>
</template>

<script>
import gs from './gs'
export default {
  components: { gs },
  props: {},
  data() {
    return {}
  },
  inject: ['str'],
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
