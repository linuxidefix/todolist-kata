import { Component, ViewEncapsulation } from '@angular/core'

import { NxtSwiperComponent } from './'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-swip-elem',
    styles: [],
    template: `
    <div class="nxt-swip-elem">
        <ng-content></ng-content>
    </div>
    `,
})

export class NxtSwipElemComponent {
    private nxtSwiperComponent: NxtSwiperComponent

    constructor (nxtSwiperComponent: NxtSwiperComponent) {
        this.nxtSwiperComponent = nxtSwiperComponent
    }

    public ngOnInit () {
        this.nxtSwiperComponent.addElem()
    }

    public ngOnDestroy () {
        this.nxtSwiperComponent.removeElem()
    }
}
