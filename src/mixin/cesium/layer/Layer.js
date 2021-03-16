'use strict'

import { Util } from '../../../utils'
// import define from 'cesium/Source/Core/defined'
// import DeveloperError from 'cesium/Source/Core/DeveloperError'
import * as Cesium from 'cesium'
import LayerType from './LayerType'

class Layer {
  constructor(name = undefined) {
    this._name = name
    this._uuid = Util.uuid()
    this._delegate = undefined
    this._show = true
    this._viewer = undefined
    this._type = undefined
  }

  get name() {
    return this._name
  }
  get uuid() {
    return this._uuid
  }
  get delegate() {
    return this._delegate
  }
  get show() {
    return this._show
  }
  set show(show) {
    this._show = show
    this._delegate && (this._delegate.show = this._show)
  }
  get type() {
    return this._type
  }

  _addTo(viewer) {
    console.log('cesium layer add')
    if (!this._delegate) {
      return
    }
    this._viewer.cesiumLayers.push(this)
    if (
      this._delegate instanceof Cesium.Cesium3DTileset ||
      this._delegate instanceof Cesium.PrimitiveCollection
    ) {
      viewer.scene.primitives.add(this._delegate)
    } else {
      viewer.dataSources.add(this._delegate)
    }
  }

  _remove() {
    if (!this._delegate || !this._viewer) {
      return
    }
    let delegate = this._delegate
    // 3d tiles
    if (delegate instanceof Cesium.Cesium3DTileset) {
      this._viewer.scene.primitives.remove(delegate)
    }
    // primitive collection
    else if (delegate instanceof Cesium.PrimitiveCollection) {
      delegate.removeAll()
      this._viewer.scene.primitives.remove(delegate)
    }
    // entities
    else if (delegate.then) {
      delegate.then(dataSource => {
        dataSource.entities.removeAll()
      })
      this._viewer.dataSources.remove(delegate)
    } else {
      delegate.entities && delegate.entities.removeAll()
      this._viewer.dataSources.remove(delegate)
    }
    const index = this._viewer.cesiumLayers.findIndex(
      item => item.uuid === this.uuid
    )
    this._viewer.cesiumLayers.splice(index, 1)
    // 释放引用，详情https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Delete_in_strict_mode
    this._delegate = null
  }

  addTo(viewer) {
    if (viewer) {
      this._viewer = viewer
      if (this._viewer.cesiumLayers) {
        this._addTo(viewer)
      }
    }
    return this
  }

  remove() {
    if (!this._viewer) {
      return
    }
    this._remove()
    return this
  }

  static registerLayerType(type) {
    if (!type) {
      return false
    }
    LayerType[type.toUpperCase()] = type.toUpperCase()
    return true
  }
  static getLayerType(type) {
    return LayerType[type.toUpperCase()] || undefined
  }
}

export default Layer
