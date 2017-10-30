import { Component, ViewEncapsulation } from '@angular/core'

import { Input } from '@angular/core'

import { inputs, NxtFormComponent, NxtFormService, outputs } from '../'

@Component({
    encapsulation: ViewEncapsulation.None,
    inputs,
    outputs,
    selector: 'nxt-checkbox',
    styles: [
        require('../_nxt-form.component.scss'),
        require('./_nxt-checkbox.component.scss'),
    ],
    template: `
        <div class="nxt-checkbox-container" [ngClass]="{ 'error': !valid && (touched || formSent), 'disabled': disabled }">
            <div class="nxt-checkbox-content" (click)="initChange()" [ngClass]="{ 'checked': value }">
                <button type="button" class="nxt-checkbox-item-button"></button>
                <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span></div>
            </div>

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
        return (this.required && this.value) || (!this.required)
    }
}
