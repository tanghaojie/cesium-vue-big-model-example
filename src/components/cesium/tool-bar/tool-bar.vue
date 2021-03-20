<template>
  <div class="tool-bar">
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
              @click="itemClicked(index, i, j)"
              class="item j-flex j-flex-column j-justify-content-center j-align-items-center"
              :class="item.active && item.active() ? 'active' : ''"
            >
              <div class="icon">
                <svg-icon :name="item.icon" />
              </div>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>

          <div class="group-name">{{ group.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import common from '@/mixin/common'
import { flyToEarth, flyToChina } from '@/libs/cesium/flyTo/flyTo.js'
import { mapState } from 'vuex'

export default {
  props: {},
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
        }
      ],
      currentMenu: 0
    }
  },
  mixins: [common],
  computed: {
    ...mapState('utils/layout', {
      locationBar: state => state.locationBar
    })
  },
  watch: {},
  created() {},
  mounted() {
    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer
    })
  },
  methods: {
    selectMenu(index) {
      this.currentMenu = index
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
        item.clicked(this.viewer)
      }
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
          cursor: pointer;
          margin: 0 5px;
          padding: 0 12px;
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
      }
    }
  }
}
</style>
