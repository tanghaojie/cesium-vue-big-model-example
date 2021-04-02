export default {
  mounted() {
    const that = this
    this.cesiumPromise.then(({ viewer }) => {
      that.viewer = viewer
      that.groupInit({ viewer: viewer })
    })
  },
  methods: {
    groupInit(params) {
      if (!this.group) {
        return
      }
      const { group } = this
      group.init && group.init(params)
      group.items.forEach(item => {
        item.init && item.init(params)
      })
    }
  }
}
