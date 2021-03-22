<template>
  <div id="cesiumContainer" ref="viewer">
    <slot />
  </div>
</template>

<script>
import 'cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'cesium'
import { mapState } from 'vuex'
import logMousePositionMixin from '../../../mixin/cesium/mixins/logMousePositionMixin'

export default {
  name: 'JTViewerWrapper',
  components: {},
  props: {
    animation: {
      type: Boolean,
      default: false
    },
    baseLayerPicker: {
      type: Boolean,
      default: false
    },
    fullscreenButton: {
      type: Boolean,
      default: false
    },
    geocoder: {
      type: Boolean,
      default: false
    },
    homeButton: {
      type: Boolean,
      default: false
    },
    infoBox: {
      type: Boolean,
      default: true
    },
    sceneModePicker: {
      type: Boolean,
      default: false
    },
    selectionIndicator: {
      type: Boolean,
      default: true
    },
    timeline: {
      type: Boolean,
      default: false
    },
    navigationHelpButton: {
      type: Boolean,
      default: false
    },
    scene3DOnly: {
      type: Boolean,
      default: false
    },
    useDefaultRenderLoop: {
      type: Boolean,
      default: true
    },
    showRenderLoopErrors: {
      type: Boolean,
      default: true
    },
    automaticallyTrackDataSourceClocks: {
      type: Boolean,
      default: true
    },
    sceneMode: {
      type: Number,
      default: Cesium.SceneMode.SCENE3D
    },
    globalViewerMountKey: {
      type: String,
      default: '',
      required: false
    },
    globalCesiumMountKey: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {}
  },
  mounted() {
    const viewer = this.init()
    this.$emit('loaded', { viewer })
  },
  watch: {
    animation(val) {
      const { viewer, viewerContainer } = this
      if (
        Cesium.defined(viewer.animation) &&
        !viewer.animation.isDestroyed() &&
        !val
      ) {
        const animationContainer = viewer.animation.container
        viewerContainer.removeChild(animationContainer)
        viewer.animation.destroy()
        viewer._animation = undefined
      } else if (
        !Cesium.defined(viewer.animation) ||
        viewer.animation.isDestroyed()
      ) {
        const animationContainer = document.createElement('div')
        animationContainer.className = 'cesium-viewer-animationContainer'
        this.viewerContainer.appendChild(animationContainer)
        const animation = new Cesium.Animation(
          animationContainer,
          new Cesium.AnimationViewModel(viewer.clockViewModel)
        )
        animation.viewModel.dateFormatter = this.localeDateTimeFormatter
        animation.viewModel.timeFormatter = this.localeTimeFormatter
        viewer._animation = animation
      }
      viewer.forceResize()
    },
    baseLayerPicker(val) {
      const { viewer, resizeToolbar } = this
      const toolbar = viewer._toolbar
      if (
        Cesium.defined(viewer.baseLayerPicker) &&
        !viewer.baseLayerPicker.isDestroyed() &&
        !val
      ) {
        viewer.baseLayerPicker.destroy()
        viewer._baseLayerPicker = undefined
        viewer.imageryLayers.remove(
          viewer.imageryLayers.get(viewer.imageryLayers.length - 1)
        )
      } else if (
        !Cesium.defined(viewer.baseLayerPicker) ||
        viewer.baseLayerPicker.isDestroyed()
      ) {
        const createBaseLayerPicker =
          (!Cesium.defined(viewer.globe) || this.globe !== false) &&
          (!Cesium.defined(viewer.baseLayerPicker) ||
            this.baseLayerPicker !== false)

        if (createBaseLayerPicker && Cesium.defined(this.imageryProvider)) {
          throw new Cesium.DeveloperError(`options.imageryProvider is not available when using the BaseLayerPicker widget.
Either specify options.selectedImageryProviderViewModel instead or set options.baseLayerPicker to false.`)
        }
        if (
          !createBaseLayerPicker &&
          Cesium.defined(this.selectedImageryProviderViewModel)
        ) {
          throw new Cesium.DeveloperError(`options.selectedImageryProviderViewModel is not available when not using the BaseLayerPicker widget.
Either specify options.imageryProvider instead or set options.baseLayerPicker to true.`)
        }
        if (createBaseLayerPicker && Cesium.defined(this.terrainProvider)) {
          throw new Cesium.DeveloperError(`options.terrainProvider is not available when using the BaseLayerPicker widget.
Either specify options.selectedTerrainProviderViewModel instead or set options.baseLayerPicker to false.`)
        }
        if (
          !createBaseLayerPicker &&
          Cesium.defined(this.selectedTerrainProviderViewModel)
        ) {
          throw new Cesium.DeveloperError(`options.selectedTerrainProviderViewModel is not available when not using the BaseLayerPicker widget.
Either specify options.terrainProvider instead or set options.baseLayerPicker to true.`)
        }
        if (createBaseLayerPicker) {
          const imageryProviderViewModels = Cesium.defaultValue(
            this.imageryProviderViewModels,
            Cesium.createDefaultImageryProviderViewModels()
          )
          const terrainProviderViewModels = Cesium.defaultValue(
            this.terrainProviderViewModels,
            Cesium.createDefaultTerrainProviderViewModels()
          )
          const baseLayerPicker = new Cesium.BaseLayerPicker(toolbar, {
            globe: viewer.scene.globe,
            imageryProviderViewModels: imageryProviderViewModels,
            selectedImageryProviderViewModel: imageryProviderViewModels[0],
            terrainProviderViewModels: terrainProviderViewModels,
            selectedTerrainProviderViewModel: terrainProviderViewModels[0]
          })
          const elements = toolbar.getElementsByClassName(
            'cesium-baseLayerPicker-dropDown'
          )

          const baseLayerPickerDropDown = elements[0]
          viewer._baseLayerPickerDropDown = baseLayerPickerDropDown
          viewer._baseLayerPicker = baseLayerPicker
          viewer.imageryLayers.raiseToTop(viewer.imageryLayers.get(0))
          // resizeToolbar(toolbar, baseLayerPicker)
        }
      }
    },
    fullscreenButton(val) {
      const { viewer, viewerContainer } = this
      if (
        Cesium.defined(viewer.fullscreenButton) &&
        !viewer.fullscreenButton.isDestroyed() &&
        !val
      ) {
        const fullscreenContainer = viewer.fullscreenButton.container
        viewerContainer.removeChild(fullscreenContainer)
        viewer.fullscreenButton.destroy()
        viewer._fullscreenButton = undefined
      } else if (
        !Cesium.defined(viewer.fullscreenButton) ||
        viewer.fullscreenButton.isDestroyed()
      ) {
        const fullscreenContainer = document.createElement('div')
        fullscreenContainer.className = 'cesium-viewer-fullscreenContainer'
        viewerContainer.appendChild(fullscreenContainer)
        const fullscreenButton = new Cesium.FullscreenButton(
          fullscreenContainer,
          this.$refs.viewer
        )
        viewer._fullscreenButton = fullscreenButton
      }
      viewer.forceResize()
    },
    geocoder(val) {
      const { viewer } = this
      const toolbar = viewer._toolbar
      if (
        Cesium.defined(viewer.geocoder) &&
        !viewer.geocoder.isDestroyed() &&
        !val
      ) {
        const geocoderContainer = viewer.geocoder.container
        toolbar.removeChild(geocoderContainer)
        viewer.geocoder.destroy()
        viewer._geocoder = undefined
      } else if (
        !Cesium.defined(viewer.geocoder) ||
        viewer.geocoder.isDestroyed()
      ) {
        const geocoderContainer = document.createElement('div')
        geocoderContainer.className = 'cesium-viewer-geocoderContainer'
        toolbar.appendChild(geocoderContainer)
        const geocoder = new Cesium.Geocoder({
          container: geocoderContainer,
          geocoderServices: Cesium.defined(this.geocoder)
            ? this.geocoder
            : undefined,
          scene: viewer.scene,
          viewer: viewer
        })
        viewer._eventHelper.add(
          geocoder.viewModel.search.beforeExecute,
          viewer._clearObjects,
          viewer
        )
        viewer._geocoder = geocoder
      }
    },
    homeButton(val) {
      const { viewer } = this
      const toolbar = viewer._toolbar
      if (
        Cesium.defined(viewer.homeButton) &&
        !viewer.homeButton.isDestroyed() &&
        !val
      ) {
        viewer.homeButton.destroy()
        viewer._homeButton = undefined
      } else if (
        !Cesium.defined(viewer.homeButton) ||
        viewer.homeButton.isDestroyed()
      ) {
        const homeButton = new Cesium.HomeButton(toolbar, viewer.scene)
        if (Cesium.defined(viewer.geocoder)) {
          viewer._eventHelper.add(
            homeButton.viewModel.command.afterExecute,
            function() {
              const viewModel = viewer.geocoder.viewModel
              viewModel.searchText = ''
              if (viewModel.isSearchInProgress) {
                viewModel.search()
              }
            }
          )
        }
        viewer._eventHelper.add(
          homeButton.viewModel.command.beforeExecute,
          viewer._clearTrackedObject,
          viewer
        )
        viewer._homeButton = homeButton
      }
    },
    infoBox(val) {
      const { viewer, viewerContainer } = this
      if (
        Cesium.defined(viewer.infoBox) &&
        !viewer.infoBox.isDestroyed() &&
        !val
      ) {
        const infoBoxContainer = viewer.infoBox.container
        viewerContainer.removeChild(infoBoxContainer)
        viewer.infoBox.destroy()
        viewer._infoBox = undefined
      } else if (
        !Cesium.defined(viewer.infoBox) ||
        viewer.infoBox.isDestroyed()
      ) {
        const infoBoxContainer = document.createElement('div')
        infoBoxContainer.className = 'cesium-viewer-infoBoxContainer'
        viewerContainer.appendChild(infoBoxContainer)
        const infoBox = new Cesium.InfoBox(infoBoxContainer)
        const infoBoxViewModel = infoBox.viewModel
        viewer._eventHelper.add(
          infoBoxViewModel.cameraClicked,
          viewer._onInfoBoxCameraClicked,
          viewer
        )
        viewer._eventHelper.add(
          infoBoxViewModel.closeClicked,
          viewer._onInfoBoxClockClicked,
          viewer
        )
        // const events = ['cameraClicked', 'closeClicked']
        viewer._infoBox = infoBox
      }
      viewer.forceResize()
    },
    sceneModePicker(val) {
      const { viewer } = this
      const toolbar = viewer._toolbar
      if (
        Cesium.defined(viewer.sceneModePicker) &&
        !viewer.sceneModePicker.isDestroyed() &&
        !val
      ) {
        viewer.sceneModePicker.destroy()
        viewer._sceneModePicker = undefined
      } else if (
        !Cesium.defined(viewer.sceneModePicker) ||
        viewer.sceneModePicker.isDestroyed()
      ) {
        if (this.sceneModePicker === true && this.scene3DOnly) {
          throw new Cesium.DeveloperError(
            'options.sceneModePicker is not available when options.scene3DOnly is set to true.'
          )
        }
        if (!this.scene3DOnly && this.sceneModePicker === true) {
          const sceneModePicker = new Cesium.SceneModePicker(
            toolbar,
            viewer.scene
          )
          viewer._sceneModePicker = sceneModePicker
        }
      }
    },
    selectionIndicator(val) {
      const { viewer, viewerContainer } = this
      if (
        Cesium.defined(viewer.selectionIndicator) &&
        !viewer.selectionIndicator.isDestroyed() &&
        !val
      ) {
        const selectionIndicatorContainer = viewer.selectionIndicator.container
        viewerContainer.removeChild(selectionIndicatorContainer)
        viewer.selectionIndicator.destroy()
        viewer._selectionIndicator = undefined
      } else if (
        !Cesium.defined(viewer.selectionIndicator) ||
        viewer.selectionIndicator.isDestroyed()
      ) {
        const selectionIndicatorContainer = document.createElement('div')
        selectionIndicatorContainer.className =
          'cesium-viewer-selectionIndicatorContainer'
        viewerContainer.appendChild(selectionIndicatorContainer)
        const selectionIndicator = new Cesium.SelectionIndicator(
          selectionIndicatorContainer,
          viewer.scene
        )
        viewer._selectionIndicator = selectionIndicator
      }
    },
    timeline(val) {
      const { viewer, viewerContainer } = this
      if (
        Cesium.defined(viewer.timeline) &&
        !viewer.timeline.isDestroyed() &&
        !val
      ) {
        const timelineContainer = viewer.timeline.container
        viewerContainer.removeChild(timelineContainer)
        viewer.timeline.destroy()
        viewer._timeline = undefined
      } else if (
        !Cesium.defined(viewer.timeline) ||
        viewer.timeline.isDestroyed()
      ) {
        const timelineContainer = document.createElement('div')
        timelineContainer.className = 'cesium-viewer-timelineContainer'
        viewerContainer.appendChild(timelineContainer)
        const timeline = new Cesium.Timeline(timelineContainer, viewer.clock)
        const that = this
        timeline.makeLabel = time => {
          return that.localeDateTimeFormatter(time)
        }
        // 响应时间轴拖动
        timeline.addEventListener(
          'settime',
          this.onTimelineScrubfunction,
          false
        )
        timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime)
        viewer._timeline = timeline
      }
      viewer.forceResize()
    },
    navigationHelpButton(val) {
      const { viewer } = this
      const toolbar = viewer._toolbar
      if (
        Cesium.defined(viewer.navigationHelpButton) &&
        !viewer.navigationHelpButton.isDestroyed() &&
        !val
      ) {
        viewer.navigationHelpButton.destroy()
        viewer._navigationHelpButton = undefined
      } else if (
        !Cesium.defined(viewer.navigationHelpButton) ||
        viewer.navigationHelpButton.isDestroyed()
      ) {
        let showNavHelp = true
        try {
          if (Cesium.defined(window.localStorage)) {
            const hasSeenNavHelp = window.localStorage.getItem(
              'cesium-hasSeenNavHelp'
            )
            if (Cesium.defined(hasSeenNavHelp) && Boolean(hasSeenNavHelp)) {
              showNavHelp = false
            } else {
              window.localStorage.setItem('cesium-hasSeenNavHelp', 'true')
            }
          }
        } catch (e) {}
        const navigationHelpButton = new Cesium.NavigationHelpButton({
          container: toolbar,
          instructionsInitiallyVisible: Cesium.defaultValue(
            this.navigationInstructionsInitiallyVisible,
            showNavHelp
          )
        })
        viewer._navigationHelpButton = navigationHelpButton
      }
    },
    useDefaultRenderLoop(val) {
      this.viewer.useDefaultRenderLoop = val
    }
  },
  computed: {
    TimeZoneCode() {
      return new Date().getTimezoneOffset() === 0
        ? 'UTC'
        : 'UTC' + '+' + -(new Date().getTimezoneOffset() / 60)
    },
    UTCoffset() {
      return -new Date().getTimezoneOffset()
    },
    ...mapState('cesium/nature', {
      showSun: state => state.showSun,
      showMoon: state => state.showMoon,
      showSkyAtmosphere: state => state.showSkyAtmosphere,
      enableLighting: state => state.enableLighting,
      showSkyBox: state => state.showSkyBox
    })
  },
  methods: {
    initCesiumDefault() {
      var west = 94
      var south = 26.5
      var east = 112
      var north = 33.5
      var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north)
      Cesium.Camera.DEFAULT_VIEW_FACTOR = 0
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = rectangle
    },

    initCesium(id, options = {}) {
      if (!id || !document.getElementById(id)) {
        throw new Error('Viewer：the id is empty')
      }
      const DEFAULT_OPT = {
        animation: this.animation, // 是否创建动画小器件，左下角仪表
        baseLayerPicker: this.baseLayerPicker, // 是否显示图层选择器
        fullscreenButton: this.fullscreenButton, // 是否显示全屏按钮
        geocoder: this.geocoder, // 是否显示geocoder小器件，右上角查询按钮
        homeButton: this.homeButton, // 是否显示Home按钮
        infoBox: this.infoBox, // 是否显示信息框
        sceneModePicker: this.sceneModePicker, // 是否显示3D/2D选择器
        selectionIndicator: this.sceneModePicker, // 是否显示选取指示器组件
        timeline: this.timeline, // 是否显示时间轴
        navigationHelpButton: this.navigationHelpButton, // 是否显示右上角的帮助按钮
        scene3DOnly: this.scene3DOnly, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        // clock: new Cesium.Clock(), // 用于控制当前时间的时钟对象
        // selectedImageryProviderViewModel: undefined, // 当前图像图层的显示模型，仅baseLayerPicker设为true有意义
        // imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(), // 可供BaseLayerPicker选择的图像图层ProviderViewModel数组
        // selectedTerrainProviderViewModel: undefined, // 当前地形图层的显示模型，仅baseLayerPicker设为true有意义
        // terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(), // 可供BaseLayerPicker选择的地形图层ProviderViewModel数组
        imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 }), // 图像图层提供者，仅baseLayerPicker设为false有意义
        terrainProvider: undefined, // 地形图层提供者，仅baseLayerPicker设为false有意义
        // skyBox: new Cesium.SkyBox({
        //   sources: {
        //     positiveX: 'Cesium-1.7.1/Skybox/px.jpg',
        //     negativeX: 'Cesium-1.7.1/Skybox/mx.jpg',
        //     positiveY: 'Cesium-1.7.1/Skybox/py.jpg',
        //     negativeY: 'Cesium-1.7.1/Skybox/my.jpg',
        //     positiveZ: 'Cesium-1.7.1/Skybox/pz.jpg',
        //     negativeZ: 'Cesium-1.7.1/Skybox/mz.jpg'
        //   }
        // }), // 用于渲染星空的SkyBox对象
        // fullscreenElement: document.body, // 全屏时渲染的HTML元素,
        useDefaultRenderLoop: this.useDefaultRenderLoop, // 如果需要控制渲染循环，则设为true
        // targetFrameRate: undefined, // 使用默认render loop时的帧率
        showRenderLoopErrors: this.showRenderLoopErrors, // 如果设为true，将在一个HTML面板中显示错误信息
        // automaticallyTrackDataSourceClocks: true, // 自动追踪最近添加的数据源的时钟设置
        // contextOptions: undefined, // 传递给Scene对象的上下文参数（scene.options）
        sceneMode: this.sceneMode // 初始场景模式
        // mapProjection: new Cesium.WebMercatorProjection(), //地 图投影体系
        // dataSources: new Cesium.DataSourceCollection() // 需要进行可视化的数据源的集合
      }
      const viewer = new Cesium.Viewer(id, {
        ...DEFAULT_OPT,
        ...options
      })

      viewer.cesiumWidget.creditContainer.style.display = 'none'
      this.viewer = viewer
      this.viewerContainer = viewer._element
      this.Cesium = Cesium
      const { globalViewerMountKey, globalCesiumMountKey } = this
      globalViewerMountKey && (window[globalViewerMountKey] = viewer)
      globalCesiumMountKey && (window[globalCesiumMountKey] = Cesium)
      return viewer
    },

    initStoreValue() {
      const { viewer } = this
      // Sun
      if (!viewer.scene.sun) {
        viewer.scene.sun = Cesium.Sun()
      }
      viewer.scene.sun.show = this.showSun

      // Moon
      if (!viewer.scene.moon) {
        viewer.scene.moon = Cesium.Moon()
      }
      viewer.scene.moon.show = this.showMoon

      // SkyAtmosphere
      if (!viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere = Cesium.SkyAtmosphere()
      }
      viewer.scene.skyAtmosphere.show = this.showSkyAtmosphere

      // Lighting
      viewer.scene.globe.enableLighting = this.enableLighting

      // SkyBox
      // if (!viewer.scene.skyAtmosphere) {
      //   viewer.scene.skyAtmosphere = Cesium.SkyAtmosphere()
      // }
      viewer.scene.skyBox.show = this.showSkyBox
    },

    init() {
      this.initCesiumDefault()

      const viewer = this.initCesium('cesiumContainer')
      viewer.extend(logMousePositionMixin, { withHeight: true })
      viewer.extend(Cesium.viewerCesiumInspectorMixin)

      this.initStoreValue()

      return viewer
    },

    localeDateTimeFormatter(datetime, viewModel, ignoredate) {
      if (this.UTCoffset) {
        datetime = Cesium.JulianDate.addMinutes(datetime, this.UTCoffset, {})
      }
      const gregorianDT = Cesium.JulianDate.toGregorianDate(datetime)
      let objDT
      if (ignoredate) {
        objDT = ''
      } else {
        objDT = new Date(
          gregorianDT.year,
          gregorianDT.month - 1,
          gregorianDT.day
        )
        objDT =
          gregorianDT.year +
          '年' +
          objDT.toLocaleString('zh-hans', { month: 'short' }) +
          gregorianDT.day +
          '日'

        if (viewModel || gregorianDT.hour + gregorianDT.minute === 0) {
          return objDT
        }
        objDT += ' '
      }
      return (
        objDT +
        Cesium.sprintf(
          '%02d:%02d:%02d ' + this.TimeZoneCode,
          gregorianDT.hour,
          gregorianDT.minute,
          gregorianDT.second
        )
      )
    },
    localeTimeFormatter(time, viewModel) {
      return this.localeDateTimeFormatter(time, viewModel, true)
    },
    onTimelineScrubfunction(e) {
      const clock = e.clock
      clock.currentTime = e.timeJulian
      clock.shouldAnimate = false
    }
  },
  destroyed() {
    this.viewer = undefined
    const { globalViewerMountKey, globalCesiumMountKey } = this
    globalViewerMountKey && (window[globalViewerMountKey] = undefined)
    globalCesiumMountKey && (window[globalCesiumMountKey] = undefined)
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
}
</style>
