import { select } from '@angular-redux/store'
import { ChangeDetectorRef, Component, ComponentFactoryResolver, Inject, ReflectiveInjector, ViewContainerRef, ViewEncapsulation } from '@angular/core'
import { Observable } from 'rxjs/Rx'

import { TodolistComponent } from '../components/todolist/todolist.component'
import { NxtGamesComponent } from '../modules/nxt/nxt-games'
import { NxtTranslateService } from '../modules/nxt/nxt-translate'

import { AppActions } from './'

import '../sass/screen.scss'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app',
    styles: [],
    template: require('./_app.component.html'),
})

export class AppComponent {
    public loading: boolean = true

    // Redux
    @select(state => state.appState) private appState$: Observable<any>

    constructor (
        public viewContainerRef: ViewContainerRef,
        private nxtTranslateService: NxtTranslateService,
        private componentResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject('AppStore') private appStore,
    ) {}

    public ngOnInit () {
        this.nxtTranslateService.setFilePattern('/resources', 'locale-', '.json')

        this.appState$.subscribe(appState => {
            if (appState.location !== this.nxtTranslateService.getCurrentLanguage()) {
                this.nxtTranslateService.setLanguage(appState.location)
                this.nxtTranslateService.setTranslateContents()
            }

            if (appState.loading !== this.loading) {
                this.loading = appState.loading
                console.log(this.loading)
                this.changeDetectorRef.detectChanges()
            }
        })

        const konami: number[] = [ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65 ]
        let n: number = 0
        document.addEventListener('keyup', (e) => {
            if (e.keyCode === konami[n++]) {
                if (n === konami.length) {
                    const games = this.componentResolver.resolveComponentFactory(NxtGamesComponent)
                    const childInjector = ReflectiveInjector.resolve([ { provide: 'viewContainerRef', useValue: this.viewContainerRef } ])
                    const injector = ReflectiveInjector.fromResolvedProviders(childInjector, this.viewContainerRef.injector)

                    this.viewContainerRef.createComponent(games, this.viewContainerRef.length, injector)
                    n = 0
                    return false
                }
            } else {
                n = 0
            }
        })
    }
}
