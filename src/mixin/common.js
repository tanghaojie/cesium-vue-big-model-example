// 除了用mixin，还可以用provided / inject来注入cesium对象
const getRoot = $component =>
  $component.$options.name !== 'JTCesiumWrapper'
    ? getRoot($component.$parent)
    : $component

const methods = {
  async mount() {
    return true
  },
  async unmount() {
    return true
  },
  async load() {
    if (this._mounted) {
      return false
    }
    const $root = getRoot(this.$parent)
    const viewer = (this.viewer = $root.viewer)
    const Cesium = $root.Cesium
    const that = this
    return this.mount().then(() => {
      that._mounted = true
      that.$emit('loaded', { viewer, Cesium })
      return { viewer, Cesium }
    })
  },
  async unload() {
    for (const $node of (this.$slots.default || [])
      .map(vnode => vnode.componentInstance)
      .filter(cmp => !!cmp)) {
      await $node.unload()
    }
    const that = this
    return this._mounted
      ? this.unmount().then(async () => {
          that._mounted = false
          return true
        })
      : false
  },
  async reload() {
    const that = this
    return this.unload().then(() => {
      return that.load()
    })
  },
  getRoot
}

export default {
  methods,
  created() {
    this._mounted = false
    const { load } = this
    const $root = getRoot(this.$parent)
    this._cesiumPromise = new Promise(resolve => {
      const viewer = $root.viewer
      viewer && resolve(load())
      $root.$on('loaded', () => {
        resolve(load())
      })
    })

    Object.defineProperties(this, {
      cesiumPromise: {
        enumerable: true,
        get: () => this._cesiumPromise
      },
      mounted: {
        enumerable: true,
        get: () => this._mounted
      }
    })
  },
  destroyed() {
    this.unload()
  }
}
