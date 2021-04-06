const getDefaultState = () => {
  return {
    hightlight3DTileFeatureItemActive: false,
    classifyItemActive: false,
    invertClassifyItemActive: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_HIGHTLIGHT_3DTILE_FEATURE_ITEM_ACTIVE: (state, active) => {
    state.hightlight3DTileFeatureItemActive = active
  },
  SET_CLASSIFY_ITEM_ACTIVE: (state, active) => {
    state.classifyItemActive = active
  },
  SET_INVERT_CLASSIFY_ITEM_ACTIVE: (state, active) => {
    state.invertClassifyItemActive = active
  }
}

const actions = {
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
