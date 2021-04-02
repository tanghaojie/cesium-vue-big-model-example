const getDefaultState = () => {
  return {
    options: {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false
    }
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_OPTIONS: (state, obj) => {
    state.cesiumOptions = obj
  }
}

const actions = {
  options({ commit, state }, obj) {
    commit('SET_OPTIONS', obj)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
