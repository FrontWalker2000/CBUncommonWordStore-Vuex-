const state = {
  // 生僻字信息
  uncommonWordInfo: {
    endTime: null,
    token: null,
    tid: null,
    url: null,
    path: null,
    stateReady: false,
    swich: null
  }
}
const mutations = {
  setUncommonWordTokenTidInfo(state, val) {
    state.uncommonWordInfo.token = val.TOKEN
    state.uncommonWordInfo.tid = val.TID
    state.uncommonWordInfo.url = val.FZURL
    state.uncommonWordInfo.path = val.FZPATH
    state.uncommonWordInfo.endTime = val.EXPIREDTIME
    state.uncommonWordInfo.swich = val.OPENFLAG
  },
  setUncommonWordState(state, val) {
    state.uncommonWordInfo.stateReady = val
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
