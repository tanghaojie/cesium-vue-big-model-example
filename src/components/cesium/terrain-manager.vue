<template>
  <div class="terrain-manager">
    <div class="type">
      <div class="title">
        <div class="name">地形</div>
        <div class="op">
          <div class="plus">
            <a-icon type="plus" />
          </div>
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
            点击选择地形 <a-icon type="down" />
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
          name: '无',
          terrainProvider: new Cesium.EllipsoidTerrainProvider({
            tilingScheme: new Cesium.GeographicTilingScheme()
          })
        },
        {
          name: '简单全球地形',
          terrainProvider: Cesium.createWorldTerrain({
            // required for water effects
            requestWaterMask: true,
            // required for terrain lighting
            requestVertexNormals: true
          })
        }
      ]
    }
  },
  mounted() {
    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer
    })
  },
  methods: {
    menuSelected({ key }) {
      const terrain = this.terrains[key]
      if (terrain && terrain.terrainProvider) {
        this.viewer.terrainProvider = terrain.terrainProvider
      }
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
