<template>
  <tool-bar-content>
    <group-nature />
    <group-earth-color />
  </tool-bar-content>
</template>

<script>
import toolBarContent from '../tool-bar-content'
import groupNature from '../groups/group-nature'
import groupEarthColor from '../groups/group-earth-color'
export default {
  components: {
    toolBarContent,
    groupNature,
    groupEarthColor
  }
}
</script>
