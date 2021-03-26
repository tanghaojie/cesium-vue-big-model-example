<template>
  <div
    class="tool-bar"
    :style="{
      '--dropdown-panel-p-left': dropdownPanel.left + 'px',
      '--dropdown-panel-p-top': dropdownPanel.top + 'px'
    }"
    @click="toolBarClick"
  >
    <div class="menus">
      <ul class="j-flex titles">
        <li
          v-for="(menu, index) in menus"
          :key="index"
          :class="index === currentMenu ? 'active' : ''"
          @click="selectMenu(index)"
        >
          {{ menu.name }}
        </li>
      </ul>
    </div>

    <div class="j-flex contents">
      <div
        class="j-flex content"
        v-show="index === currentMenu"
        v-for="(menu, index) in menus"
        :key="index"
      >
        <div
          v-for="(group, i) in menu.groups"
          :key="i"
          class="j-flex j-flex-column j-justify-content-center j-align-items-center group"
        >
          <div class="j-flex group-container">
            <div
              v-for="(item, j) in group.items"
              :key="j"
              class="item j-flex j-justify-content-center j-align-items-center"
            >
              <div
                @click="itemClicked(index, i, j)"
                class="item-container j-flex j-flex-column j-justify-content-center j-align-items-center"
                :class="item.active && item.active() ? 'active' : ''"
                :ref="'itemContainer' + index + i + j"
              >
                <div class="icon">
                  <svg-icon :name="item.icon" />
                </div>
                <div class="name">{{ item.name }}</div>
              </div>
              <div
                v-if="item.dropdown"
                @click.stop="dropdownClicked(index, i, j)"
                class="dropdown j-flex j-justify-content-center j-align-items-center"
                :class="dropdownPanel.show ? 'active' : ''"
              >
                <svg-icon name="arrow-down" />
              </div>
            </div>
          </div>

          <div class="group-name">{{ group.name }}</div>
        </div>
      </div>
    </div>

    <div v-show="dropdownPanel.show" class="dropdown-panel">
      <component :is="dropdownPanel.innerComponentName"></component>
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import common from '@/mixin/common'
import cameraChangeRate from './camera-change-rate/camera-change-rate'
import { flyToEarth, flyToChina } from '@/libs/cesium/fly-to'
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
import { mapState } from 'vuex'

