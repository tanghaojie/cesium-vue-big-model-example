import * as Cesium from 'cesium'

const flyToEarth = function(viewer) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(110, 16, 20000000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0
    },
    duration: 1
  })
}

const flyToChina = function(viewer) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(109, 33.2, 5000000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0
    },
    duration: 1
  })
}

export { flyToEarth, flyToChina }
