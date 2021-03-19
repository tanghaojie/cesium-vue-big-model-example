import define from 'cesium/Source/Core/defined'
import DeveloperError from 'cesium/Source/Core/DeveloperError'
import * as Cesium from 'cesium'

function logMousePositionMixin(
  viewer,
  options = {
    withHeight: false
  }
) {
  if (!define(viewer)) {
    console.log(options)
    throw new DeveloperError('viewer is required.')
  }
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(function(e) {
    let position
    if (options.withHeight) {
      viewer.scene.globe.depthTestAgainstTerrain = true
      position = viewer.scene.pickPosition(e.position)
    } else {
      position = viewer.scene.camera.pickEllipsoid(
        e.position,
        viewer.scene.globe.ellipsoid
      )
    }
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    const height = cartographic.height
    console.log(longitude, latitude, height)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

export default logMousePositionMixin
