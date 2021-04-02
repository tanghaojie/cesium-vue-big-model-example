<template>
  <tool-bar-content>
    <group-view />
    <group-status />
  </tool-bar-content>
</template>

<script>
import toolBarContent from '../tool-bar-content'
import groupView from '../groups/group-view'
import groupStatus from '../groups/group-status'

import common from '@/mixin/common'

export default {
  components: {
    toolBarContent,
    groupView,
    groupStatus
  },
  mixins: [common]
}
</script>
