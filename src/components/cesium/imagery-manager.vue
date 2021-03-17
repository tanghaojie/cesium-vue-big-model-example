<template>
  <div class="imagery-manager">
    <div class="type">
      <div class="title">
        <div class="name">影像</div>
        <div class="op">
          <div class="plus" @click="plusImageries">
            <a-icon type="plus" />
          </div>
          <div class="sync" @click="syncImageries">
            <a-icon type="sync" />
          </div>
        </div>
      </div>
      <div class="list">
        <div v-for="(item, index) in imageries" :key="index" class="item">
          <a-switch
            size="small"
            :checked="item.checked"
            @change="(checked, e) => changeImageryShow(index, checked, e)"
          />
          <div class="layer-name">{{ item.name }}</div>
          <div class="remove" @click="removeImagery(index)">
            <a-icon type="close" />
          </div>
        </div>
      </div>
    </div>

    <a-modal
      v-model="plusImageryModalVisible"
      title="选择影像服务"
      :footer="null"
      class="imagery-manager-modal"
    >
      <div class="imagery-sources">
        <div
          v-for="(item, index) in imagerySources"
          :key="index"
          @dblclick="addImagery(item)"
          class="imagery"
        >
          <div class="img">
            <img :src="'./static/imgs/' + item.imgUrl" width="64" height="64" />
          </div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import common from '@/mixin/common'
import Util from '@/utils/Util'

export default {
  components: {},
  props: {},
  data() {
    return {
      imageries: [],
      plusImageryModalVisible: false,
      imagerySources: [
        {
          imgUrl: 'img_c.png',
          name: '天地图影像底图',
          options: {
            url:
              'http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=feff991159823907566acaa7273472ea',
            layer: 'img',
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'c',
            tileMatrixLabels: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18'
            ],
            tilingScheme: new Cesium.GeographicTilingScheme(),
            credit: new Cesium.Credit('天地图全球影像服务'),
            subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            maximumLevel: 18,
            show: true
          },
          provider: 'WebMapTileServiceImageryProvider'
        },
        {
          imgUrl: 'cia_c.png',
          name: '天地图影像注记',
          options: {
            url:
              'http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=feff991159823907566acaa7273472ea',
            layer: 'img',
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'c',
            tileMatrixLabels: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18'
            ],
            tilingScheme: new Cesium.GeographicTilingScheme(),
            credit: new Cesium.Credit('天地图全球影像服务'),
            subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            maximumLevel: 18,
            show: true
          },
          provider: 'WebMapTileServiceImageryProvider'
        },
        {
          imgUrl: 'vec_c.png',
          name: '天地图矢量底图',
          options: {
            url:
              'http://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=feff991159823907566acaa7273472ea',
            layer: 'vec',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'c',
            tileMatrixLabels: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18'
            ],
            tilingScheme: new Cesium.GeographicTilingScheme(),
            credit: new Cesium.Credit('天地图全球影像服务'),
            subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            maximumLevel: 18,
            show: true
          },
          provider: 'WebMapTileServiceImageryProvider'
        },
        {
          imgUrl: 'cva_c.png',
          name: '天地图矢量注记',
          options: {
            url:
              'http://{s}.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=feff991159823907566acaa7273472ea',
            layer: 'vec',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'c',
            tileMatrixLabels: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18'
            ],
            tilingScheme: new Cesium.GeographicTilingScheme(),
            credit: new Cesium.Credit('天地图全球影像服务'),
            subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
            maximumLevel: 18,
            show: true
          },
          provider: 'WebMapTileServiceImageryProvider'
        },
        {
          imgUrl: 'amap_img.png',
          name: '高德影像底图',
          options: {
            url:
              'https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            subdomains: ['01', '02', '03', '04']
          },
          provider: 'UrlTemplateImageryProvider'
        },
        {
          imgUrl: 'amap_img.png',
          name: '高德影像注记',
          options: {
            url:
              'https://webst{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
            subdomains: ['01', '02', '03', '04']
          },
          provider: 'UrlTemplateImageryProvider'
        },
        {
          imgUrl: 'amap_img.png',
          name: '高德矢量',
          options: {
            url:
              'https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            subdomains: ['01', '02', '03', '04']
          },
          provider: 'UrlTemplateImageryProvider'
        }
      ]
    }
  },
  mixins: [common],
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer
      const ils = this.viewer.imageryLayers
      ils.removeAll()

      this.addImagery(this.imagerySources[0])
      this.addImagery(this.imagerySources[1])
      this.syncImageries()
    })
  },
  methods: {
    syncImageries() {
      this.imageries.splice(0, this.imageries.length)
      const { viewer } = this
      const ils = viewer.imageryLayers
      const len = ils.length
      for (let i = len - 1; i >= 0; --i) {
        const layer = ils.get(i)
        this.imageries.push({
          name: layer.name || '<NoneName>',
          uuid: layer.uuid || '<NoneUuid>',
          provider: layer.imageryProvider.constructor.name,
          checked: layer.show,
          cesiumLayerIndex: i
        })
      }
    },
    changeImageryShow(index, checked) {
      this.imageries[index].checked = this.viewer.imageryLayers.get(
        this.imageries[index].cesiumLayerIndex
      ).show = checked
    },
    plusImageries() {
      this.plusImageryModalVisible = true
    },
    addImagery(item) {
      const layer = new Cesium.ImageryLayer(
        new Cesium[item.provider]({ ...item.options })
      )
      layer.name = item.name
      layer.uuid = Util.uuid()
      const ils = this.viewer.imageryLayers

      ils.add(layer)
      this.syncImageries()
      return layer
    },
    removeImagery(index) {
      const ils = this.viewer.imageryLayers
      const layer = ils.get(this.imageries[index].cesiumLayerIndex)
      ils.remove(layer)
      this.syncImageries()
    }
  }
}
</script>

<style lang="scss" scoped>
.imagery-manager {
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
    .list {
      .item {
        padding: 8px 0;
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .layer-name {
          margin: 0 10px;
          flex: 1 1 auto;
          cursor: default;
        }

        .remove {
          cursor: pointer;
        }
      }
    }
  }
}
.imagery-manager-modal {
  .imagery-sources {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .imagery {
      width: 64px;
      margin: 8px;
      .img {
        width: 64px;
        height: 64px;
        border-radius: 10px;
        overflow: hidden;
        // background-color: rosybrown;
      }
      .name {
        font-family: sans-serif;
        text-align: center;
        vertical-align: middle;
        color: black; //#edffff;
        font-size: 14px;
      }
    }
  }
}
</style>
