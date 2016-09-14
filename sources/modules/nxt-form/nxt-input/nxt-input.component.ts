import { Input, ViewEncapsulation } from '@angular/core'

import { NxtFormComponent, NxtFormService, inputs, outputs } from '../'
import { ComponentComplement } from '../../../base.component'

@ComponentComplement({
    encapsulation: ViewEncapsulation.None,
    inputs: inputs,
    outputs: outputs,
    selector: 'nxt-input',
    styles: [
        require('./_nxt-input.component.scss'),
    ],
    template: `
        <div class="nxt-input-container" [ngClass]="{'error': !valid && (touched || formSent), 'disabled': disabled}">
            <label>
                <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span> :</div>
                <div [ngSwitch]="type">
                    <input *ngSwitchCase="'email'" type="email" [name]="name" [placeholder]="placeholder" (change)="initChange($event)" (keyup)="initChange($event)" [value]="value" [required]="required" [disabled]="disabled" />
                    <input *ngSwitchCase="'phone'" type="phone" [name]="name" [placeholder]="placeholder" (change)="initChange($event)" (keyup)="initChange($event)" [value]="value" [required]="required" [disabled]="disabled" />
                    <input *ngSwitchCase="'number'" type="number" [name]="name" [placeholder]="placeholder" (change)="initChange($event)" (keyup)="initChange($event)" [value]="value" [required]="required" [disabled]="disabled" />
                    <input *ngSwitchCase="'password'" type="password" [name]="name" [placeholder]="placeholder" (change)="initChange($event)" (keyup)="initChange($event)" [value]="value" [required]="required" [disabled]="disabled" />
                    <input *ngSwitchCase="'text'" type="text" [name]="name" [placeholder]="placeholder" (change)="initChange($event)" (keyup)="initChange($event)" [value]="value" [required]="required" [disabled]="disabled"/>
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

    public valid: boolean
    public touched: boolean

    constructor (
        nxtFormService: NxtFormService
    ) {
        super(nxtFormService)

        this.label = ''
        this.type = ''
        this.placeholder = ''
    }

    public initChange (event) {
        if (!this.disabled) {
            let value = event.path !== undefined ? event.path[0].value : event.target.value

            this.onChange(value)
        }
    }

    public isValid () {
        let regex

        switch (this.type) {
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
                    regex = /^[0-9]+(\.[0-9]+)?$/
                    break
                }
            case 'password':
            case 'text':
            default:
                if (this.required) {
                    regex = /.+/i
                } else {
                    regex = /.*/i
                }
        }

        return regex.test(this.value)
    }

    public reset () {
        this.onChange('', false)
    }
}
