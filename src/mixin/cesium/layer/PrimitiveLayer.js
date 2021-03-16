import Layer from './Layer'
import * as Cesium from 'cesium'

const typename = 'PrimitiveLayer'
/**
 * Primitive Collection
 */
class PrimitiveLayer extends Layer {
  constructor(name = undefined) {
    super(name)
    this._delegate = new Cesium.PrimitiveCollection()
    this._type = Layer.getLayerType(typename)
  }
}
Layer.registerLayerType(typename)
export default PrimitiveLayer
