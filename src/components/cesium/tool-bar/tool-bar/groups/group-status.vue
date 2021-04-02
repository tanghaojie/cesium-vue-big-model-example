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
      :ref="`group-status-${index}`"
      @itemClicked="clicked(item)"
      @dropdownClicked="dropdownClicked(item, index)"
    >
      {{ item.name }}
    </tool-bar-group-item>
    <overlay position-mode="fixed" class="over flex flex-col">
      <location-bar />
    </overlay>
  </tool-bar-group>
</template>

<script>
import toolBarGroup from '../tool-bar-group'
import toolBarGroupItem from '../tool-bar-group-item'
import locationBar from '../../../location-bar/location-bar'
import overlay from '../../../../overlay/overlay'

import common from '@/mixin/common'
import toolBarGroupMixin from './mixin'
import cameraChangeRate from '../../camera-change-rate/camera-change-rate'
import { mapState } from 'vuex'

export default {
  components: {
    toolBarGroup,
    toolBarGroupItem,
    cameraChangeRate,
    locationBar,
    overlay
  },
  props: {},
  data() {
    return {
      group: {
        name: '状态栏',
        items: [
          {
            name: '视角坐标',
            icon: 'camera2',
            dropdown: {
              componentName: 'cameraChangeRate'
            },
            clicked: () => {
              this.$store.dispatch('utils/layout/locationBar', {
                showCameraLocation: !this.locationBar.showCameraLocation
              })
            },
            active: () => {
              return this.locationBar.showCameraLocation
            }
          },
          {
            name: '鼠标坐标',
            icon: 'click',
            clicked: () => {
              this.$store.dispatch('utils/layout/locationBar', {
                showMouseLocation: !this.locationBar.showMouseLocation
              })
            },
            active: () => {
              return this.locationBar.showMouseLocation
            }
          },
          {
            name: 'FPS',
            icon: 'fps',
            clicked: () => {
              this.$store.dispatch('utils/layout/locationBar', {
                showFPS: !this.locationBar.showFPS
              })
            },
            active: () => {
              return this.locationBar.showFPS
            }
          }
        ]
      }
    }
  },
  mixins: [common, toolBarGroupMixin],
  computed: {
    ...mapState('utils/layout', {
      locationBar: state => state.locationBar
    }),
    ...mapState('cesium/tool-bar', {
      dropdown: state => state.dropdown
    })
  },
  methods: {
    clicked(item) {
      item.clicked && item.clicked({ viewer: this.viewer, item: item })
    },
    active(item) {
      return item.active && item.active()
    },
    dropdownClicked(item, index) {
      const left = this.$refs[`group-status-${index}`][0].$el.offsetLeft
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
