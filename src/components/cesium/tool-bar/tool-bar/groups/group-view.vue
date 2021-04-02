<template>
  <div>
    <tool-bar-group>
      <div slot="name">{{ group.name }}</div>

      <tool-bar-group-item
        v-for="(item, index) in group.items"
        :key="index"
        :icon-name="item.icon"
        @itemClicked="clicked(item)"
      >
        {{ item.name }}
      </tool-bar-group-item>
    </tool-bar-group>
  </div>
</template>

<script>
import toolBarGroup from '../tool-bar-group'
import toolBarGroupItem from '../tool-bar-group-item'

import common from '@/mixin/common'
import toolBarGroupMixin from './mixin'
import { flyToEarth, flyToChina } from '@/libs/cesium/fly-to'

export default {
  components: {
    toolBarGroup,
    toolBarGroupItem
  },
  props: {},
  data() {
    return {
      group: {
        name: '视角',
        items: [
          {
            name: '全球',
            icon: 'earth',
            clicked: flyToEarth
          },
          {
            name: '中国',
            icon: 'china_compressed',
            clicked: flyToChina
          }
        ]
      }
    }
  },
  mixins: [common, toolBarGroupMixin],
  methods: {
    clicked(item) {
      item.clicked && item.clicked({ viewer: this.viewer, item: item })
    }
  }
}
</script>
