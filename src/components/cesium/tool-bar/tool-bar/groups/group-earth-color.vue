<template>
  <tool-bar-group>
    <div slot="name">{{ group.name }}</div>
    <tool-bar-group-item
      v-for="(item, index) in group.items"
      :key="index"
      :icon-name="''"
      :icon-bg-color="
        `rgba(${earthColor.r},${earthColor.g},${earthColor.b},${earthColor.a})`
      "
      :ref="`group-earth-color-${index}`"
      :dropdown="item.dropdown !== undefined"
      :dropdown-active="dropdownActive(item)"
      @itemClicked="clicked(item, index)"
      @dropdownClicked="dropdownClicked(item, index)"
    >
      {{ item.name }}
    </tool-bar-group-item>
  </tool-bar-group>
</template>

<script>
import toolBarGroup from '../tool-bar-group'
import { Sketch } from 'vue-color'
import toolBarGroupItem from '../tool-bar-group-item'

import common from '@/mixin/common'
import toolBarGroupMixin from './mixin'
import { mapState } from 'vuex'

export default {
  components: {
    toolBarGroup,
    toolBarGroupItem,
    'sketch-picker': Sketch
  },
  data() {
    return {
      group: {
        name: '地球颜色',
        items: [
          {
            name: '无覆盖时颜色',
            icon: 'earth',
            dropdown: {
              componentName: 'earthColor'
            }
          }
        ]
      }
    }
  },
  mixins: [common, toolBarGroupMixin],
  computed: {
    ...mapState('cesium/tool-bar-earth-color', {
      earthColor: state => state.earthColor
    }),
    ...mapState('cesium/tool-bar', {
      dropdown: state => state.dropdown
    })
  },
  methods: {
    clicked(item, index) {
      item.clicked && item.clicked({ viewer: this.viewer, item, index })
    },
    dropdownClicked(item, index) {
      const left = this.$refs[`group-earth-color-${index}`][0].$el.offsetLeft
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
