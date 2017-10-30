import { Component, Input, ViewEncapsulation } from '@angular/core'

import { inputs, NxtFormComponent, NxtFormService, outputs } from '../'

@Component({
    encapsulation: ViewEncapsulation.None,
    inputs,
    outputs,
    selector: 'nxt-input',
    styles: [
        require('../_nxt-form.component.scss'),
        require('./_nxt-input.component.scss'),
    ],
    template: `
        <div class="nxt-input-container" [ngClass]="{'error': !valid && (touched || formSent), 'disabled': disabled}">
            <label>
                <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span> :</div>
                <div class="nxt-input-field-container" [ngSwitch]="type">
                    <input *ngSwitchCase="'email'" type="email" [name]="name" [placeholder]="placeholder" [ngModel]="value" (ngModelChange)="initChange($event)" [required]="required" [disabled]="disabled" />
                    <input *ngSwitchCase="'phone'" type="phone" [name]="name" [placeholder]="placeholder" [ngModel]="value" (ngModelChange)="initChange($event)" [required]="required" [disabled]="disabled" />
                    <input *ngSwitchCase="'number'" lang="en" type="number" [min]="min" [name]="name" [placeholder]="placeholder" [ngModel]="value" (ngModelChange)="initChange($event)" [required]="required" [disabled]="disabled" />
                    <input *ngSwitchCase="'password'" type="password" [name]="name" [placeholder]="placeholder" [ngModel]="value" (ngModelChange)="initChange($event)" [required]="required" [disabled]="disabled" />
                    <input *ngSwitchCase="'text'" type="text" [name]="name" [placeholder]="placeholder" [ngModel]="value" (ngModelChange)="initChange($event)" [required]="required" [disabled]="disabled"/>
                    <input *ngSwitchCase="'date'" type="date" [name]="name" [placeholder]="placeholder" [ngModel]="value" (ngModelChange)="initChange($event)" [required]="required" [disabled]="disabled"/>
                </div>
            </label>

            <div class="error-msg" *ngIf="!valid && (touched || formSent)">{{errorMsg}}</div>
        </div>
    `,
})

export class NxtInputComponent extends NxtFormComponent {
    @Input() public label: string
    @Input() public type: string
    @Input() public placeholder: string
    @Input() public min: number

    public valid: boolean
    public touched: boolean

    constructor (
        nxtFormService: NxtFormService,
    ) {
        super(nxtFormService)

        this.label = ''
        this.type = ''
        this.placeholder = ''
        this.min = null
    }

    public initChange (event) {
        if (!this.disabled) {
            this.onChange(event)
        }
    }

    public isValid () {
        let regex: RegExp

        switch (this.type) {
            case 'date':
                if (this.value !== '') {
                    regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
                    break
                }
            case 'email':
                if (this.value !== '') {
                    regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
                    break
                }
            case 'phone':
                if (this.value !== '') {
                    regex = /^\+?(?:[0-9]●?){6,14}[0-9]$/
                    break
                }
            case 'number':
                if (this.value !== '') {
                    regex = /^-?[0-9]+(\.[0-9]+)?$/
                    break
                }
            case 'password':
            case 'text':
            default:
                regex = (this.required) ? /.+/i : /.*/i
        }

        return this.required ? regex.test(this.value) && this.value !== null : regex.test(this.value)
    }

    public reset () {
        this.onChange('', false)
    }
}
