import { Component, ElementRef, EventEmitter, Input, ViewEncapsulation } from '@angular/core'

import { NxtTabContainerComponent } from './nxt-tab-container.component'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-tab',
    template: require('./_nxt-tab.component.html'),
})

export class NxtTabComponent {

    public selected: boolean = false
    @Input() public title: string = ''
    @Input() public icon: string = ''
    @Input() public defaultSelect: boolean = false
    @Input() public tip: string = ''

    constructor (
      private nxtTabContainerComponent: NxtTabContainerComponent,
    ) {}

    public ngOnInit () {
        this.nxtTabContainerComponent.addTab(this, this.defaultSelect)
    }

    public ngOnDestroy () {
        this.nxtTabContainerComponent.removeTab(this)
    }

}
