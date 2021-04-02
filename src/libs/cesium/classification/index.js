import * as Cesium from 'cesium'

const YING_XIU_ZHEN_ZHONG_YI_ZHI_CLASSIFICATION_ID =
  'YING_XIU_ZHEN_ZHONG_YI_ZHI_CLASSIFICATION_ID'

const classified = {
  id: undefined,
  primitive: undefined,
  color: undefined
}

const removeClassified = function() {
  if (
    Cesium.defined(classified.primitive) &&
    Cesium.defined(classified.primitive.getGeometryInstanceAttributes)
  ) {
    const attributes = classified.primitive.getGeometryInstanceAttributes(
      classified.id
    )
    attributes.color = classified.color
    classified.id = undefined
    classified.primitive = undefined
    classified.color = undefined
  }
}

const addClassify = function(params) {
  const { viewer } = params
  const { scene } = viewer

  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  handler.setInputAction(function(movement) {
    const pickedObject = scene.pick(movement.endPosition)
    if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
      if (pickedObject.id === classified.id) {
        return
      }
      if (Cesium.defined(classified.id)) {
        removeClassified()
      }
    }

    if (
      Cesium.defined(pickedObject) &&
      Cesium.defined(pickedObject.primitive) &&
      Cesium.defined(pickedObject.id) &&
      Cesium.defined(pickedObject.primitive.getGeometryInstanceAttributes)
    ) {
      classified.id = pickedObject.id
      classified.primitive = pickedObject.primitive
      const attributes = classified.primitive.getGeometryInstanceAttributes(
        classified.id
      )
      classified.color = attributes.color
      attributes.color = [0, 255, 0, 128]
    } else if (Cesium.defined(classified.id)) {
      removeClassified()
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  return handler
}

const invertClassification = function(params) {
  const { viewer, invert } = params
  const { scene } = viewer
  scene.invertClassification = invert
  scene.invertClassificationColor = new Cesium.Color(0.1, 0.1, 0.1, 1)
}

const addInvertClassification = function(params) {
  const { viewer } = params
  const { scene } = viewer

  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  handler.setInputAction(function(movement) {
    const pickedObject = scene.pick(movement.position)
    if (
      Cesium.defined(pickedObject) &&
      Cesium.defined(pickedObject.primitive) &&
      Cesium.defined(pickedObject.id) &&
      Cesium.defined(pickedObject.primitive.getGeometryInstanceAttributes)
    ) {
      const toValue = !scene.invertClassification
      invertClassification({ viewer, invert: toValue })
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  return handler
}

const removeInvertClassification = function(params) {
  invertClassification({ viewer: params.viewer, invert: false })
}

const removeYingXiuZhenZhongYiZhiClassificationPrimitive = function(params) {
  const { primitives } = params.viewer.scene
  const len = primitives.length
  for (let i = 0; i < len; i++) {
    const p = primitives.get(i)
    if (!(p instanceof Cesium.ClassificationPrimitive)) {
      continue
    }
    if (
      YING_XIU_ZHEN_ZHONG_YI_ZHI_CLASSIFICATION_ID.indexOf(
        p._primitive._instanceIds
      ) !== -1
    ) {
      primitives.remove(p)
    }
  }
}

const addYingXiuZhenZhongYiZhiClassificationPrimitive = function(params) {
  const { viewer } = params
  const { scene } = viewer

  const polygon = new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.unpackArray([
        -1275417.9693955472,
        5318550.087054305,
        3272017.0616841875,
        -1275438.4126725942,
        5318611.612937054,
        3271930.7049659174,
        -1275452.0399522835,
        5318618.569924535,
        3271889.1321967444,
        -1275464.9141620556,
        5318688.317018538,
        3271787.0505336053,
        -1275450.4827676096,
        5318700.889492173,
        3271753.747604542,
        -1275563.978625073,
        5318675.269176213,
        3271750.855104276,
        -1275663.003731765,
        5318649.789884108,
        3271753.683172207,
        -1275714.2197526316,
        5318622.152907408,
        3271780.356068088,
        -1275641.5070342335,
        5318588.594119651,
        3271862.8151732692,
        -1275590.8211024604,
        5318554.46205142,
        3271940.89376686,
        -1275577.0198637885,
        5318547.715483783,
        3271956.9115424193,
        -1275549.0903646748,
        5318536.854891771,
        3271985.0581103964,
        -1275515.7335942946,
        5318533.064849163,
        3272003.2694576317,
        -1275450.9733276595,
        5318544.242078972,
        3272013.1922425604
      ])
    ),
    height: 2000,
    extrudedHeight: 0,
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
  })

  scene.primitives.add(
    new Cesium.ClassificationPrimitive({
      geometryInstances: new Cesium.GeometryInstance({
        id: YING_XIU_ZHEN_ZHONG_YI_ZHI_CLASSIFICATION_ID,
        geometry: polygon,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            new Cesium.Color(1.0, 0.0, 0.0, 0)
          )
        }
      }),
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
    })
  )
}

export {
  addClassify,
  removeClassified,
  addInvertClassification,
  removeInvertClassification,
  addYingXiuZhenZhongYiZhiClassificationPrimitive,
  removeYingXiuZhenZhongYiZhiClassificationPrimitive
}
