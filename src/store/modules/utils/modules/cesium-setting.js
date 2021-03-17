const getDefaultState = () => {
  return {
    showSetting: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_SHOW_SETTING: (state, show) => {
    state.showSetting = show
  }
}

const actions = {
  settingShown({ commit, state }, show = true) {
    commit('SET_SHOW_SETTING', show)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
