<template>
  <tool-bar-content>
    <group-3-d-tile />
    <group-draw />
    <group-sample />
  </tool-bar-content>
</template>

<script>
import toolBarContent from '../tool-bar-content'
import group3DTile from '../groups/group-3dtile'
import groupDraw from '../groups/group-draw'
import groupSample from '../groups/group-sample'
import common from '@/mixin/common'
export default {
  components: {
    toolBarContent,
    group3DTile,
    groupDraw,
    groupSample
  },
  mixins: [common]
}
</script>
