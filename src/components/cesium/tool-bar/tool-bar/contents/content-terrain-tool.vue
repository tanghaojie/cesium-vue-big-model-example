<template>
  <tool-bar-content>
    <group-sample />
    <group-terrain-color />
  </tool-bar-content>
</template>

<script>
import toolBarContent from '../tool-bar-content'
import groupSample from '../groups/group-sample'
import groupTerrainColor from '../groups/group-terrain-color'
export default {
  components: {
    toolBarContent,
    groupSample,
    groupTerrainColor
  }
}
</script>
