import * as types from './mutation_types'

export default {
  [types.ERROR_STATE] (state, errorState) {
    state.errorState = errorState
  },
  [types.IS_AUTH] (state, isAuth) {
    state.isAuth = isAuth
  },
  [types.ACCESS_TOKEN] (state, accessToken) {
    state.accessToken = accessToken
  },
  [types.SEARCH_DATA] (state, searchData) {
    state.searchData = searchData
  },
  [types.KEYWORD] (state, keyword) {
    state.keyword = keyword
  },
  [types.SEARCH_VIEW_BACK] (state, searchViewBack) {
    state.searchViewBack = searchViewBack
  }
}
