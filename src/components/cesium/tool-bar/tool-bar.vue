<template>
  <div
    class="tool-bar relative bg-gray-500 pointer-events-auto"
    :style="{
      '--dropdown-panel-p-left': dropdown.left + 'px',
      '--dropdown-panel-p-top': dropdown.top + 'px'
    }"
    @click="clearDropdown"
  >
    <div class="tabs">
      <ul class="titles flex m-0 p-0 w-full bg-gray-700 list-none">
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          class="text-white py-1 px-6 list-none text-sm font-bold cursor-pointer hover:bg-gray-500"
          :class="index === currentTab ? 'bg-gray-500' : ''"
          @click="selectTab(index)"
        >
          {{ tab.name }}
        </li>
      </ul>
    </div>

    <div class="contents flex mt-1.5">
      <component
        :is="tab.componentName"
        v-for="(tab, index) in tabs"
        :key="index"
        v-show="currentTab === index"
      ></component>
    </div>

    <div
      v-show="dropdown.show"
      class="dropdown-panel bg-gray-600 bg-opacity-50 text-white p-4 absolute border-2 border-t-0 border-gray-900 rounded-b z-50"
    >
      <component :is="dropdown.componentName"></component>
    </div>
  </div>
</template>

<script>
import toolBarGroup from './tool-bar/tool-bar-group'
import toolBarGroupItem from './tool-bar/tool-bar-group-item'
import toolBarContent1 from './tool-bar/contents/content-1'
import toolBarContent2 from './tool-bar/contents/content-2'
import toolBarContent3 from './tool-bar/contents/content-3'
import toolBarContent4 from './tool-bar/contents/content-4'

// for dropdown
import cameraChangeRate from '../tool-bar/camera-change-rate/camera-change-rate'

import * as Cesium from 'cesium'
import common from '@/mixin/common'
import { mapState } from 'vuex'

export default {
  props: {},
  components: {
    toolBarGroup,
    toolBarGroupItem,
    toolBarContent1,
    toolBarContent2,
    toolBarContent3,
    toolBarContent4,
    cameraChangeRate
  },
  data() {
    return {
      currentTab: 0,
      tabs: [
        {
          name: '视图',
          componentName: 'toolBarContent1'
        },
        {
          name: '效果',
          componentName: 'toolBarContent2'
        },
        {
          name: '工具',
          componentName: 'toolBarContent3'
        },
        {
          name: '其他',
          componentName: 'toolBarContent4'
        }
      ]
    }
  },
  mixins: [common],
  computed: {
    ...mapState('cesium/tool-bar', {
      dropdown: state => state.dropdown
    })
  },
  watch: {},
  created() {},
  mounted() {
    const that = this
    this.cesiumPromise.then(({ viewer }) => {
      that.viewer = viewer
    })
    this.$store.dispatch('cesium/tool-bar/dropdown', {
      ...this.dropdown,
      top: this.$el.offsetHeight
    })
  },
  methods: {
    selectTab(index) {
      this.currentTab = index
    },
    clearDropdown() {
      this.$store.dispatch('cesium/tool-bar/dropdown', {
        ...this.dropdown,
        show: false,
        componentName: ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  .dropdown-panel {
    left: var(--dropdown-panel-p-left);
    top: var(--dropdown-panel-p-top);
  }
}
</style>
