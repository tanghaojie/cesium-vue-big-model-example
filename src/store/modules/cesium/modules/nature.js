const getDefaultState = () => {
  return {
    showSun: true,
    showMoon: false,
    showSkyAtmosphere: true,
    enableLighting: false,
    showSkyBox: true
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_SHOW_SUN: (state, show) => {
    state.showSun = show
  },
  SET_SHOW_MOON: (state, show) => {
    state.showMoon = show
  },
  SET_SHOW_SKY_ATMOSPHERE: (state, show) => {
    state.showSkyAtmosphere = show
  },
  SET_ENABLE_LIGHT: (state, enable) => {
    state.enableLighting = enable
  },
  SET_SHOW_SKY_BOX: (state, show) => {
    state.showSkyBox = show
  }
}

const actions = {
  switchSunShown({ commit, state }, viewer) {
    if (!viewer.scene.sun) {
      viewer.scene.sun = Cesium.Sun()
    }
    const switchTo = !state.showSun
    viewer.scene.sun.show = switchTo
    commit('SET_SHOW_SUN', switchTo)
  },
  switchMoonShown({ commit, state }, viewer) {
    if (!viewer.scene.moon) {
      viewer.scene.moon = Cesium.Moon()
    }
    const switchTo = !state.showMoon
    viewer.scene.moon.show = switchTo
    commit('SET_SHOW_MOON', switchTo)
  },
  switchSkyAtmosphereShown({ commit, state }, viewer) {
    if (!viewer.scene.skyAtmosphere) {
      viewer.scene.skyAtmosphere = Cesium.SkyAtmosphere()
    }
    const switchTo = !state.showSkyAtmosphere
    viewer.scene.skyAtmosphere.show = switchTo
    commit('SET_SHOW_SKY_ATMOSPHERE', switchTo)
  },
  switchGlobeLightingEnable({ commit, state }, viewer) {
    const switchTo = !state.enableLighting
    viewer.scene.globe.enableLighting = switchTo
    commit('SET_ENABLE_LIGHT', switchTo)
  },
  switchSkyBoxShown({ commit, state }, viewer) {
    // if (!viewer.scene.skyAtmosphere) {
    //   viewer.scene.skyAtmosphere = Cesium.SkyAtmosphere()
    // }
    const switchTo = !state.showSkyBox
    viewer.scene.skyBox.show = switchTo
    commit('SET_SHOW_SKY_BOX', switchTo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
