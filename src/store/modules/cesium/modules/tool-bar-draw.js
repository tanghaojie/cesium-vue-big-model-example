const getDefaultState = () => {
  return {
    drawPointItemActive: false,
    drawPolylineItemActive: false,
    drawPolygonItemActive: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_DRAW_POINT_ITEM_ACTIVE: (state, active) => {
    state.drawPointItemActive = active
  },
  SET_DRAW_POLYLINE_ITEM_ACTIVE: (state, active) => {
    state.drawPolylineItemActive = active
  },
  SET_DRAW_POLYGON_ITEM_ACTIVE: (state, active) => {
    state.drawPolygonItemActive = active
  }
}

const actions = {
  switchDrawPointItemActive({ commit, state }) {
    const switchTo = !state.drawPointItemActive
    commit('SET_DRAW_POINT_ITEM_ACTIVE', switchTo)
  },
  switchDrawPolylineItemActive({ commit, state }) {
    const switchTo = !state.drawPolylineItemActive
    commit('SET_DRAW_POLYLINE_ITEM_ACTIVE', switchTo)
  },
  switchDrawPolygonItemActive({ commit, state }) {
    const switchTo = !state.drawPolygonItemActive
    commit('SET_DRAW_POLYGON_ITEM_ACTIVE', switchTo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
