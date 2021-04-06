const getDefaultState = () => {
  return {
    dropdown: {
      show: false,
      componentName: '',
      top: 0,
      left: 0
    }
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },

  SET_DROP_DOWN: (state, obj) => {
    state.dropdown = obj
  }
}

const actions = {
  dropdown({ commit, state }, obj) {
    commit('SET_DROP_DOWN', obj)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
