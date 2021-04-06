<template>
  <tool-bar-group>
    <div slot="name">{{ group.name }}</div>
    <tool-bar-group-item
      v-for="(item, index) in group.items"
      :key="index"
      :icon-name="item.icon"
      :active="active(item)"
      @itemClicked="clicked(item)"
    >
      {{ item.name }}
    </tool-bar-group-item>
  </tool-bar-group>
</template>

<script>
import toolBarGroup from '../tool-bar-group'
import toolBarGroupItem from '../tool-bar-group-item'
import locationBar from '../../../location-bar/location-bar'
import overlay from '../../../../overlay/overlay'

import common from '@/mixin/common'
import toolBarGroupMixin from './mixin'
import { mapState } from 'vuex'

export default {
  components: {
    toolBarGroup,
    toolBarGroupItem,
    locationBar,
    overlay
  },
  props: {},
  data() {
    return {
      group: {
        name: '自然环境',
        items: [
          {
            name: '太阳',
            icon: 'earth',
            clicked: () => {
              this.$store.dispatch('cesium/nature/switchSunShown', {
                viewer: this.viewer
              })
            },
            active: () => this.showSun
          },
          {
            name: '月亮',
            icon: 'earth',
            clicked: () => {
              this.$store.dispatch('cesium/nature/switchMoonShown', {
                viewer: this.viewer
              })
            },
            active: () => this.showMoon
          },
          {
            name: '大气层',
            icon: 'earth',
            clicked: () => {
              this.$store.dispatch('cesium/nature/switchSkyAtmosphereShown', {
                viewer: this.viewer
              })
            },
            active: () => this.showSkyAtmosphere
          },
          {
            name: '日照阴影',
            icon: 'earth',
            clicked: () => {
              this.$store.dispatch('cesium/nature/switchGlobeLightingEnable', {
                viewer: this.viewer
              })
            },
            active: () => {
              return this.enableLighting
            }
          },
          {
            name: '天空盒',
            icon: 'earth',
            clicked: () => {
              this.$store.dispatch('cesium/nature/switchSkyBoxShown', {
                viewer: this.viewer
              })
            },
            active: () => {
              return this.showSkyBox
            }
          }
        ]
      }
    }
  },
  mixins: [common, toolBarGroupMixin],
  computed: {
    ...mapState('cesium/nature', {
      showSun: state => state.showSun,
      showMoon: state => state.showMoon,
      showSkyAtmosphere: state => state.showSkyAtmosphere,
      enableLighting: state => state.enableLighting,
      showSkyBox: state => state.showSkyBox
    })
  },
  methods: {
    clicked(item) {
      item.clicked && item.clicked({ viewer: this.viewer, item: item })
    },
    active(item) {
      return item.active && item.active()
    }
  }
}
</script>
