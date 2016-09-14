import { ViewEncapsulation } from '@angular/core'

import { Input } from '@angular/core'

import { NxtFormComponent, NxtFormService, NxtRadioItemComponent, inputs, outputs } from '../'
import { ComponentComplement } from '../../../base.component'

@ComponentComplement({
    encapsulation: ViewEncapsulation.None,
    inputs: inputs,
    outputs: outputs,
    selector: 'nxt-radio',
    styles: [
        require('./_nxt-radio.component.scss'),
    ],
    template: `
        <div class="nxt-radio-container" [ngClass]="{ 'error': !valid && (touched || formSent), 'disabled': disabled }">
            <label>
                <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span> :</div>
            </label>
            <div class="nxt-radio-content">
                <ng-content></ng-content>
            </div>
            <div class="error-msg" *ngIf="!valid && (touched || formSent)">{{errorMsg}}</div>
        </div>
    `,
})

export class NxtRadioComponent extends NxtFormComponent {
    @Input() public label: string
    private radios: NxtRadioItemComponent[]

    constructor (nxtFormService: NxtFormService) {
        super(nxtFormService)

        this.radios = []
    }

    public addItem (item: NxtRadioItemComponent) {
        this.radios.push(item)

        if (this.value === item.value) {
            this.initChange(item)
        }
    }

    public initChange (item: NxtRadioItemComponent) {
        if (!this.disabled) {
            this.onChange(item.value)

            this.radios.forEach(radio => {
                if (radio.value !== this.value) {
                    radio.select(false)
                }
            })
        }
    }

    public reset () {
        this.onChange('', false)

        this.radios.forEach(radio => radio.select(false))
    }
}
