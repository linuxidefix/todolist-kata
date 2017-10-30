import { NgRedux, NgReduxModule } from '@angular-redux/store'
import { NgModule, ValueProvider } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

import { NxtModule } from '../modules/nxt/nxt.module'
import { store } from '../reducers'
import { AppComponent, IAppState } from './'
import { APP_ROUTER_PROVIDER, routing } from './app.routes'

/// SERVICES IMPORTATION START
/// SERVICES IMPORTATION END

/// COMPONENTS IMPORTATION START
import * as Todolist from '../components/todolist'
/// COMPONENTS IMPORTATION END

const appStore: ValueProvider = { provide: 'AppStore', useValue: store }

/// COMPONENTS DEFINITION START
const components: any[] = [
    Todolist.TodolistComponent,
]
/// COMPONENTS DEFINITION END

import { TodolistPipe } from  '../components/todolist/todolist.pipe'

const modalContentComponents: any[] = []

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        ...components,
        ...modalContentComponents,
        TodolistPipe,
    ],
    entryComponents: [ ...modalContentComponents ],
    imports: [ BrowserModule, FormsModule, NgReduxModule, NxtModule, routing ],
    providers: [
        APP_ROUTER_PROVIDER,
        appStore,
    ],
})

export class AppModule {
    constructor (ngRedux: NgRedux<IAppState>) {
        ngRedux.provideStore(appStore.useValue)
    }
}
