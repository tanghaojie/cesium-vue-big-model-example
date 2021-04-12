import * as Cesium from 'cesium'

const MEASURE_POINT_NAME = '_MEASURE_POINT_NAME'
const MEASURE_LINE_NAME = '_MEASURE_LINE_NAME'
const MEASURE_POLYGON_NAME = '_MEASURE_POLYGON_NAME'

const removeAll = function(params) {
  const { viewer } = params
  removePointDS(viewer)
  removeLineDS(viewer)
  removePolygonDS(viewer)
}

/**
for point measure
*/

function pointDS(viewer) {
  const ds = viewer.dataSources
  const len = ds.length
  for (let i = 0; i < len; i++) {
    const d = ds.get(i)
    if (d && d.name === MEASURE_POINT_NAME) {
      return d
    }
  }
  const pds = new Cesium.CustomDataSource(MEASURE_POINT_NAME)
  viewer.dataSources.add(pds)
  return pds
}

function removePointDS(viewer) {
  const ds = viewer.dataSources
  const len = ds.length
  for (let i = 0; i < len; i++) {
    const d = ds.get(i)
    if (d && d.name === MEASURE_POINT_NAME) {
      ds.remove(d)
    }
  }
}

function buildLabelPoint(ds, position = undefined) {
  return ds.entities.add({
    position: position || Cesium.Cartesian3.fromDegrees(0, 0, 0),
    point: {
      color: Cesium.Color.RED,
      pixelSize: 15
    },
    label: {
      text: '',
      font: '16px Source Han Sans CN',
      fillColor: Cesium.Color.WHITE,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 8,
      outlineColor: Cesium.Color.BLACK,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      pixelOffset: new Cesium.Cartesian2(0, -30)
    }
  })
}

function measurePointText(lon = 0, lat = 0, height = 0) {
  return `经度:${lon.toFixed(6)}°\n纬度:${lat.toFixed(
    6
  )}°\n高度:${height.toFixed(3)}m`
}

function setLabelPoint(lp, position = undefined, text = undefined) {
  if (position) {
    lp.position.setValue(position)
  }
  if (text) {
    lp.label.text = text
  }
}

let currentPoint = undefined

