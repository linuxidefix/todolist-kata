import { Component, Input, ViewEncapsulation } from '@angular/core'

import { NxtSelectComponent } from '../'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-select-option',
    styles: [],
    template: `
        <div class="nxt-option" (click)="select()" title="{{textContent}}">
            {{textContent}}
        </div>
    `,
})

export class NxtSelectOptionComponent {
     @Input() public value: string
     @Input() public textContent: string

     private nxtSelectComponent: NxtSelectComponent

     constructor (nxtSelectComponent: NxtSelectComponent) {
         this.nxtSelectComponent = nxtSelectComponent
     }

     public ngOnInit () {
         this.nxtSelectComponent.addOption(this)
     }

     public select () {
         this.nxtSelectComponent.initChange(this)
     }
}
