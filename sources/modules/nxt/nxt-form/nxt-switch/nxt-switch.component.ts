import { Component, ViewEncapsulation } from '@angular/core'

import { Input } from '@angular/core'

import { inputs, NxtFormComponent, NxtFormService, outputs } from '../'

@Component({
    encapsulation: ViewEncapsulation.None,
    inputs,
    outputs,
    selector: 'nxt-switch',
    styles: [
        require('../_nxt-form.component.scss'),
        require('./_nxt-switch.component.scss'),
    ],
    template: `
        <div class="nxt-switch-container" [ngClass]="{ 'error': !valid && (touched || formSent), 'disabled': disabled }">
            <label (click)="initChange()">
                <div class="nxt-switch-slider {{ shape }}" [ngClass]="{ 'active': value }"></div>
                <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span></div>
            </label>
            <div class="error-msg" *ngIf="!valid && (touched || formSent)">{{errorMsg}}</div>
        </div>
    `,
})

export class NxtSwitchComponent extends NxtFormComponent {
    @Input() public label: string
    @Input() public shape: string // (square|rounded)

    constructor (nxtFormService: NxtFormService) {
        super(nxtFormService)

        this.label = ''
        this.shape = 'square'
        this.value = false
    }

    public initChange () {
        if (!this.disabled) {
            this.onChange(!this.value)
        }
    }

    public isValid () {
        return this.required ? this.value : true
    }

    public reset () {
        this.onChange(false, false)
    }
}