const point = function(params) {
  const { viewer, started, stoped } = params
  const { scene } = viewer
  const pds = pointDS(viewer)

  const hasDepthTest = viewer.scene.globe.depthTestAgainstTerrain
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  handler.setInputAction(function(e) {
    let position
    if (hasDepthTest) {
      position = viewer.scene.pickPosition(e.endPosition)
    } else {
      position = viewer.scene.camera.pickEllipsoid(
        e.endPosition,
        viewer.scene.globe.ellipsoid
      )
    }
    if (!Cesium.defined(position)) {
      return
    }
    if (!currentPoint) {
      currentPoint = buildLabelPoint(pds)
    }
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    const lon = Cesium.Math.toDegrees(cartographic.longitude)
    const lat = Cesium.Math.toDegrees(cartographic.latitude)
    const hei = cartographic.height

    setLabelPoint(currentPoint, position, measurePointText(lon, lat, hei))
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction(function(e) {
    currentPoint = undefined
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(function(movement) {
    if (currentPoint) {
      pds.entities.remove(currentPoint)
      currentPoint = undefined
    }
    handler.destroy()
    stoped && stoped()
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  started && started()
}

/**
end for point measure
*/

const MeasureMode = {
  Line: 1,
  Polygon: 2
}

function removeLineDS(viewer) {
  const ds = viewer.dataSources
  const len = ds.length
  for (let i = 0; i < len; i++) {
    const d = ds.get(i)
    if (d && d.name === MEASURE_LINE_NAME) {
      ds.remove(d)
    }
  }
}

function removePolygonDS(viewer) {
  const ds = viewer.dataSources
  const len = ds.length
  for (let i = 0; i < len; i++) {
    const d = ds.get(i)
    if (d && d.name === MEASURE_POLYGON_NAME) {
      ds.remove(d)
    }
  }
}

function datasource(viewer, mode) {
  let dsName
  if (mode === MeasureMode.Line) {
    dsName = MEASURE_LINE_NAME
  } else if (mode === MeasureMode.Polygon) {
    dsName = MEASURE_POLYGON_NAME
  }
  const ds = viewer.dataSources
  const len = ds.length
  for (let i = 0; i < len; i++) {
    const d = ds.get(i)
    if (d.name === dsName) {
      return d
    }
  }
  const pds = new Cesium.CustomDataSource(dsName)
  viewer.dataSources.add(pds)
  return pds
}

function buildShape(viewer, mode, data) {
  let entity
  if (mode === MeasureMode.Line) {
    entity = {
      polyline: {
        positions: data,
        clampToGround: false,
        width: 5,
        material: Cesium.Color.RED
      }
    }
  } else if (mode === MeasureMode.Polygon) {
    entity = {
      polygon: {
        hierarchy: data,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.RED.withAlpha(0.7)
        )
      }
    }
  }
  return datasource(viewer, mode).entities.add(entity)
}

function buildShapeLabelPoint(viewer, position, mode) {
  let entity
  if (mode === MeasureMode.Line) {
    entity = buildLabelPoint(datasource(viewer, mode), position)
  } else if (mode === MeasureMode.Polygon) {
    entity = viewer.entities.add({
      position: position,
      point: {
        color: Cesium.Color.YELLOW,
        pixelSize: 10,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
  }
  return entity
}

function terminateShape(viewer, mode) {
  activeShapePoints.pop()
  const entity = buildShape(viewer, mode, activeShapePoints)
  if (mode === MeasureMode.Polygon) {
    const area = getArea(entity)
    const areaLP = buildLabelPoint(
      datasource(viewer, mode),
      mousePoint.position.getValue(new Cesium.JulianDate())
    )
    setLabelPoint(areaLP, undefined, `${area.toFixed(3)}㎡`)
  }

  const entities = viewer.entities
  if (entities.contains(mousePoint)) {
    entities.remove(mousePoint)
  }
  const dses = datasource(viewer, mode).entities
  if (dses.contains(activeShape)) {
    dses.remove(activeShape)
  }
  if (dses.contains(mousePoint)) {
    dses.remove(mousePoint)
  }

  mousePoint = undefined
  activeShape = undefined
  activeShapePoints = []
}

let activeShapePoints = []
let activeShape
let mousePoint
let preMousePoint
let firstPoint
let sumLength = 0
const shape = function(params) {
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
      sumLength = 0
      mousePoint = buildShapeLabelPoint(viewer, position, mode)
      activeShapePoints.push(position)
      activeShape = buildShape(
        viewer,
        mode,
        new Cesium.CallbackProperty(() => {
          if (mode === MeasureMode.Polygon) {
            return new Cesium.PolygonHierarchy(activeShapePoints)
          }
          return activeShapePoints
        }, false)
      )
    }
    activeShapePoints.push(position)
    if (mode === MeasureMode.Line) {
      const lp = buildShapeLabelPoint(viewer, position, mode)
      const jd = new Cesium.JulianDate()
      if (activeShapePoints.length === 2) {
        firstPoint = lp
      }
      if (activeShapePoints.length > 2 && preMousePoint) {
        const dis = Cesium.Cartesian3.distance(
          preMousePoint.position.getValue(jd),
          lp.position.getValue(jd)
        )
        sumLength += dis
        setLabelPoint(lp, undefined, `${dis.toFixed(3)}m`)
        setLabelPoint(firstPoint, undefined, `总长:${sumLength.toFixed(3)}m`)
      }
      preMousePoint = lp
    }
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
    if (mode === MeasureMode.Line) {
      //   setLabelPoint(mousePoint, newPosition, '123')
    } else {
      mousePoint.position.setValue(newPosition)
    }
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

function getArea(theEntity) {
  var polygon = theEntity.polygon
  var hierarchy = polygon.hierarchy._value

  var indices = Cesium.PolygonPipeline.triangulate(
    hierarchy.positions,
    hierarchy.holes
  )
  var area = 0

  for (var i = 0; i < indices.length; i += 3) {
    var vector1 = hierarchy.positions[indices[i]]
    var vector2 = hierarchy.positions[indices[i + 1]]
    var vector3 = hierarchy.positions[indices[i + 2]]

    var vectorC = Cesium.Cartesian3.subtract(
      vector2,
      vector1,
      new Cesium.Cartesian3()
    )
    var vectorD = Cesium.Cartesian3.subtract(
      vector3,
      vector1,
      new Cesium.Cartesian3()
    )

    var areaVector = Cesium.Cartesian3.cross(
      vectorC,
      vectorD,
      new Cesium.Cartesian3()
    )

    area += Cesium.Cartesian3.magnitude(areaVector) / 2.0
  }

  return area
}

export { point, shape, MeasureMode, removeAll }
