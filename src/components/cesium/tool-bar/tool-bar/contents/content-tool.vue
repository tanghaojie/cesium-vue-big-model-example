<template>
  <tool-bar-content>
    <group-3-d-tile />
    <group-draw />
    <group-measure />
  </tool-bar-content>
</template>

<script>
import toolBarContent from '../tool-bar-content'
import group3DTile from '../groups/group-3dtile'
import groupDraw from '../groups/group-draw'
import groupMeasure from '../groups/group-measure'
export default {
  components: {
    toolBarContent,
    group3DTile,
    groupDraw,
    groupMeasure
  }
}
</script>
