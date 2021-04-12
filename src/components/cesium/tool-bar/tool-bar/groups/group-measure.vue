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

import { point, shape, MeasureMode, removeAll } from '@/libs/cesium/measure'

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
        name: '测量',
        items: [
          {
            name: '点',
            icon: 'point',
            clicked: params => {
              const self = this
              const action = () => {
                self.$store.dispatch(
                  'cesium/tool-bar-measure/switchMeasurePointItemActive'
                )
              }
              point({
                ...params,
                started: action,
                stoped: action
              })
            },
            active: () => this.measurePointItemActive
          },
          {
            name: '线',
            icon: 'line',
            clicked: params => {
              const self = this
              const action = () => {
                self.$store.dispatch(
                  'cesium/tool-bar-measure/switchMeasureLineItemActive'
                )
              }
              shape({
                ...params,
                mode: MeasureMode.Line,
                started: action,
                stoped: action
              })
            },
            active: () => this.measureLineItemActive
          },
          {
            name: '面',
            icon: 'polygon',
            clicked: params => {
              const self = this
              const action = () => {
                self.$store.dispatch(
                  'cesium/tool-bar-measure/switchMeasurePolygonItemActive'
                )
              }
              shape({
                ...params,
                mode: MeasureMode.Polygon,
                started: action,
                stoped: action
              })
            },
            active: () => this.measurePolygonItemActive
          },
          {
            name: '移除',
            icon: 'delete',
            clicked: params => {
              removeAll(params)
            }
          }
        ]
      }
    }
  },
  mixins: [common, toolBarGroupMixin],
  computed: {
    ...mapState('cesium/tool-bar-measure', {
      measurePointItemActive: state => state.measurePointItemActive,
      measureLineItemActive: state => state.measureLineItemActive,
      measurePolygonItemActive: state => state.measurePolygonItemActive
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
