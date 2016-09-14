import { ViewEncapsulation } from '@angular/core'

import { Input } from '@angular/core'

import { NxtFormComponent, NxtFormService, inputs, outputs } from '../'
import { ComponentComplement } from '../../../base.component'

@ComponentComplement({
    encapsulation: ViewEncapsulation.None,
    inputs: inputs,
    outputs: outputs,
    selector: 'nxt-checkbox',
    styles: [
        require('./_nxt-checkbox.component.scss'),
    ],
    template: `
        <div class="nxt-checkbox-container" [ngClass]="{ 'error': !valid && (touched || formSent), 'disabled': disabled }">
            <label (click)="initChange()" [ngClass]="{ 'checked': value }">
                <button type="button" class="nxt-checkbox-item-button"></button>
                <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span> :</div>
            </label>

            <div class="error-msg" *ngIf="!valid && (touched || formSent)">{{errorMsg}}</div>
        </div>
    `,
})

export class NxtCheckboxComponent extends NxtFormComponent {
    @Input() public label: string

    constructor (nxtFormService: NxtFormService) {
        super(nxtFormService)

        this.label = ''
        this.value = false
    }

    public initChange () {
        if (!this.disabled) {
            this.onChange(!this.value)
        }
    }

    public reset () {
        this.onChange(false, false)
    }

    public isValid (): boolean {
        return (this.required && this.valid) || (!this.required)
    }
}
