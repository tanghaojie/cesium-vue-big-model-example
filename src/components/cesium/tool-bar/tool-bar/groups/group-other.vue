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

    <overlay
      v-if="showSetting"
      :position-mode="'fixed'"
      :z-index="50"
      :accept-pointer-events="true"
    >
      <setting />
    </overlay>
  </tool-bar-group>
</template>

<script>
import toolBarGroup from '../tool-bar-group'
import toolBarGroupItem from '../tool-bar-group-item'
import overlay from '../../../../overlay/overlay'
import setting from '../../../setting/setting'

import common from '@/mixin/common'
import toolBarGroupMixin from './mixin'
import { mapState } from 'vuex'

export default {
  components: {
    toolBarGroup,
    toolBarGroupItem,
    overlay,
    setting
  },
  data() {
    return {
      group: {
        name: 'Cesium',
        items: [
          {
            name: '设置',
            icon: 'setting',
            clicked: params => {
              this.$store.dispatch('utils/layout/settingShown')
            }
          },
          {
            name: 'API文档',
            icon: 'document',
            clicked: params => {
              window.open('https://cesium.com/docs/cesiumjs-ref-doc/index.html')
            }
          },
          {
            name: '官方Demo',
            icon: 'demo',
            clicked: params => {
              window.open('https://sandcastle.cesium.com/')
            }
          }
        ]
      }
    }
  },
  mixins: [common, toolBarGroupMixin],
  computed: {
    ...mapState('utils/layout', {
      showSetting: state => state.showSetting
    })
  },
  methods: {
    clicked(item) {
      item.clickedResult =
        item.clicked && item.clicked({ viewer: this.viewer, item: item })
    },
    active(item) {
      return item.active && item.active()
    }
  }
}
</script>
