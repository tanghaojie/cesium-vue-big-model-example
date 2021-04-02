<template>
  <tool-bar-content>
    <group-other />
  </tool-bar-content>
</template>

<script>
import toolBarContent from '../tool-bar-content'
import groupOther from '../groups/group-other'
import common from '@/mixin/common'
export default {
  components: {
    toolBarContent,
    groupOther
  },
  mixins: [common]
}
</script>
