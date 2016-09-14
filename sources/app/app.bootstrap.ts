import { bootstrap } from '@angular/platform-browser-dynamic'

import { AppActions, appConfig } from './'

import { EventsService } from '../helpers'
import { API_PROVIDERS } from '../modules/nxt-api'
import { NXT_MODAL_PROVIDER } from '../modules/nxt-modal'
import { NXT_TRANSLATE_PROVIDER } from '../modules/nxt-translate'
import { REDUX_PROVIDER, appStore } from '../reducers'
import { AppComponent } from './app.component'
import { APP_ROUTER_PROVIDERS } from './app.routes'

export function Bootstrap () {
    let state = {
        loading: true,
        location: appConfig.defaultLocation,
    }

    appStore.dispatch(AppActions.setAppState(state))

    bootstrap(AppComponent, [
        EventsService,
        REDUX_PROVIDER,
        NXT_TRANSLATE_PROVIDER,
        APP_ROUTER_PROVIDERS,
        API_PROVIDERS,
        NXT_MODAL_PROVIDER,
    ])
}
