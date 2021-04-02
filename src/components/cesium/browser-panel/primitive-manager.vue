<template>
  <div class="primitive-manager">
    <div class="type px-4 pb-4">
      <div class="title text-lg text-white flex flex-row">
        <div class="name flex-1">模型</div>
        <div class="op flex flex-row flex-grow-0 flex-shrink-0">
          <div class="plus cursor-pointer" @click="plusModels">
            <a-icon type="plus" />
          </div>
          <div class="sync cursor-pointer ml-3" @click="syncModels">
            <a-icon type="sync" />
          </div>
        </div>
      </div>
      <div class="list">
        <div
          v-for="(item, index) in models"
          :key="index"
          class="item flex flex-row justify-center items-center text-white py-2"
        >
          <a-switch
            size="small"
            :checked="item.checked"
            @change="(checked, e) => changeModelShow(index, checked, e)"
          />
          <div
            class="layer-name mx-3 flex-1 cursor-default"
            @dblclick="modelNameDoubleClick(index)"
          >
            {{ item.name }}
          </div>
          <div class="remove cursor-default" @click="removeModel(index)">
            <a-icon type="close" />
          </div>
        </div>
      </div>
    </div>

    <a-modal
      v-model="plusModelModalVisible"
      title="添加模型"
      class="primitive-manager-modal"
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
        <div class="url mt-4">
          <a-input v-model="addModelModel.url" placeholder="模型Url">
            <a-icon slot="prefix" type="build" />
          </a-input>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import common from '@/mixin/common'
import Util from '@/utils/Util'
import { PRIMITIVE_MANAGER_NAME_FLAG, PRIMITIVE_FLAG_NAME } from './common'
import primitiveCenter from '@/utils/cesium/primitive-center'

export default {
  components: {},
  props: {
    onlyShowSelfManagedPrimitive: {
      type: Boolean,
      default: true
    }
  },
  mixins: [common],
  data() {
    return {
      models: [],
      plusModelModalVisible: false,
      addModelModel: {
        name: '',
        url: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.cesiumPromise.then(({ viewer }) => {
      this.viewer = viewer

      // const primitives = this.viewer.scene.primitives
      //primitives.removeAll()

      this.addGltf({
        name: '精模',
        url: 'http://117.139.247.104:60001/models/gltfs/rc/rc.gltf',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          Cesium.Cartesian3.fromDegrees(103.6144, 30.95525207451468, 665.0),
          new Cesium.HeadingPitchRoll(Cesium.Math.PI_OVER_TWO, 0, 0)
        ),
        show: false
      })

      this.addGltf({
        name: '单体化',
        url:
          'http://117.139.247.104:60001/models/gltfs/for_single/for_single_use.gltf',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          Cesium.Cartesian3.fromDegrees(103.61225, 30.9559, 665.5),
          new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(108), 0, 0)
        ),
        show: false
      })

      this.add3DTileset({
        name: '倾斜摄影模型',
        url: 'http://117.139.247.104:60001/models/3dtiles/yingxiu/tileset.json',
        show: false
      })

      this.add3DTileset({
        name: '简模001',
        url:
          'http://117.139.247.104:60001/models/3dtiles/shp_factory/tileset.json'
      })

      this.add3DTileset({
        name: '简模002',
        url:
          'http://117.139.247.104:60001/models/3dtiles/apartment/tileset.json'
      })
    })
  },
  methods: {
    syncModels() {
      this.models.splice(0, this.models.length)
      const { viewer } = this
      const pris = viewer.scene.primitives
      const len = pris.length
      for (let i = len - 1; i >= 0; --i) {
        const model = pris.get(i)

        const flag = model[PRIMITIVE_FLAG_NAME]

        if (
          this.onlyShowSelfManagedPrimitive &&
          flag !== PRIMITIVE_MANAGER_NAME_FLAG
        ) {
          continue
        }

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

      this.add3DTileset({
        name: this.addModelModel.name,
        url: this.addModelModel.url
      })

      this.addModelModel.name = ''
      this.addModelModel.url = ''
    },
    add3DTileset(option) {
      const model = new Cesium.Cesium3DTileset({
        ...option
      })
      model[PRIMITIVE_FLAG_NAME] = PRIMITIVE_MANAGER_NAME_FLAG
      model.name = option.name
      model.uuid = Util.uuid()
      model.show = option.show
      this.viewer.scene.primitives.add(model)
      this.syncModels()
    },
    addGltf(option) {
      const model = Cesium.Model.fromGltf({
        ...option
      })
      model[PRIMITIVE_FLAG_NAME] = PRIMITIVE_MANAGER_NAME_FLAG
      model.name = option.name
      model.uuid = Util.uuid()
      model.show = option.show
      this.viewer.scene.primitives.add(model)
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
      const location = primitiveCenter(model)
      this.viewer.camera.flyTo({
        duration: 1,
        destination: Cesium.Cartesian3.fromDegrees(
          location.longitude,
          location.latitude - 0.001,
          location.height + 500
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-78),
          roll: 0.0
        }
      })
    }
  }
}
</script>
