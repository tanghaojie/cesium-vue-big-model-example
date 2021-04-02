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
    <overlay v-if="sampleTable.show" :position-mode="'fixed'" :z-index="50">
      <sample-table />
    </overlay>
  </tool-bar-group>
</template>

<script>
import toolBarGroup from '../tool-bar-group'
import toolBarGroupItem from '../tool-bar-group-item'
import overlay from '../../../../overlay/overlay'
import sampleTable from '@/components/antv-components/sample-table/sample-table'

import { sampleTerrain, removeAll } from '@/libs/cesium/sample'

import common from '@/mixin/common'
import toolBarGroupMixin from './mixin'
import { mapState } from 'vuex'

export default {
  components: {
    toolBarGroup,
    toolBarGroupItem,
    overlay,
    sampleTable
  },
  data() {
    return {
      group: {
        name: '采样',
        items: [
          {
            name: '地形采样',
            icon: 'terrain',
            clicked: params => {
              const self = this
              const cb = datas => {
                self.$store.dispatch('utils/layout/sampleTable', {
                  show: true,
                  datas: datas
                })
              }
              sampleTerrain({
                ...params,
                cb
              })
            }
          },
          {
            name: '移除',
            icon: 'delete',
            clicked: params => {
              const self = this
              removeAll(params)
              self.$store.dispatch('utils/layout/sampleTable', {
                show: false,
                datas: []
              })
            }
          }
        ]
      }
    }
  },
  mixins: [common, toolBarGroupMixin],
  computed: {
    ...mapState('utils/layout', {
      sampleTable: state => state.sampleTable
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
