import { AppActions } from './'

const initialState = {
    loading: true,
    location: '',
}

export function appReducer (state = initialState, action) {
    switch (action.type) {
        case AppActions.SET_APP_STATE:
            return Object.assign({}, state, action.state)
        default:
            return state
    }
}
