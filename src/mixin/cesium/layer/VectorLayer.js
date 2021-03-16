import Layer from './Layer'
import * as Cesium from 'cesium'

const typename = 'VectorLayer'
/**
 * vector
 */
class VectorLayer extends Layer {
  constructor(name = undefined) {
    super(name)
    this._delegate = new Cesium.CustomDataSource(name)
    this._type = Layer.getLayerType(typename)
  }
}
Layer.registerLayerType(typename)
export default VectorLayer
