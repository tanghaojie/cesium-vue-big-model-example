<template>
  <div class="terrain-manager">
    <div class="type">
      <div class="title">
        <div class="name">三维地形</div>
        <div class="op">
          <!-- <div class="plus">
            <a-icon type="plus" />
          </div> -->
        </div>
      </div>

      <div class="select">
        <a-dropdown :trigger="['click']">
          <a-menu slot="overlay" @click="menuSelected">
            <a-menu-item v-for="(item, index) in terrains" :key="index">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
          <a-button class="button">
            {{ currentTerrainName || '点击选择地形' }} <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import common from '@/mixin/common'

export default {
  mixins: [common],
  data() {
    return {
      terrains: [
        {
          name: '无地形',
          terrainProviderName: 'EllipsoidTerrainProvider',
          options: {
            tilingScheme: new Cesium.GeographicTilingScheme()
          }
        },
        {
          name: '简单全球地形',
          terrainProvider: Cesium.createWorldTerrain({
            // required for water effects
            requestWaterMask: true,
            // required for terrain lighting
            requestVertexNormals: true
          })
        },
        {
          name: '测试高精地形001',
          terrainProviderName: 'CesiumTerrainProvider',
          options: {
            url: 'http://117.139.247.104:60001/terrains/ssdx'
          },
          afterReady: function(viewer, success) {
            console.log(555555555)
            if (viewer && success) {
              console.log(11111111111)
              viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                  102.81450979915033,
                  32.105551886627644,
                  10000
                ),
                orientation: {
                  heading: Cesium.Math.toRadians(0),
                  pitch: Cesium.Math.toRadians(-90),
                  roll: 0.0
                }
              })
            }
          }
        }
      ],
      currentTerrainName: ''
    }
  },
  mounted() {
    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer
      this.menuSelected({ key: 1 })
    })
  },
  methods: {
    menuSelected({ key }) {
      const terrain = this.terrains[key]
      if (terrain && terrain.terrainProvider) {
        this.viewer.terrainProvider = terrain.terrainProvider
      } else if (terrain && terrain.terrainProviderName) {
        const provider = new Cesium[terrain.terrainProviderName]({
          ...terrain.options
        })
        if (terrain.afterReady) {
          provider.readyPromise.then(success => {
            terrain.afterReady(this.viewer, success)
          })
        }
        this.viewer.terrainProvider = provider
      }
      this.currentTerrainName = terrain.name || '<None>'
    }
  }
}
</script>

<style lang="scss" scoped>
.terrain-manager {
  .type {
    padding: 0 16px 16px;
    .title {
      font-size: 18px;
      color: white;
      display: flex;
      flex-direction: row;

      .name {
        flex: 1 1 auto;
      }
      .op {
        flex: 0 0 auto;
        display: flex;
        flex-direction: row;

        .plus,
        .sync {
          cursor: pointer;
        }

        .sync {
          margin-left: 8px;
        }
      }
    }
  }

  .select {
    padding: 8px 0;
    .button {
      width: 100%;
    }
  }
}
</style>
