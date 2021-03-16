import Layer from './Layer'
import * as Cesium from 'cesium'

const typename = 'TilesetLayer'
/**
 * 3d tile
 */
class TilesetLayer extends Layer {
  constructor(url, name = undefined) {
    super(name)
    this._delegate = new Cesium.Cesium3DTileset({
      url
    })
    this._type = Layer.getLayerType(typename)
  }
}
Layer.registerLayerType(typename)
export default TilesetLayer
