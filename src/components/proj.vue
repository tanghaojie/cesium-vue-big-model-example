<template>
  <side-collapse class="side" width="300px">
    <div style="height: 100px; background-color: transparent;">Icon Here</div>
    <scrollbar class="scrollbar" height="calc(100% - 100px)" resize>
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

      <div class="type">
        <div class="title">
          <div class="name">模型</div>
          <div class="op">
            <div class="plus" @click="plusModels">
              <a-icon type="plus" />
            </div>
            <div class="sync" @click="syncModels">
              <a-icon type="sync" />
            </div>
          </div>
        </div>
        <div class="list">
          <div v-for="(item, index) in models" :key="index" class="item">
            <a-switch
              size="small"
              :checked="item.checked"
              @change="(checked, e) => changeModelShow(index, checked, e)"
            />
            <div class="layer-name" @dblclick="modelNameDoubleClick(index)">
              {{ item.name }}
            </div>
            <div class="remove" @click="removeModel(index)">
              <a-icon type="close" />
            </div>
          </div>
        </div>
      </div>
    </scrollbar>

    <a-modal
      v-model="plusImageryModalVisible"
      title="选择影像服务"
      :footer="null"
      class="modal"
    >
      <div class="imagery-sources">
        <div
          v-for="(item, index) in imagerySources"
          :key="index"
          @dblclick="addImagery(item)"
          class="imagery"
        >
          <div class="img">
            <img :src="'/static/imgs/' + item.imgUrl" width="64" height="64" />
          </div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="plusModelModalVisible"
      title="添加模型"
      class="modal"
      cancelText="取消"
      okText="确定"
      destroyOnClose
      @ok="addModelConfirm"
    >
      <div class="add-model">
        <div class="name">
          <a-input v-model="addModelModel.name" placeholder="模型名">
            <a-icon slot="prefix" type="file" />
          </a-input>
        </div>
        <div class="url">
          <a-input v-model="addModelModel.url" placeholder="模型Url">
            <a-icon slot="prefix" type="build" />
          </a-input>
        </div>
      </div>
    </a-modal>
  </side-collapse>
</template>

<script>
import * as Cesium from 'cesium'
import Util from '../utils/Util'
import sideCollapse from './side-collapse'
import scrollbar from './scrollbar/scrollbar'
import common from '../mixin/common'

export default {
  components: { sideCollapse, scrollbar },
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
      ],

      models: [],
      plusModelModalVisible: false,
      addModelModel: {
        name: '',
        url: ''
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

      this.addImagery(this.imagerySources[0])
      this.addImagery(this.imagerySources[1])
      this.syncImageries()

      const primitives = this.viewer.scene.primitives
      primitives.removeAll()

      const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        Cesium.Cartesian3.fromDegrees(103.6144, 30.95525207451468, 665.0),
        new Cesium.HeadingPitchRoll(Cesium.Math.PI_OVER_TWO, 0, 0)
      )

      const model = Cesium.Model.fromGltf({
        url: 'http://117.139.247.104:60001/models/gltfs/rc/rc.gltf',
        modelMatrix: modelMatrix
      })
      primitives.add(model)

      console.log(typeof model)

      // viewer.flyTo(model)

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          103.61482952161184,
          30.95525207451468,
          1200.0
        )
      })

      this.addModel({
        name: '映秀镇倾斜摄影',
        url: 'http://117.139.247.104:60001/models/3dtiles/yingxiu/tileset.json'
      })
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
    },
    syncModels() {
      this.models.splice(0, this.models.length)
      const { viewer } = this
      const pris = viewer.scene.primitives
      const len = pris.length
      for (let i = len - 1; i >= 0; --i) {
        const model = pris.get(i)
        this.models.push({
          name: model.name || '<NoneName>',
          uuid: model.uuid || '<NoneUuid>',
          checked: model.show,
          cesiumIndex: i
        })
      }
    },
    changeModelShow(index, checked) {
      this.models[index].checked = this.viewer.scene.primitives.get(
        this.models[index].cesiumIndex
      ).show = checked
    },
    plusModels() {
      this.plusModelModalVisible = true
    },
    addModelConfirm() {
      this.plusModelModalVisible = false

      this.addModel({
        name: this.addModelModel.name,
        url: this.addModelModel.url
      })

      this.addModelModel.name = ''
      this.addModelModel.url = ''
    },
    addModel(option) {
      const model = new Cesium.Cesium3DTileset({
        url: option.url
      })
      model.name = option.name
      model.uuid = Util.uuid()
      this.viewer.scene.primitives.add(model)
      model.readyPromise.then(function(model) {})
      this.syncModels()
    },
    removeModel(index) {
      const primitives = this.viewer.scene.primitives
      const model = primitives.get(this.models[index].cesiumIndex)
      primitives.remove(model)
      this.syncModels()
    },
    modelNameDoubleClick(index) {
      const primitives = this.viewer.scene.primitives
      const model = primitives.get(this.models[index].cesiumIndex)
      console.log(model)
      const modelMatrix = model.modelMatrix
      var position = Cesium.Matrix4.getTranslation(
        modelMatrix,
        new Cesium.Cartesian3()
      )
      console.log(position)
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      const height = cartographic.height
      console.log(longitude, latitude, height)
      // this.viewer.zoomTo(model)
    }
  }
}
</script>

<style lang="scss" scoped>
.side {
  .scrollbar {
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
}
.modal {
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

  .add-model {
    .name {
    }
    .url {
      margin-top: 16px;
    }
  }
}
</style>
