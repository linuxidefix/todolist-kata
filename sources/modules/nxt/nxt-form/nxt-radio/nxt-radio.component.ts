import { Component, ViewEncapsulation } from '@angular/core'

import { Input } from '@angular/core'

import { inputs, NxtFormComponent, NxtFormService, NxtRadioItemComponent, outputs } from '../'

@Component({
    encapsulation: ViewEncapsulation.None,
    inputs,
    outputs,
    selector: 'nxt-radio',
    styles: [
        require('../_nxt-form.component.scss'),
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
    private tempValue: any

    constructor (nxtFormService: NxtFormService) {
        super(nxtFormService)

        this.radios = []
    }

    set value (value: any) {
        if (this.radios === undefined) {
            this.radios = []
        }

        this.tempValue = value

        if (this._value !== value) {
            const radio = this.radios.find((r) => r.value === value)
            this.radios.forEach((r) => r.selected = false)

            if (radio) {
                this.initChange(radio)
            } else {
                this.onChange(null, this.touched)
            }
        }
    }

    get value () {
        return this._value
    }

    public addItem (item: NxtRadioItemComponent) {
        this.radios.push(item)

        if (this._value === item.value || this.tempValue === item.value) {
            this.initChange(item)
        }
    }

    public initChange (item: NxtRadioItemComponent) {
        if (!this.disabled) {
            this.onChange(item.value)

            item.selected = true

            this.radios.forEach((radio) => {
                if (radio !== item) {
                    radio.selected = false
                }
            })
        }
    }

    public reset () {
        this.onChange(null, false)

        this.radios.forEach((radio) => radio.selected = false)
    }
}
