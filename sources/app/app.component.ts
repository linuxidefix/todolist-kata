import { Inject, ViewContainerRef, ViewEncapsulation } from '@angular/core'
import { ROUTER_DIRECTIVES } from '@angular/router'
import { NgRedux, select } from 'ng2-redux'
import { Observable } from 'rxjs/Rx'

import { BaseComponent, ComponentComplement } from '../base.component'
import { TodolistComponent } from '../components/todolist/todolist.component'
import { NxtTranslateService } from '../modules/nxt-translate'

import { AppActions } from './'

import '../sass/screen.scss'

@ComponentComplement({
    directives: [ ROUTER_DIRECTIVES ],
    encapsulation: ViewEncapsulation.None,
    precompile: [ TodolistComponent ],
    selector: 'app',
    styles: [],
    template: require('./_app.component.html'),
})

export class AppComponent extends BaseComponent {
    public loading: boolean
    public viewContainerRef: ViewContainerRef

    private nxtTranslateService: NxtTranslateService

    // Redux
    @select(state => state.appState) private appState$: Observable<any>
    private appStore

    constructor (
        viewContainerRef: ViewContainerRef,
        nxtTranslateService: NxtTranslateService,
        @Inject('AppStore') appStore,
        @Inject(NgRedux) ngRedux
    ) {
        super()

        this.loading = true
        this.viewContainerRef = viewContainerRef

        this.nxtTranslateService = nxtTranslateService

        this.appStore = appStore
        ngRedux.provideStore(this.appStore)
    }

    public ngOnInit () {
        this.nxtTranslateService.setFilePattern('/resources', 'locale-', '.json')

        this.appState$.subscribe(appState => {
            if (appState.location !== this.nxtTranslateService.getCurrentLanguage()) {
                this.nxtTranslateService.setLanguage(appState.location)
                this.nxtTranslateService.setTranslateContents()
                    .then(res => this.appStore.dispatch(AppActions.setAppState({ loading: false })))
            }

            if (appState.loading !== this.loading) {
                this.loading = appState.loading
            }
        })
    }
}
