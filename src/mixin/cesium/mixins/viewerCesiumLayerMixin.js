import define from 'cesium/Source/Core/defined'
import DeveloperError from 'cesium/Source/Core/DeveloperError'
import * as Cesium from 'cesium'
import * as Layer from '../layer'

// function defineReadOnly(obj, key, value) {
//   Object.defineProperty(obj, key, {
//     get: function() {
//       return value
//     },
//     set: function() {
//       return console.warn("Don't modify [jtLayers]")
//     },
//     configurable: true
//   })
// }

// const proxyHandler = {
//   get(target, prop, receiver) {
//     if (typeof target[prop] === 'object' && target[prop]) {
//       return new Proxy(target[prop], proxyHandler)
//     }
//     return Reflect.get(target, prop, receiver)
//   },
//   set(target, prop, value, receiver) {
//     return Reflect.set(target, prop, value, receiver)
//   }
// set() {
//   console.warn("Don't modify [cesiumLayer]")
//   // return true
// }
//   get(target, prop, receiver) {
//     console.log(`getting ${prop}`)
//     return Reflect.get(target, prop, receiver)
//   }
//   set(target, prop, value, receiver) {
//     console.log(`setting ${prop} to ${value}`)
//     return Reflect.set(target, prop, value, receiver)
//   }
// }

function viewerCesiumLayerMixin(viewer, options = {}) {
  Cesium.JTLayer = { ...Layer }
  if (!define(viewer)) {
    console.log(options)
    throw new DeveloperError('viewer is required.')
  }
  let cesiumLayers = []
  // 用Proxy,可以实现layers数组的监听。但是Layer.remove的时候，调用remove(this._delegate)，由于Proxy的代理，this._delegate对象不是原始引用，无法移除
  // cesiumLayers = new Proxy(cesiumLayers, proxyHandler)

  Object.defineProperty(viewer, 'cesiumLayers', {
    get: function() {
      return cesiumLayers
    },
    set: function() {
      return console.warn("Don't modify [cesiumLayers]")
    },
    configurable: true
  })
}

export default viewerCesiumLayerMixin
