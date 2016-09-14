import { provide } from '@angular/core'
import { NgRedux } from 'ng2-redux'
import { combineReducers, createStore } from 'redux'

import { appReducer } from '../app'

export const appStore = createStore(combineReducers({
    appState: appReducer,
}))

export const REDUX_PROVIDER: any = [
    provide('AppStore', { useValue: appStore }),
    NgRedux,
]
