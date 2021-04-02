const getDefaultState = () => {
  return {
    dropdown: {
      show: false,
      componentName: '',
      top: 0,
      left: 0
    },

    hightlight3DTileFeatureItemActive: false,
    classifyItemActive: false,
    invertClassifyItemActive: false,

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

  SET_DROP_DOWN: (state, obj) => {
    state.dropdown = obj
  },
  SET_HIGHTLIGHT_3DTILE_FEATURE_ITEM_ACTIVE: (state, active) => {
    state.hightlight3DTileFeatureItemActive = active
  },
  SET_CLASSIFY_ITEM_ACTIVE: (state, active) => {
    state.classifyItemActive = active
  },
  SET_INVERT_CLASSIFY_ITEM_ACTIVE: (state, active) => {
    state.invertClassifyItemActive = active
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
  dropdown({ commit, state }, obj) {
    commit('SET_DROP_DOWN', obj)
  },
  switchHightlight3DTileFeatureItemActive({ commit, state }) {
    const switchTo = !state.hightlight3DTileFeatureItemActive
    commit('SET_HIGHTLIGHT_3DTILE_FEATURE_ITEM_ACTIVE', switchTo)
  },
  switchClassifyItemActive({ commit, state }) {
    const switchTo = !state.classifyItemActive
    commit('SET_CLASSIFY_ITEM_ACTIVE', switchTo)
  },
  switchInvertClassifyItemActive({ commit, state }) {
    const switchTo = !state.invertClassifyItemActive
    commit('SET_INVERT_CLASSIFY_ITEM_ACTIVE', switchTo)
  },
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
