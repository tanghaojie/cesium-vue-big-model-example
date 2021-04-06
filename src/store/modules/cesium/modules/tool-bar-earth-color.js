import * as Cesium from 'cesium'

const getDefaultState = () => {
  return {
    earthColor: {
      r: 0,
      g: 0,
      b: 127.5,
      a: 1
    }
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_EARTH_COLOR: (state, val) => {
    state.earthColor = val
  }
}

const actions = {
  setEarthColor({ commit, state }, obj) {
    const { viewer, rgba } = obj
    viewer.scene.globe.baseColor = new Cesium.Color(
      rgba.r / 255,
      rgba.g / 255,
      rgba.b / 255,
      rgba.a
    )
    commit('SET_EARTH_COLOR', {
      r: rgba.r,
      g: rgba.g,
      b: rgba.b,
      a: rgba.a
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
