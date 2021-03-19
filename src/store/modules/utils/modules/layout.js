const getDefaultState = () => {
  return {
    showSetting: false,
    showToolBar: true
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_SHOW_SETTING: (state, show) => {
    state.showSetting = show
  },
  SET_SHOW_TOOL_BAR: (state, show) => {
    state.showToolBar = show
  }
}

const actions = {
  settingShown({ commit, state }, show = true) {
    commit('SET_SHOW_SETTING', show)
  },
  toolBarShown({ commit, state }, show = true) {
    commit('SET_SHOW_TOOL_BAR', show)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
