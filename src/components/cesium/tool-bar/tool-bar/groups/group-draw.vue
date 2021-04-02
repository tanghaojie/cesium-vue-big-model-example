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

import { drawPoint, drawShape, DrawMode, removeAll } from '@/libs/cesium/draw'

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
        name: '绘制',
        items: [
          {
            name: '画点',
            icon: 'point',
            clicked: params => {
              const self = this
              const action = () => {
                self.$store.dispatch(
                  'cesium/tool-bar/switchDrawPointItemActive'
                )
              }
              drawPoint({
                ...params,
                started: action,
                stoped: action
              })
            },
            active: () => this.drawPointItemActive
          },
          {
            name: '画线',
            icon: 'line',
            clicked: params => {
              const self = this
              const action = () => {
                self.$store.dispatch(
                  'cesium/tool-bar/switchDrawPolylineItemActive'
                )
              }
              drawShape({
                ...params,
                mode: DrawMode.Polyline,
                started: action,
                stoped: action
              })
            },
            active: () => this.drawPolylineItemActive
          },
          {
            name: '画面',
            icon: 'polygon',
            clicked: params => {
              const self = this
              const action = () => {
                self.$store.dispatch(
                  'cesium/tool-bar/switchDrawPolygonItemActive'
                )
              }
              drawShape({
                ...params,
                mode: DrawMode.Polygon,
                started: action,
                stoped: action
              })
            },
            active: () => this.drawPolygonItemActive
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
    ...mapState('cesium/tool-bar', {
      drawPointItemActive: state => state.drawPointItemActive,
      drawPolylineItemActive: state => state.drawPolylineItemActive,
      drawPolygonItemActive: state => state.drawPolygonItemActive
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
