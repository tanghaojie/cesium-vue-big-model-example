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
export default {
  components: {
    toolBarContent,
    groupView,
    groupStatus
  }
}
</script>
