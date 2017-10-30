import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppActions, AppModule, appParams } from './'

import { MaintenanceModule } from './maintenance.module'

import { store } from '../reducers'

export function Bootstrap () {
    store.dispatch(AppActions.setLocation(appParams.defaultLocation))

    if (process.env.NODE_ENV === 'maintenance') {
        platformBrowserDynamic().bootstrapModule(MaintenanceModule)
    } else {
        platformBrowserDynamic().bootstrapModule(AppModule)
    }
}
