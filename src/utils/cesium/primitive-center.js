import * as Cesium from 'cesium'

export default function(primitive) {
  let center
  if (primitive instanceof Cesium.Cesium3DTileset) {
    center = primitive.boundingSphere.center
  }
  if (primitive instanceof Cesium.Model) {
    center = Cesium.Matrix4.multiplyByPoint(
      primitive.modelMatrix,
      primitive.boundingSphere.center,
      new Cesium.Cartesian3()
    )
  }

  const cartographic = Cesium.Cartographic.fromCartesian(center)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  const height = cartographic.height
  return { longitude, latitude, height }
}
