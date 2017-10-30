import { NgRedux, NgReduxModule } from '@angular-redux/store'
import { NgModule, ValueProvider } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

import { NxtModule } from '../modules/nxt/nxt.module'
import { store } from '../reducers'
import { IAppState } from './'
import { MaintenanceComponent } from './maintenance.component'

const appStore: ValueProvider = { provide: 'AppStore', useValue: store }

const modalContentComponents: any[] = []

@NgModule({
    bootstrap: [ MaintenanceComponent ],
    declarations: [
        MaintenanceComponent,
        ...modalContentComponents,
    ],
    entryComponents: [ ...modalContentComponents ],
    imports: [ BrowserModule, FormsModule, NgReduxModule, NxtModule ],
    providers: [
        appStore,
    ],
})

export class MaintenanceModule {
    constructor (ngRedux: NgRedux<IAppState>) {
        ngRedux.provideStore(appStore.useValue)
    }
}
