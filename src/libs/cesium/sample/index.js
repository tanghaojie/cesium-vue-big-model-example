import * as Cesium from 'cesium'

const SAMPLE_ENTITY_NAME = '_SAMPLE_ENTITY_NAME'

let activeShapePoints = []
let activeShape
let mousePoint

function createLine(viewer, data) {
  const model = viewer.entities.add({
    polyline: {
      positions: data,
      clampToGround: true,
      width: 8,
      material: Cesium.Color.DODGERBLUE
    }
  })
  model.name = SAMPLE_ENTITY_NAME
  return model
}

function createPoint(viewer, position) {
  const model = viewer.entities.add({
    position: position,
    point: {
      color: Cesium.Color.INDIANRED,
      pixelSize: 10,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  })
  model.name = SAMPLE_ENTITY_NAME
  return model
}

const sampleTerrain = function(params) {
  removeAll(params)
  const { viewer, cb } = params
  const { scene } = viewer

  if (!viewer.scene.pickPositionSupported) {
    window.alert('This browser does not support pickPosition.')
  }

  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  handler.setInputAction(function(event) {
    const position = scene.camera.pickEllipsoid(
      event.position,
      scene.globe.ellipsoid
    )
    if (!Cesium.defined(position)) {
      return
    }
    if (activeShapePoints.length === 0) {
      mousePoint = createPoint(viewer, position)
      activeShapePoints.push(position)
      activeShape = createLine(
        viewer,
        new Cesium.CallbackProperty(() => {
          return activeShapePoints
        }, false)
      )
    }
    if (activeShapePoints.length === 2) {
      createPoint(viewer, position)
      createLine(viewer, activeShapePoints)
      viewer.entities.remove(mousePoint)
      viewer.entities.remove(activeShape)

      updateData(viewer, activeShapePoints, cb)
      mousePoint = undefined
      activeShape = undefined
      activeShapePoints = []
      handler.destroy()
      return
    }
    activeShapePoints.push(position)
    createPoint(viewer, position)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(function(event) {
    const newPosition = scene.camera.pickEllipsoid(
      event.endPosition,
      scene.globe.ellipsoid
    )
    if (!Cesium.defined(mousePoint) || !Cesium.defined(newPosition)) {
      return
    }
    mousePoint.position.setValue(newPosition)
    activeShapePoints.pop()
    activeShapePoints.push(newPosition)
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction(function(event) {
    removeAll(params)
    handler.destroy()
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}

function updateData(viewer, points, cb) {
  const start = points[0].clone()
  const end = points[1].clone()

  const positions = [Cesium.Cartographic.fromCartesian(start)]
  const count = 99
  for (let i = 1; i < count; i++) {
    positions.push(
      Cesium.Cartographic.fromCartesian(
        Cesium.Cartesian3.lerp(start, end, i / count, new Cesium.Cartesian3())
      )
    )
  }
  positions.push(Cesium.Cartographic.fromCartesian(end))
  const promise = Cesium.sampleTerrainMostDetailed(
    viewer.terrainProvider,
    positions
  )

  Cesium.when(promise, function(updatedPositions) {
    const datas = []
    for (let i = 0; i < updatedPositions.length; i++) {
      datas.push({
        index: i,
        height: parseFloat(updatedPositions[i].height.toFixed(2))
      })
    }
    cb && cb(datas)
  })
}

const removeAll = params => {
  const { viewer } = params
  const entities = viewer.entities.values
  if (Cesium.defined(mousePoint)) {
    viewer.entities.remove(mousePoint)
  }
  if (Cesium.defined(activeShape)) {
    viewer.entities.remove(activeShape)
  }
  mousePoint = undefined
  activeShape = undefined
  activeShapePoints = []

  let index = 0
  while (index < entities.length) {
    const model = entities[index]
    if (model.name === SAMPLE_ENTITY_NAME) {
      viewer.entities.remove(model)
    } else {
      index++
    }
  }
}

export { sampleTerrain, removeAll }
