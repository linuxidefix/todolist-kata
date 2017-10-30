import { Component, ComponentFactoryResolver, Inject, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core'

import { NxtSnakeComponent } from './'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-games-outlet',
    template: '',
})
export class NxtGamesOutletComponent {}

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-games',
    styles: [ require('./_nxt-games.component.scss') ],
    template: require('./_nxt-games.component.html'),
})

export class NxtGamesComponent {
    public gameLaunched: boolean = false
    public gamesList: any[] = [
        { component: NxtSnakeComponent, name: 'Snake' },
    ]

    @ViewChild(NxtGamesOutletComponent, { read: ViewContainerRef }) private gamesOutletView: ViewContainerRef
    private componentResolver: ComponentFactoryResolver
    private viewContainerRef: ViewContainerRef

    constructor (
        componentResolver: ComponentFactoryResolver,
        @Inject('viewContainerRef') viewContainerRef: ViewContainerRef,
    ) {
        this.componentResolver = componentResolver
        this.viewContainerRef = viewContainerRef
    }

    public ngOnInit () {
        document.body.style.overflow = 'hidden'
    }

    public ngOnDestroy () {
        document.body.style.overflow = 'auto'
    }

    public launchGame (gameComponent) {
        this.gameLaunched = true
        const game = this.componentResolver.resolveComponentFactory(gameComponent.component)
        this.gamesOutletView.createComponent(game)
    }

    public backToMenu () {
        this.gamesOutletView.remove()
        this.gameLaunched = false
    }

    public close () {
        this.viewContainerRef.remove()
    }
}
