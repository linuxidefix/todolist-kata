import { Component, ElementRef, EventEmitter, Input, ViewEncapsulation } from '@angular/core'

import { NxtTabComponent } from './nxt-tab.component'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-tab-container',
    styles: [ require('./_nxt-tab-container.component.scss') ],
    template: require('./_nxt-tab-container.component.html'),
})

export class NxtTabContainerComponent {

    @Input() public selectedStyle: any = {}
    @Input() public tabsStyle: any = {}

    public notSelectedStyle: any = {}

    public nxtTabsComponent: NxtTabComponent[] = []

    public ngOnInit () {
        for (const prop in this.selectedStyle) {
            if (this.selectedStyle[prop]) {
                this.notSelectedStyle[prop] = 'inherit'
            }
        }
    }

    public addTab (nxtTabComponent: NxtTabComponent, defaultSelect: boolean) {
        if (this.nxtTabsComponent.length === 0) {
            nxtTabComponent.selected = true
        }

        this.nxtTabsComponent.push(nxtTabComponent)

        if (defaultSelect) {
            this.select(nxtTabComponent)
        }
    }

    public removeTab (nxtTabComponent: NxtTabComponent) {
        this.nxtTabsComponent = this.nxtTabsComponent.filter((row) => row !== nxtTabComponent)
    }

    public select (nxtTabComponent: NxtTabComponent) {
        this.nxtTabsComponent.forEach((row) => {
            if (row === nxtTabComponent) {
                row.selected = true
            } else {
                row.selected = false
            }
        })
    }

}
