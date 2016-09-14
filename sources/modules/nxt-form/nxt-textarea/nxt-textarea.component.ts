import { Input, ViewEncapsulation } from '@angular/core'
import { select } from 'ng2-redux'
import { Observable } from 'rxjs'

import { NxtFormComponent, NxtFormService, inputs, outputs } from '../'
import { ComponentComplement } from '../../../base.component'

@ComponentComplement({
    encapsulation: ViewEncapsulation.None,
    inputs: inputs,
    outputs: outputs,
    selector: 'nxt-textarea',
    styles: [
        require('./_nxt-textarea.component.scss'),
    ],
    template: `
        <div class="nxt-textarea-container" [ngClass]="{'error': !valid && (touched || formSent)}">
            <label>
                <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span> :</div>
                <textarea name="{{name}}" [placeholder]="placeholder" (change)="initChange($event)" (keyup)="initChange($event)" [value]="value" [required]="required" [disabled]="disabled"></textarea>
            </label>

            <div class="error-msg" *ngIf="!valid && (touched || formSent)">{{errorMsg}}</div>
        </div>
    `,
})

export class NxtTextareaComponent extends NxtFormComponent {
    @Input() public label: string
    @Input() public type: string
    @Input() public placeholder: string

    @select(state => state.nxtForm)public nxtForm$: Observable<any>

    constructor (nxtFormService: NxtFormService) {
        super(nxtFormService)

        this.label = ''
        this.type = ''
        this.placeholder = ''
    }

    public initChange (event) {
        this.onChange(event.path[0].value)
    }

    public reset () {
        this.onChange('', false)
    }
}
