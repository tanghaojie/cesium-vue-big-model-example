<template>
  <div class="imagery-manager">
    <div class="type px-4 pb-4">
      <div class="title text-lg text-white flex flex-row">
        <div class="name flex-1">影像</div>
        <div class="op flex flex-row flex-grow-0 flex-shrink-0">
          <div class="plus cursor-pointer" @click="plusImageries">
            <a-icon type="plus" />
          </div>
          <div class="sync cursor-pointer ml-3" @click="syncImageries">
            <a-icon type="sync" />
          </div>
        </div>
      </div>
      <div class="list">
        <div
          v-for="(item, index) in imageries"
          :key="index"
          class="item flex flex-row justify-center items-center text-white py-2"
        >
          <a-switch
            size="small"
            :checked="item.checked"
            @change="(checked, e) => changeImageryShow(index, checked, e)"
          />
          <div class="layer-name mx-3 flex-1 cursor-default">
            {{ item.name }}
          </div>
          <div class="remove cursor-pointer" @click="settingImagery(index)">
            <a-icon type="setting" />
          </div>
          <div class="remove cursor-pointer ml-2" @click="removeImagery(index)">
            <a-icon type="close" />
          </div>
        </div>
      </div>
    </div>

    <layerOperate
      v-if="layerOperate.show"
      :a="layerOperate.init.alpha"
      :b="layerOperate.init.brightness"
      :c="layerOperate.init.contrast"
      :h="layerOperate.init.hue"
      :s="layerOperate.init.saturation"
      :cb="layerOperateCallback"
      @close="closeLayerOperate"
    />

    <a-modal
      v-model="plusImageryModalVisible"
      title="选择影像服务"
      :footer="null"
      class="imagery-manager-modal flex flex-wrap"
    >
      <div class="imagery-sources">
        <div
          v-for="(item, index) in imagerySources"
          :key="index"
          :class="Array.isArray(item) ? 'px-5' : 'p-2 w-20'"
        >
          <div
            v-if="Array.isArray(item)"
            class="array flex flex-row flex-wrap justify-around items-center"
          >
            <div
              v-for="(subItem, index) in item"
              :key="index"
              @dblclick="addImagery(subItem)"
              class="p-2 w-20"
            >
              <div class="img w-16 h-16 overflow-hidden rounded-xl">
                <img
                  :src="'./static/imgs/' + subItem.imgUrl"
                  width="64"
                  height="64"
                  class="w-full h-full"
                />
              </div>
              <div
                class="name font-sans text-center align-middle text-black text-sm"
              >
                {{ subItem.name }}
              </div>
            </div>
          </div>
          <div v-else @dblclick="addImagery(item)">
            <div class="img w-16 h-16 overflow-hidden rounded-xl">
              <img
                :src="'./static/imgs/' + item.imgUrl"
                width="64"
                height="64"
                class="w-full h-full"
              />
            </div>
            <div
              class="name font-sans text-center align-middle text-black text-sm"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import common from '@/mixin/common'
import Util from '@/utils/Util'
import layerOperate from '../layer-operate/layer-operate'

export default {
  components: { layerOperate },
  props: {},
  data() {
    return {
      imageries: [],
      plusImageryModalVisible: false,
      imagerySources: [
        [
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
          }
        ],
        [
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
        ],
        [
          {
            imgUrl: 'google_hybrid.png',
            name: 'google混合',
            options: {
              url: 'https://mt1.google.cn/vt/lyrs=y&hl=zh-CN&x={x}&y={y}&z={z}'
            },
            provider: 'UrlTemplateImageryProvider'
          },
          {
            imgUrl: 'google_satellite.png',
            name: 'google影像',
            options: {
              url: 'https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}'
            },
            provider: 'UrlTemplateImageryProvider'
          },
          {
            imgUrl: 'google_label.png',
            name: 'google注记',
            options: {
              url: 'https://mt1.google.cn/vt/lyrs=h&hl=zh-CN&x={x}&y={y}&z={z}'
            },
            provider: 'UrlTemplateImageryProvider'
          },
          {
            imgUrl: 'google_road.png',
            name: 'google道路',
            options: {
              url: 'https://mt1.google.com/vt/lyrs=m&hl=zh-CN&x={x}&y={y}&z={z}'
            },
            provider: 'UrlTemplateImageryProvider'
          },
          {
            imgUrl: 'google_terrain.png',
            name: 'google地形',
            options: {
              url: 'https://mt1.google.com/vt/lyrs=p&hl=zh-CN&x={x}&y={y}&z={z}'
            },
            provider: 'UrlTemplateImageryProvider'
          }
        ],
        {
          imgUrl: 'img_c.png',
          name: '测试高清影像001',
          options: {
            url: 'http://117.139.247.104:60001/images/ssdx/{z}/{x}/{y}.png',
            fileExtension: 'png',
            rectangle: Cesium.Rectangle.fromDegrees(
              102.79329966318,
              32.0931411982237,
              102.83566593733,
              32.111856902657
            )
          },
          provider: 'UrlTemplateImageryProvider',
          afterReady: function(viewer, success) {
            if (viewer && success) {
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
      layerOperate: {
        show: false,
        cesiumLayerIndex: -1,
        init: {
          alpha: 0,
          brightness: 0,
          contrast: 0,
          hue: 0,
          saturation: 0
        }
      }
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

      this.addImagery(this.imagerySources[0][0])
      this.addImagery(this.imagerySources[0][1])
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
      const provider = new Cesium[item.provider]({ ...item.options })
      if (item.afterReady) {
        provider.readyPromise.then(success => {
          item.afterReady(this.viewer, success)
        })
      }

      const layer = new Cesium.ImageryLayer(provider)
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
    },
    settingImagery(index) {
      const ils = this.viewer.imageryLayers
      const cesiumLayerIndex = this.imageries[index].cesiumLayerIndex
      const layer = ils.get(cesiumLayerIndex)
      this.layerOperate.cesiumLayerIndex = cesiumLayerIndex
      this.layerOperate.show = true
      this.layerOperate.init.alpha = layer.alpha
      this.layerOperate.init.brightness = layer.brightness
      this.layerOperate.init.contrast = layer.contrast
      this.layerOperate.init.hue = layer.hue
      this.layerOperate.init.saturation = layer.saturation
    },
    layerOperateCallback({ key, value }) {
      const cesiumLayerIndex = this.layerOperate.cesiumLayerIndex
      if (cesiumLayerIndex < 0) {
        return
      }
      const layer = this.viewer.imageryLayers.get(cesiumLayerIndex)
      layer[key] = value
    },
    closeLayerOperate() {
      this.layerOperate.cesiumLayerIndex = -1
      this.layerOperate.show = false
    }
  }
}
</script>
