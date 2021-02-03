<template>
  <div id="cesiumContainer">
    <button
      id="model-manager-button"
      @click="modelManagerShow = !modelManagerShow"
      class="cesium-button"
      style="display: none;"
    >
      模型管理
    </button>

    <transition name="model-manager-fade">
      <div v-show="modelManagerShow" id="model-manager">
        <div @click="showAddModel()" class="add">添加模型</div>
        <div class="model-list">
          <div v-for="(item, index) in models" :key="index" class="item">
            <input
              :id="'index-' + index"
              :value="index"
              @change="modelCheckedChanged(index)"
              v-model="models[index].checked"
              type="checkbox"
            />
            <div @dblclick="modelNameDblClick(index)" class="name">
              {{ item.name }}
            </div>
            <div @click="removeModel(index)" class="close">x</div>
          </div>
        </div>

        <div id="qwe"></div>
      </div>
    </transition>

    <div
      v-show="addModelVisible"
      @click.stop="addModelCancel()"
      class="add-model"
    >
      <div @click.stop class="container">
        <div class="text">
          <input v-model="addModelName" type="text" />
          <input v-model="addModelUrl" type="text" />
        </div>
        <div class="op">
          <div @click.stop="addModelOk()" class="ok">确定</div>
          <div @click.stop="addModelCancel()" class="cancel">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'cesium'

export default {
  components: {},
  props: {},
  data() {
    return {
      modelManagerShow: true,
      addModelName: '',
      addModelUrl: '',
      addModelVisible: false,
      models: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var west = 103.44
      var south = 31.04
      var east = 103.53
      var north = 31.08
      var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north)
      Cesium.Camera.DEFAULT_VIEW_FACTOR = 0
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = rectangle

      const viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,
        timeline: false,
        geocoder: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        baselLayerPicker: false,
        infoBox: false,
        terrainProvider: Cesium.createWorldTerrain(),
        imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 })
      })
      viewer.cesiumWidget.creditContainer.style.display = 'none'

      window.viewer = viewer

      // viewer.scene.primitives.add(
      //   new Cesium.Cesium3DTileset({
      //     url: Cesium.IonResource.fromAssetId(75343)
      //   })
      // )

      this.addModel(
        'Default',
        'http://117.139.247.104:60001/3dtile/tileset.json'
      )

      const toolbar = document.querySelector('div.cesium-viewer-toolbar')
      const homeButton = document.querySelector('button.cesium-home-button')
      const modelManager = document.querySelector('button#model-manager-button')
      modelManager.style = ''
      toolbar.insertBefore(modelManager, homeButton)

      console.log(Cesium.distanceUnits)

      // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      // handler.setInputAction(function(event) {
      //   const earthPosition = viewer.camera.pickEllipsoid(
      //     event.position,
      //     viewer.scene.globe.ellipsoid
      //   )
      //   const cartographic = Cesium.Cartographic.fromCartesian(
      //     earthPosition,
      //     viewer.scene.globe.ellipsoid,
      //     new Cesium.Cartographic()
      //   )
      //   const lat = Cesium.Math.toDegrees(cartographic.latitude)
      //   const lng = Cesium.Math.toDegrees(cartographic.longitude)
      //   const height = cartographic.height
      //   console.log('[Lng=>' + lng + ',Lat=>' + lat + ',H=>' + height + ']')
      // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    showAddModel() {
      this.addModelVisible = true
    },
    addModelOk() {
      if (this.addModelName && this.addModelUrl) {
        this.addModel(this.addModelName, this.addModelUrl)
      }
    },
    addModelCancel() {
      this.addModelVisible = false
    },
    addModel(name, url) {
      this.models.push({ name, url, checked: true })
      window.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url
        })
      )
    },
    modelCheckedChanged(index) {
      const item = this.models[index]
      const primitives = window.viewer.scene.primitives
      const len = primitives.length
      for (let i = 0; i < len; i++) {
        const primitive = primitives.get(i)
        if (primitive.resource.url === item.url) {
          primitive.show = item.checked
          break
        }
      }
    },
    removeModel(index) {
      const item = this.models[index]
      const primitives = window.viewer.scene.primitives
      const len = primitives.length
      for (let i = 0; i < len; i++) {
        const primitive = primitives.get(i)
        if (primitive.resource.url === item.url) {
          this.models.splice(index, 1)
          primitives.remove(primitive)
          break
        }
      }
    },
    modelNameDblClick(index) {
      const item = this.models[index]
      const primitives = window.viewer.scene.primitives
      const len = primitives.length
      for (let i = 0; i < len; i++) {
        const primitive = primitives.get(i)
        if (primitive.resource.url === item.url) {
          window.viewer.zoomTo(primitive)
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;

  .model-manager-fade-enter-active,
  .model-manager-fade-leave-active {
    transition: all 0.3s ease;
  }

  .model-manager-fade-enter,
  .model-manager-fade-leave-to {
    transform: translateX(-300px);
  }

  .add-model {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;

    .container {
      background-color: white;
      padding: 38px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .text {
        padding: 5px;
        input {
          display: block;
          margin-bottom: 10px;
        }
        input:nth-child(1) {
          width: 180px;
          height: 24px;
        }
        input:nth-child(2) {
          width: 380px;
          height: 24px;
        }
      }

      .op {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 250px;

        .ok,
        .cancel {
          cursor: pointer;
          width: 50px;
          text-align: center;
          font-size: 16px;
          background-color: #416dd7;
          border-radius: 8px;
          color: #fff;
          padding: 8px 20px;
          z-index: 999;
        }
      }
    }
  }

  #model-manager {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;

    .add {
      background-color: #000;
      color: white;
      text-align: center;
      padding: 10px;
    }

    .model-list {
      padding: 16px 0;

      .item {
        margin-top: 10px;
        display: block;
        padding: 12px 16px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;

        input {
          padding: 2px;
        }

        .name {
          flex: 1;
        }

        .close {
          cursor: pointer;
          padding: 2px 5px;
        }
      }
    }
  }
}
</style>
