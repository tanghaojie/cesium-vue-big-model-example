const getDefaultState = () => {
  return {
    showSetting: false,
    showToolBar: true,
    sampleTable: {
      show: false,
      datas: []
    },
    locationBar: {
      showCameraLocation: false,
      showMouseLocation: false,
      showFPS: false
    }
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
  },
  SET_SAMPLE_TABLE: (state, obj) => {
    state.sampleTable = obj
  },
  SET_LOCATION_BAR: (state, obj) => {
    state.locationBar = obj
  }
}

const actions = {
  settingShown({ commit, state }, show = true) {
    commit('SET_SHOW_SETTING', show)
  },
  toolBarShown({ commit, state }, show = true) {
    commit('SET_SHOW_TOOL_BAR', show)
  },
  sampleTable({ commit, state }, obj) {
    commit('SET_SAMPLE_TABLE', obj)
  },
  locationBar({ commit, state }, options) {
    const now = state.locationBar
    commit('SET_LOCATION_BAR', {
      ...now,
      ...options
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
