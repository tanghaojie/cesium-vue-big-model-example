import * as Cesium from 'cesium'

const highlighted = {
  feature: undefined,
  originalColor: new Cesium.Color()
}
const removeHightlight = function() {
  if (Cesium.defined(highlighted.feature)) {
    try {
      highlighted.feature.color = highlighted.originalColor
    } catch (err) {
    } finally {
      highlighted.feature = undefined
    }
  }
}
const hightlight3DTileFeature = function(params) {
  const { viewer, options } = params
  const { scene } = viewer

  const toColor = options.color || Cesium.Color.YELLOW.withAlpha(0.5)

  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  handler.setInputAction(function(movement) {
    var pickedObject = scene.pick(movement.endPosition)
    if (!Cesium.defined(pickedObject)) {
      return
    }
    if (!(pickedObject instanceof Cesium.Cesium3DTileFeature)) {
      return
    }
    if (pickedObject === highlighted.feature) {
      return
    }
    removeHightlight()
    highlighted.feature = pickedObject
    Cesium.Color.clone(pickedObject.color, highlighted.originalColor)
    pickedObject.color = toColor
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  return handler
}

export { hightlight3DTileFeature, removeHightlight }
