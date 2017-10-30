import { Component, Input, ViewEncapsulation } from '@angular/core'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-alert',
    styles: [
        require('./_nxt-alert.component.scss'),
    ],
    template: `
        <div class="nxt-alert-container" [ngClass]="type">
            <ng-content></ng-content>
        </div>
    `,
})

export class NxtAlertComponent {
    @Input() public type: string

    constructor () {
        this.type = ''
    }
}
