const getDefaultState = () => {
  return {
    elevationContourItemActive: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_ELEVATION_CONTOUR_ITEM_ACTIVE: (state, active) => {
    state.elevationContourItemActive = active
  }
}

const actions = {
  switchElevationContourItemActive({ commit, state }) {
    const switchTo = !state.elevationContourItemActive
    commit('SET_ELEVATION_CONTOUR_ITEM_ACTIVE', switchTo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
