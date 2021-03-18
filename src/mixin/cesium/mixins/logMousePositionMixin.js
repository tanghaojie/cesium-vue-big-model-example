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
  //此方法获取鼠标点击位置经纬度
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
    //将笛卡尔坐标转化为经纬度坐标
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    const height = cartographic.height
    console.log(longitude, latitude, height)
    // viewer.camera.setView({
    //   //定位到范围中心点
    //   destination: Cesium.Cartesian3.fromDegrees(
    //     Number(longitude),
    //     Number(latitude),
    //     2000
    //   ),
    //   orientation: {
    //     heading: Cesium.Math.toRadians(180), //1
    //     pitch: Cesium.Math.toRadians(-90),
    //     roll: 0
    //   }
    // })
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

export default logMousePositionMixin
