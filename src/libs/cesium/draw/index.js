import * as Cesium from 'cesium'

const DRAW_POINT_NAME = '_DRAW_POINT_NAME'
const DRAW_SHAPE_NAME = '_DRAW_SHAPE_NAME'

const drawPoint = function(params) {
  const { viewer, started, stoped } = params
  const { scene } = viewer

  const pointPrimitives = new Cesium.PointPrimitiveCollection({
    blendOption: Cesium.BlendOption.TRANSLUCENT
  })
  pointPrimitives.name = DRAW_POINT_NAME
  viewer.scene.primitives.add(pointPrimitives)

  const hasDepthTest = viewer.scene.globe.depthTestAgainstTerrain
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  handler.setInputAction(function(e) {
    let cartesian
    if (hasDepthTest) {
      cartesian = viewer.scene.pickPosition(e.position)
    } else {
      cartesian = viewer.scene.camera.pickEllipsoid(
        e.position,
        viewer.scene.globe.ellipsoid
      )
    }

    pointPrimitives.add({
      position: cartesian,
      pixelSize: 10,
      color: Cesium.Color.RED
    })
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(function(movement) {
    handler.destroy()
    stoped && stoped()
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

  started && started()
}

const DrawMode = {
  Polyline: 1,
  Polygon: 2
}

function createPoint(viewer, position) {
  return viewer.entities.add({
    position: position,
    point: {
      color: Cesium.Color.YELLOW,
      pixelSize: 10,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  })
}

function buildShape(viewer, mode, data) {
  if (mode === DrawMode.Polyline) {
    return viewer.entities.add({
      polyline: {
        positions: data,
        clampToGround: true,
        width: 5,
        material: Cesium.Color.RED
      }
    })
  } else if (mode === DrawMode.Polygon) {
    return viewer.entities.add({
      polygon: {
        hierarchy: data,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.RED.withAlpha(0.7)
        )
      }
    })
  }
}

function terminateShape(viewer, mode) {
  activeShapePoints.pop()
  const entity = buildShape(viewer, mode, activeShapePoints)
  entity.name = DRAW_SHAPE_NAME
  viewer.entities.remove(mousePoint)
  viewer.entities.remove(activeShape)
  mousePoint = undefined
  activeShape = undefined
  activeShapePoints = []
}

let activeShapePoints = []
let activeShape
let mousePoint

const drawShape = function(params) {
  const { viewer, started, stoped, mode } = params
  const { scene } = viewer

  if (!viewer.scene.pickPositionSupported) {
    window.alert('This browser does not support pickPosition.')
  }

  const hasDepthTest = viewer.scene.globe.depthTestAgainstTerrain
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  handler.setInputAction(function(event) {
    let position
    if (hasDepthTest) {
      position = viewer.scene.pickPosition(event.position)
    } else {
      position = viewer.scene.camera.pickEllipsoid(
        event.position,
        viewer.scene.globe.ellipsoid
      )
    }
    if (!Cesium.defined(position)) {
      return
    }
    if (activeShapePoints.length === 0) {
      mousePoint = createPoint(viewer, position)
      activeShapePoints.push(position)
      activeShape = buildShape(
        viewer,
        mode,
        new Cesium.CallbackProperty(() => {
          if (mode === DrawMode.Polygon) {
            return new Cesium.PolygonHierarchy(activeShapePoints)
          }
          return activeShapePoints
        }, false)
      )
    }
    activeShapePoints.push(position)
    // createPoint(viewer, position)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(function(event) {
    let newPosition
    if (hasDepthTest) {
      newPosition = viewer.scene.pickPosition(event.endPosition)
    } else {
      newPosition = viewer.scene.camera.pickEllipsoid(
        event.endPosition,
        viewer.scene.globe.ellipsoid
      )
    }
    if (!Cesium.defined(mousePoint) || !Cesium.defined(newPosition)) {
      return
    }
    mousePoint.position.setValue(newPosition)
    activeShapePoints.pop()
    activeShapePoints.push(newPosition)
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction(function(event) {
    terminateShape(viewer, mode)
    handler.destroy()
    stoped && stoped()
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

  started && started()
}

function removeDrawedPoints(params) {
  const { viewer, started, stoped } = params
  const { scene } = viewer
  const pris = scene.primitives

  let index = 0
  while (index < pris.length) {
    const model = pris.get(index)
    if (model.name === DRAW_POINT_NAME) {
      pris.remove(model)
    } else {
      index++
    }
  }
}

function removeDrawedShapes(params) {
  const { viewer, started, stoped } = params
  const entities = viewer.entities.values

  let index = 0
  while (index < entities.length) {
    const model = entities[index]
    if (model.name === DRAW_SHAPE_NAME) {
      viewer.entities.remove(model)
    } else {
      index++
    }
  }
}

const removeAll = function(params) {
  removeDrawedPoints(params)
  removeDrawedShapes(params)
}

export { drawPoint, drawShape, DrawMode, removeAll }
