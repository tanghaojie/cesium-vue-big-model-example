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
import * as Cesium from 'cesium'
import toolBarGroup from '../tool-bar-group'
import toolBarGroupItem from '../tool-bar-group-item'
import {
  hightlight3DTileFeature,
  removeHightlight
} from '@/libs/cesium/highlight'
import {
  addClassify,
  removeClassified,
  addInvertClassification,
  removeInvertClassification,
  addYingXiuZhenZhongYiZhiClassificationPrimitive
} from '@/libs/cesium/classification'

import common from '@/mixin/common'
import toolBarGroupMixin from './mixin'
import { mapState } from 'vuex'

export default {
  components: {
    toolBarGroup,
    toolBarGroupItem
  },
  props: {},
  data() {
    return {
      group: {
        name: '3DTiles',
        init: params => {
          addYingXiuZhenZhongYiZhiClassificationPrimitive(params)
        },
        items: [
          {
            name: '高亮瓦片',
            icon: 'tiled',
            clicked: params => {
              this.$store.dispatch(
                'cesium/tool-bar-classify/switchHightlight3DTileFeatureItemActive'
              )
              const { viewer, item } = params
              if (item.clickedResult) {
                removeHightlight()
                item.clickedResult =
                  item.clickedResult && item.clickedResult.destroy()
                item.clickedResult = undefined
                return
              }
              params.options = {
                color: Cesium.Color.YELLOW.withAlpha(0.5)
              }
              return hightlight3DTileFeature(params)
            },
            active: () => this.hightlight3DTileFeatureItemActive
          },
          {
            name: '单体(滑动)',
            icon: 'move',
            clicked: params => {
              this.$store.dispatch(
                'cesium/tool-bar-classify/switchClassifyItemActive'
              )
              const { viewer, item } = params
              if (item.clickedResult) {
                removeClassified()
                item.clickedResult =
                  item.clickedResult && item.clickedResult.destroy()
                item.clickedResult = undefined
                return
              }
              params.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                  103.4862789722867,
                  31.0581577660983,
                  2500
                ),
                orientation: {
                  heading: Cesium.Math.toRadians(0),
                  pitch: Cesium.Math.toRadians(-90),
                  roll: 0.0
                },
                duration: 1
              })
              return addClassify(params)
            },
            active: () => this.classifyItemActive
          },
          {
            name: '单体(点击)',
            icon: 'select',
            clicked: params => {
              this.$store.dispatch(
                'cesium/tool-bar-classify/switchInvertClassifyItemActive'
              )
              const { viewer, item } = params
              if (item.clickedResult) {
                removeInvertClassification(params)
                item.clickedResult =
                  item.clickedResult && item.clickedResult.destroy()
                item.clickedResult = undefined
                return
              }
              params.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                  103.4862789722867,
                  31.0581577660983,
                  2500
                ),
                orientation: {
                  heading: Cesium.Math.toRadians(0),
                  pitch: Cesium.Math.toRadians(-90),
                  roll: 0.0
                },
                duration: 1
              })
              return addInvertClassification(params)
            },
            active: () => this.invertClassifyItemActive
          }
        ]
      }
    }
  },
  mixins: [common, toolBarGroupMixin],
  computed: {
    ...mapState('cesium/tool-bar-classify', {
      hightlight3DTileFeatureItemActive: state =>
        state.hightlight3DTileFeatureItemActive,
      classifyItemActive: state => state.classifyItemActive,
      invertClassifyItemActive: state => state.invertClassifyItemActive
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