export default {
  props: {},
  components: { cameraChangeRate },
  data() {
    return {
      menus: [
        {
          name: '视图',
          groups: [
            {
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
            },
            {
              name: '状态栏',
              items: [
                {
                  name: '视角坐标',
                  icon: 'camera2',
                  dropdown: {
                    clicked: () => {},
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
          ]
        },
        {
          name: '效果',
          groups: [
            {
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
                    this.$store.dispatch(
                      'cesium/nature/switchSkyAtmosphereShown',
                      {
                        viewer: this.viewer
                      }
                    )
                  },
                  active: () => this.showSkyAtmosphere
                },
                {
                  name: '日照阴影',
                  icon: 'earth',
                  clicked: () => {
                    this.$store.dispatch(
                      'cesium/nature/switchGlobeLightingEnable',
                      {
                        viewer: this.viewer
                      }
                    )
                  },
                  active: () => this.enableLighting
                },
                {
                  name: '天空盒',
                  icon: 'earth',
                  clicked: () => {
                    this.$store.dispatch('cesium/nature/switchSkyBoxShown', {
                      viewer: this.viewer
                    })
                  },
                  active: () => this.showSkyBox
                }
              ]
            }
          ]
        },
        {
          name: '工具',
          groups: [
            {
              name: '3DTiles',
              init: params => {
                addYingXiuZhenZhongYiZhiClassificationPrimitive(params)
              },
              items: [
                {
                  name: '高亮瓦片',
                  icon: 'setting',
                  clicked: params => {
                    this.$store.dispatch(
                      'cesium/tool-bar/switchHightlight3DTileFeatureItemActive'
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
                  name: '单体化(滑动染色)',
                  icon: 'setting',
                  clicked: params => {
                    this.$store.dispatch(
                      'cesium/tool-bar/switchClassifyItemActive'
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
                  name: '单体化(点击高亮)',
                  icon: 'setting',
                  clicked: params => {
                    this.$store.dispatch(
                      'cesium/tool-bar/switchInvertClassifyItemActive'
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
          ]
        },
        {
          name: '其他',
          groups: [
            {
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
                  icon: 'setting',
                  clicked: params => {
                    window.open(
                      'https://cesium.com/docs/cesiumjs-ref-doc/index.html'
                    )
                  }
                },
                {
                  name: '官方Demo',
                  icon: 'setting',
                  clicked: params => {
                    window.open('https://sandcastle.cesium.com/')
                  }
                }
              ]
            }
          ]
        }
      ],
      currentMenu: 0,

      dropdownPanel: {
        show: false,
        left: 0,
        top: 0,
        innerComponentName: ''
      }
    }
  },
  mixins: [common],
  computed: {
    ...mapState('utils/layout', {
      locationBar: state => state.locationBar
    }),
    ...mapState('cesium/nature', {
      showSun: state => state.showSun,
      showMoon: state => state.showMoon,
      showSkyAtmosphere: state => state.showSkyAtmosphere,
      enableLighting: state => state.enableLighting,
      showSkyBox: state => state.showSkyBox
    }),
    ...mapState('cesium/tool-bar', {
      hightlight3DTileFeatureItemActive: state =>
        state.hightlight3DTileFeatureItemActive,
      classifyItemActive: state => state.classifyItemActive,
      invertClassifyItemActive: state => state.invertClassifyItemActive
    })
  },
  watch: {},
  created() {},
  mounted() {
    const that = this
    this.cesiumPromise.then(({ viewer }) => {
      that.viewer = viewer
      that.menuInit({ viewer: viewer })
    })
  },
  methods: {
    menuInit(params) {
      this.menus.forEach(menu => {
        menu.groups.forEach(group => {
          if (group.init) {
            group.init(params)
          }
          group.items.forEach(item => {
            if (item.init) {
              item.init(params)
            }
          })
        })
      })
    },
    selectMenu(index) {
      this.currentMenu = index
    },
    toolBarClick() {
      this.dropdownPanel.show = false
    },
    itemClicked(index, gIndex, iIndex) {
      const menu = this.menus[index]
      if (!menu) {
        return
      }
      const group = menu.groups[gIndex]
      if (!group) {
        return
      }
      const item = group.items[iIndex]
      if (!item) {
        return
      }

      if (item.clicked) {
        item.clickedResult = item.clicked({ viewer: this.viewer, item: item })
      }
    },
    dropdownClicked(index, gIndex, iIndex) {
      if (this.dropdownPanel.show) {
        this.clearDropdown()
        return
      }
      this.clearDropdown()
      const menu = this.menus[index]
      if (!menu) {
        return
      }
      const group = menu.groups[gIndex]
      if (!group) {
        return
      }
      const item = group.items[iIndex]
      if (!item) {
        return
      }

      if (item.dropdown && item.dropdown.clicked) {
        const refName = 'itemContainer' + index + gIndex + iIndex
        this.dropdownPanel.innerComponentName = item.dropdown.componentName
        this.dropdownPanel.left = this.$refs[refName][0].offsetLeft
        this.dropdownPanel.top = this.$el.offsetHeight
        this.dropdownPanel.show = true
        item.dropdown.clicked()
      }
    },
    clearDropdown() {
      this.dropdownPanel.show = false
      this.dropdownPanel.innerComponentName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  pointer-events: auto;
  background: #6b6b6b;

  .menus {
    .titles {
      margin: 0;
      padding: 0;
      width: 100%;
      background: #474747;
      list-style: none;

      .active {
        background: #6b6b6b;
      }

      li {
        color: white;
        padding: 6px 25px;
        list-style: none;
        font-size: 0.9rem;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          background: #6b6b6b;
        }
      }
    }
  }

  .contents {
    margin-top: 6px;
    .content {
      padding-bottom: 3px;
      .group {
        padding: 0 26px;
        border-right: solid 3px #474747;

        .group-name {
          color: white;
          font-size: 0.7rem;
          padding: 2px 16px;
          background-color: #474747;
          border-radius: 5px;
          margin-top: 5px;
        }

        .active {
          color: rgb(82, 177, 214);
        }

        .item {
          margin: 0 5px;
          padding: 0 12px;
          .item-container {
            cursor: pointer;
            &:hover {
              color: rgb(82, 177, 214);
            }

            .name {
              font-size: 0.9rem;
              color: white;
            }
            .icon {
              font-size: 3rem;
            }
          }
          .dropdown {
            cursor: pointer;
            margin-left: 5px;
            height: 100%;
            &:hover {
              color: rgb(82, 177, 214);
            }
          }
        }
      }
    }
  }

  .dropdown-panel {
    background-color: rgba($color: #555, $alpha: 0.8);
    color: white;
    padding: 16px;
    border: solid 2px #999;
    border-radius: 6px;
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    position: absolute;
    left: var(--dropdown-panel-p-left);
    top: var(--dropdown-panel-p-top);
    z-index: 999;

    .active {
      color: rgb(82, 177, 214);
    }
  }
}
</style>
