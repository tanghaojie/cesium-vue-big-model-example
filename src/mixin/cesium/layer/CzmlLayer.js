import Layer from './Layer'
import * as Cesium from 'cesium'

const typename = 'CzmlLayer'
/**
 * czml
 */
class CzmlLayer extends Layer {
  constructor(url, options = {}, name = undefined) {
    super(name)
    this._delegate = Cesium.CzmlDataSource.load(url, options)
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
export default CzmlLayer
