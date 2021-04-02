<template>
  <tool-bar-content>
    <group-nature />
  </tool-bar-content>
</template>

<script>
import toolBarContent from '../tool-bar-content'
import groupNature from '../groups/group-nature'
import common from '@/mixin/common'
export default {
  components: {
    toolBarContent,
    groupNature
  },
  mixins: [common]
}
</script>
