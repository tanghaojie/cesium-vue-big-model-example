const getDefaultState = () => {
  return {
    measurePointItemActive: false,
    measureLineItemActive: false,
    measurePolygonItemActive: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_MEASURE_POINT_ITEM_ACTIVE: (state, active) => {
    state.measurePointItemActive = active
  },
  SET_MEASURE_LINE_ITEM_ACTIVE: (state, active) => {
    state.measureLineItemActive = active
  },
  SET_MEASURE_POLYGON_ITEM_ACTIVE: (state, active) => {
    state.measurePolygonItemActive = active
  }
}

const actions = {
  switchMeasurePointItemActive({ commit, state }) {
    const switchTo = !state.measurePointItemActive
    commit('SET_MEASURE_POINT_ITEM_ACTIVE', switchTo)
  },
  switchMeasureLineItemActive({ commit, state }) {
    const switchTo = !state.measureLineItemActive
    commit('SET_MEASURE_LINE_ITEM_ACTIVE', switchTo)
  },
  switchMeasurePolygonItemActive({ commit, state }) {
    const switchTo = !state.measurePolygonItemActive
    commit('SET_MEASURE_POLYGON_ITEM_ACTIVE', switchTo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
