import { AppActions } from './'

const initialState: IAppState = {
    cache: [],
    loading: true,
    location: '',
}

export function appReducer (state = initialState, action) {
    switch (action.type) {
        case AppActions.SET_LOADING:
            return { ...state, loading: action.loading }
        case AppActions.SET_LOCATION:
            return { ...state, location: action.location }
        case AppActions.SET_CACHE:
            return { ...state, cache: action.cache }
        case AppActions.CLEAR:
            return initialState
        default:
            return state
    }
}

export interface IAppState {
    cache: Array<{ data: any, url: string, expires: number }>
    loading: boolean
    location: string
}
