import * as Cesium from 'cesium'

const showElevationContour = params => {
  const { viewer } = params
  viewer.scene.globe.material = Cesium.Material.fromType('ElevationContour')
}

const removeElevationContour = params => {
  const { viewer } = params
  viewer.scene.globe.material = undefined
}

const removeAll = params => {
  const { viewer } = params
}

export { showElevationContour, removeElevationContour, removeAll }
