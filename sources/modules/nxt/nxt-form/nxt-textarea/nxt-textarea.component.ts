import { select } from '@angular-redux/store'
import { Component, Input, ViewEncapsulation } from '@angular/core'
import { Observable } from 'rxjs'

import { inputs, NxtFormComponent, NxtFormService, outputs } from '../'

@Component({
    encapsulation: ViewEncapsulation.None,
    inputs,
    outputs,
    selector: 'nxt-textarea',
    styles: [
        require('../_nxt-form.component.scss'),
        require('./_nxt-textarea.component.scss'),
    ],
    template: `
        <div class="nxt-textarea-container" [ngClass]="{'error': !valid && (touched || formSent)}">
            <label>
                <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span> :</div>
                <textarea name="{{name}}" [placeholder]="placeholder" [ngModel]="value" (ngModelChange)="initChange($event)" [required]="required" [disabled]="disabled"></textarea>
            </label>

            <div class="error-msg" *ngIf="!valid && (touched || formSent)">{{errorMsg}}</div>
        </div>
    `,
})

export class NxtTextareaComponent extends NxtFormComponent {
    @Input() public label: string
    @Input() public type: string
    @Input() public placeholder: string

    @select((state) => state.nxtForm)public nxtForm$: Observable<any>

    constructor (nxtFormService: NxtFormService) {
        super(nxtFormService)

        this.label = ''
        this.type = ''
        this.placeholder = ''
    }

    public initChange (event) {
        if (!this.disabled) {
            this.onChange(event)
        }
    }

    public reset () {
        this.onChange('', false)
    }
}
