<template>
  <tool-bar-group>
    <div slot="name">{{ group.name }}</div>
    <tool-bar-group-item
      v-for="(item, index) in group.items"
      :key="index"
      :icon-name="item.icon"
      :active="active(item)"
      :dropdown="item.dropdown !== undefined"
      :dropdown-active="dropdownActive(item)"
      :ref="`group-terrain-color-${index}`"
      @itemClicked="clicked(item)"
      @dropdownClicked="dropdownClicked(item, index)"
    >
      {{ item.name }}
    </tool-bar-group-item>
  </tool-bar-group>
</template>

<script>
import toolBarGroup from '../tool-bar-group'
import toolBarGroupItem from '../tool-bar-group-item'
import {
  showElevationContour,
  removeElevationContour
} from '@/libs/cesium/terrain-color'
import common from '@/mixin/common'
import toolBarGroupMixin from './mixin'
import { mapState } from 'vuex'

export default {
  components: {
    toolBarGroup,
    toolBarGroupItem
  },
  data() {
    return {
      group: {
        name: '地形着色',
        items: [
          {
            name: '等高线',
            icon: 'contour2',
            dropdown: {
              componentName: 'elevationContour'
            },
            clicked: params => {
              const self = this
              if (self.elevationContourItemActive) {
                removeElevationContour(params)
              } else {
                showElevationContour(params)
              }
              self.$store.dispatch(
                'cesium/tool-bar-terrain-color/switchElevationContourItemActive'
              )
            },
            active: () => {
              return this.elevationContourItemActive
            }
          }
        ]
      }
    }
  },
  mixins: [common, toolBarGroupMixin],
  computed: {
    ...mapState('cesium/tool-bar-terrain-color', {
      elevationContourItemActive: state => state.elevationContourItemActive
    }),
    ...mapState('cesium/tool-bar', {
      dropdown: state => state.dropdown
    })
  },
  methods: {
    clicked(item) {
      item.clickedResult =
        item.clicked && item.clicked({ viewer: this.viewer, item: item })
    },
    active(item) {
      return item.active && item.active()
    },
    dropdownClicked(item, index) {
      const left = this.$refs[`group-terrain-color-${index}`][0].$el.offsetLeft
      const componentName = item.dropdown.componentName
      this.$store.dispatch('cesium/tool-bar/dropdown', {
        show: true,
        componentName,
        left,
        top: this.dropdown.top
      })
    },
    dropdownActive(item) {
      if (item.dropdown) {
        return this.dropdown.componentName === item.dropdown.componentName
      }
    }
  }
}
</script>
