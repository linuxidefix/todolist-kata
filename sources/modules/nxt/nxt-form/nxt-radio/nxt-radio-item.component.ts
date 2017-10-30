import { Component, Input, ViewEncapsulation } from '@angular/core'

import { NxtRadioComponent } from '../'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-radio-item',
    styles: [],
    template: `
        <div class="nxt-radio-item-container" [ngClass]="{ 'selected': selected }" (click)="select()">
            <button type="button" class="nxt-radio-item-button"></button>
            <span class="label">
                <ng-content></ng-content>
            </span>
        </div>
    `,
})

export class NxtRadioItemComponent {
     @Input() public value: string

     public selected: boolean

     private nxtRadioComponent: NxtRadioComponent

     constructor (nxtRadioComponent: NxtRadioComponent) {
         this.nxtRadioComponent = nxtRadioComponent
         this.selected = false
     }

     public ngOnInit () {
         this.nxtRadioComponent.addItem(this)
     }

     public select () {
        this.nxtRadioComponent.initChange(this)
     }
}
