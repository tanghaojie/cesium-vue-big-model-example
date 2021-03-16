import Layer from './Layer'
import * as Cesium from 'cesium'

const typename = 'KmlLayer'
/**
 * kml
 */
class KmlLayer extends Layer {
  constructor(url, options = {}, name = undefined) {
    super(name)
    this._delegate = Cesium.KmlDataSource.load(url, options)
    this._type = Layer.getLayerType(typename)
  }

  /**
   * @param {boolean} show
   */
  set show(show) {
    this._show = show
    this._delegate &&
      this._delegate.then(dataSource => {
        dataSource.show = this._show
      })
  }
}
Layer.registerLayerType(typename)
export default KmlLayer
